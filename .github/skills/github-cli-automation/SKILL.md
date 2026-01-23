---
name: GitHub CLI Automation
description: Automate GitHub issue and PR workflows using gh CLI with idempotent, traceable operations
---

# GitHub CLI Automation

Comprehensive workflow for automating GitHub issue creation, branch management, and pull request workflows using GitHub CLI (`gh`) with idempotent and traceable operations.

## Quick Reference

**Core Workflow:**
1. Create/reuse GitHub issue
2. Create feature branch
3. Implement changes
4. Create pull request
5. Close issue (auto or manual)

**Key Principles:**
- ✅ Idempotent: Check before creating (avoid duplicates)
- ✅ Traceable: Link everything (PR closes issue)
- ✅ Descriptive: Use clear, searchable names
- ✅ Automated: Use labels for filtering

**Repository:** `RolandStrauss/Lancelot-extension`

## When This Skill Applies

Use this skill when:
- Working in agent mode with delegated tasks
- Creating issues for feature work or bug fixes
- Automating branch creation for consistent naming
- Creating pull requests with proper documentation
- Linking code changes to requirements

## Detailed Usage

### Prerequisites

**Required Tools:**
- GitHub CLI (`gh`) installed and authenticated
- Git configured with user name/email
- Access to target repository

**Authentication Check:**
```bash
# Verify gh is authenticated
gh auth status

# Login if needed
gh auth login
```

**Repository Setup:**
```bash
# Detect default branch
DEFAULT_BRANCH=$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name)
echo "Default branch: $DEFAULT_BRANCH"
```

### Workflow Phase 1: Create or Reuse Issue

**Idempotent Issue Creation:**
```bash
ISSUE_TITLE="Implement user authentication flow"

# Check if issue already exists (exact title match)
ISSUE_NUMBER=$(gh issue list --state open \
    --search "in:title '$ISSUE_TITLE'" \
    --json number,title \
    -q '.[0].number')

if [ -z "$ISSUE_NUMBER" ]; then
    # Issue doesn't exist, create it
    gh issue create \
        --title "$ISSUE_TITLE" \
        --body "$(cat <<'MD'
### Original Request

Implement OAuth2 authentication flow with JWT token management.

### Context & Acceptance Criteria

- Support GitHub OAuth2 provider
- Implement secure token storage
- Add automatic token refresh
- Include user profile retrieval

### Implementation Plan

1. Create OAuth2 service class
2. Implement token management
3. Add authentication middleware
4. Create user profile endpoint
5. Write comprehensive tests

### Checklist

- [ ] OAuth2 service implemented
- [ ] Token storage configured
- [ ] Token refresh logic added
- [ ] User profile endpoint created
- [ ] Tests written and passing
- [ ] Documentation updated

### Environment

- Node.js: v20+
- Dependencies: passport, jsonwebtoken
MD
)" \
        --label "auto-generated" \
        --label "copilot-task"
    
    # Retrieve the created issue number
    ISSUE_NUMBER=$(gh issue list --state open \
        --search "in:title '$ISSUE_TITLE'" \
        --json number -q '.[0].number')
fi

ISSUE_URL=$(gh issue view "$ISSUE_NUMBER" --json url -q .url)
echo "Issue: $ISSUE_URL"
```

**PowerShell Version:**
```powershell
$ISSUE_TITLE = "Implement user authentication flow"

# Check for existing issue
$ISSUE_JSON = gh issue list --state open `
    --search "in:title '$ISSUE_TITLE'" `
    --json number,title | ConvertFrom-Json

if (-not $ISSUE_JSON) {
    $body = @"
### Original Request

Implement OAuth2 authentication flow with JWT token management.

### Context & Acceptance Criteria

- Support GitHub OAuth2 provider
- Implement secure token storage
- Add automatic token refresh
- Include user profile retrieval

### Implementation Plan

1. Create OAuth2 service class
2. Implement token management
3. Add authentication middleware
4. Create user profile endpoint
5. Write comprehensive tests

### Checklist

- [ ] OAuth2 service implemented
- [ ] Token storage configured
- [ ] Token refresh logic added
- [ ] User profile endpoint created
- [ ] Tests written and passing
- [ ] Documentation updated
"@
    
    gh issue create --title $ISSUE_TITLE --body $body `
        --label "auto-generated" --label "copilot-task" | Out-Null
    
    $ISSUE_JSON = gh issue list --state open `
        --search "in:title '$ISSUE_TITLE'" `
        --json number | ConvertFrom-Json
}

$ISSUE_NUMBER = $ISSUE_JSON[0].number
$ISSUE_URL = (gh issue view $ISSUE_NUMBER --json url --jq ".url")
Write-Host "Issue: $ISSUE_URL"
```

### Workflow Phase 2: Create Feature Branch

**Branch Naming Convention:**
`feature/<ISSUE_NUMBER>-<kebab-short-title>` (max 50 chars after number)

**Bash Implementation:**
```bash
# Generate short kebab-case title (max 40 chars)
SHORT=$(echo "$ISSUE_TITLE" | tr '[:upper:]' '[:lower:]' | \
    sed -E 's/[^a-z0-9]+/-/g' | \
    sed -E 's/^-+|-+$//g' | \
    cut -c1-40)

BRANCH="feature/${ISSUE_NUMBER}-${SHORT}"
echo "Branch: $BRANCH"

# Create and switch to branch
git fetch origin "$DEFAULT_BRANCH" --quiet
git checkout -b "$BRANCH" "origin/$DEFAULT_BRANCH"
```

**PowerShell Implementation:**
```powershell
# Generate short kebab-case title (max 40 chars)
$SHORT = ($ISSUE_TITLE.ToLower() -replace "[^a-z0-9]+","-").Trim("-")
if ($SHORT.Length -gt 40) { 
    $SHORT = $SHORT.Substring(0,40) 
}

$BRANCH = "feature/$ISSUE_NUMBER-$SHORT"
Write-Host "Branch: $BRANCH"

# Create and switch to branch
git fetch origin $DEFAULT_BRANCH | Out-Null
git checkout -b $BRANCH "origin/$DEFAULT_BRANCH"
```

### Workflow Phase 3: Implement Changes

**Make Changes and Commit:**
```bash
# Edit files, implement feature...

# Stage all changes
git add -A

# Commit with descriptive message referencing issue
git commit -m "feat(auth): implement OAuth2 flow (#$ISSUE_NUMBER)

- Add OAuth2 service class
- Implement token management
- Create authentication middleware
- Add user profile endpoint

Closes #$ISSUE_NUMBER"

# Push to remote
git push -u origin "$BRANCH"
```

**Run Tests/Linters:**
```bash
# Run test suite
npm test

# Run linter
npm run lint

# If tests fail, fix and amend commit
git add -A
git commit --amend --no-edit
git push --force-with-lease
```

### Workflow Phase 4: Create Pull Request

**Idempotent PR Creation:**
```bash
# Check if PR already exists for this branch
EXISTING_PR=$(gh pr list --head "$BRANCH" --json number -q '.[0].number')

if [ -z "$EXISTING_PR" ]; then
    gh pr create \
        --base "$DEFAULT_BRANCH" \
        --head "$BRANCH" \
        --title "feat(auth): implement OAuth2 authentication flow" \
        --body "$(cat <<'MD'
## Summary

Implements OAuth2 authentication flow with JWT token management for secure user authentication.

## Implementation Notes

- Created `OAuth2Service` class handling authorization flow
- Implemented secure token storage using VS Code SecretStorage
- Added automatic token refresh with 5-minute buffer before expiry
- Created `/auth/profile` endpoint for user data retrieval
- Added comprehensive error handling and logging

## Testing

- ✅ Unit tests for OAuth2Service (100% coverage)
- ✅ Integration tests for auth endpoints
- ✅ Manual testing with GitHub OAuth provider
- ✅ Token refresh logic validated with expiry simulation
- ✅ Error scenarios tested (invalid tokens, network failures)

## Risks & Mitigations

**Risk:** Token refresh failure during active session
**Mitigation:** Implemented exponential backoff retry logic with user notification

**Risk:** Concurrent token refresh requests
**Mitigation:** Added mutex lock to prevent race conditions

## Documentation

- Updated README with authentication setup instructions
- Added API documentation for auth endpoints
- Created troubleshooting guide for common auth issues

Closes #123
MD
)" \
        --label "auto-generated" \
        --label "copilot-task"
fi

PR_URL=$(gh pr view --head "$BRANCH" --json url -q .url)
echo "Pull Request: $PR_URL"
```

**PowerShell Version:**
```powershell
$EXISTING_PR = gh pr list --head $BRANCH --json number | ConvertFrom-Json

if (-not $EXISTING_PR) {
    $prBody = @"
## Summary

Implements OAuth2 authentication flow with JWT token management.

## Implementation Notes

- Created OAuth2Service class
- Implemented secure token storage
- Added automatic token refresh
- Created user profile endpoint

## Testing

- ✅ Unit tests passing
- ✅ Integration tests passing
- ✅ Manual testing completed

## Risks & Mitigations

**Risk:** Token refresh failure
**Mitigation:** Exponential backoff retry logic

Closes #$ISSUE_NUMBER
"@
    
    gh pr create --base $DEFAULT_BRANCH --head $BRANCH `
        --title "feat(auth): implement OAuth2 authentication flow" `
        --body $prBody `
        --label "auto-generated" --label "copilot-task" | Out-Null
}

$PR_URL = (gh pr view --head $BRANCH --json url --jq ".url")
Write-Host "Pull Request: $PR_URL"
```

### Workflow Phase 5: Close Issue

**Automatic Close (Preferred):**
The issue closes automatically when PR is merged because PR body includes `Closes #<ISSUE_NUMBER>`.

**Manual Close (Fallback):**
```bash
# If issue didn't auto-close after PR merge
gh issue close "$ISSUE_NUMBER" --reason "completed"
```

**PowerShell:**
```powershell
gh issue close $ISSUE_NUMBER --reason "completed"
```

## Complete Workflow Script

**Bash:**
```bash
#!/bin/bash
set -e

# Configuration
ISSUE_TITLE="Implement user authentication flow"
DEFAULT_BRANCH=$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name)

# Phase 1: Create or reuse issue
echo "Phase 1: Creating/reusing issue..."
ISSUE_NUMBER=$(gh issue list --state open \
    --search "in:title '$ISSUE_TITLE'" \
    --json number -q '.[0].number')

if [ -z "$ISSUE_NUMBER" ]; then
    gh issue create --title "$ISSUE_TITLE" \
        --body "[Issue body here]" \
        --label "auto-generated" --label "copilot-task"
    ISSUE_NUMBER=$(gh issue list --state open \
        --search "in:title '$ISSUE_TITLE'" \
        --json number -q '.[0].number')
fi

ISSUE_URL=$(gh issue view "$ISSUE_NUMBER" --json url -q .url)
echo "✅ Issue: $ISSUE_URL"

# Phase 2: Create branch
echo "Phase 2: Creating feature branch..."
SHORT=$(echo "$ISSUE_TITLE" | tr '[:upper:]' '[:lower:]' | \
    sed -E 's/[^a-z0-9]+/-/g' | sed -E 's/^-+|-+$//g' | cut -c1-40)
BRANCH="feature/${ISSUE_NUMBER}-${SHORT}"

git fetch origin "$DEFAULT_BRANCH" --quiet
git checkout -b "$BRANCH" "origin/$DEFAULT_BRANCH"
echo "✅ Branch: $BRANCH"

# Phase 3: Make changes (example)
echo "Phase 3: Making changes..."
# [Your implementation here]
git add -A
git commit -m "feat(auth): implement OAuth2 flow (#$ISSUE_NUMBER)"
git push -u origin "$BRANCH"
echo "✅ Changes committed and pushed"

# Phase 4: Create PR
echo "Phase 4: Creating pull request..."
EXISTING_PR=$(gh pr list --head "$BRANCH" --json number -q '.[0].number')
if [ -z "$EXISTING_PR" ]; then
    gh pr create --base "$DEFAULT_BRANCH" --head "$BRANCH" \
        --title "feat(auth): implement OAuth2 authentication flow" \
        --body "Closes #$ISSUE_NUMBER" \
        --label "auto-generated" --label "copilot-task"
fi

PR_URL=$(gh pr view --head "$BRANCH" --json url -q .url)
echo "✅ Pull Request: $PR_URL"

# Summary
echo ""
echo "Summary:"
echo "  Issue: $ISSUE_URL"
echo "  Branch: $BRANCH"
echo "  PR: $PR_URL"
```

## Advanced Patterns

### Multi-Repository Workflow

```bash
REPOS=("RolandStrauss/Lancelot-extension" "RolandStrauss/other-repo")

for REPO in "${REPOS[@]}"; do
    echo "Processing $REPO..."
    gh repo set-default "$REPO"
    # Run workflow...
done
```

### Draft PR for Work in Progress

```bash
gh pr create --draft \
    --base "$DEFAULT_BRANCH" \
    --head "$BRANCH" \
    --title "WIP: OAuth2 implementation" \
    --body "Closes #$ISSUE_NUMBER"

# Mark as ready when complete
gh pr ready
```

### Add Reviewers

```bash
gh pr create \
    --reviewer "@octocat,@other-user" \
    --assignee "@me" \
    # ... other flags
```

## Validation Checklist

Before running automation:
- [ ] `gh` CLI is installed and authenticated
- [ ] Git user name and email are configured
- [ ] Default branch is correctly detected
- [ ] Issue title is descriptive and unique
- [ ] Branch name follows convention (max 50 chars after issue number)
- [ ] Commit message references issue number
- [ ] PR body includes "Closes #<ISSUE_NUMBER>"
- [ ] Tests pass before pushing
- [ ] Labels are appropriate

## Troubleshooting

**Issue: "gh: command not found"**
```bash
# Install GitHub CLI
# macOS:
brew install gh

# Linux:
sudo apt install gh  # or appropriate package manager

# Windows:
winget install GitHub.cli
```

**Issue: "gh auth status shows not authenticated"**
```bash
gh auth login
# Follow prompts to authenticate
```

**Issue: "Branch already exists"**
```bash
# Switch to existing branch
git checkout "$BRANCH"

# Or delete and recreate
git branch -D "$BRANCH"
git checkout -b "$BRANCH" "origin/$DEFAULT_BRANCH"
```

**Issue: "PR creation fails - already exists"**
```bash
# List existing PRs for branch
gh pr list --head "$BRANCH"

# View existing PR
gh pr view --head "$BRANCH"
```

**Issue: "Issue didn't auto-close after PR merge"**
```bash
# Manually close issue
gh issue close "$ISSUE_NUMBER" --reason "completed"
```

## Tools and Resources

**GitHub CLI Documentation:**
- Official docs: https://cli.github.com/manual/
- Issue commands: `gh issue --help`
- PR commands: `gh pr --help`
- Repo commands: `gh repo --help`

**Query Syntax:**
- Search syntax: `gh issue list --search 'is:open label:bug'`
- JQ filtering: `-q '.[] | select(.state=="open")'`

**Useful Commands:**
```bash
# List all issues with labels
gh issue list --label "bug,priority-high"

# View PR with comments
gh pr view 123 --comments

# Check PR status checks
gh pr checks

# Merge PR
gh pr merge --squash --delete-branch
```

## Related Skills

- See `.github/skills/branch-naming-workflow/SKILL.md` for branch naming standards
- See `.github/skills/version-management/SKILL.md` for release workflows
- See `copilot-instructions.md` Agent Mode section for complete workflow context
