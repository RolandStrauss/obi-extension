---
applyTo: '*'
description: 'LDM (Lancelot Development Manager) extension architecture, workflow, and development instructions for maintainers and contributors.'
---

# LDM Extension Instructions

## Project Overview

LDM (Lancelot Development Manager) is a VS Code extension that provides automated build workflows specifically designed for IBM i development. It enables local-first development with remote compilation via SSH, integrating modern development practices (VS Code, Git) with IBM i systems.

**Key Architecture**: The extension runs in VS Code, communicates with IBM i via SSH, manages build orchestration locally, and executes compilations remotely on IBM i using the ldm backend scripts.

## Branch & Commit Naming

See `.github/skills/branch-naming-workflow/SKILL.md` for comprehensive branch naming conventions, commit message standards, and CI validation setup.

## Core Development Principles

### Architecture & Design Patterns

1. Follow the codebase's architecture and design patterns (TypeScript, VS Code API, modular structure).
2. Register all new features as commands or panels in `src/extension.ts` and document in `package.json`.
3. Use clear, consistent UI labels (e.g., "Project" not "Repository").
4. Use icons from the `images/` folder; update the activity bar icon in `package.json` as needed.
5. Apply dependency injection for services; avoid hardcoded dependencies.
6. Separate business logic from UI logic; use service classes for integrations.
7. Place shared services/utilities in `src/utilities/`.
8. **UI Implementation Strategy**: Prefer VS Code native UI elements (dialogs, QuickPick, status bar, etc.) for consistency and performance. However, when a web UI (webview) solution provides significantly better user experience, enhanced functionality, or superior workflow efficiency, web UI implementations are permitted and encouraged. Consider web UI for: complex dashboards, rich data visualization, multi-step forms with real-time validation, or interactive data manipulation interfaces.

### Code Quality & Standards

9. Use async/await for asynchronous operations; handle errors gracefully.
10. Apply strict TypeScript types and interfaces for all public APIs and module boundaries. See `.github/skills/typescript-strict-typing/SKILL.md` for strict typing standards and never use `any`.
11. Write maintainable code with descriptive comments for complex logic. See `self-explanatory-code-commenting.instructions.md`.
12. **File Header Change Summary**: When making changes to any file with a header comment block containing a "Change Summary:" field, MUST update that field with a brief description of what changed. This maintains accurate file-level change tracking and helps future maintainers understand the evolution of the code.
13. Optimize extension activation events for minimal startup time.
14. Avoid global state; use VS Code context and workspace storage.
15. Follow [Semantic Versioning 2.0.0](https://semver.org/) (MAJOR.MINOR.PATCH); update `CHANGELOG.md` using the [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) structure and the extra guidance outlined in this document for every release.
16. Use Prettier and ESLint for formatting and linting.
17. Remove unused files, comments, and code snippets.
18. Follow platform-specific rules from `.github/copilot-instructions.md` for PowerShell syntax, file operations, and environment setup.
19. Prefer Node.js APIs or libraries for scripting and automation where possible. If PowerShell is required for platform-specific tasks, invoke `pwsh` from Node.js using `child_process.spawn` with proper error handling and document any PowerShell dependencies and required modules.
20. **VSIX Package Location**: All VSIX packages are created directly in the `.artifacts/vsix/` folder via the `--out` flag in package scripts. Release notes are created in `.artifacts/releases/` folder to maintain a clean workspace root.
21. **Auto-Increment Version Management**: ALL VSIX package builds MUST automatically increment the version number and update related documentation. Use `npm run package` (patch), `npm run package:minor`, or `npm run package:major`. See `auto-version-increment.instructions.md` and `.github/skills/version-management/SKILL.md` for details.
22. **NEVER update README.md automatically**: Do not modify README.md files without explicit user request or instruction to do so.

### Accessibility - Webview Best Practices

- Avoid setting `aria-hidden` on `document.body` or other host-level ancestors. Setting `aria-hidden` broadly can block assistive technologies and produce runtime accessibility warnings when focused descendants remain active. Instead:
    - Use the WICG `inert` semantics (or a polyfill) to make background content unfocusable when showing overlays/modals inside webviews.
    - If `inert` is not available, set `aria-hidden="true"` only on individual sibling elements (never on `body`) so the overlay itself remains operable and focusable.
    - When hiding background content, ensure any element that currently has focus is blurred or moved to the overlay before applying `inert`/`aria-hidden` changes to avoid blocked focus issues.
    - Prefer a message-driven lifecycle between the extension host and webviews (e.g., host posts `{ type: 'showOverlay', overlayId }` / `{ type: 'hideOverlay' }`), and perform inert/aria-hidden manipulation inside the webview in response to those messages. This ensures the webview controls ordering and focus safely.

These rules prevent the common accessibility error "Blocked aria-hidden on an element because its descendant retained focus" caused by programmatically hiding broad ancestors while a descendant still retains focus. Follow them when implementing or refactoring any webview that displays overlays, dialogs, or panels.

### Cross-Platform Compatibility

- The Lancelot extension MUST be able to run on Windows, macOS, and Linux environments. Ensure that all build, packaging, test and runtime steps (including VSIX creation, installation scripts, and any helper tooling) are compatible with these platforms.
- CI/CD pipelines MUST include cross-platform validation (e.g., build and smoke-test jobs for Windows, macOS, and Linux) before publishing artifacts. Fail the release if cross-platform validation does not pass.
- Avoid hard-coded platform-specific paths, shell syntax, or separators in source files and scripts. When platform-specific behavior is required, detect the platform at runtime and provide safe, documented fallbacks.
- If native modules or platform-specific binaries are necessary, provide clear documentation in `docs/` about required system dependencies and include automated checks during packaging to ensure the correct artifacts are produced for each OS.


### Root Folder Organization & Project Structure

23. **Keep Root Folder Clean**: See `.github/skills/lancelot-folder-structure/SKILL.md` for comprehensive folder organization standards, approved files, structure guidelines, and best practices.

### Integration Architecture

31. Use `src/obi/` for build orchestration and compilation workflow.
32. Use `src/utilities/SSH_Tasks.ts` for SSH communication with IBM i.
33. Use `src/webview/` for UI components and user interaction.
34. Use `src/utilities/` for shared services (logging, workspace, configuration).
35. Integrate IBM i compilation/deployment with ldm backend scripts via SSH.

## Build & Deployment Workflow

### Build Pipeline Requirements

36. Detect source changes using hash-based comparison (SHA-256).
37. Resolve dependencies to determine build order and affected sources.
38. Sort builds by object type priority (files before programs, etc.).
39. Transfer sources to IBM i IFS via SSH.
40. Execute remote ldm backend compilation scripts.
41. Download build logs and parse compilation results.
42. Display build summaries with joblog, spool file, and error details.
43. Support profile-based configuration for different environments.

### Error Handling & User Feedback

44. Use robust error handling with SSH connection retry and timeout management.
45. Provide comprehensive logging via Winston logger to `.ldm/log/main.log`.
46. Display user-friendly error messages with actionable remediation steps.
47. Show compilation progress with real-time feedback in Build Summary webview.

## Security & Performance

### Security-First Development

48. Never store long-lived secrets in the extension or on user machines.
49. Use VS Code SecretStorage for short-lived tokens with secure refresh flows.
50. Enforce TLS encryption for all API communications.
51. Apply least-privilege access patterns with explicit role-based escalation.
52. Maintain comprehensive audit trails for authentication and authorization events.
52a. **Telemetry-First Logging:** Always use `trackEvent()` from telemetry service for logging critical events (authentication, validation, errors). Only use `Logger` as a safe fallback when telemetry is unavailable. This ensures consistent metrics collection across the extension. Example: `trackEvent('gitlab_validation_success', { username, cacheSource })` with logger fallback for initialization failures.

### Performance & Reliability

53. Use SSH connection pooling to reduce connection overhead.
54. Cache local source lists to avoid repeated file system scans.
55. Support graceful degradation when SSH connection to IBM i is unavailable.
56. Use concurrent SSH operations (configurable via `ssh-concurrency`) to parallelize file transfers.
57. Optimize hash calculations using efficient algorithms (hasha library with SHA-256).

## Testing & Quality Assurance

### Comprehensive Testing

58. Cover all new code with unit tests in the `test/` folder.
59. Ensure new features are covered by integration tests.
60. Write unit tests for all new features and bug fixes.
61. Run and pass all tests before merging changes.
62. Implement end-to-end testing for workflow automation.
63. Test the extension on all supported platforms (Windows, macOS, Linux).
64. Test batching rule: For large test suites (e.g., Mocha running 100+ files), always execute tests in batches to improve stability and reduce wall-clock time. Prefer 3–4 batches of ~30–40 files each; use higher Node heap (8–16GB) if needed. In CI, run batches in parallel when feasible.

### Quality Gates

64. Implement error handling and input validation for all user-facing commands.
65. Maintain backward compatibility for public APIs and configuration options.
66. Ensure accessibility and localization for all UI elements and messages.
67. Regularly review and refactor code for performance and maintainability.

### Issue Test Scenarios

68. **Test Scenario Documentation**: See `.github/skills/test-scenario-documentation/SKILL.md` for comprehensive test scenario standards and requirements for every issue fix or remediation.

## Documentation & Reporting

### Documentation Requirements

69. Document all new commands, features, and configuration options in `README.md` only when explicitly requested by the user.
70. **Version Number Updates**: ALWAYS update `README.md` with the new version number each time a new version is created and released. This includes updating version references in installation instructions, feature lists, and any version-specific sections. Version numbers in README must be kept synchronized with package.json and CHANGELOG.md to avoid confusion for users.
71. Keep the PRD document up to date and use it as a reference for all development work.
72. Update checklist and chat-prompts files whenever workflow or requirements change.
73. Document all changes and decisions made during development for future reference.
74. **Feature Documentation**: See `.github/skills/feature-documentation/SKILL.md` for comprehensive feature documentation standards and requirements.

### Development Tracking

75. Maintain comprehensive documentation in `docs/` folder.
76. Track development progress and issues in GitHub repository.
77. Document PRD updates in `docs/reports/PRD_OBI_Extension_2026.md`.
78. Break down large tasks into smaller, manageable subtasks.
79. Generate executive summaries in `docs/reports/Executive_Timeline_Summary.md`.
80. Update `ToDo.md` with planned features and improvements.
81. Include code snippets, design decisions, and challenges in reports as applicable.
82. **Version Management**: Follow the auto-increment version management rules detailed in `.github/instructions/auto-version-increment.instructions.md` for all VSIX releases and documentation updates.
83. **Core Docs:** Keep `launch.json`, `tasks.json`, and `CHANGELOG.md` synchronized with the ongoing LDM work. Update them as the project evolves so that the workspace launch/tasks configs represent current scripts, and the changelog records every release or notable state change.

### Changelog Standards

See `.github/skills/changelog-management/SKILL.md` for comprehensive CHANGELOG.md format and management guidance following Keep a Changelog 1.1.0.

## Continuous Improvement

### Feedback & Enhancement

84. Request clarification or additional requirements when needed.
85. Seek feedback from peers and stakeholders to refine development practices.
86. Regularly review and update the development workflow for effectiveness.
87. Implement agreed changes and track their impact.

### Process Evolution

88. Review and update these Lancelot instructions based on feedback and changing requirements.
89. Foster a culture of continuous improvement by encouraging workflow enhancements.
90. Establish clear processes for handling and incorporating feedback into development workflows.

## Extension Development Workflow

- Keep `copilot-instructions.md`, `README.md`, and `ToDo.md` up to date.
- Use modular TypeScript and VS Code extension best practices.
- Validate all changes with comprehensive testing and update documentation accordingly.
- Request user input for unclear requirements or missing information.
- Follow security-first development practices with comprehensive logging.
- Ensure compatibility with ldm backend scripts on IBM i.
- Break down complex tasks into manageable subtasks with clear acceptance criteria.

### Webview and Tree View Feature Parity

See `.github/skills/webview-tree-parity/SKILL.md` for comprehensive guidance on maintaining feature parity between Webview and Tree View implementations, shared-service patterns, and code examples.

## LDM Backend Integration

### Backend ldm Scripts

The extension depends on separate Python/shell scripts on IBM i:
- **Repository**: `andreas-prouza/ldm` - Backend build scripts and tools
- **Version check**: `Constants.ldm_BACKEND_VERSION` - Ensures compatibility
- **Installation**: User must clone the ldm repository on IBM i and run `setup.sh`
- **Location**: Configured via `general.ldm-path` in app-config.toml

### SSH Integration

All IBM i communication is handled via `src/utilities/SSH_Tasks.ts`:
- Uses `node-ssh` library for SSH connections
- Supports both password and SSH key authentication
- Connection pooling and keepalive (3600s timeout)
- Concurrent operations via `ssh-concurrency` config
- Command execution wrapped in `bash -c '...'` for consistency
- Path expansion: `$USER` and `~` automatically replaced

### File Transfer Process

1. Local source changes detected via hash comparison
2. Sources transferred to IBM i IFS (location: `general.ifs-build-source-path`)
3. ldm backend scripts executed remotely
4. Build logs downloaded to `.ldm/build-output/`
5. Build history stored in `.ldm/build-history/`

## Build Process Flow

```
User triggers build
    ↓
ldmCommands.show_changes() / run_build()
    ↓
createBuildList(source?) in src/obi/compile_list/
    ↓
1. getFiles() - Scan source directory
2. getChangedSources() - Hash comparison (SHA-256)
3. getBuildOrder() - Resolve dependencies
4. orderBuilds() - Sort by object type priority
    ↓
Write to .ldm/tmp/compile-list.json
    ↓
SSH_Tasks transfers source files to IFS
    ↓
SSH_Tasks executes remote ldm Python/shell scripts
    ↓
Download build logs to .ldm/build-output/
    ↓
BuildSummary panel displays results
```

### Key Build Files

- `src/obi/compile_list/createBuildList.ts` - Main build orchestration
- `src/obi/compile_list/modules/dependency.ts` - Dependency resolution
- `src/obi/compile_list/modules/build_cmds.ts` - Object type ordering
- `src/obi/OBICommands.ts` - Command handlers for build operations

### Hash-Based Change Detection

Build state stored in `.ldm/etc/object-builds.json`:
```json
{
  "lib/file/member.rpgle.pgm": "sha256-hash-of-source"
}
```

Only sources with changed hashes or new sources are compiled. Reset via `ldm.reset-compiled-object-list` command.

### Dependency System

Stored in `.ldm/etc/dependency.json`:
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

Edit dependencies via `ldm.source.maintain-source-dependency` command (opens webview UI).

## Source Organization

### Source Filters (`.ldm/source-list/*.json`)

```json
{
  "name": "All RPGLE Programs",
  "filters": [
    { "source-lib": ".*", "source-file": ".*", "source-member": ".*\\.rpgle\\.pgm" }
  ]
}
```

Filters are **regex-based** (not glob). UI tree view in `src/webview/source_list/SourceListProvider.ts`.

### IBM i Source Path Convention

IBM i naming: `library/source-file/member.type.objtype`

Example: `qrpglesrc/qrpglesrc/custmaint.rpgle.pgm`

- Library: Often same as source file (IBM i quirk)
- Member: Base filename
- Type: Language extension (rpgle, sqlrpgle, clle, dspf, etc.)
- Objtype: IBM i object type (pgm, srvpgm, module, file, etc.)

## Configuration System

### Two-Layer TOML Configuration

```typescript
Final Config = deepmerge(
  app-config.toml,        // Project config (committed to Git)
  .user-app-config.toml   // User overrides (gitignored)
)
```

**Profile Support**: Both files can define `[profiles.<name>]` sections. Active profile is stored in workspace state.

**Key Configuration Sections**:
- `[general]` - IBM i connection, paths, SSH settings
- `[profiles.<name>]` - Environment-specific overrides (dev, test, prod)
- `[object-types]` - Build order priority for different object types

**Critical**: Always use `AppConfig.get_app_config()` to get merged config. Never read TOML files directly.

### Configuration Validation

The extension validates config on every change via `fs.watchFile()` in `ldmTools.reload_ldm_extension_on_config_change()`. Invalid config triggers a full extension reload and displays ConfigInvalid webview.

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
      global_stuff: ldmTools.get_global_stuff(webview, extensionUri),
      main_java_script: getUri(webview, extensionUri, ["out", "script.js"]),
      ...data
    });
  }
}
```

**Critical Functions**:
- `getUri()` - Converts paths to `vscode-resource://` URIs with proper CSP nonces
- `getNonce()` - Generates CSP nonce for inline scripts
- `ldmTools.get_global_stuff()` - Provides common assets (Bootstrap, CSS, etc.)

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

## Multi-Language Support (i18n)

Strings defined in `package.nls.json` (English) and `package.nls.<lang>.json`:

```json
{
  "ldm.run_build": "ldm: Run build"
}
```

In TypeScript: `LocaleText.get('ldm.run_build')`

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

### Lancelot Integration (Local ldm Mode)

**Status**: Planned integration
**Integration Point**: Project Lancelot extension (`C:\Roland_Batcave\Repos\GitHub\Lancelot-extension`)

Local ldm Mode allows running ldm build scripts locally on the developer's machine instead of via SSH to IBM i:
- Uses local Python environment to execute ldm backend scripts
- Faster build iteration for development/testing
- Reduces network latency for small builds
- Integrates with Lancelot extension for enhanced IBM i development workflow

**Detection**: `ldmTools.without_local_ldm()` checks for local ldm Python installation
**Context Variable**: `ldm.run_native` indicates local mode is active

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

## Common Patterns

### Reading User Config Files

```typescript
// WRONG - loads single file
const config = DirTool.read_toml(Constants.ldm_APP_CONFIG_FILE);

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
  vscode.commands.registerCommand('ldm.my-command', () => {
    MyHandler.execute();
  })
);
```

2. **Add to package.json**:
```json
{
  "commands": [{
    "command": "ldm.my-command",
    "title": "%ldm.my-command%",
    "icon": "$(icon-name)"
  }]
}
```

3. **Add i18n strings** to `package.nls.json`:
```json
{
  "ldm.my-command": "ldm: My Command Description"
}
```

4. **Add menu contribution** if UI button needed:
```json
{
  "menus": {
    "view/title": [{
      "command": "ldm.my-command",
      "when": "ldm.contains_ldm_project && ldm.valid-config && view == ldm.controller",
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
`LocalSourceList.load_source_list()` caches source directory structure. Refresh via `ldm.source-filter.update` command.

### Large Projects
Build list generation is synchronous and can block on large codebases (10,000+ files). Consider progress notifications for long operations.

### SSH Connection Pooling
Single persistent SSH connection reused across operations. Connection timeout: 3600s (keepalive).

## External Dependencies

**Backend ldm**: Extension depends on separate Python/shell scripts on IBM i:
- Repository: `andreas-prouza/ldm`
- Version check: `Constants.ldm_BACKEND_VERSION`
- Installation: User must clone and run `setup.sh` on IBM i

**Transfer on Update**: `ldmTools.self_check()` copies templates to `.ldm/etc/` on extension version changes.

## Development Roadmap

### Q1 2026: Production Release (v1.0)
- Complete test coverage to 90%
- Bug fixes and performance optimization
- Documentation completion
- External beta testing

### Q2 2026: Advanced Features (v1.1-1.2)
- **Enable Deployment Module** - Full release management
- **Quick Settings Panel** - Rapid configuration access
- **Lancelot Integration** - Local ldm mode with enhanced workflow
- Automatic dependency detection
- Build analytics and reporting

### Q3 2026: Ecosystem Integration (v1.3-1.4)
- Debug integration with VS Code
- Enhanced Git workflow integration
- Team collaboration features
- Enterprise polish and LTS planning

## Related Projects

- **ldm Backend**: `andreas-prouza/ldm` - Python/shell scripts for IBM i
- **Project Lancelot**: `C:\Roland_Batcave\Repos\GitHub\Lancelot-extension` - Companion IBM i development extension
- **ldm Documentation**: `andreas-prouza/ibm-i-build-ldm` - Comprehensive ldm documentation

When making changes that affect build orchestration, configuration management, or SSH communication, consider impact on these integration points.

## Related Instruction Files

- **TypeScript**: `instructions/typescript-5-es2022.instructions.md`
- **Security**: `instructions/security-and-owasp.instructions.md`
- **Performance**: `instructions/performance-optimization.instructions.md`
- **Testing**: `instructions/playwright-typescript.instructions.md`
- **Auto Versioning**: `instructions/auto-version-increment.instructions.md`
- **i18n**: `instructions/i18n.instructions.md`
