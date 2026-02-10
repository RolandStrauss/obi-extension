---
applyTo: '**'
description: 'Documentation folder organization: All Markdown and text documentation must be organized in docs/ with appropriate subfolders based on purpose and audience. GitHub convention files stay in root.'
---

# Documentation Organization Rule

## Core Principle

All Markdown (.md) and text (.txt) documentation files that do not belong in the repository root must be organized in the `docs/` folder with appropriate subfolders. This ensures:

- **Cleaner root directory** – Only essential GitHub convention files remain
- **Better discoverability** – Documentation organized by purpose and audience
- **Professional presentation** – Organized docs structure for GitHub Pages
- **Easier navigation** – Team members can quickly find relevant documentation

---

## Root-Level Exception Rules

**Files that MUST remain in repository root** (GitHub conventions):

- `README.md` – Repository overview (GitHub shows on repo home)
- `CHANGELOG.md` – Release history (GitHub displays prominently)
- `CODE_OF_CONDUCT.md` – GitHub looks for this in root
- `CONTRIBUTING.md` – GitHub looks for this in root
- `LICENSE.md` / `LICENSE` – Legal requirements, must be in root
- `SECURITY.md` – GitHub security policy (if applicable)
- `.github/` folder contents – GitHub configuration
- `package.json` – npm configuration (not documentation)

All other documentation must go in `docs/`.

---

## Folder Structure Best Practices

### Primary Categories

```
docs/
├── getting-started/           # Onboarding and quick-start guides
├── guides/                    # How-to guides and tutorials
├── development/               # Developer references and standards
├── architecture/              # System design and technical specs
│   ├── design/               # Design documents
│   ├── dependencies/         # Dependency analysis
│   └── api/                  # API documentation
├── features/                 # Feature-specific documentation
│   ├── lancelot-builder/     # Lancelot Builder / LBT docs
│   ├── gitlab-integration/   # GitLab integration
│   └── ibmi-integration/     # IBM i integration
├── troubleshooting/          # FAQ and troubleshooting
├── release/                  # Release planning and notes
└── archive/                  # Completed work, historical docs
    ├── issues/              # Archived issue summaries
    ├── sessions/            # Archived session reports
    └── completed/           # Completed feature documentation
```

### File Naming Conventions

- **Use descriptive names**: `QUICK-START.md` not `qs.md`
- **Date format** (if needed): `YYYY-MM-DD-description.md`
- **Uppercase for primary docs**: `QUICK-START.md`, `API-REFERENCE.md`
- **Lowercase for descriptive files**: `setup-guide.md`, `troubleshooting-faq.md`
- **Use hyphens** not underscores: `setup-guide.md` not `setup_guide.md`

---

## Organization Decision Matrix

### How to Categorize Documentation

| Content Type | Primary Folder | Example Files |
|--------------|----------------|---------------|
| Getting started, quick start | `getting-started/` | `QUICK-START.md`, `setup-guide.md` |
| Developer guides, standards | `development/` | `coding-standards.md`, `contribution-guidelines.md` |
| Architecture, design, specs | `architecture/` | `system-design.md`, `dependency-analysis.md` |
| Integration guides | `features/[feature]/` | `gitlab-integration-guide.md`, `ibmi-setup.md` |
| Feature documentation | `features/[feature]/` | `quick-reference.md`, `configuration-guide.md` |
| How-to guides, tutorials | `guides/` | `how-to-use-lancelot.md`, `deployment-guide.md` |
| Troubleshooting, FAQ | `troubleshooting/` | `FAQ.md`, `error-resolution.md` |
| Release information | `release/` | `release-notes.md`, `release-checklist.md` |
| Completed work, archives | `archive/` | Historical issues, completed sessions, obsolete docs |

---

## Implementation Guidelines

### When Adding New Documentation

1. **Determine Purpose**: Is this onboarding, development reference, architecture, feature-specific, or troubleshooting?
2. **Choose Folder**: Select appropriate primary folder from structure above
3. **Consider Audience**: Developers, users, maintainers, or contributors?
4. **Create Subfolder**: If needed, create descriptive subfolder (e.g., `features/lancelot-builder/`)
5. **Verify GitHub**: Isn't this CHANGELOG.md or README.md? If yes, keep in root
6. **Name Consistently**: Follow naming conventions (hyphens, descriptive, clear)

### When Organizing Existing Documentation

1. Read the file to understand its purpose
2. Identify the closest category
3. Move to appropriate `docs/[category]/` folder
4. Update any internal links (in README.md and other docs)
5. Verify that moving doesn't break external references

---

## Special Cases

### Session Reports & Issue Work

**Pattern**: Work summaries, session reports, issue closures after initial resolution
**Location**: `docs/archive/`
**Examples**:
- `archive/sessions/SESSION_SUMMARY_OBI_LBT_COMPLETE.md` – Session recap
- `archive/issues/ISSUE-552-COMPLETION-SUMMARY.txt` – Issue completion summary

**Rationale**: These are historical records valuable for archaeology but not current reference material

### Dependency & Analysis Docs

**Pattern**: Dependency trees, verification reports, analysis results
**Location**: `docs/architecture/dependencies/`
**Examples**:
- `dependencies/DEPENDENCIES_REFERENCE.md` – Dependency list
- `dependencies/DEPENDENCIES_VERIFICATION_REPORT.md` – Analysis results

**Rationale**: Technical reference valuable during architecture decisions

### Feature Integration Guides

**Pattern**: Integration documentation for major features (Lancelot Builder, GitLab, IBM i)
**Location**: `docs/features/[feature-name]/`
**Examples**:
- `features/lancelot-builder/OBI_MERGE_SUMMARY.md`
- `features/lancelot-builder/NAMING_QUICK_REFERENCE.md`
- `features/gitlab-integration/setup-guide.md`

**Rationale**: Keeps feature-specific docs grouped and discoverable

---

## Migration Path

When reorganizing existing documentation:

```
Root Directory (BEFORE)
├── QUICK-START.md
├── Copilot-Processing.md
├── DEPENDENCIES_REFERENCE.md
├── README.md (stays)
└── CHANGELOG.md (stays)

Organized Structure (AFTER)
├── docs/getting-started/QUICK-START.md
├── docs/development/COPILOT-PROCESSING.md
├── docs/architecture/dependencies/DEPENDENCIES_REFERENCE.md
├── README.md (stays in root)
└── CHANGELOG.md (stays in root)
```

---

## References & Updates

When moving documentation:

1. **Update README.md** – Links to moved documentation should still work (use relative paths)
2. **Cross-document links** – Update internal links using relative paths: `../features/lancelot-builder/`
3. **Table of contents** – If you maintain a docs index, update it
4. **Navigation in MD files** – Update breadcrumb-style nav if present

---

## Exceptions & Temporary Files

**Temporary/Development Files** (can stay in root):
- `.eslint-errors.txt` – Build artifact, not documentation
- `test-output.txt` – Build/test output
- `.tsc_output.txt` – TypeScript build output

**Why**: These are generated artifacts, not curated documentation

**Recommendation**: Add these to `.gitignore` after initial fix

---

## Enforcement & Governance

**Code Review Checklist**:
- ☐ All new `.md` and `.txt` documentation goes in `docs/` (except GitHub conventions)
- ☐ Root directory contains only: `README.md`, `CHANGELOG.md`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `LICENSE.md`
- ☐ Documentation in appropriate subfolder by purpose
- ☐ File follows naming conventions (lowercase with hyphens)
- ☐ Internal links updated to reflect new locations

---

## Maintenance Plan

### Quarterly Review

- Audit `docs/` structure for orphaned files
- Move files to `archive/` if superseded by newer documentation
- Update stale links across all documentation
- Verify GitHub Pages builds correctly (if applicable)

### Retirement Process

When documentation becomes obsolete:

1. **Mark as archived**: Move to `docs/archive/`
2. **Add deprecation notice**: "This documentation is superseded by [link to new doc]"
3. **Keep for reference**: Don't delete; maintain for historical context
4. **Cross-reference**: Link from new documentation to archival location

---

## Benefits

✅ **Professional Appearance** – Clean root directory, organized docs
✅ **Better Discoverability** – Logical folder structure aids navigation
✅ **GitHub Pages Ready** – `docs/` folder can power GitHub Pages
✅ **Easier Maintenance** – Grouped documentation easier to maintain
✅ **Clear Intent** – File location signals its purpose
✅ **Scalability** – Structure accommodates growth without clutter

---

**Authority**: Lancelot Extension Project Standards
**Effective Date**: 2026-02-09
**Status**: Active
**Owner**: Roland Strauss (GitHub Copilot Authority)
