---
applyTo: '**'
description: 'Lancelot-specific code review criteria and checklists for VS Code extension development, with focus on extension APIs, IBM i integration, GitLab workflows, and Jira automation.'
---

# Lancelot Code Review Checklist

Lancelot-specific code review criteria for VS Code extension development. When reviewing code, apply domain-specific checks (extension APIs, IBM i integration, GitLab workflows, Jira automation, accessibility, performance) in addition to standard quality metrics.

**Key Focus Areas:** VS Code extension lifecycle • TypeScript strict typing • IBM i security • GitLab/Jira integration patterns • Accessibility (WCAG 2.2 AA) • i18n consistency • Extension activation performance

## Extension Architecture & APIs

### VS Code Extension Lifecycle

- [ ] **Activation Events**: Are activation events appropriately scoped? Check that `activationEvents` in `package.json` only trigger when necessary (avoid lazy loading anti-patterns).
  - **Good**: `onCommand:lancelot.gitlab.enterToken` (specific command)
  - **Bad**: `onStartupFinished` (blocks startup for unrelated users)
- [ ] **Deactivation**: Are resources properly cleaned up in `deactivate()` function? Verify subscriptions, listeners, and connections are disposed.
- [ ] **Extension Dependencies**: If using other VS Code extensions (e.g., Code for IBM i), are they accessed via safe lazy-loading patterns (see `ExtensionDependencyService`)?
  - Code should check `ext?.isActive` before accessing `ext?.exports`
  - Never perform module-level imports of optional extension APIs
- [ ] **Context Subscriptions**: All event listeners, commands, and providers registered via `context.subscriptions.push()` to ensure proper cleanup?
- [ ] **Global State vs. Workspace State**: Is state managed appropriately?
  - Global state for user-scoped settings (e.g., GitLab token)
  - Workspace state for project-specific data (e.g., selected repository)
  - Never use global variables for state; use VS Code APIs instead

### Command Registration & Execution

- [ ] **Command Handler Signature**: Does the command handler match expected signature with proper parameter types?
  - Format: `(arg1: Type1, arg2: Type2) => T | Promise<T>`
  - Are parameters properly typed (no `any`)?
- [ ] **UI Feedback**: Does the command provide user feedback?
  - For long operations (>500ms): Show progress indicator or status bar message
  - Use `vscode.window.withProgress()` for indeterminate operations
  - Show error notifications with actionable messages (not just technical errors)
- [ ] **Error Handling**: Are errors caught and handled gracefully?
  - Should not crash the extension; errors should be logged and reported to telemetry
  - User should see a meaningful error message, not a console stack trace
- [ ] **Cancellation Support**: Can the user cancel long-running operations?
  - Long operations (>2 seconds) should support cancellation tokens
  - Use `CancellationToken` passed to async operations

### Tree Views & Providers

- [ ] **Tree Data Provider**: Is the provider correctly implementing `vscode.TreeDataProvider`?
  - `getChildren()` must handle async operations properly
  - `getTreeItem()` should return correct icon, label, collapsible state
  - Refresh logic should not cause excessive re-renders
- [ ] **Refresh Efficiency**: When calling `_onDidChangeTreeData.fire()`, is the change scoped appropriately?
  - Fire with specific node if only that node changed (not entire tree)
  - Avoid firing on every keystroke or rapid polling
- [ ] **Icons**: Are all tree items using icons from `images/` folder? Check `vscode.Uri.file()` construction for correct paths.
- [ ] **i18n Labels**: Are tree item labels using i18n keys? Check `vscode.l10n.t()` usage.

### Webviews (if applicable)

- [ ] **CSP Headers**: Are Content-Security-Policy headers properly set to restrict script execution?
  - Only allow scripts from `webview.cspSource`
  - Avoid inline script execution with `'unsafe-inline'`
- [ ] **Focus Management**: Are dialogs/overlays managing focus correctly?
  - ⚠️ **CRITICAL**: Never set `aria-hidden="true"` on `document.body` – use `inert` attribute instead
  - When showing overlays, trap focus within the overlay
  - Restore focus to trigger element when closing
- [ ] **Message Passing**: Is communication between extension and webview secure?
  - Validate all messages received from webview (treat as untrusted input)
  - Sanitize data before passing back to webview
  - Use type-safe message contracts (interfaces/types for message shapes)

---

## TypeScript & Type Safety

### Strict Typing

- [ ] **No `any` Types**: Scan for `any` usage; require explicit type definitions or generic types.
  - **Exception**: Temporary `any` for third-party libraries lacking types (mark with `// @ts-ignore` with explanation)
  - Check that `tsconfig.json` has `"noImplicitAny": true`
- [ ] **Function Return Types**: All functions have explicit return type annotations (not inferred)?
  - Inferred types for simple arrow functions (e.g., `const x = (a: number) => a + 1`) are acceptable
  - Public/exported functions must have explicit return types
- [ ] **Async Functions**: Do async functions properly type their Promise return?
  - Format: `async function foo(): Promise<ReturnType>` (not `Promise<Promise<T>>`)
  - Proper error handling for rejected Promises?
- [ ] **Interfaces & Type Guards**: For complex data structures, are interfaces defined?
  - Check for proper use of `interface` vs `type`
  - Type guards for discriminated unions (e.g., `if (x.type === 'A') { /* x is type A */ }`)

### Null & Undefined Safety

- [ ] **Optional Chaining**: Are optional properties accessed safely?
  - Use `obj?.prop?.method?.()` instead of checking each level
  - Verify nullability is intentional, not an oversight
- [ ] **Null Coalescing**: Are defaults properly applied?
  - Use `value ?? defaultValue` for null-coalescing (not `||` which treats falsy values)
- [ ] **Non-Null Assertions**: Are `!` assertions justified?
  - Should be rare; acceptable only when compiler cannot infer safety
  - Must be accompanied by a comment explaining why non-null is guaranteed

---

## IBM i Integration Security

### Connection Management

- [ ] **Credential Storage**: Are IBM i credentials stored securely?
  - **✅ GOOD**: Read from `SecretStorage` or environment variables
  - **❌ BAD**: Stored in configuration files, workspace storage, or logs
- [ ] **Connection Pooling**: If maintaining connections, is pooling used?
  - Connections should be reused (not created per operation)
  - Connection timeouts properly configured (not infinite waits)
- [ ] **SSH Key Security**: If SSH keys are used:
  - Private keys never logged or exposed in telemetry
  - Keys stored securely (SecretStorage, OS credential manager)
  - File permissions checked (e.g., SSH key file not world-readable)

### CL Command Execution

- [ ] **Command Injection Prevention**: Are CL commands built safely?
  - **✅ GOOD**: `execSync('SBMJOB CMD(${sanitizedCmd})')`  with proper parameter escaping
  - **❌ BAD**: `execSync(`SBMJOB CMD("${userInput}")`  (direct interpolation)
  - Use parameterized commands where possible; sanitize identifiers (library names, file names)
- [ ] **Error Handling**: Do IBM i command failures include actionable error messages?
  - Error should describe what failed and why (e.g., "Library MYLIB not found on IBM i")
  - Should not expose internal job IDs or server details unless debugging is enabled
- [ ] **Telemetry**: Are successful/failed command executions tracked?
  - Track count, duration, error type (not the actual command text)
  - Ensure no credential/PII leakage in telemetry events

### Member Upload/Download

- [ ] **Path Validation**: Are local file paths validated?
  - Prevent directory traversal attacks (e.g., `../../etc/passwd`)
  - Use APIs that build paths securely (not string concatenation)
- [ ] **Sparse Checkout**: If using sparse checkout for member selection:
  - Verify that excluded files are truly excluded from sync
  - Test with sensitive/large files to ensure sync doesn't leak data
- [ ] **Transfer Encoding**: Are large files transferred efficiently?
  - Check for streaming APIs (not loading entire file into memory)
  - Large file uploads should show progress

---

## GitLab Integration

### API Calls & Rate Limiting

- [ ] **Rate Limiting**: Are GitLab API calls respecting rate limits?
  - Extension configured for max 5 req/sec
  - Check `RateLimiter` usage; verify limits are enforced
  - Slow down or queue if hitting rate limits (not fail abruptly)
- [ ] **Pagination**: For queries returning multiple results, is pagination used?
  - **✅ GOOD**: `GitLabClient.getProjects(page: 1, perPage: 20)`
  - **❌ BAD**: `GitLabClient.getProjects()` returning unlimited results
  - Check for `maxPages` guards to prevent runaway queries
- [ ] **Error Handling**: Are GitLab API errors handled gracefully?
  - 401 (unauthorized) → prompt user to re-authenticate
  - 403 (forbidden) → inform user they lack permissions
  - 500+ errors → suggest retrying or checking GitLab status
- [ ] **Token Refresh**: If using short-lived tokens, is token refresh automatic?
  - Check that `LazyTokenValidator` or similar is caching token validation
  - Tokens should be refreshed before expiration, not after

### Branch & Merge Request Operations

- [ ] **Branch Naming**: Are branches created with proper naming conventions?
  - Should follow pattern: `type/ticket-description` (e.g., `feat/john/LSPEX-101-auth-module`)
  - Check that Jira ticket ID is included (for traceability)
- [ ] **Merge Request Templates**: Do MR descriptions follow the template?
  - Should include: title, description, acceptance criteria, testing notes
  - Should reference associated Jira issue (e.g., "Fixes LSPEX-101")
- [ ] **Conflict Resolution**: How are merge conflicts handled?
  - Should provide clear guidance to user on resolving conflicts
  - Should not auto-resolve conflicts without user intervention

### Webhook Integration

- [ ] **Webhook Validation**: Are webhook signatures validated?
  - Check `X-Gitlab-Token` header matches configured secret
  - Replay attacks prevented (e.g., timestamp validation)
- [ ] **Payload Handling**: Is webhook payload validated?
  - Only process expected event types
  - Validate payload fields before processing
  - Handle missing/malformed fields gracefully

---

## Jira Integration

### Issue Operations

- [ ] **Credential Management**: Are Jira credentials stored securely?
  - **✅ GOOD**: Stored in `SecretStorage` or environment variables
  - **❌ BAD**: Hardcoded in configuration files or workspace storage
- [ ] **Issue Creation**: When creating issues, are all required fields provided?
  - Check that issue type, summary, and description are present
  - Verify custom fields (if required by project) are populated
  - Check Jira project key is validated (not arbitrary user input)
- [ ] **Issue Linking**: When linking commits/MRs to issues, is linkage bidirectional?
  - Jira issue should show link to commit/MR
  - Commit message should include issue key (e.g., "LSPEX-101: Fix authentication")
- [ ] **Error Messages**: Are Jira API errors user-friendly?
  - Don't expose raw Jira API errors; translate to actionable messages
  - Suggest troubleshooting steps (check credentials, project permissions, etc.)

### Workflow Automation

- [ ] **Automation Rules**: If creating Jira automation rules, are they idempotent?
  - Transitions should check current status before transitioning
  - Rules should not trigger infinite loops
- [ ] **Custom Fields**: Are custom field names validated?
  - Should not assume field names (e.g., `customfield_12345`) are stable across Jira instances
  - Should failover gracefully if custom field is missing

---

## Performance & Startup

### Extension Activation

- [ ] **Activation Time**: Is activation time < 2 seconds (measured from `activate()` call to command availability)?
  - Profile with `--inspect` flag if activation is slow
  - Defer non-critical initialization (e.g., cache population)
  - Lazy-load heavy modules (webviews, test runners, etc.)
- [ ] **Bundle Size**: Is the bundled VSIX size reasonable?
  - Monitor bundle size in CI (current trend: should stay <5MB)
  - Large dependencies (e.g., Puppeteer, unused polyfills) should be flagged
  - Check that development-only dependencies are excluded from bundle

### Command Execution

- [ ] **Response Time**: Are command handlers responsive (< 500ms for instant feedback)?
  - Long operations (>2 seconds) should show progress indicators
  - Callbacks/promises should not block the UI thread
- [ ] **Memory Usage**: Does the command clean up resources after execution?
  - Temporary data structures released after use
  - File handles closed properly
  - Event listeners removed when no longer needed

### Caching & Data Freshness

- [ ] **Cache TTL**: Are cache TTLs appropriate?
  - GitLab data: 5-15 minutes (depends on frequency of external changes)
  - IBM i data: 30 seconds (time-sensitive for deployed changes)
  - Jira issues: 10 minutes (typically stable)
- [ ] **Cache Invalidation**: Is cache invalidated when data changes?
  - Manual invalidation triggered by user actions (e.g., "Refresh" command)
  - Automatic invalidation on file save or deployment events
  - Stale data should never be silently served

---

## Accessibility (WCAG 2.2 AA)

### UI Components

- [ ] **Semantic HTML**: Are tree views and lists using semantic elements?
  - Use `<ul>`, `<li>` for lists (not `<div>` with roles)
  - Use `<button>` for buttons (not `<div onclick>`)
- [ ] **ARIA Labels**: Are custom components properly labeled for screen readers?
  - `aria-label` for icon-only buttons
  - `aria-describedby` for form controls with help text
  - Never use `aria-hidden="true"` on interactive elements
- [ ] **Focus Visible**: Are focused elements visually distinguishable?
  - Check against high-contrast and low-vision user needs
  - Tab order follows logical document order
  - Skip links provided if there are repeated navigation elements

### Keyboard Navigation

- [ ] **Tab Order**: Can users navigate UI with keyboard only?
  - Tab moves forward through interactive elements
  - Shift+Tab moves backward
  - Arrow keys work in lists/trees for item selection
- [ ] **Escape Key**: Do modal dialogs close with Escape key?
  - Escape should close topmost dialog/overlay
  - Focus should return to trigger element
- [ ] **Discoverability**: Are keyboard shortcuts documented?
  - Use `package.nls.json` for command descriptions (visible in Command Palette)
  - Command category and title should clarify the action

---

## Localization (i18n)

- [ ] **String Externalization**: Are all user-visible strings in `package.nls.json`?
  - Check for hardcoded strings in TypeScript code
  - Command titles, descriptions, messages should all be i18n keys
  - Use `vscode.l10n.t()` to retrieve strings at runtime
- [ ] **Placeholder Text**: Are placeholder strings in strings file?
  - Dialog prompts, status messages, error messages
  - Should not be embedded in code
- [ ] **Number/Date Formatting**: Are numbers/dates formatted using locale-aware APIs?
  - Use `Intl.NumberFormat` for numbers
  - Use `Intl.DateTimeFormat` for dates
  - Never assume US decimal point (`.`) or date format (`MM/DD/YYYY`)
- [ ] **Pluralization**: Are plurals handled correctly?
  - Check for hardcoded plural forms (use i18n library support)
  - Message should adapt based on count

---

## Testing & Quality

### Test Coverage

- [ ] **Critical Paths**: Are security-sensitive and frequently-used code paths tested?
  - Authentication/authorization flows
  - Credential handling
  - API error scenarios
  - IBM i command execution failures
- [ ] **Unit Tests**: For utility functions and service methods?
  - Test success and failure cases
  - Test edge cases (empty arrays, null values, etc.)
  - Mock external dependencies (API calls, file system)
- [ ] **Integration Tests**: For workflows involving multiple services?
  - Test GitLab API calls with network mocking
  - Test Jira API calls with network mocking
  - Test IBM i command execution with error simulation

### Test Naming & Clarity

- [ ] **Test Names**: Do test names clearly describe what is being tested?
  - Format: `should_<action>_when_<condition>`
  - Example: `should_transition_branch_to_draft_when_user_selects_draft_status`
- [ ] **Assertions**: Are assertions specific?
  - Use `expect(result).toBe(expected)` (not `expect(result).toBeTruthy()`)
  - Test should fail with clear message if assertion fails
- [ ] **Setup/Teardown**: Are tests properly isolated?
  - Mock data cleaned up after each test
  - Spies/stubs restored after each test
  - No test pollution (tests should be independent)

---

## Security & Compliance

### Secrets & Credentials

- [ ] **No Secrets in Code**: Are API keys, tokens, or credentials hardcoded?
  - Check package.json, source files, test files for hardcoded secrets
  - Use environment variables or SecretStorage for credentials
- [ ] **Logging**: Are sensitive values logged?
  - Credentials must not appear in console logs or telemetry
  - API responses containing secrets should be redacted before logging
- [ ] **Error Messages**: Do error messages expose sensitive information?
  - Should not include actual API keys or tokens
  - Should not expose internal server names or IPs (unless debugging)

### Input Validation

- [ ] **User Input**: Is all user input validated?
  - GitLab API parameters (project IDs, branch names, etc.)
  - IBM i identifiers (library names, member names, etc.)
  - Jira project keys and issue fields
- [ ] **Path Traversal**: Are file paths validated?
  - Prevent `../` sequences in user-provided paths
  - Use secure path APIs (not string concatenation)

### Dependency Management

- [ ] **Known Vulnerabilities**: Are dependencies up-to-date?
  - Check `npm audit` output
  - Review security advisories for critical packages
  - Update dependencies promptly (especially security fixes)
- [ ] **Unused Dependencies**: Can orphaned dependencies be removed?
  - Check `package.json` against actual imports
  - Reduce attack surface by removing unused packages

---

## Documentation & Code Comments

- [ ] **Complex Logic**: Is non-obvious logic explained in comments?
  - Why a particular algorithm was chosen (not what it does)
  - Trade-offs considered (performance vs. simplicity, etc.)
  - Links to relevant documentation or issues
- [ ] **API Contracts**: Are public functions documented?
  - JSDoc comments with `@param` and `@returns`
  - Describe expected exceptions or error conditions
  - Examples of usage where appropriate
- [ ] **File Headers**: Do modified files have updated "Change Summary" sections?
  - Brief description of what changed and why
  - Date and author (for audit trail)

---

## Quick Checklist (Pre-Merge)

```
Extension Architecture:
  ☐ Activation events appropriate and minimal
  ☐ Resources properly cleaned up in deactivate()
  ☐ Optional extension dependencies safely accessed
  ☐ State managed via VS Code APIs (not global variables)
  ☐ All commands properly typed and have error handling

TypeScript & Types:
  ☐ No `any` types (legitimate types defined)
  ☐ Public functions have explicit return types
  ☐ Null/undefined safety checked
  ☐ Optional chaining used where appropriate

IBM i Integration:
  ☐ Credentials stored securely (SecretStorage)
  ☐ CL commands built safely (no injection vulnerabilities)
  ☐ File paths validated (no traversal attacks)
  ☐ IBM i errors have actionable messages

GitLab Integration:
  ☐ Rate limiting enforced, pagination used
  ☐ API errors handled with appropriate user feedback
  ☐ Tokens refreshed before expiration
  ☐ Webhooks validated (signature + payload checks)

Jira Integration:
  ☐ Credentials stored securely
  ☐ Required issue fields present
  ☐ Issue linking bidirectional
  ☐ Jira errors translated to actionable messages

Performance:
  ☐ Activation time < 2 seconds
  ☐ Command response time < 500ms (heavy ops show progress)
  ☐ Bundle size remains reasonable
  ☐ Cache TTLs appropriate, invalidation working

Accessibility:
  ☐ Semantic HTML used for UI components
  ☐ ARIA labels present for custom components
  ☐ Keyboard navigation fully functional
  ☐ Focus trap works in dialogs, Escape key closes

Localization:
  ☐ All user-visible strings in package.nls.json
  ☐ All i18n keys retrieved via vscode.l10n.t()
  ☐ Number/date formatting locale-aware
  ☐ Pluralization handled correctly

Testing:
  ☐ Critical security paths tested
  ☐ Unit tests for utility functions
  ☐ Integration tests for multi-service workflows
  ☐ Test names clearly describe what is tested

Security:
  ☐ No credentials hardcoded in code
  ☐ Sensitive values not logged
  ☐ Error messages don't expose sensitive data
  ☐ All user input validated
  ☐ Dependencies up-to-date and free of known vulnerabilities

Documentation:
  ☐ Complex logic has comments explaining WHY
  ☐ Public APIs have JSDoc comments
  ☐ File headers have updated "Change Summary"
```

---

## References

- `instructions/lancelot.instructions.md` – Primary authority for Lancelot development
- `instructions/code-review-generic.instructions.md` – Generic code review principles
- `instructions/security-and-owasp.instructions.md` – Security and OWASP guidelines
- `instructions/a11y.instructions.md` – Accessibility (WCAG 2.2 AA) guidelines
- `instructions/typescript-5-es2022.instructions.md` – TypeScript strict typing standards
- `.github/skills/vscode-ext-commands/SKILL.md` – VS Code command best practices
- `.github/skills/i18n-implementation/SKILL.md` – i18n implementation patterns

---

**Last Updated:** 2026-01-24
**Status:** Active
**Owner:** Roland Strauss (GitHub Copilot Code Review Authority)
