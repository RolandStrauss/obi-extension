---
name: Changelog Management
description: Maintain CHANGELOG.md following Keep a Changelog 1.0.0 format with proper versioning and categorization. Use when user updates changelog, creates releases, or mentions CHANGELOG.md, release notes, or version history.
---

# Changelog Management

Comprehensive guide for maintaining `CHANGELOG.md` following the [Keep a Changelog 1.0.0](https://keepachangelog.com/) format and [Semantic Versioning 2.0.0](https://semver.org/) principles.

## Quick Reference

**Format Structure:**
```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New features or capabilities

### Changed
- Changes to existing functionality

### Deprecated
- Features marked for removal

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security vulnerability fixes
```

**Quick Rules:**
- ✅ Latest version at the top
- ✅ Use ISO date format (YYYY-MM-DD)
- ✅ Keep `[Unreleased]` section for upcoming changes
- ✅ Link to issues/PRs where relevant
- ✅ Write for end users, not developers

## When This Skill Applies

Use this skill when:
- Adding a new release entry to CHANGELOG.md
- Documenting feature additions, changes, or fixes
- Preparing for version release
- Reviewing changelog entries in PRs
- Migrating `[Unreleased]` entries to versioned release

## Detailed Usage

### Complete CHANGELOG.md Structure

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Feature planned for next release

## [1.2.0] - 2024-01-15

### Added
- New feature X that enables Y (#123)
- Support for Z functionality

### Changed
- Improved performance of ABC operation (#124)
- Updated UI for better accessibility

### Fixed
- Fixed crash when handling edge case (#125)
- Resolved memory leak in long-running processes

## [1.1.1] - 2024-01-10

### Fixed
- Critical bug fix for production issue (#120)

## [1.1.0] - 2024-01-05

### Added
- New API endpoint for data export (#115)

### Deprecated
- Old export method (use new API endpoint instead) (#115)

## [1.0.0] - 2024-01-01

### Added
- Initial release with core functionality
- Documentation and examples

[Unreleased]: https://github.com/user/repo/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/user/repo/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/user/repo/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/user/repo/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/user/repo/releases/tag/v1.0.0
```

### Change Categories Explained

**Added** - New features or capabilities
```markdown
### Added
- OAuth2 authentication flow (#145)
- Export to CSV functionality in reports view
- Dark mode theme support
- New keyboard shortcut Ctrl+Shift+P for command palette
```

**Changed** - Changes to existing functionality
```markdown
### Changed
- Improved search algorithm performance by 40% (#150)
- Redesigned settings page for better usability
- Updated dependencies to latest stable versions
- Changed default timeout from 30s to 60s
```

**Deprecated** - Features marked for future removal
```markdown
### Deprecated
- Old authentication API (use OAuth2 flow instead) - will be removed in v2.0.0 (#148)
- Legacy configuration format (migrate to YAML) - scheduled for v2.5.0
```

**Removed** - Features removed in this version
```markdown
### Removed
- Removed support for Node.js v12 (EOL) (#152)
- Removed deprecated `getUser()` method (use `fetchUser()`)
- Removed experimental feature flags
```

**Fixed** - Bug fixes
```markdown
### Fixed
- Fixed crash when processing empty files (#155)
- Resolved race condition in concurrent requests (#156)
- Fixed memory leak in WebSocket connection handler
- Corrected timezone handling in date picker
```

**Security** - Security vulnerability fixes (always specify CVE if applicable)
```markdown
### Security
- Fixed SQL injection vulnerability in search query (CVE-2024-1234) (#160)
- Updated dependency X to patch security issue (GHSA-xxxx-yyyy)
- Improved input validation to prevent XSS attacks
```

### Writing User-Focused Entries

**❌ Developer-focused (Bad):**
```markdown
### Changed
- Refactored UserService class
- Updated webpack config
- Fixed linting errors
```

**✅ User-focused (Good):**
```markdown
### Changed
- Improved application startup time by 50%
- Reduced bundle size resulting in faster page loads
- Enhanced code quality for better stability
```

**❌ Vague (Bad):**
```markdown
### Fixed
- Fixed bug
- Updated stuff
- Improvements
```

**✅ Specific (Good):**
```markdown
### Fixed
- Fixed crash when opening files larger than 10MB (#170)
- Corrected calculation error in tax reports (#171)
- Resolved UI rendering issue on mobile devices (#172)
```

### Linking to Issues and PRs

Always link changes to their source:

```markdown
### Added
- New export feature (#123, @username)
- API rate limiting ([#145](https://github.com/user/repo/pull/145))

### Fixed
- Fixed critical security issue (see [PR #200](https://github.com/user/repo/pull/200) for details)
```

### Unreleased Section Management

**Adding to Unreleased:**
```markdown
## [Unreleased]

### Added
- Feature being developed (#180)

### Fixed
- Bug fix waiting for release (#181)
```

**Preparing for Release:**
When creating version 1.3.0:

**Step 1: Update header and add date:**
```markdown
## [1.3.0] - 2024-01-20

### Added
- Feature being developed (#180)

### Fixed
- Bug fix waiting for release (#181)
```

**Step 2: Create new Unreleased section:**
```markdown
## [Unreleased]

<!-- Changes for next release go here -->

## [1.3.0] - 2024-01-20
```

**Step 3: Update comparison links:**
```markdown
[Unreleased]: https://github.com/user/repo/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/user/repo/compare/v1.2.0...v1.3.0
```

### Semantic Versioning Integration

Match changelog entries to version bumps:

**MAJOR (X.0.0) - Breaking Changes:**
```markdown
## [2.0.0] - 2024-02-01

### Changed
- **BREAKING**: Renamed `getUser()` to `fetchUser()` (#200)
- **BREAKING**: Changed configuration format from JSON to YAML (#201)

### Removed
- Removed deprecated authentication methods
- Dropped support for Node.js v14
```

**MINOR (X.Y.0) - New Features:**
```markdown
## [1.4.0] - 2024-01-25

### Added
- New dashboard widget for analytics (#210)
- Support for custom themes (#211)

### Changed
- Improved error messages for better debugging
```

**PATCH (X.Y.Z) - Bug Fixes:**
```markdown
## [1.3.1] - 2024-01-22

### Fixed
- Fixed crash in report generation (#220)
- Corrected timezone display issue (#221)

### Security
- Patched XSS vulnerability (#222)
```

### Multi-line Entries

For complex changes that need explanation:

```markdown
### Changed
- Redesigned authentication flow (#250)
  - Added multi-factor authentication support
  - Improved session management
  - Enhanced security with token rotation
  - Migration guide: see docs/auth-migration.md
```

### Special Version Entries

**First Release:**
```markdown
## [1.0.0] - 2024-01-01

Initial public release.

### Added
- Core functionality
- API documentation
- Example implementations
- Test suite
```

**Pre-release Versions:**
```markdown
## [2.0.0-beta.1] - 2024-03-15

### Added
- Preview of new feature set for 2.0.0

### Known Issues
- Feature X is experimental
- Performance optimization pending
```

## Validation Checklist

Before committing changelog updates:
- [ ] All entries are under appropriate category (Added/Changed/Fixed/etc.)
- [ ] Version number follows Semantic Versioning
- [ ] Date is in ISO format (YYYY-MM-DD)
- [ ] Latest version is at the top (below Unreleased)
- [ ] Entries are written for end users, not developers
- [ ] Issue/PR numbers are linked where applicable
- [ ] Breaking changes are clearly marked with **BREAKING**
- [ ] Security fixes reference CVE or GHSA identifiers
- [ ] Comparison links are updated at the bottom
- [ ] `[Unreleased]` section exists and is empty or has upcoming changes

## Common Mistakes and Fixes

**Mistake 1: Developer-centric language**

❌ Bad:
```markdown
### Changed
- Refactored database layer
- Updated TypeScript to v5
```

✅ Good:
```markdown
### Changed
- Improved database query performance by 60%
- Enhanced type safety across the application
```

**Mistake 2: Missing dates or wrong format**

❌ Bad:
```markdown
## [1.2.0] - January 15, 2024
## [1.1.0] - 2024/01/10
```

✅ Good:
```markdown
## [1.2.0] - 2024-01-15
## [1.1.0] - 2024-01-10
```

**Mistake 3: Vague descriptions**

❌ Bad:
```markdown
### Fixed
- Fixed issue
- Bug fixes
```

✅ Good:
```markdown
### Fixed
- Fixed crash when processing large files (#300)
- Resolved memory leak in background sync (#301)
```

**Mistake 4: Not using Unreleased section**

❌ Bad: Adding directly to latest version before release
```markdown
## [1.2.0] - 2024-01-15
### Added
- Feature still in development
```

✅ Good: Use Unreleased for work in progress
```markdown
## [Unreleased]
### Added
- Feature still in development

## [1.2.0] - 2024-01-15
```

## Automation Integration

**GitHub Actions Example:**
```yaml
name: Changelog Validation
on: [pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Check CHANGELOG.md updated
        run: |
          if git diff --name-only origin/main | grep -q "CHANGELOG.md"; then
            echo "✅ CHANGELOG.md updated"
          else
            echo "❌ CHANGELOG.md not updated"
            exit 1
          fi

      - name: Validate changelog format
        run: |
          # Check for valid version header
          grep -E "^## \[[0-9]+\.[0-9]+\.[0-9]+\] - [0-9]{4}-[0-9]{2}-[0-9]{2}$" CHANGELOG.md
```

**Pre-commit Hook:**
```bash
#!/bin/bash
# .git/hooks/commit-msg

# Check if CHANGELOG.md is staged
if git diff --cached --name-only | grep -q "CHANGELOG.md"; then
  # Validate date format
  if ! grep -E "[0-9]{4}-[0-9]{2}-[0-9]{2}" CHANGELOG.md >/dev/null; then
    echo "❌ CHANGELOG.md: Invalid date format. Use YYYY-MM-DD"
    exit 1
  fi
fi
```

## Tools and Resources

**Changelog Generation:**
- `github-changelog-generator`: Auto-generate from GitHub issues/PRs
- `standard-version`: Automated versioning and changelog
- `conventional-changelog`: Generate changelog from conventional commits

**Validation:**
- `markdownlint`: Ensure proper markdown formatting
- Custom scripts: Validate version numbers and dates

**References:**
- Keep a Changelog: https://keepachangelog.com/
- Semantic Versioning: https://semver.org/
- Conventional Commits: https://www.conventionalcommits.org/

## Related Skills

- See `.github/skills/version-management/SKILL.md` for version numbering guidance
- See `.github/skills/branch-naming-workflow/SKILL.md` for commit message conventions
- See `.github/skills/vsix-packaging/SKILL.md` for automated version updates
- See `instructions/auto-version-increment.instructions.md` for version automation
