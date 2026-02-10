---
name: github-issues
description: 'Create, update, and manage GitHub issues using MCP tools. Use this when you need to create bug reports, feature requests, or task issues, update existing issues, or manage issue workflows.'
---

# GitHub Issues

Manage GitHub issues via MCP tools.

## Quick Workflow

1. Confirm repo owner and name
2. Pick template: [references/templates.md](references/templates.md)
3. Structure title + body + optional labels/assignees
4. Call appropriate MCP tool
5. Confirm issue URL to user

## Parameters

**Required**: `owner`, `repo`, `title`, `body`

**Optional**: `labels` (array), `assignees` (array), `milestone` (ID)

**For updates**: `issue_number` (required), other fields as needed; status: `open`/`closed`

## Title Guidance

- Prefix when useful: `[Bug]`, `[Feature]`, `[Docs]`
- Be specific, actionable
- Keep under 72 characters

## Examples & Reference

- **Examples** → [references/examples.md](references/examples.md)
- **Labels** → [references/labels-reference.md](references/labels-reference.md)
- **Templates** → [references/templates.md](references/templates.md)
- **Comprehensive template** (major architectural issues) → [references/lancelot-issue-template.md](references/lancelot-issue-template.md)

## Tips

- Ask for missing info rather than guessing
- Link related issues: `Related to #123`
- Always fetch current state before updating to preserve unchanged fields
