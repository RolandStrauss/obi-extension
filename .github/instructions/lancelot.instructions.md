---
applyTo: '*'
description: 'Essential Lancelot architecture, coding conventions, and security. See related instruction files for detailed guidance on specific topics.'
---

# Lancelot Extension Instructions

**Lancelot** is a VS Code extension for GitLab-assisted workflows in IBM i development. It integrates with GitLab, Jira, and IBM i systems.

**Author**: Roland Strauss | **Email**: roland.strauss@momentum.co.za

---

## Core Architecture

1. Follow codebase patterns: TypeScript, VS Code API, modular structure
2. Register features in `src/extension.ts`, document in `package.json`
3. Use clear UI labels (e.g., "Project" not "Repository")
4. Apply dependency injection; no hardcoded dependencies
5. Separate business logic from UI; use service classes for integrations
6. Shared services/utilities in `src/core/`
7. Prefer VS Code native UI (quick pick, dialogs, status bar) for consistency
8. WebViews only when they provide significantly better UX (complex dashboards, real-time forms, data visualization)

## Code Quality Essentials

- **Async/await**: Always async, graceful error handling; no blocking operations
- **Types**: Strict TypeScript, no `any`. See `typescript-5-es2022.instructions.md`
- **Comments**: Explain *why*, not *what*; see `self-explanatory-code-commenting.instructions.md`
- **File headers**: Update "Change Summary:" field when modifying files with existing headers
- **Activation**: Minimize startup time; lazy-load heavy modules
- **State**: Use VS Code context/storage, never global variables
- **Formatting**: Prettier + ESLint; clean code habits
- **Versioning**: Semantic Versioning; auto-increment on VSIX build. See `auto-version-increment.instructions.md`

## Integration Architecture

- **Auth**: `src/authentication/` (OAuth2/OIDC, SecretStorage)
- **GitLab**: `src/gitlab/` (rate limiting, caching, REST API)
- **REST**: `src/rest/` (comprehensive error handling)
- **IBM i**: `src/ibmi/`, `src/workspace/` (member sync, CL execution)
- **Jira**: `src/jira/`

## Security Essentials

- Never hardcode secrets; use VS Code SecretStorage
- Short-lived tokens with refresh flows; TLS only
- Least-privilege access; audit trails for auth events
- **Telemetry-first logging**: Use `trackEvent()` for critical events (auth, validation, errors), logger as fallback
- Rate limiting per service; graceful degradation on service unavailability
- Validate all user input; prevent command injection in CL commands

See `security-and-owasp.instructions.md` for Lancelot-specific threat models and mitigations.

## Testing & Quality

- Unit tests for all new code in `test/` folder
- Batch tests in 3-4 groups (~30-40 files each) for large suites; higher Node heap if needed
- Run `npm run verify:all` before merging

See `copilot-code-review-checklist.instructions.md` for 50+ pre-merge validation points.

---

## Related Instruction Files

**Always reference for specific task guidance:**
- `copilot-code-review-checklist.instructions.md` — Code review gates (50+ checkpoints)
- `copilot-performance-targets.instructions.md` — Performance SLAs, startup budgets
- `copilot-it-architecture.instructions.md` — Architecture patterns, DevSecOps
- `security-and-owasp.instructions.md` — Threat models, secure coding
- `typescript-5-es2022.instructions.md` — Strict typing rules
- `i18n.instructions.md` — Localization patterns
- `auto-version-increment.instructions.md` — Release & versioning

**See .github/skills/ for quick references:**
- `branch-naming-workflow/SKILL.md` — Branch/commit naming
- `version-management/SKILL.md` — Changelog management
- `lancelot-folder-structure/SKILL.md` — Folder organization
- `webview-tree-parity/SKILL.md` — Webview/Tree View consistency

**Occasional guidance (when needed):**
- `copilot-jira-integration.instructions.md` — Jira/agile workflows
- `ibmi-integration-testing.instructions.md` — IBM i testing strategies
