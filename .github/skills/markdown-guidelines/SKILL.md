---
name: markdown-guidelines
description: Standards for creating and maintaining Markdown documentation including chatmode files, prompt files, and instruction files with YAML frontmatter requirements. Use when the user is creating or editing Markdown documentation, chatmode files, prompt files, or instruction files.
---

# Markdown Documentation Guidelines

Standards for creating and maintaining Markdown documentation, including special file types like chatmode, prompt, and instruction files.

## When to Use This Skill

- User is creating/editing Markdown files
- User mentions documentation standards
- User wants to create chatmode files
- User wants to create prompt files
- User wants to create instruction files
- User mentions file-specific guidelines
- User references YAML frontmatter

## File Types

### 1. General Markdown Files (*.md)

**Purpose:** Documentation, guides, READMEs, changelogs

**Structure:**
```markdown
# Document Title

Brief introduction or summary.

## Section 1

Content...

## Section 2

Content...
```

**Special Rule - MD012 Lint:**
When markdown-lint reports MD012 (multiple consecutive blank lines), **delete** the offending line. Do not reformat surrounding content.

### 2. Chatmode Files (*.chatmode.md)

**Purpose:** Define custom chat modes for GitHub Copilot

**Required Frontmatter:**
```yaml
---
description: 'Non-empty description in single quotes'
model: 'gpt-4'  # Optional but strongly encouraged
---
```

**Example:**
```yaml
---
description: 'Code review assistant that checks security, performance, and best practices'
model: 'claude-3.5-sonnet'
---

# Code Review Mode

You are an expert code reviewer...
```

**Requirements:**
- [ ] Include YAML frontmatter
- [ ] Add non-empty `description` field (single quotes)
- [ ] Use lower-case, hyphen-separated filenames
- [ ] Specify `model` for optimization (optional but recommended)

### 3. Prompt Files (*.prompt.md)

**Purpose:** Reusable prompt templates for GitHub Copilot

**Required Frontmatter:**
```yaml
---
description: 'Non-empty description in single quotes'
mode: 'agent'  # or 'ask'
model: 'gpt-4'  # Optional but strongly encouraged
---
```

**Modes:**
- `agent` - For autonomous task execution
- `ask` - For question answering

**Example:**
```yaml
---
description: 'Generate comprehensive test suite for a given file'
mode: 'agent'
model: 'gpt-4'
---

Generate a comprehensive test suite for the following file:

{{file}}

Include:
- Unit tests for all public methods
- Edge case coverage
- Error handling tests
```

**Requirements:**
- [ ] Include YAML frontmatter
- [ ] Add non-empty `description` field (single quotes)
- [ ] Specify `mode` field (`agent` or `ask`)
- [ ] Use lower-case, hyphen-separated filenames
- [ ] Specify `model` for optimization (optional but recommended)

### 4. Instruction Files (*.instructions.md)

**Purpose:** Persistent instructions for GitHub Copilot across sessions

**Required Frontmatter:**
```yaml
---
description: 'Non-empty description in single quotes'
applyTo: '**.ts, **.js'  # File patterns
excludeAgent: ['coding-agent']  # Optional
model: 'gpt-4'  # Optional but strongly encouraged
---
```

**Example:**
```yaml
---
description: 'TypeScript coding standards and best practices'
applyTo: '**.ts'
model: 'claude-3.5-sonnet'
---

# TypeScript Coding Standards

When writing TypeScript code:

1. Use strict typing
2. Avoid `any` type
3. Use modern ES2022 features
```

**applyTo Patterns:**
- `'**'` - All files
- `'**.ts'` - All TypeScript files
- `'src/**'` - All files in src/
- `'**.ts, **.tsx'` - Multiple patterns

**Requirements:**
- [ ] Include YAML frontmatter
- [ ] Add non-empty `description` field (single quotes)
- [ ] Specify `applyTo` field with file patterns
- [ ] Use lower-case, hyphen-separated filenames
- [ ] Specify `model` for optimization (optional but recommended)
- [ ] Add `excludeAgent` if needed (optional)

## Naming Conventions

### File Names

**Format:** `lower-case-with-hyphens`

**✅ Good:**
- `code-review-checklist.md`
- `typescript-best-practices.instructions.md`
- `test-generation.prompt.md`
- `review-mode.chatmode.md`

**❌ Bad:**
- `Code Review Checklist.md` (spaces)
- `TypeScript_BestPractices.md` (underscores, caps)
- `testGeneration.md` (camelCase)

### Headings

Use proper heading hierarchy:

```markdown
# H1 - Document Title (one per file)

## H2 - Main Section

### H3 - Subsection

#### H4 - Minor Section
```

## Frontmatter Best Practices

### Description Field

**Purpose:** Explains what the file does and when to use it

**Best Practices:**
- Write for AI agents (they read this first)
- Include keywords for discoverability
- Mention specific use cases
- Keep under 200 characters

**Examples:**

**Good:**
```yaml
description: 'Validates TypeScript code against strict typing rules. Use when reviewing or generating TypeScript code.'
```

**Bad:**
```yaml
description: 'TypeScript stuff'  # Too vague
description: "Some rules"  # Use single quotes
description: ''  # Empty
```

### Model Field

**Purpose:** Specifies which AI model to use

**Recommended Models:**
- `gpt-4` - OpenAI GPT-4
- `gpt-3.5-turbo` - OpenAI GPT-3.5
- `claude-3.5-sonnet` - Anthropic Claude
- `claude-3-opus` - Anthropic Claude Opus

**Benefits:**
- Optimizes performance
- Ensures consistent behavior
- Allows model-specific features

### ApplyTo Patterns

**Glob Patterns:**

| Pattern | Matches |
|---------|---------|
| `'**'` | All files |
| `'**.ts'` | All TypeScript files |
| `'**.{ts,tsx}'` | TypeScript and TSX |
| `'src/**'` | Everything in src/ |
| `'test/**'` | Everything in test/ |
| `'**/README.md'` | All README.md files |

**Multiple Patterns:**
```yaml
applyTo: '**.ts, **.tsx, **.js, **.jsx'
```

## Markdown Best Practices

### Code Blocks

Use fenced code blocks with language specifiers:

````markdown
```typescript
function example() {
  return "Hello";
}
```
````

### Lists

**Unordered:**
```markdown
- Item 1
- Item 2
  - Nested item
```

**Ordered:**
```markdown
1. First step
2. Second step
3. Third step
```

**Task Lists:**
```markdown
- [ ] Todo item
- [x] Completed item
```

### Links

**Inline:**
```markdown
[Link Text](https://example.com)
```

**Reference:**
```markdown
[Link Text][ref]

[ref]: https://example.com
```

**Relative:**
```markdown
[See documentation](../docs/guide.md)
```

### Tables

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

### Emphasis

```markdown
*italic* or _italic_
**bold** or __bold__
***bold italic*** or ___bold italic___
`code`
~~strikethrough~~
```

## Linting

### MD012 Rule (Consecutive Blank Lines)

**Rule:** No more than one consecutive blank line

**When reported:**
1. Identify the line with MD012 error
2. Delete that line
3. Do NOT reformat surrounding content
4. Apply consistently across all Markdown files

**Example:**
```markdown
## Section 1

Content here...


## Section 2  # ← Delete one of these blank lines
```

### Other Common Rules

- **MD001:** Heading levels should increment by one
- **MD003:** Heading style should be consistent
- **MD022:** Headings should be surrounded by blank lines
- **MD032:** Lists should be surrounded by blank lines

## File Organization

### Project Structure

```
project-root/
├── README.md                    # Project overview
├── CHANGELOG.md                 # Version history
├── CONTRIBUTING.md              # Contribution guide
├── .github/
│   ├── copilot-instructions.md # Main instructions
│   └── instructions/
│       ├── typescript.instructions.md
│       ├── security.instructions.md
│       └── ...
├── docs/
│   ├── getting-started.md
│   ├── architecture.md
│   └── api/
│       └── reference.md
└── prompts/
    ├── code-review.prompt.md
    ├── test-generation.prompt.md
    └── ...
```

### File Locations

- **Instructions:** `.github/instructions/`
- **Prompts:** `prompts/` or `.github/prompts/`
- **Chatmodes:** `.github/chatmodes/`
- **Documentation:** `docs/`
- **Root-level:** Only essential docs (README, CHANGELOG, etc.)

## Validation Checklist

### All Markdown Files
- [ ] Proper heading hierarchy
- [ ] Fenced code blocks with language
- [ ] Consistent list formatting
- [ ] No MD012 errors (consecutive blank lines)
- [ ] Links are valid
- [ ] Tables are properly formatted

### Chatmode Files
- [ ] YAML frontmatter present
- [ ] Non-empty `description` (single quotes)
- [ ] Lower-case hyphen-separated filename
- [ ] `model` specified (recommended)

### Prompt Files
- [ ] YAML frontmatter present
- [ ] Non-empty `description` (single quotes)
- [ ] Valid `mode` field (`agent` or `ask`)
- [ ] Lower-case hyphen-separated filename
- [ ] `model` specified (recommended)

### Instruction Files
- [ ] YAML frontmatter present
- [ ] Non-empty `description` (single quotes)
- [ ] Valid `applyTo` patterns
- [ ] Lower-case hyphen-separated filename
- [ ] `model` specified (recommended)
- [ ] `excludeAgent` if needed

## Related Documentation

- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [markdown-lint Rules](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md)
- [Copilot Custom Instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
