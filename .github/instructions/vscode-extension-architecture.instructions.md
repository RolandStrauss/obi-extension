---
applyTo: 'src/**'
description: 'Extension architecture: 8 service layers, activation lifecycle, deployment targets, critical data flows.'
---

# Lancelot Extension Architecture Reference

## Core Service Layers (8 Major Groupings)

| Layer | Directory | Responsibility |
|-------|-----------|-----------------|
| **Authentication** | `src/authentication/` | OAuth2/OIDC token lifecycle, VS Code SecretStorage integration |
| **GitLab API** | `src/gitlab/` | REST client wrapper with rate limiting (5 req/sec), pagination, error handling |
| **Git Operations** | `src/api/git.ts`, `src/workspace/` | Local git commands, sparse checkout, conflict detection |
| **IBM i Integration** | `src/ibmi/` | SSH connectivity (ssh2), member upload/download, CL compilation, lazy-loaded Code for IBM i extension |
| **Jira Cloud** | `src/jira/` | Issue creation/fetch/link, jira.js v5.2.2 wrapper, credential management |
| **Configuration** | `src/core/configurationService.ts` | Centralized settings management with fully-qualified keys (e.g., `lancelot.gitlab.baseUrl`) |
| **Telemetry** | `src/telemetry.ts` | Application Insights integration (opt-out friendly), no PII collection |
| **RBAC** | `src/governance/` | Role-based command gating (6 roles: developer, manager, architect, qa, devops, deploy_officer) |

## Critical Data Flows

1. **Authentication flow**: User triggers command → `authService.getToken()` (lazy validation, 30-min cache) → GitLab API call
2. **Sparse checkout flow**: User selects files → `sparseCheckoutService` → git sparse-checkout set → workspace refresh
3. **IBM i sync flow**: User edits member → `ibmiSyncService` → Code for IBM i extension (lazy-loaded) → SSH upload → CL compile
4. **Metadata migration flow** (Issue #489): Validator → Normalizer → DiffCalculator (5 diff types) → PreviewDialog → BackupManager → MigrationExecutor

## Lazy-Loading Pattern (Critical for Extension Dependencies)

```typescript
// ALWAYS use this pattern when accessing Code for IBM i extension
function getCodeForIbmiInstance(): any {
  const ext = vscode.extensions.getExtension('halcyontechltd.code-for-ibmi');
  if (!ext?.isActive) return null;
  return ext?.exports?.instance;
}
// Applied in: src/views/{branches,status,fileHistory,commits}.ts, src/api/git.ts
```

**Why**: Prevents unwanted side effects from module-level extension access (Issue #488 fix)

## Service Inventory

### Core Services (`src/services/`)
| Service | File | Responsibility |
|---------|------|---------------|
| ApprovalService | `approvalService.ts` | Code review approval workflow, multi-level approval chains |
| AuditService | `auditService.ts` | Centralized audit logging for compliance, RBAC events, authentication |
| CodeReviewService | `codeReviewService.ts` | GitLab MR creation/review, comment threads, approval tracking |
| ExtensionDependencyService | `extensionDependencyService.ts` | Manages dependencies on other VS Code extensions (Code for IBM i) |
| LazyTokenValidator | `lazyTokenValidator.ts` | On-demand token validation with 30-min cache (Issue #510 implementation) |
| NotificationService | `notificationService.ts` | Multi-provider notifications (email, Teams, Slack), audit event dispatch |
| UpdateService | `updateService.ts` | Extension update checks, changelog display |

### Core Infrastructure (`src/core/`)
| Module | File | Responsibility |
|--------|------|---------------|
| ServiceContainer | `serviceContainer.ts` | Dependency injection container (singleton services) |
| ConfigurationService | `configurationService.ts` | Centralized config management, setting observers |
| ErrorHandlingService | `errorHandlingService.ts` | Global error handling, error classification, retry logic |
| PerformanceOptimizer | `performanceOptimizer.ts` | Lazy loading, async patterns, memory management |
| DiagnosticsService | `diagnosticsService.ts` | VS Code diagnostic integration (Problems panel) |

### Utilities (`src/utils/`)
| Module | File | Responsibility |
|--------|------|---------------|
| Logger | `logger.ts` | Centralized logging, log levels, output channel |
| RateLimiter | `rateLimiter.ts` | API rate limiting (5 req/sec for GitLab) |
| SimpleCache | `cache.ts` | TTL-based in-memory cache |
| MetadataManager | `metadataManager.ts` | Workspace metadata persistence (`.lancelot/metadata.json`) |

## Extension Activation Lifecycle

### Activation Triggers (package.json)

Triggers define when the extension loads:
- Activity bar badges (`onView:lancelotCommands`, `onView:lancelotIbmiExplorer`, `onView:repoTreeView`)
- Command invocations (`onCommand:lancelot.gitlab.enterToken`, `onCommand:lancelot.jira.authenticate`, etc.)
- All triggers are optimized to avoid unnecessary activation

### Activation Sequence (src/extension.ts)

1. **Initialize telemetry** (Application Insights, opt-out friendly)
2. **Migrate legacy settings** (if needed)
3. **Initialize core infrastructure** (PerformanceOptimizer, ServiceContainer)
4. **Register services** (AuthService, GitLabClient, ConfigurationService, etc.)
5. **Initialize lazy token validator** (Issue #510)
6. **Register tree view providers** (activity bar, sidebar)
7. **Register commands** (82+ commands across 15+ command handlers)
8. **Set up configuration change listeners**
9. **Notify activation complete**

### Deactivation
- Dispose telemetry
- Dispose all services (cleanup subscriptions, listeners)

### Performance Targets
- **Cold start**: <2 seconds (first activation)
- **Warm start**: <500ms (subsequent activations)
- **Lazy loading**: WebViews and heavy services loaded on-demand
- **Tree views**: Registered immediately, data fetched lazily

## WebView Implementation Patterns

### Primary WebViews
1. **RepoListWebview** (`src/panels/repoListWebview.ts`) — GitLab project browsing and selection
2. **CheckoutWebview** (`src/panels/checkoutWebview.ts`) — Sparse checkout file picker
3. **DepsVizWebview** (`src/ibmi/deps/viz/vizWebview.ts`) — IBM i library dependency visualization

### Lazy Loading Pattern
```typescript
vscode.commands.registerCommand('lancelot.openCheckoutWebview', async () => {
  const { CheckoutWebview } = await import('./panels/checkoutWebview');
  CheckoutWebview.show(context, repoService, branchService, fileSelector,
                       sparseCheckoutService, authService);
});
```

### Message Protocol
```typescript
// Extension → WebView
panel.webview.postMessage({ type: 'updateData', data: { /* ... */ } });

// WebView → Extension
panel.webview.onDidReceiveMessage(message => {
  switch (message.type) {
    case 'selectProject': handleProjectSelection(message.projectId); break;
    case 'cancel': panel.dispose(); break;
  }
});
```

### Critical Accessibility Rules (WCAG 2.2 AA)
- **Never set `aria-hidden="true"` on `document.body`** — Use `inert` attribute instead
- **Focus management**: Trap focus in dialogs, restore on close
- **Keyboard navigation**: Tab/Enter/Escape must work everywhere
- **Screen readers**: Use semantic HTML (`<button>`, `<label>`) not `<div>` with roles
- **Color contrast**: 4.5:1 for normal text, 3:1 for large text/UI

### CSP Headers
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'none';
               style-src ${webview.cspSource} 'unsafe-inline';
               script-src ${webview.cspSource};
               img-src ${webview.cspSource} https:;">
```

### WebView vs Native UI Decision
Use **WebView** for: complex multi-step forms, rich visualization, custom layouts, interactive charts, file trees with checkboxes

Use **Native UI** (QuickPick/Dialog) for: single selections, simple lists, standard VS Code patterns, text-based interactions

**Current pattern**: Prefer native UI by default; use WebView when UX significantly benefits

## Configuration API (Common Pitfall)

❌ **Wrong**:
```typescript
vscode.workspace.getConfiguration('lancelot').update('workspace.defaultPath', value)
```

✅ **Right**:
```typescript
vscode.workspace.getConfiguration().update('lancelot.workspace.defaultPath', value)
```

**Why**: VS Code requires fully-qualified keys (Issue #528 fix)

## Extension Dependencies

### Lazy-Load External Extensions
```typescript
const codeForIbmi = vscode.extensions.getExtension('halcyontechltd.code-for-ibmi');
if (codeForIbmi?.isActive) {
  // Use codeForIbmi.exports
}
```

Never use module-level imports of optional extension APIs. Always check `isActive` before accessing exports.

---

**Need more detail?** Reference:
- `instructions/lancelot.instructions.md` — primary source for all development rules
- `docs/architecture.md` — design decisions and architectural reasoning
- `memory-bank/` — ongoing design documentation and decision records
