# Branch & Commit Naming Standards

## Branch Naming Convention

### Format
```
<type>/<assignee>/<description>
```

- **type**: One of the valid types listed below
- **assignee**: Developer/team name
- **description**: Kebab-case description (max 50 chars)

### Valid Types

| Type | Purpose | Example |
|------|---------|---------|
| `feature` | New features | `feature/roland/add-jira-branching` |
| `fix` | Bug fixes | `fix/roland/login-validation` |
| `chore` | Maintenance tasks | `chore/roland/update-deps` |
| `docs` | Documentation updates | `docs/roland/update-readme` |
| `refactor` | Code refactoring | `refactor/roland/extract-service` |
| `test` | Test updates | `test/roland/add-unit-tests` |
| `perf` | Performance improvements | `perf/roland/optimize-query` |
| `ci` | CI/CD updates | `ci/roland/add-github-action` |
| `style` | Code style changes | `style/roland/format-code` |
| `build` | Build system changes | `build/roland/update-webpack` |
| `wip` | Work in progress | `wip/roland/experimental-feature` |
| `revert` | Revert previous changes | `revert/roland/rollback-feature` |

### Special Branch Formats

**Release Branches:**
```
release/<assignee>/<semver>
```
Example: `release/roland/v1.2.0`

**Hotfix Branches:**
```
hotfix/<assignee>/<description>
```
Example: `hotfix/roland/critical-security-fix`

### Branches That Skip Validation

The following branches skip branch naming validation in CI/CD:
- `main`
- `master`
- Semantic version tags: `vX.Y.Z` (e.g., `v1.0.0`)

## Commit Message Convention

### Format (Conventional Commits)
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Type
Must align with Conventional Commits spec. Common types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Test changes
- `build` - Build system changes
- `ci` - CI/CD changes
- `chore` - Maintenance tasks
- `revert` - Revert previous changes

### Scope (Optional)
The scope specifies what part of the codebase is affected:
- `auth` - Authentication
- `api` - API changes
- `ui` - User interface
- `core` - Core functionality
- `config` - Configuration
- etc.

### Subject
- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at the end
- Max 50 characters

### Examples

**Good:**
```
feat(auth): add OAuth2 login flow
fix(api): handle null response data
docs(readme): update installation steps
refactor(core): extract validation logic
test(auth): add unit tests for login
perf(query): optimize database queries
ci(actions): add automated testing workflow
```

**Bad:**
```
Added new feature  # Wrong mood, missing scope
Fix bug.  # Too vague, has period
Updated stuff  # Too vague, no type
FEAT: NEW FEATURE  # Caps, missing scope
```

### Body (Optional)

Provide additional context:
```
feat(auth): add OAuth2 login flow

- Implement OAuth2 authentication provider
- Add token refresh mechanism
- Update login UI components
```

### Footer (Optional)

Reference issues or breaking changes:
```
feat(auth): add OAuth2 login flow

BREAKING CHANGE: Old auth system removed

Closes #123
Relates to #456
```

## Validation Rules

### Server-Side Enforcement

CI/CD workflows enforce these rules by:

1. Skipping validation for `main`, `master`, and semantic version tags (`vX.Y.Z`)
2. Enforcing release/hotfix branch formats
3. Validating `<type>/<assignee>/<description>` for other branches
4. Checking all commits against Conventional Commits

### Local Validation

Install commit message hook:
```bash
./scripts/install-commit-hook.ps1
```

This validates commit messages locally before push.

## Common Mistakes

### Branch Names

❌ **Wrong:**
- `Feature/Add-User-Auth` (uppercase)
- `fix` (missing assignee and description)
- `-fix-bug` (starts with hyphen)
- `feature--add-auth` (double hyphen)
- `feature/roland/this-is-a-very-long-description-that-exceeds-fifty-characters` (too long)

✅ **Correct:**
- `feature/roland/add-user-auth`
- `fix/roland/login-bug`
- `docs/roland/update-readme`

### Commit Messages

❌ **Wrong:**
- `Added new feature` (wrong tense, no type)
- `fix: Fixed the bug.` (wrong tense, has period)
- `feat: stuff` (too vague)
- `FEAT(auth): login` (uppercase type)

✅ **Correct:**
- `feat(auth): add OAuth2 support`
- `fix(api): handle empty response`
- `docs(readme): update examples`
- `refactor(core): extract service layer`

## CI/CD Integration

### Validation Steps

1. **Fetch full history:**
   ```bash
   fetch-depth: 0
   ```

2. **Validate on pull requests:**
   - Check head ref (branch name)
   - Validate all commits in PR

3. **Validate on pushes:**
   - Check pushed branch name
   - Validate commits in `before..after` range

4. **Exit non-zero on failure:**
   - Marks CI run as failed
   - Blocks merge if required checks enabled

### Example GitHub Action

```yaml
name: Validate Branch and Commits
on:
  pull_request:
  push:
    branches-ignore:
      - main
      - master

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Validate branch name
        run: |
          ./scripts/validate-branch.sh "${{ github.ref_name }}"
      
      - name: Validate commits
        run: |
          ./scripts/validate-commits.sh
```

## Quick Reference

**Branch:** `<type>/<assignee>/<description>`
**Commit:** `<type>(<scope>): <subject>`

**Example Flow:**
```bash
# Create branch
git checkout -b feature/roland/add-user-auth

# Make changes
git add .
git commit -m "feat(auth): add user authentication"

# Push
git push origin feature/roland/add-user-auth

# Create PR with title
"Add user authentication"
```
