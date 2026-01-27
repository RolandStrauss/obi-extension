---
name: Lancelot Folder Structure
description: Maintain clean project organization following Lancelot's folder structure standards
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

### Adding New Files

**Decision Tree:**

```
Is it source code?
├─ Yes → src/
│  ├─ Shared logic? → src/core/
│  ├─ Feature module? → src/{feature}/
│  └─ UI component? → src/ui/
│
├─ Test file? → test/
│  └─ Mirror src/ structure
│
├─ Documentation? → docs/
│  ├─ Feature? → docs/features/
│  ├─ Test scenario? → docs/testing/
│  └─ Architecture? → docs/architecture/
│
├─ Build script? → scripts/
│
├─ Build output? → .artifacts/ (don't commit)
│
└─ Essential metadata? → Root (must justify)
```

### Migrating Misplaced Files

**Step 1: Identify misplaced files**
```bash
# Find TypeScript files in root
find . -maxdepth 1 -name "*.ts"

# Find test files in root
find . -maxdepth 1 -name "*.test.ts"

# Find doc files in root
find . -maxdepth 1 -name "*.md" -not -name "README.md" -not -name "CHANGELOG.md"
```

**Step 2: Move to correct location**
```bash
# Move source files
mv root-file.ts src/

# Move test files
mv root-test.test.ts test/

# Move docs
mv random-doc.md docs/
```

**Step 3: Update references**
```bash
# Update import paths in code
grep -r "from './root-file'" src/
# Replace with: from '../root-file'

# Update documentation links
grep -r "root-file.ts" docs/
```

**Step 4: Update build configs**
```json
// Update tsconfig.json, eslint.config.js, etc.
// Verify file is in correct include/exclude paths
```

### Cleaning Temporary Files

**Identify temporary files:**
```bash
# Development artifacts
ls -la *.log *.tmp *.cache

# Build outputs
ls -la out/ dist/ build/

# VS Code temporary files
ls -la .vscode-test/

# Test outputs
ls -la coverage/ test-results/
```

**Move to proper location:**
```bash
# Create temp directory if needed
mkdir -p temp/
mkdir -p .agent_work/

# Move temporary files
mv *.log temp/
mv *.tmp temp/

# Ensure ignored
echo "temp/" >> .gitignore
echo ".agent_work/" >> .gitignore
```

## Common Organization Mistakes

### Mistake 1: Source Code in Root

**❌ Bad:**
```
project-root/
├── authService.ts          # ← Should be in src/
├── gitlabClient.ts         # ← Should be in src/
└── utils.ts                # ← Should be in src/core/
```

**✅ Good:**
```
project-root/
└── src/
    ├── authentication/
    │   └── authService.ts
    ├── gitlab/
    │   └── gitlabClient.ts
    └── core/
        └── utils.ts
```

### Mistake 2: Tests Mixed with Source

**❌ Bad:**
```
src/
├── authService.ts
├── authService.test.ts     # ← Should be in test/
└── gitlabClient.ts
    └── gitlabClient.test.ts # ← Should be in test/
```

**✅ Good:**
```
src/
├── authService.ts
└── gitlabClient.ts

test/
├── authService.test.ts
└── gitlabClient.test.ts
```

### Mistake 3: Build Artifacts in Repository

**❌ Bad:**
```
project-root/
├── lancelot-0.8.70.vsix    # ← Should be in .artifacts/vsix/
├── out/                     # ← Should be ignored
└── dist/                    # ← Should be ignored
```

**✅ Good:**
```
project-root/
└── .artifacts/
    └── vsix/
        └── lancelot-0.8.70.vsix

.gitignore:
out/
dist/
.artifacts/
```

### Mistake 4: Documentation Scattered

**❌ Bad:**
```
project-root/
├── auth-docs.md            # ← Should be in docs/features/
├── test-plan.md            # ← Should be in docs/testing/
└── ARCHITECTURE.md         # ← Should be in docs/architecture/
```

**✅ Good:**
```
docs/
├── features/
│   └── oauth-authentication.md
├── testing/
│   └── authentication-test-scenarios.md
└── architecture/
    └── architecture.md
```

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

```bash
#!/bin/bash

# Check for misplaced files
if find . -maxdepth 1 -name "*.ts" -o -name "*.test.ts" | grep -q .; then
    echo "ERROR: TypeScript files found in root"
    echo "Move source files to src/, test files to test/"
    exit 1
fi

# Check for VSIX in root
if find . -maxdepth 1 -name "*.vsix" | grep -q .; then
    echo "ERROR: VSIX file found in root"
    echo "VSIX files belong in .artifacts/vsix/"
    exit 1
fi

exit 0
```

### CI Validation

**GitHub Action:** `.github/workflows/validate-structure.yml`

```yaml
name: Validate Project Structure

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Check for misplaced files
        run: |
          # Fail if .ts files in root
          if find . -maxdepth 1 -name "*.ts" -not -name "*.config.ts"; then
            echo "ERROR: TypeScript files in root"
            exit 1
          fi
          
          # Fail if VSIX in root
          if find . -maxdepth 1 -name "*.vsix"; then
            echo "ERROR: VSIX in root"
            exit 1
          fi
```

## Migration Guide

### Step-by-Step Cleanup

**1. Audit Current Structure**
```bash
# List all root files
ls -la | grep -v "^d"

# Compare to approved list
```

**2. Create Missing Directories**
```bash
mkdir -p src/core
mkdir -p test/unit
mkdir -p docs/features
mkdir -p .artifacts/vsix
mkdir -p scripts
```

**3. Move Misplaced Files**
```bash
# Source files
git mv *.ts src/

# Test files
git mv *.test.ts test/

# Documentation
git mv *.md docs/ (except README, CHANGELOG, etc.)

# Scripts
git mv *.ps1 scripts/
git mv *.sh scripts/
```

**4. Update References**
```bash
# Find and fix import paths
grep -r "import.*from './" src/

# Update build configs
vim tsconfig.json
vim eslint.config.js
```

**5. Update .gitignore**
```
# Build outputs
out/
dist/
*.vsix

# Artifacts
.artifacts/

# Temporary
temp/
.agent_work/
*.log
*.tmp
```

**6. Commit Changes**
```bash
git add .
git commit -m "chore: reorganize project structure

- Move source files to src/
- Move test files to test/
- Move docs to docs/
- Update import paths
- Update .gitignore"
```

## References

- Lancelot Instructions: `.github/instructions/lancelot.instructions.md` (Rules #23-30)
- VS Code Extension Guidelines: https://code.visualstudio.com/api/references/extension-guidelines
- TypeScript Project Structure: https://www.typescriptlang.org/docs/handbook/project-references.html
