---
name: Branch Naming & Commit Workflow
description: Create properly named branches and commits following Lancelot's Conventional Commits conventions. Use when user creates branches, writes commit messages, or mentions branch naming, commit standards, or conventional commits.
---

# Branch Naming & Commit Workflow

Create properly named Git branches and commits following Lancelot extension conventions with server-side validation enforcement.

## Quick Start

```bash
# Create a feature branch
git checkout -b feature/<assignee>/add-authentication

# Commit with conventional format
git commit -m "feat(auth): add OAuth2 login flow"

# Create a release branch
git checkout -b release/<assignee>/1.2.0

# Create a hotfix branch
git checkout -b hotfix/<assignee>/fix-memory-leak
```

## Branch Naming Rules

### Standard Branch Format
```
<type>/<assignee>/<description>
```

**Allowed Types:**
- `feature` - New features
- `fix` - Bug fixes
- `chore` - Maintenance tasks
- `docs` - Documentation changes
- `refactor` - Code refactoring
- `test` - Test additions/changes
- `perf` - Performance improvements
- `ci` - CI/CD changes
- `style` - Code style changes
- `build` - Build system changes
- `wip` - Work in progress
- `revert` - Revert previous changes

**Description Rules:**
- Maximum 50 characters
- Use lowercase with hyphens
- Be descriptive but concise

**Examples:**
```bash
feature/roland/add-gitlab-integration
fix/sarah/resolve-memory-leak
docs/john/update-api-documentation
refactor/alice/simplify-auth-logic
```

### Release Branches
```
release/<assignee>/<semver>
```

**Example:**
```bash
release/roland/1.2.0
release/sarah/2.0.0-beta.1
```

### Hotfix Branches
```
hotfix/<assignee>/<description>
```

**Example:**
```bash
hotfix/roland/critical-security-patch
hotfix/sarah/fix-deployment-failure
```

## Commit Message Format

### Structure
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Commit Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting, etc.)
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Adding/updating tests
- `chore` - Maintenance
- `ci` - CI/CD changes
- `build` - Build system changes
- `revert` - Revert previous commit

### Commit Examples

**Feature:**
```bash
git commit -m "feat(auth): add OAuth2 login flow

Implements OAuth2 authentication with GitLab provider.
Includes token refresh mechanism and secure storage.

Closes #123"
```

**Bug Fix:**
```bash
git commit -m "fix(gitlab): resolve API pagination issue

Fixed bug where large result sets were truncated.
Added proper cursor-based pagination handling.

Fixes #456"
```

**Documentation:**
```bash
git commit -m "docs(readme): update installation instructions

Added cross-platform setup details and prerequisites."
```

**Refactor:**
```bash
git commit -m "refactor(core): simplify error handling

Consolidated error handling logic into shared utility.
Reduces code duplication and improves maintainability."
```

## Server-Side Validation

### Validation Rules

1. **Skipped Branches:**
   - `main`, `master`
   - Semantic version tags: `vX.Y.Z`

2. **Enforced Branches:**
   - Release: Must match `release/<assignee>/<semver>`
   - Hotfix: Must match `hotfix/<assignee>/<description>`
   - Others: Must match `<type>/<assignee>/<description>`

3. **Commit Validation:**
   - All commits must follow Conventional Commits format
   - Validation runs on push and pull request

### CI/CD Validation Steps

**Recommended GitHub Actions workflow:**
```yaml
- name: Validate branch name
  run: |
    # Validation logic runs automatically
    # Fails workflow if naming convention violated

- name: Validate commits
  run: |
    git fetch --depth=0  # Full history
    # Validates all commits in push/PR range
```

## Local Setup

### Install Commit Message Hook

**PowerShell (Windows):**
```powershell
# Run from repository root
.\scripts\install-commit-hook.ps1
```

**Bash (Linux/macOS):**
```bash
# Run from repository root
./scripts/install-commit-hook.sh
```

This installs a `commit-msg` hook that validates commit messages locally before push.

### Quick Validation

**Check branch name:**
```bash
# Current branch
git rev-parse --abbrev-ref HEAD

# Should match: <type>/<assignee>/<description>
```

**Check commit format:**
```bash
# View last commit
git log -1 --oneline

# Should match: <type>(<scope>): <subject>
```

## Common Scenarios

### Creating a Feature Branch

```bash
# 1. Update main branch
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/roland/add-authentication

# 3. Make changes and commit
git add .
git commit -m "feat(auth): implement OAuth2 provider"

# 4. Push to remote
git push -u origin feature/roland/add-authentication
```

### Creating a Release Branch

```bash
# 1. Create release branch from main
git checkout main
git pull origin main
git checkout -b release/roland/1.2.0

# 2. Update version numbers and changelog
# (automated by version management scripts)

# 3. Commit release changes
git commit -m "chore(release): prepare v1.2.0"

# 4. Push release branch
git push -u origin release/roland/1.2.0
```

### Creating a Hotfix

```bash
# 1. Create hotfix from main (or production tag)
git checkout main
git pull origin main
git checkout -b hotfix/roland/fix-security-issue

# 2. Apply fix
git add .
git commit -m "fix(security): patch XSS vulnerability

Sanitizes user input to prevent script injection.
Applies to all form inputs and URL parameters.

Fixes #789"

# 3. Push hotfix
git push -u origin hotfix/roland/fix-security-issue
```

## Troubleshooting

### Branch Name Validation Failed

**Error:**
```
Branch name does not follow convention: <type>/<assignee>/<description>
```

**Solution:**
```bash
# Rename current branch
git branch -m feature/roland/correct-branch-name
git push origin -u feature/roland/correct-branch-name
```

### Commit Message Validation Failed

**Error:**
```
Commit message does not follow Conventional Commits format
```

**Solution:**
```bash
# Amend last commit
git commit --amend -m "feat(scope): correct message format"

# Force push if already pushed
git push --force-with-lease
```

### Description Too Long

**Error:**
```
Branch description exceeds 50 characters
```

**Solution:**
```bash
# Use shorter, more concise description
git branch -m feature/roland/short-description
```

## Best Practices

1. **Descriptive Names:** Use clear, searchable branch names
2. **Conventional Commits:** Always follow the format for automation
3. **Atomic Commits:** One logical change per commit
4. **Reference Issues:** Include issue numbers in commit body/footer
5. **Update Often:** Rebase frequently to stay current with main
6. **Clean History:** Squash WIP commits before merging

## References

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- Lancelot Instructions: `.github/instructions/lancelot.instructions.md`
- Contributing Guide: `CONTRIBUTING.md`
