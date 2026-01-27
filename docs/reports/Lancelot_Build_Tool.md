# LBT Extension - Complete Feature List

**Version:** 0.7.0  
**Analysis Date:** January 24, 2026  
**Purpose:** Requirements baseline for extension development

## Overview
LBT (Lancelot Build Tool) is a VS Code extension for automated IBM i builds with local-first development and remote SSH compilation.

---

## 1. Core Build System Features

### 1.1 Build Operations
- **Show Changes** - Detect and display all modified sources since last build using SHA-256 hash comparison
- **Show Single Change** - Display changes for currently active source file
- **Run Build** - Execute full build for all detected changed sources
- **Run Single Build** - Build only the currently active source file
- **Build History** - Track and view historical build records with timestamps
- **Build Summary Panel** - Display detailed compilation results including:
  - Command executed
  - Job logs
  - Spool files
  - Error outputs
  - Success/failure status per object

### 1.2 Change Detection
- **Hash-Based Tracking** - SHA-256 hash comparison to identify changed sources
- **Incremental Builds** - Only build sources that have changed
- **Compiled Object List Management**:
  - Reset compiled object list (mark all as new)
  - Get remote compiled object list
  - Automatic hash storage in `.LBT/etc/object-builds.json`

### 1.3 Dependency Management
- **Dependency Resolution** - Automatic detection and building of dependent objects
- **Dependency Graph** - Visual maintenance of source dependencies
- **Transitive Dependencies** - Build all objects affected by changes
- **Dependency Order** - Correct build order (prerequisites first)
- **Dependency Storage** - JSON-based dependency definitions (`.LBT/etc/dependency.json`)
- **Source Dependency Maintenance UI** - Webview panel for managing dependencies

### 1.4 Build Ordering
- **Object Type Priority** - Build in correct order (files before programs, etc.)
- **Configurable Priority** - Define custom object type build orders
- **Smart Ordering** - Combine dependency order with object type priority

---

## 2. Source Management Features

### 2.1 Source Filters
- **Multiple Filter Definitions** - Create unlimited source filter configurations
- **Regex-Based Filtering** - Powerful regex pattern matching for source selection
- **Hierarchical View** - Tree view showing Library/File/Member structure
- **Filter Management**:
  - Add new source filter
  - Edit source filter configuration
  - Delete source filter
  - Show source filter as table view
  - Update/refresh source filters

### 2.2 Source File Operations
- **Add Source File** - Create new source file folders
- **Add Source Member** - Create new source members with validation
- **Rename Source Member** - Rename source files with dependency tracking
- **Delete Source Member** - Remove source members
- **Open Source** - Direct file opening from tree view

### 2.3 Source Metadata
- **Source Descriptions** - Maintain descriptive metadata for each source
- **Source Info Maintenance** - Webview panel for managing source descriptions
- **View Source Infos** - Display all source descriptions in table format
- **Extended Source Information** - JSON-based storage in `.LBT/etc/source-info.json`

### 2.4 Source List Cache
- **Local Source List** - Cached directory structure for fast access
- **Remote Source List** - Retrieve source list from IBM i
- **Automatic Refresh** - Update cache when files change
- **Source List Generation** - Create/update local source cache

---

## 3. Configuration Management

### 3.1 Multi-Level Configuration
- **Project Configuration** (`app-config.toml`) - Team-shared settings
- **User Configuration** (`.user-app-config.toml`) - User-specific overrides
- **Configuration Merging** - Automatic deep merge of project + user configs
- **Profile Support** - Multiple named configuration profiles
- **Profile Management**:
  - Switch active profile
  - Copy profile configuration
  - Delete profile
  - Create new profile from existing

### 3.2 Configuration Webview
- **Interactive Configuration UI** - Visual configuration editor
- **Project vs User Sections** - Clear separation of config layers
- **Configuration Validation** - Real-time validation and error display
- **Auto-Reload** - Automatic extension reload on config changes
- **File Watchers** - Monitor config file changes

### 3.3 Configuration Categories
- **Connection Settings**:
  - Remote host
  - SSH user/password (SecretStorage)
  - SSH key path
  - SSH concurrency settings
- **Project Locations**:
  - Source directory
  - Remote base directory
  - Remote LBT path
  - Build output directory
- **Compile Settings**:
  - Library list
  - Target library mappings
  - Individual command overrides
  - Build command templates
- **LBT Integration**:
  - Local LBT path (optional)
  - Remote LBT path
  - LBT backend version checking

### 3.4 Per-Source Compilation Settings
- **Individual Build Settings** - Custom compile commands per source
- **Source Configuration** (`source-config.toml`) - Per-source overrides
- **Variable Substitution** - Dynamic variables in compile commands
- **Command ID Mapping** - Define custom command sets

---

## 4. SSH and Remote Integration

### 4.1 SSH Connection Management
- **Persistent Connection** - Single SSH connection with keepalive (3600s timeout)
- **Connection Pooling** - Reuse connections for efficiency
- **Password Management** - VS Code SecretStorage integration
- **SSH Key Support** - Public/private key authentication
- **Auto-Reconnect** - Handle connection drops gracefully

### 4.2 File Transfer Operations
- **Parallel Transfer** - Configurable concurrent file transfers
- **Batch Transfers** - Transfer multiple files efficiently
- **Transfer All** - Bulk transfer of all project files to IFS
- **Selective Transfer** - Transfer only changed sources
- **Directory Transfer** - Recursive directory synchronization
- **Path Expansion** - Support for `~` and `$USER` in paths

### 4.3 Remote Command Execution
- **Bash Shell Wrapper** - All commands executed in bash for consistency
- **Path Normalization** - Cross-platform path handling (Windows/Unix)
- **Command Timeout Management** - Configurable timeouts
- **Error Handling** - Comprehensive error capture and reporting
- **Remote Build Execution** - Execute LBT Python scripts on IBM i

### 4.4 Remote Synchronization
- **Download Build Logs** - Retrieve compilation output from IBM i
- **Download Build Output** - Get compiled objects back to local
- **Remote Build History Sync** - Keep local build history synchronized
- **Remote Validation** - Check remote project folder structure

---

## 5. Build Scripting and Orchestration

### 5.1 Build List Generation
- **Automatic Build List** - Generate compile lists from changes
- **Source Scanning** - Scan workspace for all sources
- **Regex-Based Selection** - Filter sources using regex patterns
- **Compile List JSON** - Structured compilation plan in `.LBT/tmp/compile-list.json`

### 5.2 Build Script Generation
- **Local LBT Mode** - Generate build scripts locally (faster iteration)
- **Remote LBT Mode** - Generate build scripts on IBM i
- **Python Integration** - Execute LBT Python scripts
- **Custom Build Commands** - Override default compile commands

### 5.3 Build Execution
- **Progress Tracking** - Real-time build progress notifications
- **Cancellable Builds** - Stop running builds
- **Build Output Collection** - Gather all logs, spool files, and errors
- **Build Status Reporting** - Success/failure status per object

---

## 6. User Interface Features

### 6.1 Activity Bar Views
- **Controller Panel** (Webview) - Main build control interface
- **Build History Tree** - Hierarchical view of build history by date
- **Source Filters Tree** - Organize and view source filters
- **Quick Settings Panel** (Planned) - Rapid access to common settings
- **Deployment Panel** (Planned) - Release management interface

### 6.2 Webview Panels
- **Build Summary** - Detailed compilation results with interactive controls
- **Configuration Editor** - Visual config file editing
- **Source List View** - Tabular display of filtered sources with sorting/filtering
- **Source Info Maintenance** - Edit source descriptions
- **Dependency Maintenance** - Visual dependency graph editor
- **Welcome Screen** - Project initialization guide
- **Config Invalid Screen** - Configuration error display

### 6.3 Tree View Features
- **Collapsible Nodes** - Expand/collapse hierarchical data
- **Context Menus** - Right-click actions on tree items
- **Icons** - Visual indicators for file types and status
- **Inline Actions** - Quick action buttons on tree items
- **Drag and Drop** - (if implemented)

### 6.4 Command Palette Integration
- All commands accessible via Command Palette
- Keyboard shortcuts configurable
- Conditional command visibility based on project state

---

## 7. Localization and Internationalization

### 7.1 Multi-Language Support
- **English** (package.nls.json)
- **German** (package.nls.de.json)
- **Extensible** - Easy to add new languages
- **LocaleText Service** - Centralized translation management

### 7.2 Localized Elements
- Command titles and descriptions
- UI labels and messages
- Configuration descriptions
- Webview content
- Error messages and notifications

---

## 8. Logging and Monitoring

### 8.1 Winston Logger Integration
- **File Logging** - Comprehensive logs in `.LBT/log/main.log`
- **Log Levels** - Info, Debug, Warn, Error
- **Structured Logging** - JSON-formatted log entries
- **Log Rotation** - Automatic log file management

### 8.2 Output Channel
- **VS Code Output Panel** - Real-time log streaming
- **Filtered Output** - Show only relevant messages
- **Clear Output** - Reset output panel
- **Log File Links** - Quick access to log files from UI

### 8.3 Build Output Tracking
- **Per-Build Logs** - Individual log files for each build
- **Compilation Logs** - Detailed compiler output
- **Job Logs** - IBM i job execution logs
- **Spool Files** - Printer output and messages
- **Error Logs** - Consolidated error messages

---

## 9. Testing and Quality Assurance

### 9.1 Test Infrastructure
- **Unit Tests** - Mocha-based test suite
- **Test Files**:
  - `AppConfig.test.ts`
  - `Constants.test.ts`
  - `DirTool.test.ts`
  - `extension.test.ts`
  - `getNonce.test.ts`
  - `LBTStatus.test.ts`
  - `LocaleText.test.ts`
  - `Source.test.ts`
  - `Workspace.test.ts`

### 9.2 Testing Capabilities
- Extension activation testing
- Configuration merging tests
- File system operation tests
- Hash calculation tests
- Locale text resolution tests

---

## 10. Development and Build System

### 10.1 Build Tools
- **esbuild** - Fast bundling for extension backend and webviews
- **TypeScript Compiler** - Type checking and compilation
- **ESLint** - Code quality and style enforcement
- **Three-Layer Bundling**:
  - Extension backend (Node.js)
  - Webview JavaScript (Browser)
  - HTML templates (Nunjucks)

### 10.2 Development Workflow
- **Watch Mode** - Auto-recompile on file changes
- **Development Build** - Fast builds with sourcemaps
- **Production Build** - Optimized, minified builds
- **Packaging** - VSIX creation for distribution

### 10.3 External Dependencies
- **node-ssh** - SSH2 client for IBM i connections
- **nunjucks** - Template engine for webviews
- **deepmerge** - Configuration merging
- **hasha** - SHA-256 hash calculations
- **smol-toml** - TOML configuration parsing
- **winston** - Logging framework
- **fs-extra** - Enhanced file system operations

---

## 11. Integration Points

### 11.1 VS Code Integration
- **SecretStorage API** - Secure password storage
- **Workspace Settings** - Project-specific settings
- **File System Watcher** - Monitor file changes
- **Progress Notifications** - Long-running operation feedback
- **Quick Input** - Input prompts for user interaction
- **Status Bar** - Build status indicators

### 11.2 Git Integration (Planned)
- **GitTool Utility** - Git operations helper
- Branch management
- Commit tracking
- Remote synchronization

### 11.3 External Tools
- **LBT Backend** - Separate Python/shell scripts on IBM i
- **IBM i IFS** - Integrated File System interaction
- **IBM i Compile Commands** - Native compiler integration
- **IBM i Job System** - Job submission and monitoring

---

## 12. Security Features

### 12.1 Credential Management
- **VS Code SecretStorage** - Encrypted password storage
- **No Hardcoded Secrets** - All credentials from secure sources
- **SSH Key Support** - Public/private key authentication
- **Per-Host/User** - Unique credentials per connection

### 12.2 Secure Communication
- **SSH Protocol** - All remote communication encrypted
- **SSL/TLS Support** - Secure network protocols
- **Path Sanitization** - Prevent path traversal attacks
- **Input Validation** - Validate all user inputs

---

## 13. Performance Features

### 13.1 Caching
- **Source List Cache** - Fast access to source directory structure
- **Configuration Cache** - Cached merged configurations
- **Connection Pooling** - Reuse SSH connections
- **Hash Storage** - Persistent build state

### 13.2 Concurrency
- **Parallel File Transfers** - Configurable SSH concurrency
- **Batch Operations** - Group file operations for efficiency
- **Async/Await** - Non-blocking operations
- **Background Processing** - Long operations don't block UI

### 13.3 Optimization
- **Incremental Builds** - Only compile changed sources
- **Smart Change Detection** - Hash-based comparison
- **Efficient File Scanning** - Fast source directory traversal
- **Minimal Data Transfer** - Only transfer necessary files

---

## 14. Error Handling and Recovery

### 14.1 Error Detection
- **Configuration Validation** - Catch config errors early
- **SSH Connection Errors** - Handle connection failures gracefully
- **Build Failures** - Report compilation errors clearly
- **File System Errors** - Handle missing files and permissions

### 14.2 Error Reporting
- **User-Friendly Messages** - Clear error descriptions
- **Actionable Advice** - Suggest remediation steps
- **Detailed Logging** - Comprehensive error logs
- **Stack Traces** - Full error context for debugging

### 14.3 Recovery Mechanisms
- **Auto-Reconnect** - Retry failed SSH connections
- **State Preservation** - Don't lose progress on errors
- **Rollback Support** - Undo failed operations
- **Manual Intervention** - Allow user to fix issues

---

## 15. Planned/Disabled Features

### 15.1 Deployment Module (Disabled - Phase 2)
- Multi-environment support (dev, test, production)
- Deployment history tracking
- Rollback capability
- Release approval workflow
- Integration with i-Releaser tools

### 15.2 Quick Settings Panel (Disabled - Phase 2)
- Active profile quick-switch
- Recent build configurations
- Frequently modified settings shortcuts
- Build mode toggles
- SSH connection status

### 15.3 Local LBT Mode (Planned)
- Run LBT scripts locally for faster iteration
- Reduce network latency
- Development/testing optimization
- Integration with Lancelot extension

---

## 16. Project Management Features

### 16.1 Project Initialization
- **Welcome Screen** - Guide users through setup
- **Init Command** - Create `.LBT/` directory structure
- **Template Configs** - Pre-populated configuration files
- **Setup Validation** - Check requirements before starting

### 16.2 Workspace Management
- **Multi-Root Workspace Support** - Handle complex project structures
- **Workspace Settings** - Per-workspace configuration
- **Profile Management** - Switch profiles per workspace
- **Project State** - Track current build state and history

---

## 17. Documentation and Help

### 17.1 Embedded Documentation
- **Inline Help** - Tooltips and descriptions
- **Configuration Tooltips** - Explain each config option
- **Command Descriptions** - Clear command palette descriptions
- **Error Messages** - Actionable error descriptions

### 17.2 External Documentation
- **README.md** - Project overview and setup
- **CHANGELOG.md** - Version history
- **Dependencies Documentation** - How to define dependencies
- **SSH Setup Guide** - Configure SSH for IBM i
- **LBT Backend Docs** - Integration with Python/shell scripts

---

## 18. Platform Support

### 18.1 Operating Systems
- Windows
- macOS
- Linux

### 18.2 VS Code Compatibility
- **Minimum Version**: 1.100.0
- **Extension Host**: Node.js environment
- **Webview Support**: Modern browser APIs
- **Remote Development**: SSH and remote workspace support

---

## 19. Data Formats and Storage

### 19.1 Configuration Files
- **TOML Format** - Human-readable configuration
- **JSON Storage** - Structured data files
- **Hierarchical Structure** - Organized in `.LBT/` directory

### 19.2 Build Artifacts
- `.LBT/etc/object-builds.json` - Build state/hashes
- `.LBT/etc/dependency.json` - Dependency graph
- `.LBT/etc/source-config.toml` - Per-source settings
- `.LBT/etc/source-info.json` - Source metadata
- `.LBT/tmp/compile-list.json` - Current build plan
- `.LBT/build-output/` - Compilation logs
- `.LBT/build-history/` - Historical build records
- `.LBT/log/` - Application logs
- `.LBT/source-list/` - Source filter definitions

---

## 20. Extension Architecture

### 20.1 Module Structure
- **Extension Entry** - `src/extension.ts`
- **LBT Core** - `src/lbt/`
- **Webview Panels** - `src/webview/`
- **Utilities** - `src/utilities/`
- **Constants** - `src/Constants.ts`

### 20.2 Key Services
- **AppConfig** - Configuration management
- **SSH_Tasks** - Remote SSH operations
- **LBTTools** - Common utilities
- **Logger** - Winston logging
- **Workspace** - Workspace helpers
- **DirTool** - File system operations
- **LocaleText** - Internationalization
- **GitTool** - Git integration helper

---

## 21. Command Reference

### 21.1 Build Commands
- `lbt.show_changes` - Show all changed sources
- `lbt.show_single_changes` - Show changes for active source
- `lbt.run_build` - Execute full build
- `lbt.run_single_build` - Build active source only

### 21.2 Source Management Commands
- `lbt.source-filter.update` - Refresh source filters
- `lbt.source-filter.add` - Create new source filter
- `lbt.source-filter.show-view` - Display filter as table
- `lbt.source-filter.edit-config` - Edit filter configuration
- `lbt.source-filter.delete-config` - Remove source filter
- `lbt.source-filter.add-source-file` - Create new source file folder
- `lbt.source-filter.add-source-member` - Add new source member
- `lbt.source-filter.rename-source-member` - Rename source
- `lbt.source-filter.delete-source-member` - Delete source
- `lbt.source-filter.change-source-description` - Edit source metadata
- `lbt.source-filter.view-source-infos` - View all source descriptions
- `lbt.source-filter.maintain-source-infos` - Edit source info panel

### 21.3 Configuration Commands
- `lbt.controller.config` - Open configuration editor
- `lbt.controller.dependency-list` - View dependency graph
- `lbt.copy-profile-config` - Copy current profile
- `lbt.source.edit-compile-config` - Individual source compile settings
- `lbt.source.maintain-source-dependency` - Edit dependencies

### 21.4 Remote Operations Commands
- `lbt.transfer-all` - Upload all files to IBM i
- `lbt.reset-compiled-object-list` - Mark all sources as new
- `lbt.get-remote-compiled-object-list` - Download build state from IBM i (disabled)
- `lbt.get-remote-source-list` - Retrieve source list from remote (disabled)
- `lbt.check-remote-sources` - Validate remote sources (disabled)

### 21.5 Build History Commands
- `lbt.build-history.update` - Refresh build history view
- `lbt.build-history.delete-item` - Remove single build record
- `lbt.build-history.delete-date` - Remove all builds for a date

### 21.6 Deployment Commands (Disabled)
- `lbt.deployment.maintain` - Deployment configuration (Phase 2)

---

## 22. Technical Specifications

### 22.1 File Formats
- **Source Naming Convention**: `library/source-file/member.type.objtype`
  - Example: `qrpglesrc/qrpglesrc/custmaint.rpgle.pgm`
- **Hash Algorithm**: SHA-256
- **Configuration Format**: TOML (project) + JSON (structured data)
- **Template Engine**: Nunjucks for HTML generation

### 22.2 Performance Metrics
- **SSH Keepalive**: 3600 seconds
- **Default SSH Concurrency**: 5 parallel transfers
- **File Watcher Interval**: 1000ms
- **Build History**: Timestamped JSON files

### 22.3 Supported Object Types
Configurable via `general.supported-object-types` configuration:
- `pgm` - Programs
- `srvpgm` - Service Programs
- `module` - Modules
- `file` - Database files
- `dspf` - Display files
- `prtf` - Printer files
- And other IBM i object types

---

## 23. User Workflows

### 23.1 Initial Project Setup
1. Open empty folder in VS Code
2. Switch to LBT view
3. Click "Initialize" on welcome screen
4. Configure connection settings (host, user, paths)
5. Save configuration
6. Clone LBT backend on IBM i
7. Configure LBT backend path in settings

### 23.2 Daily Development Workflow
1. Edit sources locally in VS Code
2. Click "Show Changes" to see what's modified
3. Review build list with dependencies
4. Click "Run Build" to compile on IBM i
5. Review Build Summary for results
6. Check job logs and spool files if needed
7. Commit changes to Git

### 23.3 Dependency Management Workflow
1. Open source file or select in tree
2. Click "Maintain Source Dependencies"
3. Add/remove dependencies in webview
4. Dependencies automatically included in builds
5. Build system ensures correct order

### 23.4 Profile Switching Workflow
1. Create multiple profiles for different environments (dev, test, prod)
2. Switch active profile from controller panel
3. Different target libraries, settings per profile
4. Share project config, keep user config private

---

## 24. Integration Architecture

### 24.1 LBT Backend Integration
- **Repository**: [roland-strauss/LBT](https://github.com/roland-strauss/LBT)
- **Technology**: Python/Shell scripts
- **Installation**: Clone to IBM i IFS, run `setup.sh`
- **Version Check**: `Constants.LBT_BACKEND_VERSION`
- **Communication**: SSH command execution
- **Scripts**:
  - `main.py -a create` - Generate build scripts
  - `main.py -a run` - Execute compilation
  - `main.py -a gen_src_list` - Create source lists

### 24.2 Webview Architecture
- **Backend**: Node.js extension host
- **Frontend**: Browser environment (webview)
- **Communication**: Message passing via `postMessage`
- **Templates**: Nunjucks server-side rendering
- **Resource Loading**: `vscode-resource://` URIs
- **CSP**: Content Security Policy with nonces

### 24.3 Data Flow
```
Local Sources → Hash Check → Build List → Transfer to IFS
    ↓
IBM i Compilation (LBT Backend)
    ↓
Download Logs/Results → Update Build History → Display Summary
```

---

## 25. Extension Lifecycle

### 25.1 Activation
1. Extension activates on `onStartupFinished` event
2. Check for `.LBT/` directory existence
3. If missing: Show welcome screen, exit
4. Validate configuration
5. If invalid: Show config error screen, exit
6. Register all command handlers
7. Register tree view and webview providers
8. Load source list cache
9. Set context variables for command visibility

### 25.2 Configuration Changes
1. File watcher detects config file change
2. Validate new configuration
3. If invalid: Show error, reload extension
4. If valid: Update internal cache
5. Refresh UI components
6. Notify user of successful reload

### 25.3 Build Process
1. Scan workspace for sources
2. Calculate hashes for each source
3. Compare with stored hashes
4. Resolve dependencies
5. Order by priority
6. Transfer changed sources to IFS
7. Generate/transfer build script
8. Execute remote build
9. Download results
10. Update hash storage
11. Display build summary

---

## Summary

This comprehensive feature list represents the LBT extension v0.7.0 as a mature build automation tool for IBM i development with:

- **150+ discrete features** across 25 major categories
- **30+ VS Code commands** for build and source management
- **Multi-layer configuration system** with profiles
- **Incremental build system** with dependency resolution
- **Full SSH integration** with secure credential management
- **Rich UI** with webviews and tree views
- **Internationalization** support (English/German)
- **Comprehensive logging** and error handling
- **Platform-independent** operation (Windows/macOS/Linux)

This can serve as a complete requirements baseline for:
- Creating similar extensions for other platforms
- Integrating LBT features into other tools
- Understanding the IBM i development workflow automation
- Planning feature enhancements or migrations
