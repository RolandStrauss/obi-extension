---
name: Instruction File Standards
description: Standards for creating and maintaining .instructions.md files with proper frontmatter and structure. Use when user creates or edits instruction files, mentions .instructions.md, or asks about instruction file format.
---

# Instruction File Standards

Comprehensive guidelines for creating, maintaining, and organizing `.instructions.md` files that provide guidance to GitHub Copilot and AI assistants.

## Quick Reference

**File Naming:**
- Use pattern: `<topic>.instructions.md`
- Use kebab-case: `typescript-strict-typing.instructions.md`
- Store in `.github/instructions/` directory

**Required Frontmatter:**
```yaml
---
applyTo: '**/*.ts'
description: 'Clear one-line description of what this instructs'
---
```

**Optional Frontmatter Fields:**
```yaml
excludeAgent: ['coding-agent']  # Exclude from specific agents
```

**Content Structure:**
1. Title (`# Topic Instructions`)
2. Overview/Introduction
3. Core rules and guidelines
4. Examples (Good ✅ vs Bad ❌)
5. Validation checklist
6. References to related files

## When This Skill Applies

Use this skill when:
- Creating new instruction files
- Updating existing instruction files
- Organizing instruction file hierarchy
- Reviewing instruction file PRs
- Maintaining DRY principle across instructions

## Detailed Usage

### File Naming Convention

**Pattern:** `<topic>.instructions.md`

**Examples:**
- ✅ `typescript-5-es2022.instructions.md`
- ✅ `security-and-owasp.instructions.md`
- ✅ `performance-optimization.instructions.md`
- ✅ `playwright-typescript.instructions.md`
- ❌ `typescript.md` (missing `.instructions` suffix)
- ❌ `TypeScript_Guide.instructions.md` (not kebab-case)
- ❌ `ts-help.instructions.md` (vague topic name)

### Required Frontmatter

All instruction files **must** include YAML frontmatter:

```yaml
---
applyTo: '<glob pattern>'
description: 'One-line description'
---
```

**`applyTo` Field:**
Specifies which files this instruction applies to using glob patterns:

```yaml
# Apply to all TypeScript files
applyTo: '**/*.ts'

# Apply to all files
applyTo: '**'

# Apply to multiple file types
applyTo: '**/*.{ts,js}'

# Apply to specific directories
applyTo: 'src/**/*.ts'

# Apply to specific files
applyTo: '**/SKILL.md'
```

**`description` Field:**
Clear, concise one-line description wrapped in single quotes:

```yaml
# ✅ Good: Specific and clear
description: 'Enforce strict typing standards avoiding any type in TypeScript'

# ✅ Good: Actionable and clear
description: 'Security guidelines based on OWASP Top 10 for all languages'

# ❌ Bad: Too vague
description: 'TypeScript stuff'

# ❌ Bad: Multiple sentences
description: 'TypeScript guidelines. Use strict mode. Avoid any type.'
```

### Optional Frontmatter Fields

**`excludeAgent`:**
Exclude instruction from specific agents:

```yaml
---
applyTo: '**/*.ts'
description: 'Advanced TypeScript patterns'
excludeAgent: ['coding-agent', 'junior-agent']
---
```

### Content Structure Template

```markdown
---
applyTo: '<pattern>'
description: 'One-line description'
---

# Topic Instructions

Brief overview of what this instruction file covers (2-3 sentences).

## Core Principles

High-level principles that guide all rules:
- Principle 1: Explanation
- Principle 2: Explanation
- Principle 3: Explanation

## Rules and Guidelines

### Rule 1: [Clear Rule Title]

Detailed explanation of the rule.

**❌ Bad Example:**
\`\`\`typescript
// Code showing what NOT to do
function badExample(data: any) {
    return data;
}
\`\`\`

**✅ Good Example:**
\`\`\`typescript
// Code showing correct approach
interface Data {
    value: string;
}

function goodExample(data: Data) {
    return data;
}
\`\`\`

### Rule 2: [Another Rule]

[Repeat pattern: explanation → bad example → good example]

## Validation Checklist

Before applying this instruction, verify:
- [ ] Checklist item 1
- [ ] Checklist item 2
- [ ] Checklist item 3

## Common Mistakes

### Mistake 1: [Description]

❌ Bad approach with explanation
✅ Correct approach with explanation

## Troubleshooting

**Issue:** [Common problem]
**Solution:** [How to resolve]

## References

- Related instruction file: `.github/instructions/related.instructions.md`
- External documentation: [Link with description]
- Project file: `path/to/relevant/file.ts`
```

### DRY Principle - Referencing Other Files

**Don't Duplicate:** Reference other instruction files instead of repeating content.

**❌ Bad (Duplicating content):**
```markdown
# security-guidelines.instructions.md
## SQL Injection Prevention
[500 lines of SQL injection guidance]

# api-security.instructions.md
## SQL Injection Prevention
[Same 500 lines duplicated]
```

**✅ Good (Referencing):**
```markdown
# security-guidelines.instructions.md
## SQL Injection Prevention
[500 lines of detailed guidance]

# api-security.instructions.md
## Database Security
For SQL injection prevention, see `.github/instructions/security-guidelines.instructions.md`.

Additional API-specific guidance:
- Use parameterized queries in ORM
- Validate input at API layer
```

### Instruction File Hierarchy

**High Priority (Specific):**
1. Project-specific: `lancelot.instructions.md`
2. Feature-specific: `webview-parity.instructions.md`
3. Tool-specific: `playwright-typescript.instructions.md`

**Medium Priority (Domain):**
4. Language-specific: `typescript-5-es2022.instructions.md`
5. Framework-specific: `react-best-practices.instructions.md`

**Low Priority (General):**
6. General guidelines: `security-and-owasp.instructions.md`
7. Universal standards: `code-quality.instructions.md`

**Document hierarchy in parent instruction file:**
```markdown
## Instruction File Hierarchy

**Priority Order** (highest to lowest):

1. `lancelot.instructions.md` - Primary source for Lancelot development
2. Domain-specific instructions (TypeScript, Security, Performance)
3. This file - General workspace guidance only
```

### Cross-Referencing Pattern

**Within Instruction Files:**
```markdown
For TypeScript-specific rules, see `instructions/typescript-5-es2022.instructions.md`.

See `.github/skills/changelog-management/SKILL.md` for changelog format.
```

**Within Agent Skills:**
```markdown
## References

- See `instructions/security-and-owasp.instructions.md` for security guidelines
- See `.github/skills/test-scenario-documentation/SKILL.md` for testing standards
```

### Special Instruction Types

**Chat Mode Instructions (`*.chatmode.md`):**
```yaml
---
description: 'Purpose of this chat mode'
---
# (No applyTo field needed for chat modes)
```

**Prompt Instructions (`*.prompt.md`):**
```yaml
---
mode: 'agent'  # or 'ask'
description: 'Purpose of this prompt'
---
```

## Validation Checklist

Before committing instruction file:
- [ ] File name follows `<topic>.instructions.md` pattern
- [ ] File name uses kebab-case
- [ ] Frontmatter includes `applyTo` field
- [ ] Frontmatter includes `description` field (single quotes)
- [ ] Description is one clear sentence
- [ ] `applyTo` glob pattern is correct and specific
- [ ] Content follows structure template
- [ ] Examples use ❌/✅ for bad/good comparisons
- [ ] No content duplicated from other instruction files
- [ ] References other files instead of duplicating
- [ ] Cross-references use correct paths
- [ ] File is stored in `.github/instructions/` directory

## Organizing Multiple Instructions

**Single-Responsibility:** Each file covers one topic area.

**Example Organization:**
```
.github/instructions/
├── lancelot.instructions.md (project-specific, highest priority)
├── typescript-5-es2022.instructions.md (language rules)
├── security-and-owasp.instructions.md (security practices)
├── performance-optimization.instructions.md (performance patterns)
├── testing/
│   ├── playwright-typescript.instructions.md
│   ├── mocha-chai.instructions.md
│   └── test-coverage.instructions.md
├── code-quality/
│   ├── self-explanatory-code-commenting.instructions.md
│   └── code-review-checklist.instructions.md
└── process/
    ├── memory-bank.instructions.md
    └── copilot-thought-logging.instructions.md
```

## Updating Instruction Index

When creating new instruction files, update the parent instruction file's list:

**In `copilot-instructions.md`:**
```markdown
**Core Instructions** (reference as needed):

- **Project**: `instructions/lancelot.instructions.md`
- **Language**: `instructions/typescript-5-es2022.instructions.md`
- **Security**: `instructions/security-and-owasp.instructions.md`
- **NEW**: `instructions/your-new-topic.instructions.md`
```

## Common Mistakes and Fixes

**Mistake 1: Missing frontmatter**

❌ Bad:
```markdown
# TypeScript Instructions

Always use strict mode...
```

✅ Good:
```markdown
---
applyTo: '**/*.ts'
description: 'TypeScript strict mode and typing guidelines'
---

# TypeScript Instructions

Always use strict mode...
```

**Mistake 2: Vague description**

❌ Bad:
```yaml
description: 'Instructions for code'
```

✅ Good:
```yaml
description: 'Enforce OWASP Top 10 security practices for all code'
```

**Mistake 3: Wrong file location**

❌ Bad:
```
/docs/typescript-guide.instructions.md
/src/instructions/security.instructions.md
```

✅ Good:
```
/.github/instructions/typescript-5-es2022.instructions.md
/.github/instructions/security-and-owasp.instructions.md
```

**Mistake 4: Duplicating content**

❌ Bad: Copying 500 lines from another instruction file

✅ Good:
```markdown
For security practices, see `instructions/security-and-owasp.instructions.md`.
This file adds project-specific security configurations:
- [Project-specific rules]
```

## Tools and Resources

**Validation:**
- Use YAML linter for frontmatter validation
- Check glob patterns with `globby` or `minimatch`
- Validate markdown with `markdownlint`

**Templates:**
- Use the Content Structure Template above as starting point
- Copy frontmatter from similar existing instruction files

**Discovery:**
- GitHub Copilot automatically discovers `.instructions.md` files
- Files in `.github/instructions/` are prioritized

**References:**
- GitHub Copilot Custom Instructions: https://code.visualstudio.com/docs/copilot/customization/custom-instructions
- YAML Specification: https://yaml.org/spec/
- Glob Pattern Guide: https://github.com/isaacs/node-glob#glob-primer

## Related Skills

- See `.github/skills/markdown-guidelines/SKILL.md` for markdown formatting standards
- See `.github/skills/lancelot-folder-structure/SKILL.md` for where to place instruction files
- See `copilot-instructions.md` for instruction file hierarchy
