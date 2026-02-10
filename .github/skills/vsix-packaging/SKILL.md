---
name: VSIX Packaging & Versioning
description: Build, version, and package Lancelot extension for distribution with automated version management. Use when user builds VSIX, packages extension, increments versions, or mentions VSIX, package, vsce, or extension distribution.
---

# VSIX Packaging & Versioning

Build and package the Lancelot VS Code extension with automated version management and proper artifact organization.

## Quick Start

```bash
# Package with patch version increment (most common)
npm run package

# Package with minor version increment
npm run package:minor

# Package with major version increment
npm run package:major

# Build optimized package without version increment
npm run package:optimized
```

**Result:** VSIX file created in `.artifacts/vsix/` directory

## Version Management

### Automatic Version Increment

**All package commands automatically increment the version** before building:

- `npm run package` → Increments **PATCH** version (0.8.0 → 0.8.1)
- `npm run package:minor` → Increments **MINOR** version (0.8.0 → 0.9.0)
- `npm run package:major` → Increments **MAJOR** version (0.8.0 → 1.0.0)

### What Gets Updated Automatically

When version increments, the following are updated:

1. **`package.json`** - Main version field
2. **`CHANGELOG.md`** - New version entry with template
3. **`.artifacts/releases/release_notes_X.X.X.md`** - Release notes
4. **`README.md`** - Version references and download links
5. **`docs/getting-started.md`** - Version references
6. **`docs/lancelot-installation-guide.md`** - Installation instructions
7. **`docs/ibmi/product_requirements_document.md`** - Version references

### Semantic Versioning Rules

Follow [Semantic Versioning 2.0.0](https://semver.org/):

- **MAJOR** (X.0.0): Breaking changes, incompatible API changes
- **MINOR** (0.X.0): New features, backwards-compatible
- **PATCH** (0.0.X): Bug fixes, backwards-compatible

## Packaging Commands

### Standard Packaging

**Patch version (most common):**
```bash
npm run package
```
- Auto-increments patch version
- Builds VSIX with standard optimizations
- Creates `.artifacts/vsix/lancelot-X.X.X.vsix`

**Minor version (new features):**
```bash
npm run package:minor
```
- Auto-increments minor version
- Resets patch to 0
- Builds optimized VSIX

**Major version (breaking changes):**
```bash
npm run package:major
```
- Auto-increments major version
- Resets minor and patch to 0
- Builds optimized VSIX

### Special Packaging

**Optimized build (no version change):**
```bash
npm run package:optimized
```
- Does NOT increment version
- Uses current version from package.json
- Applies maximum optimizations

**Deterministic build:**
```bash
npm run package:deterministic
```
- Reproducible builds
- Fixed timestamps for CI/CD
- Useful for verification

## Build Process

### Step-by-Step Workflow

1. **Version Increment** (if applicable)
   - Runs `scripts/increment-version.js`
   - Updates all documentation files
   - Creates release notes template

2. **Pre-Build Validation**
   - Checks `package.json` validity
   - Validates version format
   - Ensures target directories exist

3. **Bundle Creation**
   - Compiles TypeScript to JavaScript
   - Bundles with esbuild
   - Minifies and optimizes

4. **VSIX Packaging**
   - Creates extension package
   - Includes only necessary files
   - Outputs to `.artifacts/vsix/`

5. **Artifact Management**
   - Archives previous VSIX (if exists)
   - Moves to `.artifacts/vsix/archive/`
   - Keeps workspace root clean

## Artifact Organization

### Directory Structure

```
.artifacts/
├── vsix/
│   ├── lancelot-0.8.70.vsix           # Latest package
│   └── archive/
│       ├── lancelot-0.8.69.vsix       # Previous versions
│       └── lancelot-0.8.68.vsix
└── releases/
    ├── release_notes_0.8.70.md        # Current release notes
    ├── release_notes_0.8.69.md
    └── release_notes_template.md      # Canonical template
```

### Automatic Cleanup

- **Old VSIX files** in root → Moved to `.artifacts/vsix/archive/`
- **Stray release notes** → Moved to `.artifacts/releases/`
- **Workspace root** remains clean

## Release Notes Management

### Release Notes Template

Every version increment creates release notes from the canonical template:

**Location:** `.artifacts/releases/release_notes_X.X.X.md`

**Template includes:**
- Version and date information
- Sections for Features, Improvements, Bug Fixes
- Technical details (breaking changes, performance, security)
- Installation instructions
- Documentation links

### Customizing Release Notes

After packaging, edit the generated release notes:

```bash
# Open in editor
code .artifacts/releases/release_notes_0.8.70.md

# Add actual changes under each section
# Remove unused sections
# Add specific details for this release
```

## CHANGELOG Management

### Format

Follow [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/):

```markdown
## [X.X.X] - YYYY-MM-DD

### Added
- New features or capabilities

### Changed
- Changes to existing functionality

### Fixed
- Bug fixes

### Removed
- Removed features
```

### Automatic Entry Creation

Version increment adds a template entry to `CHANGELOG.md`:

```markdown
## [0.8.70] - 2025-12-23

### Added
- Auto-incremented version for VSIX package build

### Changed
- [Add changes here]

### Fixed
- [Add fixes here]
```

**Important:** Customize this entry with actual changes before distribution.

## Manual Version Management

### When to Use Manual Process

- Hotfix releases requiring specific version numbers
- Reverting version changes
- Coordinated releases with external dependencies

### Manual Steps

1. **Update version in package.json manually**
   ```json
   {
     "version": "0.8.71"
   }
   ```

2. **Sync documentation only**
   ```bash
   node scripts/increment-version.js --docs-only
   ```

3. **Update release notes manually**
   - Create `.artifacts/releases/release_notes_0.8.71.md`
   - Fill in actual changes

4. **Build without auto-increment**
   ```bash
   npm run package:optimized
   ```

## Quality Assurance

### Pre-Build Validation

The increment script validates:
- ✅ `package.json` exists and is valid JSON
- ✅ Current version follows semantic versioning
- ✅ Target directories exist or can be created
- ✅ Previous artifacts can be archived

### Post-Build Verification

After packaging, verify:

```bash
# Check package.json version
cat package.json | grep version

# Check CHANGELOG.md has new entry
head -20 CHANGELOG.md

# Verify VSIX exists
ls -lh .artifacts/vsix/lancelot-*.vsix

# Check release notes created
ls -lh .artifacts/releases/release_notes_*.md
```

## Common Scenarios

### Scenario 1: Regular Bug Fix

```bash
# 1. Make bug fixes
git add .
git commit -m "fix(gitlab): resolve API pagination bug"

# 2. Package with patch increment
npm run package

# 3. Verify version updated
cat package.json | grep version
# Should show: "version": "0.8.71"

# 4. Customize release notes
code .artifacts/releases/release_notes_0.8.71.md

# 5. Update CHANGELOG.md
code CHANGELOG.md
# Add specific bug fix details

# 6. Commit version changes
git add .
git commit -m "chore(release): v0.8.71"
git push
```

### Scenario 2: New Feature Release

```bash
# 1. Make feature changes
git add .
git commit -m "feat(auth): add OAuth2 support"

# 2. Package with minor increment
npm run package:minor

# 3. Version jumps to 0.9.0
cat package.json | grep version

# 4. Document feature in release notes
code .artifacts/releases/release_notes_0.9.0.md

# 5. Update CHANGELOG with feature details
code CHANGELOG.md

# 6. Commit and push
git add .
git commit -m "chore(release): v0.9.0 with OAuth2"
git push
```

### Scenario 3: Breaking Changes

```bash
# 1. Make breaking API changes
git add .
git commit -m "feat!: redesign authentication API

BREAKING CHANGE: Old auth methods removed"

# 2. Package with major increment
npm run package:major

# 3. Version jumps to 1.0.0
cat package.json | grep version

# 4. Document breaking changes prominently
code .artifacts/releases/release_notes_1.0.0.md

# 5. Update CHANGELOG with migration guide
code CHANGELOG.md

# 6. Commit and push
git add .
git commit -m "chore(release): v1.0.0 major release"
git push
```

## Troubleshooting

### Version Increment Fails

**Error:** Script fails with permission errors

**Solution:**
```bash
# Check write permissions
ls -la package.json

# Ensure not locked by other process
# On Windows, close VS Code and retry
```

### Version Not Updated in Docs

**Error:** Version references still show old version

**Solution:**
```bash
# Re-run docs sync
node scripts/increment-version.js --docs-only

# Manually verify and update missed files
grep -r "0.8.69" docs/
```

### Previous VSIX Not Archived

**Error:** Old VSIX file still in root

**Solution:**
```bash
# Manually move to archive
mkdir -p .artifacts/vsix/archive
mv lancelot-*.vsix .artifacts/vsix/archive/

# Verify cleanup
ls *.vsix  # Should be empty
```

### Build Artifacts in Wrong Location

**Error:** VSIX created in root instead of .artifacts/vsix/

**Solution:**
```bash
# Move manually
mkdir -p .artifacts/vsix
mv lancelot-*.vsix .artifacts/vsix/

# Check package scripts use --out flag
cat package.json | grep "vsce package"
# Should include: --out .artifacts/vsix
```

## Best Practices

1. **Always increment for releases** - Use version increment commands
2. **Customize release notes** - Edit generated templates with actual changes
3. **Update CHANGELOG** - Add meaningful descriptions to generated sections
4. **Test installations** - Verify VSIX installs correctly after packaging
5. **Commit version changes** - Commit separately from feature changes
6. **Tag releases** - Tag with version number for easy reference
7. **Archive old packages** - Keep .artifacts/vsix/archive/ for rollback

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Package

on:
  push:
    branches: [main]

jobs:
  package:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'

      - name: Install dependencies
        run: npm ci

      - name: Build and Package
        run: npm run package:optimized

      - name: Upload VSIX
        uses: actions/upload-artifact@v3
        with:
          name: vsix-package
          path: .artifacts/vsix/*.vsix
```

## References

- Auto-Increment Instructions: `.github/instructions/auto-version-increment.instructions.md`
- Semantic Versioning: https://semver.org/
- Keep a Changelog: https://keepachangelog.com/
- VS Code Extension Publishing: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
