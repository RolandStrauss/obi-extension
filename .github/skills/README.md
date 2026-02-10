# Lancelot Extension Skills Catalog

**Last Updated:** 2026-02-06  
**Active Skills:** 23  
**Optimization Status:** ✅ Streamlined (32 generic skills archived)

---

## Overview

Skills are on-demand instruction modules loaded by GitHub Copilot when relevant to your query. Each skill contains domain-specific guidance, patterns, and best practices.

**How Skills Work:**
- Skills trigger based on description matching in YAML frontmatter
- Only relevant skills load, keeping token usage efficient
- Multiple skills can activate for complex queries
- All skills are Lancelot-specific (generic skills archived)

**Token Efficiency:**
- Average skill size: ~7.4 KB (~1,850 tokens)
- Typical activation: 1-2 skills per query (~2K-4K tokens)
- Maximum load: All 23 skills = ~43K tokens (rare edge case)

---

## Quick Navigation

**By Development Phase:**
- [VS Code Extension Development](#vs-code-extension-development) — Building the extension
- [IBM i Integration](#ibm-i-integration) — Connecting to IBM i systems
- [Lancelot Workflows](#lancelot-workflows) — Project-specific processes
- [Development Utilities](#development-utilities) — General dev tools
- [Internal Tools](#internal-tools) — Documentation maintenance

**By Task Type:**
- **Commands & UI**: vscode-ext-commands, vscode-ext-localization
- **Packaging & Release**: vsix-packaging, version-management, changelog-management
- **Architecture**: webview-tree-parity, lancelot-folder-structure
- **Code Quality**: typescript-strict-typing, powershell-integration
- **IBM i Development**: ibmi-clle, ibmi-db2, ibmi-dspf, ibmi-rpgle, ibmi-sqlrpgle, ibmi-extension-management
- **Documentation**: feature-documentation, test-scenario-documentation, markdown-guidelines
- **Workflow Automation**: git-commit, branch-naming-workflow, diagram-assistant

---

## VS Code Extension Development

### vscode-ext-commands (1.6 KB)
**Purpose:** Guidelines for contributing commands in VS Code extensions

**When This Triggers:**
- Registering new commands in `package.json`
- Implementing command handlers
- Command naming conventions
- Questions about command visibility or categories

**Use Cases:**
- Adding a new command to Lancelot
- Understanding command contribution points
- Fixing command registration issues

**Key Topics:**
- Command naming patterns (`lancelot.category.action`)
- Command categories and visibility
- `CommandManager` usage
- i18n for command titles/descriptions

**Example Query:** _"How do I add a new command to the extension?"_

---

### vscode-ext-localization (1.5 KB)
**Purpose:** Guidelines for proper localization of VS Code extensions

**When This Triggers:**
- Implementing multi-language support
- Working with `package.nls.json` files
- Questions about string externalization
- i18n best practices for extensions

**Use Cases:**
- Setting up localization for new features
- Adding translations for UI text
- Understanding VS Code i18n patterns

**Key Topics:**
- `package.nls.json` structure
- Locale file organization
- VS Code l10n API usage
- Message key conventions

**Example Query:** _"How do I localize extension strings?"_

---

### vsix-packaging (11.2 KB)
**Purpose:** VSIX build, package, and release workflows

**When This Triggers:**
- Building VSIX packages
- Release preparation tasks
- Questions about `vsce` or packaging
- Marketplace publishing workflows

**Use Cases:**
- Creating a new release
- Troubleshooting package build issues
- Understanding `.vscodeignore` patterns
- Optimizing VSIX size

**Key Topics:**
- `vsce package` commands and flags
- Auto-versioning integration
- Bundle size optimization
- Artifact storage in `.artifacts/vsix/`
- Cross-platform compatibility

**Example Query:** _"How do I build and package the extension?"_

---

### webview-tree-parity (14.3 KB)
**Purpose:** Maintain feature parity between TreeView and WebView implementations

**When This Triggers:**
- Implementing features in both TreeView and WebView
- Questions about shared service patterns
- UI component design decisions
- Feature parity requirements

**Use Cases:**
- Adding a new feature that needs both UI types
- Refactoring to share logic between views
- Understanding UI architecture patterns

**Key Topics:**
- Shared service layer patterns
- State management across views
- Event coordination
- Code reuse strategies
- Accessibility considerations

**Example Query:** _"How do I ensure TreeView and WebView have the same features?"_

---

### i18n-implementation (8.1 KB)
**Purpose:** Multi-language support implementation patterns

**When This Triggers:**
- Implementing internationalization
- Working with resource bundles
- Questions about locale handling
- RTL support or pluralization

**Use Cases:**
- Adding i18n to new features
- Creating locale-specific message files
- Handling dynamic text in multiple languages

**Key Topics:**
- Message key patterns
- Locale file structure
- `vscode.l10n.t()` usage
- Pluralization rules
- RTL (right-to-left) support
- Unicode handling

**Example Query:** _"How do I add internationalization support?"_

---

### typescript-strict-typing (9.8 KB)
**Purpose:** TypeScript strict mode best practices and no-`any` enforcement

**When This Triggers:**
- TypeScript type safety questions
- Fixing type errors
- Questions about strict mode
- Type guard implementations

**Use Cases:**
- Enforcing strict typing in new code
- Eliminating `any` types
- Understanding type narrowing
- Implementing discriminated unions

**Key Topics:**
- `tsconfig.json` strict options
- Explicit return types
- Type guards and assertions
- Null/undefined safety
- Generic type patterns

**Example Query:** _"How do I fix this TypeScript any type?"_

---

### powershell-integration (12.4 KB)
**Purpose:** Node.js ↔ PowerShell integration patterns using `child_process.spawn`

**When This Triggers:**
- Calling PowerShell from Node.js
- Build script automation
- Platform-specific tasks (Windows)
- Execution of `.ps1` scripts

**Use Cases:**
- Running PowerShell scripts from extension
- Build/package automation
- Platform detection and fallback
- Stream management

**Key Topics:**
- `child_process.spawn` with pwsh
- Error handling for PowerShell execution
- Platform detection (Windows, macOS, Linux)
- Safe script invocation
- Stream processing

**Example Query:** _"How do I call a PowerShell script from Node.js?"_

---

### version-management (8 KB)
**Purpose:** Semantic versioning and changelog automation workflows

**When This Triggers:**
- Version increment tasks
- CHANGELOG.md updates
- Release preparation
- Semantic versioning questions

**Use Cases:**
- Incrementing version for new release
- Updating CHANGELOG.md
- Understanding semantic versioning rules
- Automating version bumps

**Key Topics:**
- Semantic Versioning 2.0.0
- Keep a Changelog 1.1.0 format
- Auto-increment scripts
- Version synchronization across files

**Example Query:** _"How do I increment the version number?"_

---

### lancelot-folder-structure (13.6 KB)
**Purpose:** Project organization standards and folder structure conventions

**When This Triggers:**
- Questions about where files should go
- Project organization decisions
- Root folder cleanup
- New directory creation

**Use Cases:**
- Understanding project layout
- Deciding where to place new files
- Keeping root folder clean
- Following organizational best practices

**Key Topics:**
- Approved root files
- Directory structure rules
- `.artifacts/` organization
- `docs/` hierarchy
- `src/` module organization

**Example Query:** _"Where should I put this new file?"_

---

## IBM i Integration

### ibmi-clle (3.9 KB)
**Purpose:** CL command language execution patterns and security

**When This Triggers:**
- Executing CL commands from extension
- Questions about CLLE syntax
- Security concerns with command injection
- IBM i integration via ssh2

**Use Cases:**
- Running CL commands securely
- Validating library/member names
- Preventing command injection
- Understanding CL execution patterns

**Key Topics:**
- Safe CL command construction
- Parameter validation and sanitization
- SSH connection management
- Error handling for CL failures

**Example Query:** _"How do I execute a CL command safely?"_

---

### ibmi-db2 (6 KB)
**Purpose:** DB2 for i query patterns, performance, and best practices

**When This Triggers:**
- DB2 for i SQL queries
- Database performance questions
- Embedded SQL patterns
- Query optimization

**Use Cases:**
- Writing efficient DB2 queries
- Understanding indexing strategies
- Connection pooling patterns
- Performance tuning

**Key Topics:**
- SQL best practices for i
- Index design patterns
- Query optimization techniques
- Connection management
- Transaction handling

**Example Query:** _"How do I optimize this DB2 query?"_

---

### ibmi-dspf (3 KB)
**Purpose:** Display file (DSPF) development patterns

**When This Triggers:**
- Working with display files
- Screen layout questions
- IBM i UI development
- DDS (Data Description Specifications)

**Use Cases:**
- Creating/modifying display files
- Understanding DDS syntax
- Screen design patterns

**Key Topics:**
- DSPF structure and syntax
- Screen formatting
- Field definitions
- Subfile patterns

**Example Query:** _"How do I create a display file?"_

---

### ibmi-extension-management (5.7 KB)
**Purpose:** Code for IBM i extension integration and dependency management

**When This Triggers:**
- Integrating with Code for IBM i extension
- Lazy-loading extension dependencies
- Questions about IBM i extension APIs
- Connection management

**Use Cases:**
- Safely accessing Code for IBM i features
- Implementing lazy extension loading
- Handling optional dependencies
- Connection state management

**Key Topics:**
- Safe lazy-loading patterns
- Extension dependency checks (`ext?.isActive`)
- API access patterns
- `ExtensionDependencyService` usage

**Example Query:** _"How do I integrate with the IBM i extension?"_

---

### ibmi-rpgle (4.6 KB)
**Purpose:** RPG ILE development patterns and modernization

**When This Triggers:**
- RPG programming questions
- RPGLE modernization tasks
- Free-form RPG syntax
- RPG best practices

**Use Cases:**
- Writing modern RPG code
- Understanding free-form syntax
- Modernizing fixed-form code
- Error handling patterns

**Key Topics:**
- Free-form vs. fixed-form RPG
- Modern control structures
- Error handling (`MONITOR/ON-ERROR`)
- Modularization patterns

**Example Query:** _"What's the modern way to write this RPG code?"_

---

### ibmi-sqlrpgle (5.6 KB)
**Purpose:** SQL-embedded RPG development (SQLRPGLE) patterns

**When This Triggers:**
- Embedded SQL in RPG
- SQLRPGLE development
- SQL cursor usage
- Prepared statement patterns

**Use Cases:**
- Writing SQLRPGLE programs
- Understanding embedded SQL syntax
- Cursor management
- Error handling for SQL in RPG

**Key Topics:**
- `EXEC SQL` statements
- Cursor declaration and usage
- SQL error handling (`SQLCODE`, `SQLSTATE`)
- Dynamic SQL patterns
- Performance optimization

**Example Query:** _"How do I use embedded SQL in RPG?"_

---

## Lancelot Workflows

### branch-naming-workflow (7.3 KB)
**Purpose:** Git branch naming conventions and workflow automation

**When This Triggers:**
- Creating new branches
- Branch naming questions
- Git workflow guidance
- Merge request preparation

**Use Cases:**
- Creating properly named branches
- Understanding branch types
- Following team conventions
- Automated branch creation

**Key Topics:**
- Branch naming pattern: `type/developer/TICKET-description`
- Branch types: `feat/`, `fix/`, `refactor/`, `docs/`
- Jira ticket integration
- Git workflow best practices

**Example Query:** _"What's the correct branch naming format?"_

---

### changelog-management (11.4 KB)
**Purpose:** CHANGELOG.md maintenance following Keep a Changelog standards

**When This Triggers:**
- Updating CHANGELOG.md
- Release notes preparation
- Version history questions
- Keep a Changelog format

**Use Cases:**
- Adding new CHANGELOG entries
- Preparing release notes
- Understanding changelog structure
- Following versioning standards

**Key Topics:**
- Keep a Changelog 1.1.0 format
- Semantic versioning integration
- Section organization (Added, Changed, Fixed, Removed, etc.)
- Date formatting (YYYY-MM-DD)

**Example Query:** _"How do I update the CHANGELOG?"_

---

### feature-documentation (14.7 KB)
**Purpose:** Feature documentation templates and standards for Lancelot

**When This Triggers:**
- Documenting new features
- Creating feature specifications
- Questions about documentation structure
- User-facing documentation

**Use Cases:**
- Writing feature documentation
- Creating user guides
- Documenting configuration options
- Following doc templates

**Key Topics:**
- Feature documentation structure
- User guide format
- Configuration documentation
- Screenshot and example inclusion
- Cross-referencing standards

**Example Query:** _"How do I document this new feature?"_

---

### test-scenario-documentation (12.2 KB)
**Purpose:** Test scenario documentation for issue fixes with Given/When/Then format

**When This Triggers:**
- Creating test scenarios for issues
- Issue fix documentation
- Test case writing
- Quality assurance documentation

**Use Cases:**
- Documenting test scenarios for bug fixes
- Creating reproducible test cases
- Writing acceptance criteria
- QA documentation

**Key Topics:**
- Given/When/Then format
- Test scenario templates
- Reproduction steps
- Expected vs. actual results
- Edge case documentation

**Example Query:** _"How do I document test scenarios for this fix?"_

---

## Development Utilities

### diagram-assistant (2.6 KB)
**Purpose:** Generate flowcharts, process diagrams using Mermaid or Draw.io

**When This Triggers:**
- Creating diagrams for documentation
- Architecture visualization requests
- Process flow documentation
- Mentions of "Mermaid" or "Draw.io"

**Use Cases:**
- Generating architecture diagrams
- Creating flowcharts
- Visualizing workflows
- Exporting diagrams as PNG/SVG

**Key Topics:**
- Mermaid.js syntax
- Draw.io integration
- Diagram types (flowchart, sequence, class, etc.)
- Export formats

**Example Query:** _"Can you create a flowchart for this process?"_

---

### git-commit (3.3 KB)
**Purpose:** Conventional commit message patterns with intelligent staging

**When This Triggers:**
- Creating git commits
- Commit message questions
- Mentions of "conventional commits"
- Using `/commit` command

**Use Cases:**
- Writing well-formatted commit messages
- Auto-detecting commit type and scope
- Understanding conventional commits
- Staging files intelligently

**Key Topics:**
- Conventional Commits specification
- Commit message format: `type(scope): description`
- Commit types (feat, fix, docs, refactor, etc.)
- Auto-detection from changes

**Example Query:** _"How do I write a proper commit message?"_

---

### markdown-guidelines (9.9 KB)
**Purpose:** Markdown documentation standards and best practices

**When This Triggers:**
- Writing markdown documentation
- Markdown formatting questions
- Creating instruction files
- Documentation file creation

**Use Cases:**
- Writing README files
- Creating markdown documentation
- Following formatting standards
- YAML frontmatter in docs

**Key Topics:**
- Markdown syntax and formatting
- YAML frontmatter requirements
- Documentation structure
- Code block formatting
- Link and image handling

**Example Query:** _"What's the proper markdown format for documentation?"_

---

## Internal Tools

### instruction-file-standards (11 KB)
**Purpose:** Standards for creating and maintaining instruction files with YAML frontmatter

**When This Triggers:**
- Creating new instruction files
- Questions about instruction file format
- YAML frontmatter requirements
- Documentation maintenance

**Use Cases:**
- Creating new `.instructions.md` files
- Understanding frontmatter structure
- Following instruction file conventions
- Internal documentation standards

**Key Topics:**
- YAML frontmatter format (`---` delimiters)
- Required fields: `applyTo`, `description`
- Instruction file naming conventions
- Content organization standards

**Example Query:** _"How do I create a new instruction file?"_

---

## Skill Trigger Optimization

### How to Trigger a Specific Skill

Skills activate based on keyword matching in your query. To ensure the right skill loads:

**Explicit Mentions:**
- Use the skill name or domain: _"following the **branch-naming-workflow**"_
- Mention the technology: _"PowerShell script"_, _"SQLRPGLE program"_, _"Mermaid diagram"_
- Reference the task: _"create a commit message"_, _"package the VSIX"_, _"write test scenarios"_

**Implicit Context:**
- Copilot infers from surrounding code and files
- Working in relevant directories (e.g., `src/ibmi/` may trigger IBM i skills)
- Editing specific file types (`.md` may trigger markdown-guidelines)

### Preventing Unwanted Skill Activation

If you notice irrelevant skills loading:
- Be more specific in your query
- Explicitly state what you're NOT looking for
- Provide clear context about the current task

**Example:**
- ❌ Generic: _"How do I create a new file?"_  
  → May trigger multiple skills
- ✅ Specific: _"How do I create a new TypeScript service file in src/services/?"_  
  → Triggers lancelot-folder-structure + typescript-strict-typing

---

## Skill Statistics

### Size Distribution

| Size Range | Count | Skills |
|------------|-------|--------|
| **XL (>10 KB)** | 9 | webview-tree-parity (14.3), feature-documentation (14.7), lancelot-folder-structure (13.6), powershell-integration (12.4), test-scenario-documentation (12.2), vsix-packaging (11.2), changelog-management (11.4), instruction-file-standards (11) |
| **L (5-10 KB)** | 6 | typescript-strict-typing (9.8), markdown-guidelines (9.9), version-management (8), branch-naming-workflow (7.3), i18n-implementation (8.1), ibmi-db2 (6) |
| **M (3-5 KB)** | 5 | ibmi-clle (3.9), ibmi-rpgle (4.6), ibmi-sqlrpgle (5.6), ibmi-extension-management (5.7), git-commit (3.3) |
| **S (<3 KB)** | 3 | ibmi-dspf (3), diagram-assistant (2.6), vscode-ext-commands (1.6), vscode-ext-localization (1.5) |

### Activation Frequency (Estimated)

Based on typical Lancelot development tasks:

| Frequency | Skills |
|-----------|--------|
| **High** (daily use) | typescript-strict-typing, lancelot-folder-structure, git-commit, branch-naming-workflow, vscode-ext-commands |
| **Medium** (weekly use) | version-management, changelog-management, vsix-packaging, powershell-integration, feature-documentation, markdown-guidelines |
| **Low** (as-needed) | ibmi-* skills (when working on IBM i features), webview-tree-parity (UI work), diagram-assistant (documentation), i18n-implementation (localization) |

---

## Troubleshooting

### Skill Not Loading

**Symptoms:** Expected guidance not appearing in Copilot responses

**Causes & Solutions:**
1. **Query too generic** → Be more specific with keywords
2. **Wrong terminology** → Use domain terms (e.g., "VSIX" not "package")
3. **Skill archived** → Check if skill was moved to `skills-unused/`

### Multiple Skills Loading

**Symptoms:** Too much context, response too verbose

**Causes & Solutions:**
1. **Broad query** → Narrow scope, be more specific
2. **Overlapping domains** → Explicitly exclude unrelated topics
3. **Context from files** → Copilot infers from open files; close unrelated tabs

### Skill Content Outdated

**Solution:** Skills are static files. To update:
1. Edit the `SKILL.md` file in the skill directory
2. Update YAML frontmatter if trigger conditions changed
3. Test with relevant queries to verify activation

---

## Maintenance

### Adding a New Skill

1. Create directory in `.github/skills/<skill-name>/`
2. Create `SKILL.md` with YAML frontmatter:
   ```yaml
   ---
   name: skill-name
   description: Clear description of when this skill should trigger
   ---
   ```
3. Add skill content (patterns, examples, best practices)
4. Update this README.md catalog
5. Test with relevant queries

### Archiving a Skill

If a skill becomes obsolete or too generic:
```bash
Move-Item .github\skills\<skill-name> .github\skills-unused\
```

### Restoring an Archived Skill

If a previously archived skill is needed:
```bash
Move-Item .github\skills-unused\<skill-name> .github\skills\
```

---

## Related Documentation

- [Instructions Optimization](../.github/INSTRUCTIONS-ENHANCEMENT-SUMMARY.md) - Instruction files streamline
- [Skills Optimization Results](../.github/SKILLS-OPTIMIZATION-RESULTS.md) - Skills archival summary
- [Lancelot Instructions](../instructions/lancelot.instructions.md) - Primary authority for development

---

**Maintained by:** Lancelot Development Team  
**Questions?** See [Contributing Guide](../../CONTRIBUTING.md) or create an issue
