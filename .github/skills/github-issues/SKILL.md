---
name: github-issues
description: 'Create, update, and manage GitHub issues using MCP tools. Use this skill when users want to create bug reports, feature requests, or task issues, update existing issues, add labels/assignees/milestones, or manage issue workflows. Triggers on requests like "create an issue", "file a bug", "request a feature", "update issue X", or any GitHub issue management task.'
---

# GitHub Issues

Manage GitHub issues using the `@modelcontextprotocol/server-github` MCP server.

## Lancelot context and role

You operate as an IT Architect and DevSecOps Architect with expertise in:

- TypeScript/JavaScript and VS Code extension development
- IBM i (7.6) workflows and constraints
- GitLab 18.6 (used by end users) and GitHub (hosting this repo)

Your guidance must be secure-by-default, architecturally sound, and aligned to DevSecOps best practices, incorporating current (2025 and 2026) trends such as AI-driven DevOps, shift-left security, and hybrid cloud patterns. For the Lancelot VS Code extension (GitLab-assisted IBM i development), prefer structured sections and include diagrams (mermaid) when they improve clarity.

## Available MCP Tools

| Tool | Purpose |
|------|---------|
| `mcp__github__create_issue` | Create new issues |
| `mcp__github__update_issue` | Update existing issues |
| `mcp__github__get_issue` | Fetch issue details |
| `mcp__github__search_issues` | Search issues |
| `mcp__github__add_issue_comment` | Add comments |
| `mcp__github__list_issues` | List repository issues |

## Workflow

1. **Determine action**: Create, update, or query?
2. **Gather context**: Repository, stakeholders, related discussions, labels/milestones
3. **Analyze**: Summarize problem, current vs expected behavior, impact, and root cause (if known)
4. **Structure content**: Prefer the “Comprehensive Lancelot Issue Template” in [references/templates.md](references/templates.md)
5. **Execute**: Call the appropriate MCP tool
6. **Harden**: Ensure labels, assignees, and cross-links are added for triage and traceability
7. **Confirm**: Report the issue URL to the user

## Creating Issues

### Required Parameters

```
owner: repository owner (org or user)
repo: repository name
title: clear, actionable title
body: structured markdown content
```

### Optional Parameters

```
labels: ["bug", "enhancement", "documentation", ...]
assignees: ["username1", "username2"]
milestone: milestone number (integer)
```

### Title Guidelines

- Start with type prefix when useful: `[Bug]`, `[Feature]`, `[Docs]`
- Be specific and actionable
- Keep under 72 characters
- Examples:
  - `[Bug] Login fails with SSO enabled`
  - `[Feature] Add dark mode support`
  - `Add unit tests for auth module`

### Body Structure

Always use the templates in [references/templates.md](references/templates.md). Choose based on issue type:

| User Request | Template |
|--------------|----------|
| Lancelot architectural/DevSecOps/feature or complex changes | Comprehensive Lancelot Issue |
| Bug, error, broken, not working | Bug Report |
| Feature, enhancement, add, new | Feature Request |
| Task, chore, refactor, update | Task |

When using the Comprehensive template for Lancelot, include:
- Problem Statement, Root Cause (if known), Current vs Expected Behavior
- Logic Flow diagram (mermaid)
- Impact on users/system
- Architecture & Design (constraints/dependencies, component overview, data flow diagram)
- Acceptance Criteria grouped by Must/Should/Nice-to-have
- Implementation Details and Estimates
- Testing Strategy and Success Metrics
- Implementation Plan, Open Questions, Related Issues, Labels

## Updating Issues

Use `mcp__github__update_issue` with:

```
owner, repo, issue_number (required)
title, body, state, labels, assignees, milestone (optional - only changed fields)
```

State values: `open`, `closed`

## Examples

### Example 1: Bug Report

**User**: "Create a bug issue - the login page crashes when using SSO"

**Action**: Call `mcp__github__create_issue` with:
```json
{
  "owner": "github",
  "repo": "awesome-copilot",
  "title": "[Bug] Login page crashes when using SSO",
  "body": "## Description\nThe login page crashes when users attempt to authenticate using SSO.\n\n## Steps to Reproduce\n1. Navigate to login page\n2. Click 'Sign in with SSO'\n3. Page crashes\n\n## Expected Behavior\nSSO authentication should complete and redirect to dashboard.\n\n## Actual Behavior\nPage becomes unresponsive and displays error.\n\n## Environment\n- Browser: [To be filled]\n- OS: [To be filled]\n\n## Additional Context\nReported by user.",
  "labels": ["bug"]
}
```

### Example 2: Feature Request

**User**: "Create a feature request for dark mode with high priority"

**Action**: Call `mcp__github__create_issue` with:
```json
{
  "owner": "github",
  "repo": "awesome-copilot",
  "title": "[Feature] Add dark mode support",
  "body": "## Summary\nAdd dark mode theme option for improved user experience and accessibility.\n\n## Motivation\n- Reduces eye strain in low-light environments\n- Increasingly expected by users\n- Improves accessibility\n\n## Proposed Solution\nImplement theme toggle with system preference detection.\n\n## Acceptance Criteria\n- [ ] Toggle switch in settings\n- [ ] Persists user preference\n- [ ] Respects system preference by default\n- [ ] All UI components support both themes\n\n## Alternatives Considered\nNone specified.\n\n## Additional Context\nHigh priority request.",
  "labels": ["enhancement", "high-priority"]
}
```

### Example 3: Comprehensive Lancelot Issue

**User**: "Create a Lancelot issue for GitLab authentication flow improvements"

**Action**: Call `mcp__github__create_issue` with the Comprehensive Lancelot template pre-filled:
```json
{
  "owner": "RolandStrauss",
  "repo": "Lancelot-extension",
  "title": "[Architecture] Enhance GitLab authentication flow with 2FA support",
  "body": "# Problem Statement\nCurrent GitLab authentication does not support 2FA workflows, limiting enterprise adoption.\n\n# Root Cause\nLancelot relies on basic OAuth2 flow without 2FA escalation logic; GitLab 18.6 supports 2FA but we don't handle the challenge/response.\n\n# Current Behavior\n- Users with 2FA enabled cannot authenticate via Lancelot\n- Flow fails at GitLab token exchange with 401 Unauthorized\n\n# Expected Behavior\n- Users with 2FA enabled receive SMS/TOTP challenge\n- Lancelot prompts user to enter 2FA code in VS Code UI\n- Session completes and stores token securely in SecretStorage\n\n## Logic Flow\n```mermaid\nflowchart TD\n  A[User clicks Sign In] --> B[GitLab OAuth2 redirect]\n  B --> C{2FA Required?}\n  C -->|yes| D[GitLab 2FA Challenge]\n  C -->|no| E[Token Exchange]\n  D --> F[Lancelot prompts for TOTP/SMS]\n  F --> G[User enters 2FA code]\n  G --> H[Validate with GitLab]\n  H --> E\n  E --> I[Store token in SecretStorage]\n  I --> J[Success]\n  H -->|invalid| K[Error + Retry]\n```\n\n# Impact\n- Users: Enterprise teams with 2FA mandates can now use Lancelot\n- Systems: GitLab API integration; VS Code SecretStorage; telemetry for auth success/failure\n- Security/Compliance: Shift-left by supporting 2FA; reduce token exposure via secure storage\n\n# Architecture & Design\n## Constraints & Dependencies\n- GitLab 18.6 API supports 2FA challenge workflow (documented)\n- VS Code SecretStorage API for token persistence (no plaintext)\n- Network timeout: 30s for 2FA challenge + user input window\n- IBM i not directly involved; auth happens client-side\n\n## Component Overview\n- `src/authentication/gitlab-oauth-handler.ts` — OAuth2 flow logic\n- `src/authentication/2fa-challenge-handler.ts` — NEW: 2FA prompt and validation\n- `src/core/secret-storage-service.ts` — Secure token storage\n- VS Code QuickInput for user TOTP/SMS entry\n\n## Data Flow\n```mermaid\nflowchart LR\n  VSCode[VS Code UI] -->|user input| Handler[2FA Handler]\n  Handler -->|2FA code| GitLabAPI[GitLab 18.6 API]\n  GitLabAPI -->|token| SecretStorage[VS Code SecretStorage]\n  SecretStorage -->|cached token| Extension[Lancelot Extension]\n  Extension -->|telemetry| Analytics[App Insights]\n```\n\n# Acceptance Criteria\n## Must Have\n- [ ] Support TOTP and SMS 2FA methods\n- [ ] Prompt user in VS Code UI for 2FA code\n- [ ] Store token in VS Code SecretStorage (not plaintext)\n- [ ] Handle 2FA validation errors with clear user messaging\n- [ ] Pass all existing unit/integration tests\n\n## Should Have\n- [ ] Emit telemetry for 2FA success/failure\n- [ ] Support 2FA retry up to 3 times\n- [ ] Document 2FA setup in README and getting-started.md\n- [ ] Cross-platform tested (Windows, macOS, Linux)\n\n## Nice to Have\n- [ ] Cache 2FA preference (remember device option)\n- [ ] Support WebAuthn (FIDO2) if GitLab supports it\n- [ ] Accessibility review for TOTP input dialog\n\n# Implementation Details\n- Use GitLab's OTP challenge endpoint (POST /oauth/authorize with otp_challenge)\n- Create QuickInput dialog with masked TOTP input field\n- Implement exponential backoff for retries\n- Add security event logging (failed attempts logged, not codes)\n- Follow DevSecOps shift-left pattern: validate early, fail securely\n\n# Implementation Estimates / Estimated Effort\n- Size: Medium (M)\n- Effort: ~16-20 hours (2–2.5 days)\n  - OAuth2 handler changes: 6h\n  - 2FA challenge handler (new): 8h\n  - Testing + telemetry: 4h\n  - Documentation: 2–4h\n\n# Testing Strategy\n- Unit: Test 2FA validation logic with mock GitLab responses\n- Integration: Test full flow with GitLab sandbox (2FA enabled)\n- End-to-end: Manual test on Windows, macOS, Linux\n- Security: Verify no tokens logged; SecretStorage used correctly\n- Accessibility: Keyboard navigation and screen reader support\n\n# Success Metrics\n- 2FA authentication success rate: ≥99%\n- User onboarding time (with 2FA) vs. without: <5% slower\n- Zero security incidents related to token exposure\n- Telemetry: 2FA code validation latency p95 <2s\n- Documentation: Clear setup guide in README and getting-started.md\n\n# Implementation Plan\n1. Create 2FA challenge handler module with unit tests\n2. Update OAuth2 flow to detect and handle 2FA challenges\n3. Implement QuickInput dialog for TOTP/SMS entry\n4. Add telemetry events for 2FA lifecycle\n5. Integration test against GitLab sandbox\n6. Update documentation (README, getting-started.md)\n7. Code review + merge to main\n8. Release notes and changelog update\n\n# Open Questions\n- Does GitLab 18.6 support device trust (remember device)? If so, should we expose it?\n- Should we support backup codes if user loses 2FA device?\n- Timeline for deprecation of basic OAuth2 (if any)?\n\n# Related Issues\n- #501 — GitLab enterprise feature requests\n- #512 — Security audit findings\n\n# Labels\narchitecture, devsecops, gitlab-integration, ibmi, priority/high, severity/high, needs-triage",
  "labels": [
    "architecture",
    "devsecops",
    "gitlab-integration",
    "priority/high",
    "severity/high",
    "needs-triage"
  ],
  "assignees": []
}
```

## Create a Lancelot Issue (Quick Start)

**When to use**: Architecture/DevSecOps topics, complex cross-system changes, or features with significant security/reliability impact.

**Quick invocation pattern**:

1. **User says**: "Create a Lancelot issue for [topic]"
2. **You**:
   - Gather context (problem, current behavior, expected behavior, stakeholders)
   - Populate the Comprehensive Lancelot template from [references/templates.md](references/templates.md)
   - Include mermaid diagrams for logic flow and data flow
   - Group acceptance criteria into Must/Should/Nice-to-have
   - Add labels: `architecture`, `devsecops`, `ibmi`, `gitlab-integration`, `needs-triage`, plus any `priority/` or `severity/` labels
3. **Call**: `mcp__github__create_issue` with the pre-filled body (see Example 3 above)
4. **Confirm**: Report issue URL and next steps to user

**Pre-filled defaults to always include**:
- `owner: "RolandStrauss"`
- `repo: "Lancelot-extension"`
- Template: Comprehensive Lancelot Issue
- Labels: At minimum [`architecture`, `devsecops`, `needs-triage`]; add `ibmi`, `gitlab-integration`, `priority/*`, `severity/*` as context dictates

## Common Labels

Use these standard labels when applicable:

| Label | Use For |
|-------|---------|
| `bug` | Something isn't working |
| `enhancement` | New feature or improvement |
| `documentation` | Documentation updates |
| `good first issue` | Good for newcomers |
| `help wanted` | Extra attention needed |
| `question` | Further information requested |
| `wontfix` | Will not be addressed |
| `duplicate` | Already exists |
| `high-priority` | Urgent issues |
| `architecture` | Architecture/Design topics |
| `devsecops` | Security/DevSecOps concerns |
| `ibmi` | IBM i-specific work |
| `gitlab-integration` | GitLab-related changes |
| `needs-triage` | Awaiting triage |

## Tips

- Always confirm the repository context before creating issues
- Ask for missing critical information rather than guessing
- Link related issues when known: `Related to #123`
- For updates, fetch current issue first to preserve unchanged fields
 - Prefer the Comprehensive template for Lancelot issues; include mermaid diagrams for logic/data flow when useful
 - Align acceptance criteria to Must/Should/Nice-to-have to aid prioritization
