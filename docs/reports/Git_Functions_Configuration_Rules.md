# Lancelot Git Functions, Configuration, and Rules

**Document Version**: 1.0  
**Date**: January 27, 2026  
**Scope**: Complete Git integration within Lancelot Development Manager (LDM) extension

---

## Table of Contents

1. [Overview](#overview)
2. [Git Detection & Location](#git-detection--location)
3. [Git Installation & Remediation](#git-installation--remediation)
4. [Git Status Bar UI](#git-status-bar-ui)
5. [Commands & User Interactions](#commands--user-interactions)
6. [Configuration Settings](#configuration-settings)
7. [Rules & Conventions](#rules--conventions)
8. [Architecture & Flow](#architecture--flow)
9. [Error Handling](#error-handling)
10. [Usage Examples](#usage-examples)

---

## Overview

The Git integration in Lancelot is designed to:
- **Detect** Git availability on the user's system
- **Guide** users to install Git if missing (corporate-preferred path first)
- **Monitor** Git status via a visual status bar item
- **Support** cross-platform operations (Windows, macOS, Linux)
- **Respect** organizational policies via configuration

### Philosophy
- **Corporate-first**: Prefer company-managed Software Center/SCCM installations
- **User-friendly**: Clear, actionable guidance for manual installs
- **Lightweight**: Minimal startup impact through non-blocking checks
- **Configurable**: Organizations can inject their internal Git installation guide

---

## Git Detection & Location

### Function: `findGit()`

**Location**: `src/platform/gitDetection.ts`

**Purpose**: Locate Git executable on the system using a multi-strategy approach.

**Returns**: `Promise<string | undefined>`
- Returns path to Git executable (absolute or "git" if on PATH)
- Returns `undefined` if Git is not found

**Detection Strategy (in order)**:

1. **VS Code Configuration** (`git.path` setting)
   - Respects user's custom Git path from VS Code settings
   - Validates that the path is executable
   - Most specific user preference

2. **System PATH** (`git --version`)
   - Spawns subprocess to check if `git` command is available
   - Works when Git is properly added to PATH environment variable

3. **Platform-Specific Fallbacks**:
   
   **Windows**:
   - `C:\Program Files\Git\cmd\git.exe`
   - `C:\Program Files (x86)\Git\cmd\git.exe`
   - Environment variables: `%ProgramFiles%` and `%ProgramFiles(x86)%`
   - `where git` command (searches PATH)

   **macOS/Linux**:
   - `which git` command
   - Avoids triggering Xcode CLI dialogs on macOS

### Helper Functions

#### `isExecutable(path: string): Promise<boolean>`
- Uses `fs.access()` with `X_OK` flag to check executable permissions
- Cross-platform file permission check
- Returns false if path is inaccessible

#### `trySpawn(cmd: string, args: string[]): Promise<{code, stdout, stderr} | undefined>`
- Safely spawns subprocess with stdio handling
- Captures exit code and output
- Returns `undefined` on error (prevents exceptions)

#### `streamToString(stream: NodeJS.ReadableStream | null): Promise<string>`
- Converts Node.js readable stream to string
- Handles null streams gracefully
- Accumulates chunks and buffers

---

## Git Installation & Remediation

### Function: `handleMissingGit()`

**Location**: `src/platform/gitInstallPrompt.ts`

**Purpose**: Guide users through Git installation when Git is not found.

**User Actions** (platform-dependent):

#### Windows
1. **"Open Software Center"** (Primary)
   - Launches `softwarecenter:` URI
   - Fallback: Information message with manual steps
   - Recommended: Corporate-managed installation path

2. **"Install via winget (silent)"** (Alternative)
   - Executes: `winget install --id Git.Git -e --silent`
   - Opens terminal with command
   - May require admin or fail due to policy
   - User completes any prompts, then reloads VS Code

3. **"Show package manager command"** → N/A (Windows)

4. **"Open Git downloads page"** (Fallback)
   - Launches: https://git-scm.com/downloads

#### macOS
1. **"Open Software Center"** → N/A (macOS)

2. **"Show Homebrew command"**
   - Displays: `brew install git`
   - Copy-to-clipboard option

3. **"Open Git downloads page"** (Fallback)

#### Linux
1. **"Open Software Center"** → N/A (Linux)

2. **"Show package manager command"**
   - Shows multiple package manager options:
     - `sudo apt-get update && sudo apt-get install -y git` (Debian/Ubuntu)
     - `sudo dnf install -y git` (Fedora/RHEL)
     - `sudo yum install -y git` (CentOS/RHEL legacy)
     - `sudo pacman -S --noconfirm git` (Arch)
   - Copy-to-clipboard option

3. **"Open Git downloads page"** (Fallback)

### Helper Functions

#### `runTerminalCommand(cmd: string): Promise<void>`
- Creates new VS Code terminal window
- Executes command with automatic newline
- Shows info message prompting VS Code reload

#### `showCommand(cmd: string | string[]): Promise<void>`
- Displays command in info modal
- Offers "Copy" button to clipboard
- Handles multi-line commands (uses OS-specific newlines)

---

## Git Status Bar UI

### Function: `registerGitStatusBar(ctx: ExtensionContext)`

**Location**: `src/ui/gitStatusBar.ts`

**Purpose**: Display real-time Git availability status in VS Code status bar.

### Status Bar Item Properties

| Property | Value | Notes |
|----------|-------|-------|
| **Alignment** | `StatusBarAlignment.Right` | Right side of status bar |
| **Priority** | `100` | Position within right alignment (higher = further left) |
| **Name** | "Lancelot Git Status" | Display name in UI |
| **Command** | `ldm.tools.checkGit` | Click triggers Git check |

### Status Display

#### When Git is Found (`$(check) Git`)

**Icon**: Green checkmark  
**Tooltip** (Markdown):
```
Git detected (/path/to/git)

[$(link-external) Open "Install Git via Software Center" guide](configured_url)
```
OR (if no guide URL configured):
```
Git detected (/path/to/git)

[$(link-external) Open Git downloads](https://git-scm.com/downloads)
```

**Visibility** (controlled by `ldm.gitStatus.showWhenAvailable`):
- `true`: Always shown
- `false`: Hidden

#### When Git is Missing (`$(warning) Git missing`)

**Icon**: Orange warning triangle  
**Tooltip** (Markdown):
```
**Git is missing.** Lancelot requires Git for repository operations.

[$(book) Open "Install Git via Software Center" guide](configured_url)

**Other options**

- [$(link-external) Git downloads](https://git-scm.com/downloads)
```

### Auto-Update Triggers

The status bar updates reactively when:

1. **Git path changes**: `git.path` configuration updated
2. **Lancelot settings change**:
   - `ldm.gitStatus.showWhenAvailable`
   - `ldm.gitStatus.refreshOnWindowFocus`
   - `ldm.docs.gitInstallUrl`
3. **Window gains focus** (if `ldm.gitStatus.refreshOnWindowFocus` is true)

---

## Commands & User Interactions

### Command: `ldm.tools.checkGit`

**Title**: "Lancelot: Check Git"  
**Category**: Lancelot  
**Accessible**: Command Palette, Status Bar Click  

**Behavior**:

#### If Git is Available
```
Message: "Git is available (/path/to/git)"
Buttons: [Copy Path] [Open Settings…]
```

- **Copy Path**: Copies Git path to clipboard
- **Open Settings…**: Opens VS Code settings filtered to `git.path`

#### If Git is Missing
```
Message: "Git is required for Lancelot workflows, but it was not found."
Buttons: [Open Install Guide]* [Fix it now] [Don't ask again]
         (* only if ldm.docs.gitInstallUrl is configured)
```

- **Open Install Guide**: Opens configured guide URL or falls back to git-scm.com/downloads
- **Fix it now**: Calls `handleMissingGit()` for platform-specific remediation
- **Don't ask again**: Shows info message; user can re-enable via Command Palette

### Command: `ldm.gitStatus.toggleVisibility`

**Title**: "Toggle Git Status Bar"  
**Category**: Lancelot  
**Accessible**: Command Palette  

**Behavior**:
- Reads current value of `ldm.gitStatus.showWhenAvailable`
- Toggles the boolean setting
- Shows confirmation: "Git status bar shown." or "Git status bar hidden."

---

## Configuration Settings

### Extension Manifest Configuration

**File**: `package.json` → `contributes.configuration`

#### `ldm.gitStatus.showWhenAvailable`
```json
{
  "type": "boolean",
  "default": true,
  "description": "Show the Git status item even when Git is available. If disabled, the item only appears when Git is missing."
}
```

**Scope**: User or Workspace  
**Impact**: Controls status bar visibility when Git is detected  
**Use Case**: Users who want indicator only on errors

#### `ldm.gitStatus.refreshOnWindowFocus`
```json
{
  "type": "boolean",
  "default": true,
  "description": "Refresh the Git status when the VS Code window gains focus."
}
```

**Scope**: User or Workspace  
**Impact**: Re-checks Git availability on window focus  
**Use Case**: Keep status current in multi-window environments

#### `ldm.docs.gitInstallUrl`
```json
{
  "type": "string",
  "default": "",
  "description": "URL of the internal guide that shows how to install Git from Software Center (SharePoint/Confluence link)."
}
```

**Scope**: User or Workspace (recommend workspace)  
**Impact**: Provides organization-specific Git installation guide  
**Examples**:
- `https://mmiholdingsltd.sharepoint.com/:w:/s/ProjectLancelot/<doc-id>`
- `https://wiki.company.com/Git/Installation`
- Empty string: Falls back to https://git-scm.com/downloads

### Workspace Defaults

**File**: `.vscode/settings.json`

```jsonc
{
  "ldm.docs.gitInstallUrl": "https://mmiholdingsltd.sharepoint.com/:w:/s/ProjectLancelot/<doc-id>"
}
```

**Rationale**: Teams get the link "out of the box" via workspace configuration. Individual users can override in personal user settings.

---

## Rules & Conventions

### 1. Detection Strategy
- **Rule**: Always try the most specific source first (user setting → PATH → fallbacks)
- **Rule**: Never block extension activation on Git detection (non-blocking async)
- **Rule**: Validate executable permissions before returning path

### 2. User Messaging
- **Rule**: Show Git status immediately on activation (visual feedback)
- **Rule**: Provide corporate path first, then fallbacks
- **Rule**: Never silently suppress Git missing warnings (use explicit "Don't ask again" button)

### 3. Configuration Hierarchy
- **Highest Priority**: User personal settings (`~/.config/Code/settings.json` or equivalent)
- **Middle**: Workspace settings (`.vscode/settings.json`)
- **Lowest**: Extension defaults (`package.json`)

### 4. Reactivity
- **Rule**: Status bar updates within 500ms of configuration change
- **Rule**: Window focus triggers re-check only if setting enabled
- **Rule**: Configuration changes are debounced to prevent excessive checks

### 5. Error Handling
- **Rule**: Gracefully handle subprocess errors (don't crash UI)
- **Rule**: Show user-friendly error messages (not stack traces)
- **Rule**: Provide fallback UI when Git check fails

### 6. Accessibility
- **Rule**: Use accessible icons from VS Code icon library
- **Rule**: Provide markdown-based tooltips (text-based alternative to icons)
- **Rule**: Keyboard accessible via Command Palette

---

## Architecture & Flow

### Initialization Flow (Extension Activation)

```
activate()
  ├─ 1. Non-blocking Git check (async IIFE)
  │  ├─ findGit() → check user global state
  │  └─ If missing: showWarningMessage() → options
  │
  ├─ 2. registerGitStatusBar()
  │  ├─ Create StatusBarItem (Right, priority 100)
  │  ├─ Initial update() call
  │  └─ Subscribe to:
  │     ├─ onDidChangeConfiguration
  │     └─ onDidChangeWindowState
  │
  └─ 3. registerCheckGitCommand()
     ├─ Register ldm.tools.checkGit
     ├─ Register ldm.gitStatus.toggleVisibility
     └─ Subscribe to context subscriptions
```

### Runtime Update Flow

```
Configuration/Focus Change
  └─ Event fires (onDidChangeConfiguration or onDidChangeWindowState)
     └─ update() called
        ├─ findGit() to get current path
        ├─ Fetch settings (showWhenAvailable, guideUrl, refreshOnFocus)
        └─ Update StatusBarItem:
           ├─ Set text (icon)
           ├─ Set tooltip (markdown)
           └─ Show/hide based on settings
```

---

## Error Handling

### Scenario: Git Check Fails

**Error Source**: `findGit()` exception  
**Handling**: Caught in try-catch, returns `undefined`  
**User Impact**: Git treated as missing (shows warning)  
**Recovery**: User can retry via Command Palette

### Scenario: Configuration Invalid

**Error Source**: Invalid `ldm.docs.gitInstallUrl` format  
**Handling**: Gracefully treated as "not configured" (uses fallback)  
**User Impact**: Users see default Git downloads link instead  
**Recovery**: Admin can update workspace settings with valid URL

### Scenario: GUI Launch Fails (e.g., Software Center)

**Error Source**: `vscode.env.openExternal()` returns false  
**Handling**: Falls back to information message with manual steps  
**User Impact**: User sees copy-paste instructions  
**Recovery**: User can manually launch Software Center

### Scenario: Terminal Command Fails (e.g., winget)

**Error Source**: Subprocess error or permission denied  
**Handling**: Terminal shown to user, user sees command output  
**User Impact**: User can troubleshoot or retry  
**Recovery**: User completes install, reloads VS Code

---

## Usage Examples

### Example 1: Typical User (Git Already Installed)

1. User opens VS Code with LDM extension
2. Extension detects Git via PATH or settings
3. Status bar shows: `$(check) Git`
4. Tooltip: "Git detected (/usr/bin/git)\n\n[link to guide or downloads]"
5. User can click to copy path or open settings
6. On window focus: Status refreshes (if enabled)

### Example 2: New User (Git Missing)

1. User opens VS Code with LDM extension
2. Non-blocking check detects Git is missing
3. Modal warning: "Git is required... Fix it now / Don't ask again"
4. User clicks "Fix it now"
5. Platform-specific guidance:
   - **Windows**: "Open Software Center" dialog
   - **macOS**: "Show Homebrew command" with copy option
   - **Linux**: "Show package manager command" with common options
6. User installs Git, reloads VS Code
7. Status bar updates to show Git found

### Example 3: Admin Configures Organization Guide

1. Admin creates SharePoint page on Git installation
2. Admin sets workspace `ldm.docs.gitInstallUrl` in `.vscode/settings.json`:
   ```json
   {
     "ldm.docs.gitInstallUrl": "https://sharepoint.company.com/sites/IT/Git"
   }
   ```
3. Team clones workspace
4. Users see guide link in status bar tooltip and command modal
5. Guide link consistent across all users (centralized)
6. Admin can update URL once, applies to all

### Example 4: User Disables Status Bar

1. User opens Command Palette
2. Types "Toggle Git Status Bar"
3. Clicks command
4. Status bar hides
5. User can re-toggle anytime

---

## File Structure

```
src/
├── platform/
│   ├── gitDetection.ts          ← Core detection logic
│   └── gitInstallPrompt.ts      ← Remediation guidance
├── commands/
│   └── checkGit.ts              ← Command registration & handlers
├── ui/
│   └── gitStatusBar.ts          ← Status bar UI & reactivity
└── extension.ts                 ← Activation & registration

.vscode/
└── settings.json                ← Workspace config (guide URL)

package.json                      ← Configuration schema & commands
├── contributes.commands           ← ldm.tools.checkGit, ldm.gitStatus.toggleVisibility
└── contributes.configuration      ← ldm.gitStatus.*, ldm.docs.*
```

---

## Summary Table

| Aspect | Details |
|--------|---------|
| **Detection** | Multi-strategy: user setting → PATH → platform fallbacks |
| **Installation Guidance** | Corporate-first (Software Center), then platform-specific helpers |
| **Status Indicator** | Right-aligned status bar item, icon + markdown tooltip |
| **Auto-Updates** | Config changes + window focus (configurable) |
| **Commands** | Check Git + Toggle visibility |
| **Settings** | Show when available + Refresh on focus + Guide URL |
| **Error Handling** | Graceful fallbacks, user-friendly messages |
| **Platforms** | Windows, macOS, Linux |
| **Extensibility** | Configurable guide URL, organizational policy-friendly |
