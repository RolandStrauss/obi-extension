---
applyTo: '**'
description: 'Quick-reference cheat-sheet for GitHub Copilot in the Lancelot extension. Points to detailed instruction files for comprehensive guidance.'
---

# Copilot Instructions — Lancelot Extension

Quick reference for Copilot working on Lancelot. **Always start with** `instructions/lancelot.instructions.md` for authoritative project rules. See `instructions/README.md` for a complete file guide and reading order.

## Summary

**Lancelot** is a VS Code extension that provides GitLab-assisted workflows for IBM i development. It integrates with GitLab (CI/CD, repositories), Jira (issue tracking), and IBM i systems (member sync, compilation).

- **Tech stack**: TypeScript 5 (ES2022 target), VS Code extension API, Node.js
- **Test framework**: Mocha + Chai
- **Build**: esbuild (fast bundling), auto-versioning via `npm run package*`
- **Distribution**: VSIX packages auto-incremented and stored in `.artifacts/vsix/`

## Terminology

| Term | Definition |
|------|-----------|
| **Member** | IBM i source code file (RPG, COBOL, CL, etc.) in a library |
| **Library** | IBM i namespace/package containing members and objects |
| **Sparse checkout** | Git feature to clone only selected files (not entire repo) |
| **LazyTokenValidator** | Cached token validation (30-min TTL) to reduce API calls |
| **Service Layer** | Dependency-injected services (AuthService, GitLabClient, IbmiService, etc.) in `src/` |
| **Activation Event** | VS Code trigger that loads extension (view click, command invocation, etc.) |
| **Tree View** | VS Code sidebar panel showing hierarchical data (repositories, branches, IBM i objects) |
| **RBAC** | Role-based access control (6 roles: developer, manager, architect, qa, devops, deploy_officer) |

## Architecture

**Three integration domains:**

1. **GitLab** (`src/gitlab/`) — REST API client (5 req/sec rate limit), projects, branches, merge requests
2. **IBM i** (`src/ibmi/`) — SSH connectivity (ssh2), member sync, CL execution, lazy-load Code for IBM i extension
3. **Jira** (`src/jira/`) — Issue creation/fetch/linking via jira.js SDK

**Core services** (`src/core/`, `src/services/`):
- **AuthService**: OAuth2/OIDC, SecretStorage token management
- **ServiceContainer**: Dependency injection for singletons
- **ConfigurationService**: Centralized settings (`package.json` contributes.configuration)
- **RateLimiter**: API rate limiting guardrails
- **Telemetry**: Application Insights (opt-out friendly, no PII)

**Extension lifecycle**: Async activation → register services → tree views → commands → listen for config changes

For detailed architecture, see `instructions/vscode-extension-architecture.instructions.md`.

## Task planning and problem-solving

**Before writing code:**

1. **Read the relevant instruction file** — Project-specific guidance lives in `.github/instructions/`. Start with `lancelot.instructions.md`.
2. **Understand the service layer** — Don't hardcode logic in commands; delegate to services (AuthService, GitLabClient, IbmiService).
3. **Use lazy-loading patterns** — Avoid blocking extension activation. Load heavy modules (`await import()`) and extensions (Code for IBM i) on-demand.
4. **Follow existing code patterns** — Tree views use providers, commands use event handlers, services use dependency injection.
5. **Test in isolation** — Mock external dependencies (GitLab, Jira, IBM i); use `sinon.stub()` for unit tests.

**Key problem-solving approach:**
- Identify which service boundary the task touches (GitLab? IBM i? Config?)
- Check if similar logic exists elsewhere (reuse patterns, avoid duplication)
- Add tests alongside implementation (Mocha, unit + integration)
- Run `npm run verify:all` before committing (typecheck, lint, i18n, tests)

**Common issues reference:**
- **Issue #510**: Lazy token validation (cache to reduce API calls)
- **Issue #528**: VS Code configuration API requires fully-qualified keys (`lancelot.key.name`, not scoped)
- **Issue #488**: Never access Code for IBM i extension at module level; use safe lazy-loading pattern

## Coding guidelines

### TypeScript & Type Safety
- **No `any` types** — Use explicit interfaces. TypeScript strict mode (`tsconfig.json`) catches mismatches.
- **Return types on public functions** — Functions exported from services/modules must have explicit return types.
- **Async/await only** — Never use synchronous I/O (`fs.readFileSync`, blocking network calls).

### Configuration & Secrets
- **Use `vscode.workspace.getConfiguration()` for settings** — Fully-qualified keys only: `get('lancelot.gitlab.baseUrl')`
- **SecretStorage for credentials** — Never commit tokens. Use `context.secrets.get/set()` for GitLab, IBM i, Jira tokens.
- **Never log credentials, tokens, or PII** — Redact in error messages and telemetry events.

### i18n (Internationalization)
- **No hardcoded user-visible strings** — All labels, messages, titles must come from `package.nls.json` and locale variants.
- **Use `vscode.l10n.t('key')` to retrieve localized strings** at runtime.
- **Validate with `npm run i18n:check`** before committing.

### Testing & Build
- **Add tests alongside code** — Mocha in `test/` folder. Use `sinon.stub()` for mocks.
- **Use batch mode for large test suites** — `npm run test:batch:*` to avoid memory exhaustion.
- **Run pre-commit checks** — `npm run lint && npm run typecheck` (< 30 seconds).
- **Package with auto-versioning** — `npm run package`, `npm run package:optimized`, etc. Never manually edit `package.json` version.

### Accessibility & WebViews
- **Never set `aria-hidden="true"` on `document.body`** — Use `inert` attribute instead to avoid blocking assistive tech.
- **Prefer native UI (QuickPick, dialogs) over WebViews** unless UX significantly improves with WebView.
- **Keyboard navigation mandatory** — All interactive elements must be accessible via Tab, Enter, Escape.

### Documentation
- **Update `package.json` description and keywords** when adding new features.
- **Use file header comments** to document intent in complex files. Avoid "what" comments (code is self-explanatory).
- **Reference instruction files** in code comments when patterns are non-obvious.

## Terminal Command Execution

**PowerShell Syntax Rule**: When running commands from the chat, **always use PowerShell syntax**. This is critical on Windows (the primary development platform for Lancelot) to ensure commands execute correctly and consistently.

**Examples:**
- ✅ `Get-Content file.txt | Select-String 'pattern'` (PowerShell)
- ✅ `npm run lint 2>&1 | Select-Object -Last 5` (PowerShell redirection)
- ❌ `grep 'pattern' file.txt` (bash/Unix - not portable on Windows)
- ❌ `head -n 5 file.txt` (bash/Unix - Windows doesn't have `head`)

**Why PowerShell?**
- Cross-platform: PowerShell 7+ runs on Windows, macOS, Linux
- Default on Windows: Lancelot development happens primarily on Windows
- Shell consistency: Avoid syntax failures on Windows systems
- Availability: PowerShell is configured in all CI/CD pipelines

**File Operations in PowerShell:**
- List files: `Get-ChildItem` or `dir` (alias)
- Read file: `Get-Content filename.txt`
- Write file: `Set-Content filename.txt -Value $content`
- Search: `Select-String -Path file.txt -Pattern 'regex'`
- Piping: `command1 | command2` (object-based, not text-based)

**For comprehensive guidance, see the instruction files in `instructions/` directory:**

**Start here:**
- `instructions/README.md` — **File guide with quick navigation, reading order, and dependencies**
- `instructions/lancelot.instructions.md` — Primary authority, 90 core principles

**Architecture & Design:**
- `instructions/vscode-extension-architecture.instructions.md` — Service layers, activation lifecycle, data flows
- `instructions/copilot-it-architecture.instructions.md` — Design patterns, DevSecOps, scalability

**Code Quality:**
- `instructions/copilot-code-review-checklist.instructions.md` — 50+ code review checkpoints (VS Code APIs, IBM i, GitLab, Jira, accessibility)
- `instructions/typescript-5-es2022.instructions.md` — Strict typing, type safety, no-`any` enforcement

**Security:**
- `instructions/security-and-owasp.instructions.md` — 6 Lancelot-specific threat models (GitLab tokens, IBM i creds, Jira API, command injection, SSRF, data leakage)

**Integrations:**
- `instructions/copilot-jira-integration.instructions.md` — Jira workflows, agile planning, end-to-end traceability
- `instructions/ibmi-integration-testing.instructions.md` — IBM i testing strategy, safe SSH patterns

**Operations & Release:**
- `instructions/auto-version-increment.instructions.md` — Release automation, version management
- `instructions/copilot-performance-targets.instructions.md` — Performance budgets, SLA targets
- `instructions/commercialization-readiness.instructions.md` — Marketplace packaging, VSIX optimization

**Other:**
- `instructions/i18n.instructions.md` — VS Code i18n patterns
- `instructions/playwright-typescript.instructions.md` — E2E testing patterns
- `instructions/memory-bank.instructions.md` — Memory bank structure, task management
- `instructions/taming-copilot.instructions.md` — Copilot behavior directives (no boilerplate)
