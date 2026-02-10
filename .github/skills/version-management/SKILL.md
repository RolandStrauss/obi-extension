---
name: version-management
description: Manages semantic versioning, changelog maintenance, and release documentation following Keep a Changelog and Semantic Versioning standards. Automates version increments and synchronizes documentation. Use when the user mentions version updates, releases, changelog, or VSIX packaging.
---

# Version and Changelog Management

Manages semantic versioning, changelog maintenance, and release documentation. Automates version increments and keeps all documentation synchronized.

## When to Use This Skill

- User mentions version updates
- User wants to create a release
- User mentions changelog updates
- User references VSIX packaging
- User wants to publish an extension
- User mentions semantic versioning

## Semantic Versioning (SemVer 2.0.0)

### Version Format
```
MAJOR.MINOR.PATCH
```

### Increment Rules

**MAJOR (X.0.0):**
- Breaking changes
- API incompatibilities
- Removal of deprecated features

**MINOR (0.X.0):**
- New features
- Backwards-compatible additions
- New capabilities

**PATCH (0.0.X):**
- Bug fixes
- Backwards-compatible changes
- Performance improvements
- Documentation updates

### Examples

```
1.0.0 → 1.0.1   # Bug fix
1.0.1 → 1.1.0   # New feature
1.1.0 → 2.0.0   # Breaking change
```

## Automated Version Management

### Version Increment Commands

```bash
# Patch increment (default)
npm run version:increment
npm run version:patch

# Minor increment
npm run version:minor

# Major increment
npm run version:major
```

### Package with Auto-Increment

```bash
# Patch + build VSIX
npm run package

# Optimized build
npm run package:optimized

# Minor version + optimized
npm run package:minor

# Major version + optimized
npm run package:major
```

### What Gets Updated Automatically

The auto-increment script updates:

1. **package.json** - Main version field
2. **CHANGELOG.md** - New version entry
3. **Release Notes** - `.artifacts/releases/release_notes_X.X.X.md`
4. **README.md** - Version references
5. **Documentation** - All version references in docs/

### Manual Override

**When to use manual process:**
- Hotfix releases requiring specific versions
- Reverting version changes
- Coordinated releases with dependencies

**Steps:**
1. Update `package.json` version manually
2. Run: `node scripts/increment-version.js --docs-only`
3. Update release notes manually
4. Build: `vsce package --skip-license`

## Changelog Management (Keep a Changelog 1.1.0)

### Structure

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New features in development

### Changed
- Changes to existing functionality

### Fixed
- Bug fixes

## [1.2.0] - 2025-01-15

### Added
- New authentication system
- Support for multiple languages

### Changed
- Improved error handling
- Updated dependencies

### Fixed
- Login validation bug
- Memory leak in cache

### Security
- Fixed XSS vulnerability

## [1.1.0] - 2024-12-01
...
```

### Change Categories

| Category | Purpose | Example |
|----------|---------|---------|
| **Added** | New features | "Added OAuth2 authentication" |
| **Changed** | Changes to existing | "Changed API endpoint structure" |
| **Deprecated** | Soon-to-be removed | "Deprecated legacy auth system" |
| **Removed** | Removed features | "Removed old API v1 support" |
| **Fixed** | Bug fixes | "Fixed login validation error" |
| **Security** | Security fixes | "Fixed SQL injection vulnerability" |

### Best Practices

**Write for End Users:**
```markdown
# ❌ Bad (too technical)
- Refactored AuthService.authenticate() method

# ✅ Good (user-focused)
- Improved login reliability and performance
```

**Be Specific:**
```markdown
# ❌ Bad (vague)
- Fixed bugs

# ✅ Good (specific)
- Fixed issue where login failed with special characters in password
```

**Use Links:**
```markdown
### Fixed
- Fixed authentication timeout ([#123](https://github.com/user/repo/issues/123))
```

### Unreleased Section

Keep an `[Unreleased]` section at the top:

```markdown
## [Unreleased]

### Added
- Feature in progress but not yet released

### Changed
- Work in progress
```

**When releasing:**
1. Move `[Unreleased]` items to new version section
2. Add release date
3. Create new empty `[Unreleased]` section

## Release Documentation

### Release Notes Template

Location: `.artifacts/releases/release_notes_X.X.X.md`

```markdown
# Release Notes v1.2.0

**Release Date:** 2025-01-15

## What's New

### Features
- New authentication system with OAuth2 support
- Multi-language support (English, German, French)

### Improvements
- Faster startup time (50% reduction)
- Better error messages
- Improved UI responsiveness

### Bug Fixes
- Fixed login validation with special characters
- Resolved memory leak in cache system
- Fixed incorrect date formatting

## Breaking Changes

⚠️ **OAuth2 Migration Required:**
- Old authentication system removed
- Migration guide: [docs/migration-guide.md](docs/migration-guide.md)

## Technical Details

### Performance
- Reduced bundle size by 30%
- Improved API response time

### Security
- Fixed XSS vulnerability in user input
- Added rate limiting to API endpoints

## Installation

```bash
code --install-extension lancelot-1.2.0.vsix
```

## Documentation

- [Getting Started](docs/getting-started.md)
- [Migration Guide](docs/migration-guide.md)
- [API Documentation](docs/api/)

## Feedback

Report issues: [GitHub Issues](https://github.com/user/repo/issues)
```

## VSIX Package Management

### Package Location

All VSIX packages are created in `.artifacts/vsix/`:

```bash
# Output directly to .artifacts/vsix/
npm run package  # Uses --out flag

# Files created:
.artifacts/vsix/lancelot-1.2.0.vsix
.artifacts/releases/release_notes_1.2.0.md
```

### Deterministic Builds

For reproducible builds:

```bash
npm run package:deterministic

# Fixed timestamps ensure:
# - Same input → same output hash
# - Verifiable builds
# - Consistent packaging
```

### Release Preparation

Full release flow:

```bash
# Patch release
npm run release:prepare

# Minor release
npm run release:minor

# Major release
npm run release:major
```

This runs:
1. Version increment
2. Documentation update
3. Bundle creation
4. VSIX packaging

## Pre-Release Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md has new entry
- [ ] Release notes created
- [ ] Breaking changes documented
- [ ] Migration guide written (if needed)
- [ ] Version number follows SemVer
- [ ] VSIX tested locally

## Post-Release Checklist

- [ ] Git tag created (`vX.Y.Z`)
- [ ] GitHub Release created
- [ ] VSIX uploaded to release
- [ ] Release notes attached
- [ ] Marketplace published (if public)
- [ ] Team notified
- [ ] Documentation site updated

## Common Mistakes

### Version Numbers

❌ **Wrong:**
- `v1.2.3` (use `1.2.3` in package.json)
- `1.2` (missing patch)
- `1.2.3.4` (too many segments)

✅ **Correct:**
- `1.2.3` in package.json
- `v1.2.3` for git tags

### Changelog

❌ **Wrong:**
```markdown
## [1.2.0]
- Fixed stuff
- Added things
```

✅ **Correct:**
```markdown
## [1.2.0] - 2025-01-15

### Added
- OAuth2 authentication support

### Fixed
- Login validation with special characters
```

## Related Documentation

- [Semantic Versioning 2.0.0](https://semver.org/)
- [Keep a Changelog 1.1.0](https://keepachangelog.com/)
- [auto-version-increment.instructions.md](../../../.github/instructions/auto-version-increment.instructions.md)
