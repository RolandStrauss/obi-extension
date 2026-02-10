---
description: 'Guidelines for GitHub Copilot to write self-explanatory code with minimal but meaningful comments. References comprehensive code commenting philosophy skill.'
applyTo: '**'
---

# Self-Explanatory Code Commenting Instructions

## Core Principle

**Write code that speaks for itself. Comment only when necessary to explain WHY, not WHAT.**

We do not need comments most of the time. The goal is to make code so clear through proper naming, structure, and simplicity that comments become largely unnecessary.

## Comprehensive Guidance

For complete guidance on code commenting philosophy and best practices, see:

**[Code Commenting Philosophy Skill](../.github/skills/code-commenting-philosophy/SKILL.md)**

This skill provides:

### ❌ Anti-Patterns to Avoid
- Obvious comments (restating what code does)
- Redundant comments (repeating function names)
- Outdated comments (mismatching code)
- Dead code comments (using comments instead of version control)
- Changelog comments (duplicating git history)
- Divider comments (using ASCII art instead of proper organization)

### ✅ When to Write Comments
- Complex business logic (tax calculations, rules)
- Non-obvious algorithms (Floyd-Warshall, etc.)
- Regex patterns (explaining match criteria)
- API constraints or gotchas (rate limits, known issues)

### 📋 Comment Decision Framework
Four-step process:
1. Is the code self-explanatory? → No comment needed
2. Would better naming eliminate the need? → Refactor instead
3. Does this explain WHY, not WHAT? → Good comment
4. Will this help future maintainers? → Good comment

### 🏷️ Special Cases
- **Public APIs**: Use JSDoc/Javadoc for comprehensive documentation
- **Configuration & Constants**: Document source and reasoning
- **Standard Annotations**: TODO, FIXME, HACK, NOTE, WARNING, PERF, SECURITY, BUG, REFACTOR, DEPRECATED

### ✓ Quality Checklist
- Explains WHY, not WHAT
- Grammatically correct and clear
- Will remain accurate as code evolves
- Adds genuine value to understanding
- Placed appropriately (above code)
- Uses professional language

## Summary

**The best comment is the one you don't need to write because the code is self-documenting.**

Focus on writing clear, self-explanatory code first. Use comments sparingly for non-obvious decisions, constraints, and reasoning that cannot be expressed through code alone.
