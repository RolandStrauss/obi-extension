# OBI Extension - AI Coding Agent Instructions

## Project Overview

This is a **VS Code extension** for automating IBM i builds. It provides a local-first development workflow with remote compilation via SSH. The extension bridges modern development practices (VS Code, Git) with IBM i systems.

**Key Architecture Principle**: The extension runs in VS Code, communicates with IBM i via SSH, and manages build orchestration locally while executing compilations remotely.

## Critical File Paths (Constants.ts)

All OBI project files live under `.obi/` in the user's workspace. Key paths are defined in `src/Constants.ts`:

```typescript
.obi/
├── etc/
│   ├── app-config.toml           // Project config
│   ├── .user-app-config.toml     // User-specific overrides
│   ├── source-config.toml        // Per-source compile settings
│   ├── dependency.json           // Source dependency graph
│   └── object-builds.json        // Build state/hashes
├── source-list/                  // Source filters (*.json)
├── build-output/                 // Compilation logs
├── build-history/                // Historical build records
└── tmp/                          // Temp build artifacts
```

## Build System Architecture

### Three-Layer Bundling (esbuild.js)

The extension uses **esbuild** to create separate bundles:

1. **Extension Backend** (`extension.ts` → `out/extension.js`)
   - Platform: `node`, format: `cjs`
   - Externals: `vscode`, `ssh2`, `cpu-features`

2. **Webview JavaScript** (12 separate entry points)
   - Platform: browser (`es2020`), format: `esm`
   - Each webview panel has its own bundle (e.g., `controller.ts` → `out/controller.js`)

3. **HTML Templates** (`asserts/templates/`)
   - Rendered server-side using **Nunjucks**
   - Path: `Constants.HTML_TEMPLATE_DIR`

**Important**: When adding a new webview, you must:
- Create TypeScript in `src/webview/<area>/javascript/<name>.ts`
- Add esbuild config entry in `esbuild.js`
- Create HTML template in `asserts/templates/<area>/<name>.html`

### Build Command

```bash
npm run compile   # Development build with sourcemaps
npm run package   # Production build (minified, no sourcemaps)
npm run watch     # TypeScript watch mode (does NOT use esbuild)
```

## Extension Activation Flow

```typescript
// src/extension.ts
activate() → {
  1. Initialize Logger & LocaleText (i18n)
  2. Check for .obi/ directory existence → set 'obi.contains_obi_project' context
  3. If no .obi/: Show Welcome screen → EXIT
  4. Run OBITools.self_check() → validate/migrate configs
  5. Validate AppConfig → set 'obi.valid-config' context
  6. If invalid: Show ConfigInvalid screen → EXIT
  7. Register all command handlers
  8. Register TreeView providers (SourceList, BuildHistory)
  9. Register Webview providers (Controller, QuickSettings, etc.)
  10. Load LocalSourceList cache
}
```

**Key Context Variables** (control UI visibility in `package.json`):
- `obi.contains_obi_project` - .obi/ directory exists
- `obi.valid-config` - Configuration is complete
- `obi.run_native` - No local OBI Python installation

## Configuration System

### Two-Layer Merge (AppConfig.ts)

```typescript
Final Config = deepmerge(
  app-config.toml,        // Project config (committed to Git)
  .user-app-config.toml   // User overrides (gitignored)
)
```

**Profile Support**: Both files can define `[profiles.<name>]` sections. Active profile is stored in workspace state.

**Critical**: Use `AppConfig.get_app_config()` to get merged config. Never read TOML files directly.

### Configuration Validation

The extension validates config on every change via `fs.watchFile()` in `OBITools.reload_obi_extension_on_config_change()`. Invalid config triggers a full extension reload.

## Webview Pattern

### Standard Webview Lifecycle

```typescript
class MyWebviewPanel {
  public static currentPanel: MyWebviewPanel | undefined;

  public static render(context, extensionUri, ...params) {
    // Singleton pattern - reuse or create panel
    if (MyWebviewPanel.currentPanel) {
      MyWebviewPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(...);
    MyWebviewPanel.currentPanel = new MyWebviewPanel(panel, extensionUri);
  }

  private getHtml(webview, extensionUri) {
    const nunjucks = require('nunjucks');
    nunjucks.configure(Constants.HTML_TEMPLATE_DIR, { autoescape: true });

    // Use getUri() for all resource URLs
    return nunjucks.render('path/to/template.html', {
      global_stuff: OBITools.get_global_stuff(webview, extensionUri),
      main_java_script: getUri(webview, extensionUri, ["out", "script.js"]),
      ...data
    });
  }
}
```

**Critical Functions**:
- `getUri()` - Converts paths to `vscode-resource://` URIs with proper CSP nonces
- `getNonce()` - Generates CSP nonce for inline scripts
- `OBITools.get_global_stuff()` - Provides common assets (Bootstrap, CSS, etc.)

### Webview ↔ Extension Communication

```typescript
// Extension → Webview
webview.postMessage({ command: 'action', data: {...} });

// Webview → Extension
window.addEventListener('message', event => {
  switch(event.data.command) {
    case 'save': ...
  }
});
```

## SSH Communication (SSH_Tasks.ts)

### Connection Management

```typescript
SSH_Tasks.connect(async () => {
  // Your SSH work here
  await SSH_Tasks.execute_command('...');
});
```

**Key Behaviors**:
- Passwords stored in `context.secrets` (VS Code SecretStorage API)
- SSH keys supported via `ssh-key` config
- Path expansion: `$USER` and `~` automatically replaced
- All commands wrapped in `bash -c '...'` for shell consistency

### Concurrent Operations

The extension uses `ssh-concurrency` config (default: 5) to parallelize file transfers and command executions. See `SSH_Tasks.transfer_files()` for batching logic.

## Build Process Flow

```
User triggers build
    ↓
OBICommands.show_changes() / run_build()
    ↓
createBuildList(source?) in src/obi/compile_list/
    ↓
1. getFiles() - Scan source directory
2. getChangedSources() - Hash comparison
3. getBuildOrder() - Resolve dependencies
4. orderBuilds() - Sort by object type priority
    ↓
Write to .obi/tmp/compile-list.json
    ↓
SSH_Tasks transfers source files to IFS
    ↓
SSH_Tasks executes remote OBI Python/shell scripts
    ↓
Download build logs to .obi/build-output/
    ↓
BuildSummary panel displays results
```

**Key Files**:
- `src/obi/compile_list/createBuildList.ts` - Main orchestration
- `src/obi/compile_list/modules/dependency.ts` - Dependency resolution
- `src/obi/compile_list/modules/build_cmds.ts` - Object type ordering

### Hash-Based Change Detection

Build state stored in `object-builds.json`:
```json
{
  "lib/file/member.rpgle.pgm": "sha256-hash-of-source"
}
```

Only sources with changed hashes or new sources are compiled. Reset via `obi.reset-compiled-object-list` command.

## Dependency System

Stored in `.obi/etc/dependency.json`:
```json
{
  "program.rpgle.pgm": ["file.pf.file", "screen.dspf.file"],
  "srvpgm.rpgle.srvpgm": ["module1.rpgle.module"]
}
```

**Dependency Resolution**: When a source changes, the build system:
1. Identifies all sources that depend on it (transitive closure)
2. Adds them to build list
3. Sorts by dependency order (prerequisites first)
4. Further sorts by object type priority (files before programs)

Edit dependencies via `obi.source.maintain-source-dependency` command (opens webview UI).

## Source Organization

### Source Filters (`.obi/source-list/*.json`)

```json
{
  "name": "All RPGLE Programs",
  "filters": [
    { "source-lib": ".*", "source-file": ".*", "source-member": ".*\\.rpgle\\.pgm" }
  ]
}
```

Filters are **regex-based** (not glob). UI tree view in `src/webview/source_list/SourceListProvider.ts`.

### Source Path Convention

IBM i naming: `library/source-file/member.type.objtype`

Example: `qrpglesrc/qrpglesrc/custmaint.rpgle.pgm`

- Library: Often same as source file (IBM i quirk)
- Member: Base filename
- Type: Language extension
- Objtype: IBM i object type (pgm, srvpgm, module, file, etc.)

## Multi-Language Support (i18n)

Strings defined in `package.nls.json` (English) and `package.nls.<lang>.json`:

```json
{
  "obi.run_build": "OBI: Run build"
}
```

In TypeScript: `LocaleText.get('obi.run_build')`

**Command Titles**: VS Code automatically loads correct `package.nls.<lang>.json` based on `vscode.env.language`.

## Planned Features

### Deployment Module

**Status**: UI partially implemented (`src/webview/deployment/`), currently disabled in `package.json`
**Planned for**: Phase 2 (Q2 2026)

The deployment module will provide release management capabilities for production deployments:
- Multi-environment support (dev, test, production)
- Deployment history and tracking
- Rollback capability
- Release approval workflow
- Integration with i-Releaser tools

**Current Implementation**:
- Webview files exist in `src/webview/deployment/`
- Template: `asserts/templates/deployment/`
- JavaScript: `src/webview/deployment/javascript/deployment_config.ts`
- Disabled via `when: "1==2"` condition in `package.json`

To enable for development, change the `when` clause in package.json menus.

### Quick Settings Panel

**Status**: UI registered but disabled
**Planned for**: Phase 2 (Q2 2026)

Quick Settings will provide rapid access to frequently used configuration options:
- Active profile quick-switch
- Recent build configurations
- Frequently modified settings shortcuts
- Build mode toggles (full vs. incremental)
- SSH connection status and quick reconnect

**Implementation**:
- Webview provider: `src/webview/quick_settings/QuickSettings.ts`
- Registered in extension.ts but disabled via context variable

### Lancelot Integration (Local OBI Mode)

**Status**: Planned integration
**Integration Point**: Project Lancelot extension (`C:\Roland_Batcave\Repos\GitHub\Lancelot-extension`)

Local OBI Mode allows running OBI build scripts locally on the developer's machine instead of via SSH to IBM i:
- Uses local Python environment to execute OBI backend scripts
- Faster build iteration for development/testing
- Reduces network latency for small builds
- Integrates with Lancelot extension for enhanced IBM i development workflow

**Detection**: `OBITools.without_local_obi()` checks for local OBI Python installation
**Context Variable**: `obi.run_native` indicates local mode is active

**Lancelot Integration Benefits**:
- Unified IBM i development experience
- Shared configuration and credentials
- Cross-extension command coordination
- Enhanced debugging capabilities

## Testing Strategy

**Current State**: Minimal test coverage (2 test files in `src/test/`)

**Target Coverage**: 90%

**Planned Approach**:

### Test Infrastructure (Phase 1 - Q1 2026)
- Set up comprehensive unit test framework
- Configure code coverage tooling
- Establish CI/CD pipeline with automated test runs
- Mock VS Code APIs and external dependencies

### Test Categories
1. **Unit Tests** (Target: 85% coverage)
   - Configuration parsing and merging (`AppConfig.ts`)
   - Build list generation (`createBuildList.ts`)
   - Dependency resolution (`modules/dependency.ts`)
   - Path utilities (`DirTool.ts`, `Workspace.ts`)
   - Hash-based change detection

2. **Integration Tests** (Target: key workflows)
   - Full build process (without SSH)
   - Configuration validation and reload
   - Webview lifecycle and messaging
   - File system operations

3. **E2E Tests** (Target: critical paths)
   - Extension activation flow
   - Project initialization
   - Build execution (mocked SSH)
   - UI command execution

### Testing Tools
- **Framework**: VS Code Extension Test suite
- **Mocking**: Sinon.js for SSH and file system
- **Coverage**: nyc/Istanbul
- **CI**: GitHub Actions

Run tests: `npm run test`

**Note**: Tests require VS Code extension host. Current implementation needs expansion for comprehensive mocking.

## Debugging

### Extension Backend
Use VS Code's "Run Extension" (F5) - launches extension development host.

### Webview Panels
1. Open webview panel in dev host
2. Developer Tools → Help → Toggle Developer Tools
3. Select correct webview context in Console dropdown

### SSH Commands
All SSH output logged via Winston logger to `.obi/log/main.log` in workspace.

## Common Patterns

### Reading User Config Files

```typescript
// WRONG - loads single file
const config = DirTool.read_toml(Constants.OBI_APP_CONFIG_FILE);

// CORRECT - merges project + user config
const config = AppConfig.get_app_config();
```

### File System Operations

```typescript
// Use DirTool wrapper (cross-platform path handling)
DirTool.file_exists(path);
DirTool.dir_exists(path);
DirTool.write_json(path, data);
DirTool.read_json(path);
DirTool.write_toml(path, data);  // Uses smol-toml
DirTool.read_toml(path);
```

### Workspace Paths

```typescript
// WRONG
const ws = vscode.workspace.workspaceFolders[0].uri.fsPath;

// CORRECT
const ws = Workspace.get_workspace();  // Handles multi-root, remote workspaces
```

### Windows vs. Unix Paths

**Critical**: Always use forward slashes for remote paths:
```typescript
path.replace(/\\/g, '/')  // Convert Windows backslashes
```

IBM i IFS paths are Unix-style even when extension runs on Windows.

## Adding a New Command

1. **Register in extension.ts**:
```typescript
context.subscriptions.push(
  vscode.commands.registerCommand('obi.my-command', () => {
    MyHandler.execute();
  })
);
```

2. **Add to package.json**:
```json
{
  "commands": [{
    "command": "obi.my-command",
    "title": "%obi.my-command%",
    "icon": "$(icon-name)"
  }]
}
```

3. **Add i18n strings** to `package.nls.json`:
```json
{
  "obi.my-command": "OBI: My Command Description"
}
```

4. **Add menu contribution** if UI button needed:
```json
{
  "menus": {
    "view/title": [{
      "command": "obi.my-command",
      "when": "obi.contains_obi_project && obi.valid-config && view == obi.controller",
      "group": "navigation@10"
    }]
  }
}
```

## Known Issues & Workarounds

### jQuery Dependency
Several webviews use jQuery (`asserts/js/jquery.min.js`). **Should be phased out** in favor of vanilla JS or webview UI toolkit.

### SSH2 Test Files
`postinstall` script in `package.json` removes `node_modules/ssh2/test` to avoid packaging issues.

### Path Encoding
Use `DirTool.get_encoded_file_URI()` for file:// URIs opened in VS Code - handles spaces and special characters.

### Context Keys
When adding UI elements, always check required `when` clauses in `package.json`. Missing context checks cause commands to appear when they shouldn't.

## Performance Considerations

### Source List Caching
`LocalSourceList.load_source_list()` caches source directory structure. Refresh via `obi.source-filter.update` command.

### Large Projects
Build list generation is synchronous and can block on large codebases (10,000+ files). Consider progress notifications for long operations.

### SSH Connection Pooling
Single persistent SSH connection reused across operations. Connection timeout: 3600s (keepalive).

## External Dependencies

**Backend OBI**: Extension depends on separate Python/shell scripts on IBM i:
- Repository: `andreas-prouza/obi`
- Version check: `Constants.OBI_BACKEND_VERSION`
- Installation: User must clone and run `setup.sh` on IBM i

**Transfer on Update**: `OBITools.self_check()` copies templates to `.obi/etc/` on extension version changes.

## Development Roadmap

### Q1 2026: Production Release (v1.0)
- Complete test coverage to 90%
- Bug fixes and performance optimization
- Documentation completion
- External beta testing

### Q2 2026: Advanced Features (v1.1-1.2)
- **Enable Deployment Module** - Full release management
- **Quick Settings Panel** - Rapid configuration access
- **Lancelot Integration** - Local OBI mode with enhanced workflow
- Automatic dependency detection
- Build analytics and reporting

### Q3 2026: Ecosystem Integration (v1.3-1.4)
- Debug integration with VS Code
- Enhanced Git workflow integration
- Team collaboration features
- Enterprise polish and LTS planning

## Related Projects

- **OBI Backend**: `andreas-prouza/obi` - Python/shell scripts for IBM i
- **Project Lancelot**: `C:\Roland_Batcave\Repos\GitHub\Lancelot-extension` - Companion IBM i development extension
- **OBI Documentation**: `andreas-prouza/ibm-i-build-obi` - Comprehensive OBI documentation

When making changes that affect build orchestration, configuration management, or SSH communication, consider impact on these integration points.
