---
name: Lancelot Folder Structure
description: Maintain clean project organization following Lancelot's folder structure standards. Use when user organizes files, cleans root folder, moves misplaced files, or mentions folder structure, project organization, or file placement.
---

# Lancelot Folder Structure & Organization

Maintain a clean, organized project structure following industry best practices and Lancelot conventions.

## Core Principle

**Keep the root folder clean with only essential files. Everything else goes in structured subdirectories.**

## Quick Reference

### ✅ Approved Root Files

```
project-root/
├── package.json              # Essential metadata
├── package-lock.json         # Dependency lock
├── tsconfig.json            # TypeScript config
├── tsconfig.test.json       # Test TypeScript config
├── eslint.config.js         # ESLint config
├── vite.config.ts           # Vite bundler config
├── README.md                # Project overview
├── CHANGELOG.md             # Version history
├── LICENSE.md               # License text
├── CODE_OF_CONDUCT.md       # Community guidelines
├── CONTRIBUTING.md          # Contribution guide
├── .gitignore               # Git ignore rules
├── .prettierrc              # Prettier config
├── .prettierignore          # Prettier ignore
├── .editorconfig            # Editor config
├── .github/                 # GitHub config & workflows
├── .vscode/                 # VS Code workspace settings
└── types/                   # TypeScript type definitions
```

### ❌ Files That Don't Belong in Root

```
❌ .ts, .js files              → src/
❌ .test.ts, .spec.ts files    → test/
❌ Documentation files         → docs/
❌ Scripts                     → scripts/
❌ Build outputs               → .artifacts/, out/
❌ Temporary files             → .agent_work/, temp/
❌ VSIX packages              → .artifacts/vsix/
❌ Release notes              → .artifacts/releases/
```

## Standard Directory Structure

### Source Code: `src/`

```
src/
├── extension.ts              # Extension entry point
├── core/                     # Shared services & utilities
│   ├── services/
│   ├── models/
│   └── utils/
├── authentication/           # Auth modules
├── gitlab/                   # GitLab integration
├── rest/                     # REST API client
├── ibmi/                     # IBM i integration
├── workspace/                # Workspace management
├── ui/                       # UI components & views
│   ├── webview/
│   └── treeview/
└── commands/                 # VS Code commands
```

**Rules:**
- Single entry point: `extension.ts`
- Shared code in `core/`
- Feature modules separated by concern
- UI code isolated from business logic

### Tests: `test/`

```
test/
├── unit/
│   ├── core/
│   ├── authentication/
│   └── gitlab/
├── integration/
│   ├── gitlab-integration.test.ts
│   └── ibmi-integration.test.ts
└── fixtures/
    └── mock-data.json
```

**Rules:**
- Mirror `src/` structure
- Use `*.test.ts` naming
- Group by test type (unit, integration)
- Include test fixtures

### Documentation: `docs/`

```
docs/
├── features/                 # Feature documentation
│   ├── README.md            # Features index
│   ├── oauth-auth.md
│   └── gitlab-integration.md
├── testing/                  # Test scenarios
│   ├── issue-192-test-scenarios.md
│   └── issue-328-test-scenarios.md
├── architecture/             # Architecture decisions
│   ├── architecture.md
│   └── decision-records/
├── development/              # Development guides
│   ├── getting-started.md
│   └── reports/
│       ├── Weekly/
│       └── Sprints/
├── api/                      # API documentation
└── ibmi/                     # IBM i specific docs
    └── product_requirements_document.md
```

**Rules:**
- Feature docs in `features/`
- Test scenarios in `testing/`
- Maintain index files
- Use kebab-case naming

### GitHub Configuration: `.github/`

```
.github/
├── workflows/                # GitHub Actions
│   ├── build.yml
│   ├── test.yml
│   └── release.yml
├── instructions/             # Copilot instructions
│   ├── lancelot.instructions.md
│   ├── typescript-5-es2022.instructions.md
│   └── security-and-owasp.instructions.md
└── skills/                   # Copilot Agent Skills
    ├── branch-naming-workflow/
    ├── vsix-packaging/
    └── test-scenario-documentation/
```

**Rules:**
- CI/CD in `workflows/`
- Copilot instructions in `instructions/`
- Agent Skills in `skills/`

### Build Artifacts: `.artifacts/`

```
.artifacts/
├── vsix/                     # VSIX packages
│   ├── lancelot-0.8.70.vsix
│   └── archive/
│       └── lancelot-0.8.69.vsix
└── releases/                 # Release notes
    ├── release_notes_0.8.70.md
    └── release_notes_template.md
```

**Rules:**
- All VSIX in `vsix/`
- Archive old versions
- Release notes in `releases/`
- Never commit to VCS

### Scripts: `scripts/`

```
scripts/
├── increment-version.js      # Version management
├── install-commit-hook.ps1   # Git hook installer
└── build-utils/
    └── clean-dist.js
```

**Rules:**
- Build & utility scripts only
- No source code
- Document script usage
- Platform-specific scripts noted

## File Organization Workflow

### Decision Tree

**Where does this file belong?**
- Source code (`.ts`, `.js`) → `src/` (shared logic → `src/core/`, feature → `src/{feature}/`, UI → `src/ui/`)
- Tests → `test/` (mirror `src/` structure)
- Documentation → `docs/` (features → `features/`, test scenarios → `testing/`, architecture → `architecture/`)
- Build scripts → `scripts/`
- Build output → `.artifacts/` (don't commit to VCS)
- Essential metadata → Root (must justify)

### Quick Fixes

**Find misplaced files:**
```bash
find . -maxdepth 1 -name "*.ts"        # Source in root
find . -maxdepth 1 -name "*.test.ts"   # Tests in root
find . -maxdepth 1 -name "*.vsix"      # VSIX in root
```

**Move to correct location:**
```bash
git mv misplaced-file.ts src/appropriate-folder/
grep -r "misplaced-file" src/ docs/  # Find references to update
```

**Clean temporary files:**
```bash
mkdir -p temp/ .agent_work/
mv *.log *.tmp temp/
echo -e "temp/\n.agent_work/" >> .gitignore
```

## Common Organization Mistakes

### Pattern: Source Code in Root

**❌ Bad:**
```
project-root/
├── authService.ts          # Should be in src/
└── utils.ts                # Should be in src/core/
```

**✅ Good:**
```
project-root/
└── src/
    ├── authentication/authService.ts
    └── core/utils.ts
```

**Other Common Mistakes:**
- **Tests mixed with source** → Separate `test/` directory mirroring `src/` structure
- **Build artifacts in repo** → Use `.artifacts/` folder, add to `.gitignore`
- **Documentation scattered** → Organize in `docs/features/`, `docs/testing/`, `docs/architecture/`
- **Scripts in root** → Move to `scripts/` directory with README
- **Temporary files committed** → Use `temp/` folder, add to `.gitignore`

## Benefits of Clean Structure

### 1. Clarity
- Contributors immediately understand organization
- Essential files easy to find
- Clear separation of concerns

### 2. Discoverability
- Standard locations for common files
- Predictable structure
- Reduced cognitive load

### 3. Professionalism
- Follows industry standards
- Shows attention to detail
- Easier to onboard new contributors

### 4. Maintainability
- Easier to manage dependencies
- Clear configuration hierarchy
- Simplified build processes

### 5. Scalability
- Structure supports growth
- Clear extension points
- Room for new features

### 6. Automation
- Tools work predictably
- Build scripts more reliable
- CI/CD easier to configure

## Validation Checklist

Before committing, verify:

- [ ] No source files (`.ts`, `.js`) in root
- [ ] No test files in root
- [ ] No build outputs in root
- [ ] No temporary files committed
- [ ] All docs in `docs/`
- [ ] All tests in `test/`
- [ ] All artifacts in `.artifacts/`
- [ ] All scripts in `scripts/`
- [ ] `.gitignore` up to date
- [ ] Build configs updated for new files

## Automated Cleanup

### Pre-commit Hook

**File:** `.git/hooks/pre-commit`

Check for:
- TypeScript files in root: `find . -maxdepth 1 -name "*.ts"`
- VSIX files in root: `find . -maxdepth 1 -name "*.vsix"`
- Exit with error message if found

### CI Validation

**GitHub Action:** `.github/workflows/validate-structure.yml`

Validate on push/PR:
- Fail if `.ts` files in root (except `*.config.ts`)
- Fail if `.vsix` files in root
- Fail if temporary files committed (`*.log`, `*.tmp`)

**Pattern:** Run validation checks in CI to catch structure violations before merge.

## Migration Guide

### Quick Cleanup Commands

```bash
# 1. Create directories
mkdir -p src/core test/unit docs/features .artifacts/vsix scripts

# 2. Move misplaced files
git mv *.ts src/           # Source files
git mv *.test.ts test/     # Test files
git mv *.md docs/          # Docs (except README, CHANGELOG, LICENSE, etc.)
git mv *.ps1 *.sh scripts/ # Scripts

# 3. Update .gitignore
echo -e "out/\ndist/\n*.vsix\n.artifacts/\ntemp/\n.agent_work/\n*.log" >> .gitignore

# 4. Find and fix import paths
grep -r "import.*from './" src/  # Identify needed changes
# Update paths: './' → '../', './file' → '../file'

# 5. Commit reorganization
git add .
git commit -m "chore: reorganize project structure per Lancelot standards"
```

**Note:** After moving files, update `tsconfig.json`, `eslint.config.js`, and other build configs to reflect new paths.

## References

- Lancelot Instructions: `.github/instructions/lancelot.instructions.md` (Rules #23-30)
- VS Code Extension Guidelines: https://code.visualstudio.com/api/references/extension-guidelines
- TypeScript Project Structure: https://www.typescriptlang.org/docs/handbook/project-references.html
