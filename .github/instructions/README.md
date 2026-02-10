# Lancelot Instruction Files Reference

This directory contains curated, project-specific instruction files that guide GitHub Copilot in understanding and working effectively with the Lancelot VS Code extension. All files have been streamlined to remove boilerplate and focus exclusively on Lancelot-relevant guidance.

## Quick Navigation

### 🎯 Start Here
- **[lancelot.instructions.md](lancelot.instructions.md)** — Primary project authority. Read this first for core principles, architecture overview, and development workflow.
- **[copilot-instructions.md](../copilot-instructions.md)** — Quick reference for Copilot. Entry point for fast context.

### 🏗️ Architecture & Design
- **[vscode-extension-architecture.instructions.md](vscode-extension-architecture.instructions.md)** — Service inventory (8 layers), activation lifecycle, deployment targets, critical data flows.
- **[copilot-it-architecture.instructions.md](copilot-it-architecture.instructions.md)** — Architectural design patterns, DevSecOps practices, hybrid cloud strategies, scalability guidelines.

### 🔍 Code Review & Quality
- **[copilot-code-review-checklist.instructions.md](copilot-code-review-checklist.instructions.md)** — Domain-specific code review criteria (50+ checkpoints) covering VS Code APIs, IBM i integration, GitLab workflows, Jira automation, accessibility, and performance.
- **[typescript-5-es2022.instructions.md](typescript-5-es2022.instructions.md)** — TypeScript strict typing standards, type safety enforcement, no-`any` rules.

### 🔐 Security & Compliance
- **[security-and-owasp.instructions.md](security-and-owasp.instructions.md)** — Lancelot-specific threat model covering 6 critical threats: GitLab token exposure, IBM i credentials, Jira API tokens, CL command injection, SSRF, and data leakage.

### 🌍 Integration Patterns
- **[copilot-jira-integration.instructions.md](copilot-jira-integration.instructions.md)** — Jira workflow automation, agile planning, issue tracking, end-to-end traceability with GitLab/GitHub.
- **[ibmi-integration-testing.instructions.md](ibmi-integration-testing.instructions.md)** — IBM i testing strategy, safe SSH testing patterns, environment setup, RPGLE/SQL development.

### 🎨 Localization & i18n
- **[i18n.instructions.md](i18n.instructions.md)** — i18n implementation for VS Code extensions, message key patterns, locale file management, proper pluralization.

### 📊 Performance & Operations
- **[copilot-performance-targets.instructions.md](copilot-performance-targets.instructions.md)** — Performance budgets (activation <2s, VSIX <5MB), SLA targets (GitLab API <1s p95), memory profiles, regression detection.
- **[auto-version-increment.instructions.md](auto-version-increment.instructions.md)** — VSIX release automation, version incrementing (patch/minor/major), changelog synchronization.
- **[commercialization-readiness.instructions.md](commercialization-readiness.instructions.md)** — Marketplace packaging, metadata, VSIX size optimization, documentation standards.

### 🧠 Memory & Meta
- **[memory-bank.instructions.md](memory-bank.instructions.md)** — Memory bank workflow, task management, session continuity for Copilot across resets.
- **[taming-copilot.instructions.md](taming-copilot.instructions.md)** — Copilot behavior directives: no boilerplate, surgical edits, direct user intent priority.

### 🧪 Testing
- **[playwright-typescript.instructions.md](playwright-typescript.instructions.md)** — Playwright e2e test patterns, locators, assertions, test organization, quality checklists.

---

## File Organization by Category

### Core Governance (2 files)
| File | Focus | Size |
|------|-------|------|
| lancelot.instructions.md | Primary authority; 90 core principles | ~2,000 lines |
| taming-copilot.instructions.md | Copilot behavior; prevent boilerplate | ~100 lines |

### Architecture & Patterns (2 files)
| File | Focus | Size |
|------|-------|------|
| vscode-extension-architecture.instructions.md | Service layers, activation, data flows | 188 lines |
| copilot-it-architecture.instructions.md | Design patterns, DevSecOps, scalability | 396 lines |

### Code Quality (2 files)
| File | Focus | Size |
|------|-------|------|
| copilot-code-review-checklist.instructions.md | 50+ code review checkpoints (VS Code, IBM i, GitLab, Jira, a11y) | 492 lines |
| typescript-5-es2022.instructions.md | Strict typing, type safety, no-`any` enforcement | ~200 lines |

### Security & Compliance (1 file)
| File | Focus | Size |
|------|-------|------|
| security-and-owasp.instructions.md | 6 threat models specific to GitLab, IBM i, Jira | 290 lines |

### Integration Guidance (2 files)
| File | Focus | Size |
|------|-------|------|
| copilot-jira-integration.instructions.md | Jira workflows, agile planning, traceability | ~250 lines |
| ibmi-integration-testing.instructions.md | IBM i testing, safe patterns, SSH usage | ~200 lines |

### Localization (1 file)
| File | Focus | Size |
|------|-------|------|
| i18n.instructions.md | VS Code i18n patterns, message keys, locale files | ~150 lines |

### Operations & Release (3 files)
| File | Focus | Size |
|------|-------|------|
| copilot-performance-targets.instructions.md | Performance budgets, SLA targets, metrics | 340 lines |
| auto-version-increment.instructions.md | Release automation, version management | 200 lines |
| commercialization-readiness.instructions.md | Marketplace packaging, VSIX optimization | 155 lines |

### Testing (1 file)
| File | Focus | Size |
|------|-------|------|
| playwright-typescript.instructions.md | Playwright e2e patterns, quality checks | ~130 lines |

### Continuity (1 file)
| File | Focus | Size |
|------|-------|------|
| memory-bank.instructions.md | Memory bank structure, task management | ~250 lines |

---

## File Dependencies & Reading Order

```
START HERE:
  ↓
lancelot.instructions.md (core authority)
  ├─→ vscode-extension-architecture.instructions.md (understand service layers)
  ├─→ copilot-code-review-checklist.instructions.md (apply during code review)
  ├─→ typescript-5-es2022.instructions.md (enforce during implementation)
  └─→ security-and-owasp.instructions.md (apply security threat model)

FOR FEATURES:
  copilot-it-architecture.instructions.md (design patterns)
    └─→ copilot-jira-integration.instructions.md (if Jira integration)
    └─→ ibmi-integration-testing.instructions.md (if IBM i testing)

FOR RELEASE:
  auto-version-increment.instructions.md (version management)
    └─→ commercialization-readiness.instructions.md (pre-publish checklist)
    └─→ copilot-performance-targets.instructions.md (validate performance)

FOR QUALITY:
  copilot-performance-targets.instructions.md (performance budgets)
  playwright-typescript.instructions.md (e2e testing)
  i18n.instructions.md (localization)

FOR WORKFLOW:
  memory-bank.instructions.md (task tracking)
  taming-copilot.instructions.md (Copilot behavior)
```

---

## Usage Patterns

### When Implementing a Feature
1. Start with **lancelot.instructions.md** (core principles)
2. Review **vscode-extension-architecture.instructions.md** (where does it fit?)
3. Check **copilot-it-architecture.instructions.md** (design patterns)
4. Reference integration files if needed:
   - **copilot-jira-integration.instructions.md** (if Jira integration)
   - **ibmi-integration-testing.instructions.md** (if IBM i)

### When Writing Code
1. Apply **typescript-5-es2022.instructions.md** (type safety)
2. Ensure **security-and-owasp.instructions.md** compliance (threat model)
3. Check **copilot-performance-targets.instructions.md** (performance budgets)
4. Write tests per **playwright-typescript.instructions.md**

### When Reviewing Code
1. Use **copilot-code-review-checklist.instructions.md** (50+ checkpoints)
2. Verify **security-and-owasp.instructions.md** (threat model compliance)
3. Check **copilot-performance-targets.instructions.md** (SLA targets)
4. Ensure **i18n.instructions.md** compliance (localization)

### When Preparing a Release
1. Run **copilot-performance-targets.instructions.md** (performance validation)
2. Update version per **auto-version-increment.instructions.md**
3. Verify **commercialization-readiness.instructions.md** (marketplace checklist)
4. Update documentation per **lancelot.instructions.md**

---

## Summary

| Metric | Value |
|--------|-------|
| **Active instruction files** | 15 (boilerplate removed) |
| **Total lines of guidance** | ~3,000 |
| **Core authority** | lancelot.instructions.md |
| **Primary use case** | Copilot context for VS Code extension development |
| **Focus** | 100% Lancelot-specific (no generic boilerplate) |

All files have been streamlined to maximize token efficiency while preserving critical domain knowledge. Boilerplate and non-project-specific guidance has been moved to `instructions-unused/`.

---

**Last Updated**: 2026-02-06  
**Maintained by**: GitHub Copilot  
**Authority**: See lancelot.instructions.md
