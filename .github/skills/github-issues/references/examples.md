# GitHub Issue Examples

Quick examples for common issue creation patterns.

## Example 1: Simple Bug Report

**User request**: "Create a bug issue - the login page crashes when using SSO"

```json
{
  "owner": "github",
  "repo": "awesome-copilot",
  "title": "[Bug] Login page crashes when using SSO",
  "body": "## Description\nThe login page crashes when users attempt to authenticate using SSO.\n\n## Steps to Reproduce\n1. Navigate to login page\n2. Click 'Sign in with SSO'\n3. Page crashes\n\n## Expected Behavior\nSSO authentication should complete and redirect to dashboard.\n\n## Actual Behavior\nPage becomes unresponsive and displays error.",
  "labels": ["bug"]
}
```

## Example 2: Feature Request

**User request**: "Create a feature request for dark mode with high priority"

```json
{
  "owner": "github",
  "repo": "awesome-copilot",
  "title": "[Feature] Add dark mode support",
  "body": "## Summary\nAdd dark mode theme option for improved user experience and accessibility.\n\n## Motivation\n- Reduces eye strain in low-light environments\n- Increasingly expected by users\n- Improves accessibility\n\n## Proposed Solution\nImplement theme toggle with system preference detection.\n\n## Acceptance Criteria\n- [ ] Toggle switch in settings\n- [ ] Persists user preference\n- [ ] Respects system preference by default\n- [ ] All UI components support both themes",
  "labels": ["enhancement", "high-priority"]
}
```

## Example 3: Task/Chore

**User request**: "Create a task to refactor the authentication module"

```json
{
  "owner": "github",
  "repo": "awesome-copilot",
  "title": "Refactor authentication module for clarity",
  "body": "## Objective\nRefactor the authentication module to improve readability and maintainability.\n\n## Details\nThe current auth module has grown complex and would benefit from breaking into smaller, focused components.\n\n## Checklist\n- [ ] Extract token validation logic\n- [ ] Extract session management logic\n- [ ] Add unit tests for new components\n- [ ] Update documentation",
  "labels": ["refactor", "tech-debt"]
}
```

## Example 4: Update Existing Issue

**User request**: "Add the 'urgent' label to issue #42 and assign it to alice"

```json
{
  "owner": "github",
  "repo": "awesome-copilot",
  "issue_number": 42,
  "labels": ["urgent"],
  "assignees": ["alice"]
}
```

## Example 5: Close Issue

**User request**: "Close issue #123 - it's been resolved"

```json
{
  "owner": "github",
  "repo": "awesome-copilot",
  "issue_number": 123,
  "state": "closed"
}
```
