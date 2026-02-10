---
applyTo: '*'
description: 'VSIX release automation: auto-increment versions (patch/minor/major), update changelogs, generate release notes.'
---

# Auto-Increment Version Management Rules

## Overview

These rules ensure that every VSIX package build automatically increments the version and updates all related documentation, maintaining consistency across the project and providing proper release tracking.

## Core Rules

### 1. Automatic Version Increment on VSIX Build

**Rule**: Every VSIX package build MUST automatically increment the version number.

**Implementation**:

- The `package`, `package:optimized`, `package:minor`, and `package:major` npm scripts automatically call the version increment script
- Version increment happens BEFORE the actual packaging to ensure the new version is included in the VSIX
- Default increment type is `patch` unless otherwise specified

**Commands**:

```bash
npm run package           # Auto-increments patch version + builds VSIX
npm run package:optimized # Auto-increments patch version + optimized build
npm run package:minor     # Auto-increments minor version + optimized build
npm run package:major     # Auto-increments major version + optimized build
```

### 2. Documentation Synchronization

**Rule**: All version-related documentation MUST be updated automatically when version changes.

**Files Updated Automatically**:

- `package.json` - Main version field
- `CHANGELOG.md` - New version entry with template
- `.artifacts/releases/release_notes_X.X.X.md` - Release notes (generated from template)
- `.artifacts/releases/release_notes_template.md` - Canonical release notes template (MUST be used)
- `README.md` - Version references and VSIX download links
- `docs/getting-started.md` - Version references
- `docs/lancelot-installation-guide.md` - Installation instructions with new version
- `docs/ibmi/product_requirements_document.md` - Version references

**Pattern Matching**:
The script automatically finds and updates:

- `vX.X.X` patterns
- `version X.X.X` patterns
- `lancelot-X.X.X.vsix` patterns

### 3. Release Artifact Management

**Rule**: All VSIX packages are created in `.artifacts/vsix/` and release notes in `.artifacts/releases/`.

**Automatic Behavior**:

- VSIX packages are created in `.artifacts/vsix/` folder via `--out` flag in package scripts
- Release notes are created in `.artifacts/releases/` folder
- Any stray VSIX files accidentally created in root are automatically moved to `.artifacts/vsix/`
- Any stray release notes accidentally created in root or old VSIX/ folder are automatically moved to `.artifacts/releases/`
- Workspace root remains clean with only current development files

### 4. Release Notes Generation

**Rule**: Release notes MUST be generated from the canonical template and saved as Markdown files for every version.

- The canonical template file is `.artifacts/releases/release_notes_template.md`. When preparing a release, tooling or maintainers MUST copy/populate this template and produce a versioned markdown file.

**Format**: Release notes MUST be created as Markdown files (`.md` extension) for proper formatting, readability, and version control integration. Do NOT create release notes as `.txt` files.

**Template Includes**:

- Version and date information
- Sections for Features, Improvements, Bug Fixes, Removals
- Technical details sections for breaking changes, performance, security
- Installation instructions
- Documentation links

**Location**: `.artifacts/releases/release_notes_X.X.X.md`

**File Naming Convention**: `release_notes_X.X.X.md` (e.g., `release_notes_0.8.70.md`)

### 5. Changelog Management

**Rule**: CHANGELOG.md MUST be updated with new version entry.

**Format**:

```markdown
## [X.X.X] - YYYY-MM-DD

### Added

- Auto-incremented version for VSIX package build

### Changed

- [Add changes here]

### Fixed

- [Add fixes here]

### Removed

- [Add removed items here]
```

## Version Increment Scripts

### Standalone Version Management

For version changes without building VSIX:

```bash
npm run version:increment  # Patch increment (default)
npm run version:patch      # Patch increment (X.X.X+1)
npm run version:minor      # Minor increment (X.Y+1.0)
npm run version:major      # Major increment (X+1.0.0)
```

### Release Preparation

For preparing releases with documentation updates:

```bash
npm run release:prepare    # Patch increment + docs + bundle
npm run release:minor      # Minor increment + docs + bundle
npm run release:major      # Major increment + docs + bundle
```

## Manual Override Process

### When to Use Manual Process

- Hotfix releases requiring specific version numbers
- Reverting version changes
- Coordinated releases with external dependencies

### Manual Steps

1. **Update version manually in package.json**
2. **Run documentation sync**: `node scripts/increment-version.js --docs-only`
3. **Update release notes manually**
4. **Build without auto-increment**: `vsce package --skip-license`

## Quality Assurance

### Pre-Build Validation

The increment script validates:

- ✅ package.json exists and is valid JSON
- ✅ Current version follows semantic versioning
- ✅ Target directories exist or can be created
- ✅ Previous artifacts can be archived

### Post-Build Verification

After version increment, verify:

- ✅ package.json version is updated
- ✅ CHANGELOG.md has new entry
- ✅ Release notes template exists
- ✅ Documentation files reference new version
- ✅ Previous VSIX is archived

### Error Handling

The script provides clear error messages for:

- Invalid version types
- File system permission issues
- Malformed package.json
- Missing required files

## Integration with CI/CD

### GitHub Actions Integration

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
            - name: Archive artifacts
              uses: actions/upload-artifact@v3
              with:
                  name: vsix-package
                  path: '*.vsix'
```

### Local Development Integration

The version increment integrates with:

- VS Code extension development workflow
- Local testing and validation
- Git commit and push workflows

## Compliance and Governance

### Semantic Versioning Compliance

- **MAJOR**: Breaking changes, API incompatibilities
- **MINOR**: New features, backwards-compatible additions
- **PATCH**: Bug fixes, backwards-compatible changes

### Documentation Standards

All generated documentation follows:

- Markdown formatting standards
- Consistent date formats (YYYY-MM-DD)
- Structured section headers
- Clear installation instructions

### Audit Trail

Each version increment creates an audit trail:

- Git commit with version changes
- CHANGELOG entry with date
- Release notes with detailed changes
- Archived previous artifacts

## Troubleshooting

### Common Issues

**Script fails with permission errors**:

- Ensure write permissions to project directory
- Check if files are locked by other processes

**Version not updating in documentation**:

- Verify file exists and follows expected patterns
- Check if manual version references need updating

**Previous VSIX not archived**:

- Ensure VSIX directory exists
- Check for naming pattern matches

### Recovery Procedures

**Rollback version increment**:

1. Restore package.json from git: `git checkout -- package.json`
2. Remove generated artifacts: `rm -f .artifacts/releases/release_notes_*.txt`
3. Restore CHANGELOG.md: `git checkout -- CHANGELOG.md`

**Fix incomplete increment**:

1. Run script again: `node scripts/increment-version.js`
2. Manually update missed files
3. Commit all changes together

## Best Practices

### Development Workflow

1. **Feature Development**: Work on feature branches without version changes
2. **Pre-Release Testing**: Use `npm run release:prepare` to test complete flow
3. **Release Building**: Use `npm run package:optimized` for production releases
4. **Post-Release**: Update release notes with actual changes before distribution

### Documentation Maintenance

1. **Review Generated Templates**: Always customize release notes templates
2. **Update CHANGELOG**: Add meaningful descriptions to generated sections
3. **Validate Links**: Ensure all documentation links work after version updates
4. **Test Installation**: Verify installation instructions with new version

### Git Integration

1. **Commit Strategy**: Commit version increment separately from feature changes
2. **Tag Releases**: Tag releases with version numbers for easy reference
3. **Branch Protection**: Use protected branches to prevent manual version conflicts

## Implementation Notes

### Script Architecture

The `increment-version.js` script is designed as:

- **Modular**: Each function handles one responsibility
- **Testable**: Functions can be imported and unit tested
- **Extensible**: Easy to add new documentation files or patterns
- **Robust**: Comprehensive error handling and validation

### Performance Considerations

- Script completes in <2 seconds for typical projects
- Minimal I/O operations with batch file updates
- Efficient regex patterns for version matching
- Graceful handling of missing optional files

### Security Considerations

- No external network calls
- File operations limited to project directory
- Input validation for version type parameters
- Safe handling of existing files and directories

---

## Enforcement

These rules are enforced through:

- **Automated Scripts**: Version increment runs automatically with package commands
- **Code Review**: Manual verification during pull request reviews
- **CI/CD Pipeline**: Automated validation in continuous integration
- **Documentation**: Clear instructions and examples for all team members

**Violation of these rules may result in**:

- Inconsistent version tracking
- Broken documentation links
- Manual cleanup requirements
- Release deployment issues

**For questions or exceptions**, consult the development team lead or create an issue in the project repository.
