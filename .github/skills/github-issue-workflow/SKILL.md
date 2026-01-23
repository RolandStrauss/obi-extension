---
name: github-issue-workflow
description: Automates GitHub issue and pull request workflows using GitHub CLI (gh). Creates issues, manages feature branches, creates PRs, and closes issues with proper linking. Use when the user mentions issue tracking, PR creation, or automated GitHub workflows.
---

# GitHub Issue Workflow Automation

Automates the complete GitHub workflow: issue creation, feature branch management, pull request creation, and issue closure. Uses GitHub CLI (`gh`) for all interactions.

## When to Use This Skill

- User requests issue creation or tracking
- User mentions creating a feature branch
- User wants to create a pull request
- User mentions automated GitHub workflows
- User references "issue tasks" or delegated tasks

## Prerequisites

- GitHub CLI (`gh`) installed and authenticated
- Repository: RolandStrauss/Lancelot-extension
- Proper Git configuration

## Workflow Steps

### 1. Create or Reuse GitHub Issue

**Check for existing issue:**
```bash
gh issue list --state open --search "in:title '<ISSUE_TITLE>'" --json number,title -q '.[0].number'
```

**Create new issue if none exists:**
```bash
gh issue create \
  --title "<ISSUE_TITLE>" \
  --body "$(cat <<'MD'
### Original Request
<REQUEST>

### Context & Acceptance Criteria
- <criterion 1>
- <criterion 2>

### Implementation Plan
1. <step 1>
2. <step 2>

### Checklist
- [ ] Code updated
- [ ] Tests added/updated
- [ ] Docs updated
MD
)" \
  --label "auto-generated" --label "copilot-task"
```

**Record issue number and URL:**
```bash
ISSUE_NUMBER=$(gh issue list --state open --search "in:title '<ISSUE_TITLE>'" --json number -q '.[0].number')
ISSUE_URL=$(gh issue view "$ISSUE_NUMBER" --json url -q .url)
```

### 2. Create Feature Branch

**Detect default branch:**
```bash
DEFAULT_BRANCH=$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name)
```

**Create and checkout feature branch:**
```bash
# Generate short kebab-case title (max 40 chars)
SHORT=$(echo "<ISSUE_TITLE>" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g' | sed -E 's/^-+|-+$//g' | cut -c1-40)
BRANCH="feature/${ISSUE_NUMBER}-${SHORT}"

git fetch origin "$DEFAULT_BRANCH" --quiet
git checkout -b "$BRANCH" "origin/$DEFAULT_BRANCH"
```

### 3. Implement Changes

**Make granular commits:**
```bash
git add -A
git commit -m "Implement: <ISSUE_TITLE> (#$ISSUE_NUMBER)"
git push -u origin "$BRANCH"
```

**Run tests/linters:**
- Execute project test suite
- Run linting tools
- Verify documentation updates

### 4. Create Pull Request

**Check for existing PR:**
```bash
gh pr list --head "$BRANCH" --json number -q '.[0].number'
```

**Create PR if none exists:**
```bash
gh pr create \
  --base "$DEFAULT_BRANCH" \
  --head "$BRANCH" \
  --title "Fix: <ISSUE_TITLE>" \
  --body "$(cat <<'MD'
## Summary
<what changed>

## Implementation Notes
<how it was done>

## Testing
<how verified>

## Risks & Mitigations
<risks>

Closes #<ISSUE_NUMBER>
MD
)" \
  --label "auto-generated" --label "copilot-task"
```

**Get PR URL:**
```bash
PR_URL=$(gh pr view --head "$BRANCH" --json url -q .url)
```

### 5. Close Issue

**Auto-close via PR:**
- Include `Closes #<ISSUE_NUMBER>` in PR description
- Issue closes automatically when PR merges

**Fallback manual close:**
```bash
gh issue close "$ISSUE_NUMBER" --reason "completed"
```

## Branch Naming Convention

**Format:** `<type>/<assignee>/<description>` (max 50 chars for description)

**Valid types:**
- `feature` - New features
- `fix` - Bug fixes
- `chore` - Maintenance tasks
- `docs` - Documentation updates
- `refactor` - Code refactoring
- `test` - Test updates
- `perf` - Performance improvements
- `ci` - CI/CD updates
- `style` - Code style changes
- `build` - Build system changes

**Examples:**
- `feature/123-add-user-auth`
- `fix/456-login-validation`
- `docs/789-update-readme`

**Special branches (skip validation):**
- `main`, `master`
- `release/<assignee>/<semver>`
- `hotfix/<assignee>/<description>`
- Semantic version tags: `vX.Y.Z`

## Commit Message Convention

Follow Conventional Commits: `<type>(<scope>): <subject>`

**Examples:**
- `feat(auth): add OAuth2 login flow`
- `fix(api): handle null response data`
- `docs(readme): update installation steps`
- `refactor(core): extract validation logic`

## Error Handling

**If command fails:**
1. Capture stderr output
2. Stop workflow execution
3. Report failing command and error
4. Do not proceed to next step

**Common issues:**
- `gh` not installed or authenticated
- Branch already exists
- Issue title contains invalid characters
- PR already exists for branch

## Reporting

**Always report back:**
- Issue URL
- PR URL
- Branch name
- Any errors encountered

**Example output:**
```
✅ Issue created: https://github.com/RolandStrauss/Lancelot-extension/issues/123
✅ Branch created: feature/123-add-user-auth
✅ PR created: https://github.com/RolandStrauss/Lancelot-extension/pull/124
```

## PowerShell Variant

For PowerShell environments, see [references/powershell-commands.md](references/powershell-commands.md).

## Related Documentation

- [Branch & Commit Naming](references/branch-commit-naming.md)
- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [Conventional Commits](https://www.conventionalcommits.org/)
