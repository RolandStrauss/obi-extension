---
name: Feature Documentation
description: Create standardized feature documentation in docs/features/ directory following Lancelot conventions. Use when user documents new features, creates feature docs, or mentions feature documentation or docs/features/.
---

# Feature Documentation

Create comprehensive, standardized documentation for new features in the Lancelot extension.

## Quick Start

```bash
# Create feature documentation
touch docs/features/oauth-authentication.md

# Open in editor
code docs/features/oauth-authentication.md

# Update features index
code docs/features/README.md
```

**Rule:** ALL feature documentation MUST be created in `docs/features/` directory.

## File Naming Convention

### Format
```
docs/features/{feature-name}.md
```

**Rules:**
- Use descriptive kebab-case naming
- Be specific and searchable
- Avoid abbreviations unless widely known
- Keep under 50 characters

**Good Examples:**
```
oauth-authentication.md
gitlab-integration.md
auto-version-increment.md
permission-analytics-dashboard.md
branch-validation-workflow.md
```

**Bad Examples:**
```
auth.md                    # Too vague
OAuth_Authentication.md    # Wrong case
feature1.md               # Not descriptive
gitlab_gitlab.md          # Redundant
```

## Document Template Structure

### Required Sections

1. **Header** - Status badge (`🟢 Stable`, `🟡 Beta`, `🔵 Alpha`, `🔴 Deprecated`), version, category
2. **Overview** - What it does, why it exists (2-3 sentences)
3. **Key Benefits** - User value (3-5 bullets)
4. **Quick Start** - Prerequisites, basic setup, first use with expected result
5. **Configuration Reference** - Settings table with type/default/description
6. **Examples** - At least 2 practical use cases with scenarios and steps
7. **Troubleshooting** - Common issues with symptoms/solution/prevention
8. **Related Documentation** - Links to related features and guides

### Optional Sections

Add when relevant:
- **Detailed Usage** - For complex features needing deep dive
- **Integration** - GitLab, IBM i, or Jira integration details
- **Advanced Topics** - Performance, security, customization
- **API Reference** - TypeScript interfaces and events
- **FAQ** - Common questions beyond troubleshooting

### Template Skeleton

```markdown
# {Feature Name}

> **Status:** {🟢 Stable | 🟡 Beta | 🔵 Alpha | 🔴 Deprecated}
> **Since Version:** {X.Y.Z}
> **Category:** {Authentication | Integration | Workflow | UI}

## Overview
{2-3 sentences}

### Key Benefits
- {Problem it solves}
- {Workflow improvement}

## Quick Start
### Prerequisites
- {Requirement}

### Basic Setup
1. {Step}
2. {Step}

**Expected Result:** {What user sees}

## Configuration Reference
| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `lancelot.feature.enabled` | boolean | `true` | {Desc} |

## Examples
### Example 1: {Use case}
**Scenario:** {What user wants}
**Steps:** {1. Action 2. Action}
**Result:** {Outcome}

## Troubleshooting
### Issue: {Problem}
**Symptoms:** {What happens}
**Solution:** {Fix steps}

## Related Documentation
- [{Related}](./related.md)
```

**Full Template:** See `.github/skills/feature-documentation/TEMPLATE.md` for complete template with all optional sections.

## Features Index (README.md)

### Location
```
docs/features/README.md
```

### Index Structure

```markdown
# Lancelot Features

Comprehensive documentation for all Lancelot extension features.

## Feature Categories

### Authentication & Security
- [OAuth2 Authentication](./oauth-authentication.md) - Browser-based OAuth login
- [Token Management](./token-management.md) - Secure token storage and refresh

### GitLab Integration
- [GitLab Projects](./gitlab-projects.md) - Project browsing and management
- [GitLab API](./gitlab-api-integration.md) - API client with pagination
- [Merge Requests](./merge-request-workflow.md) - MR creation and management

### IBM i Integration
- [Source Synchronization](./ibmi-source-sync.md) - Code sync with IBM i
- [Compilation](./ibmi-compilation.md) - Remote compilation workflow
- [Deployment](./ibmi-deployment.md) - Automated deployment

### Workflow Automation
- [Branch Creation](./branch-creation-automation.md) - Automated branch naming
- [CI/CD Pipelines](./cicd-pipeline-integration.md) - Pipeline triggers
- [Change Management](./change-management-workflow.md) - CAB approval workflow

### Developer Tools
- [Auto Version Increment](./auto-version-increment.md) - Automated versioning
- [Test Scenario Generator](./test-scenario-documentation.md) - Test docs
- [Release Notes](./release-notes-generation.md) - Automated release notes

## Feature Status Legend

- 🟢 **Stable** - Production-ready, fully supported
- 🟡 **Beta** - Feature-complete, testing phase
- 🔵 **Alpha** - Early access, may change
- 🔴 **Deprecated** - Will be removed in future version

## Getting Started

New to Lancelot? Start here:
1. [Installation Guide](../lancelot-installation-guide.md)
2. [Getting Started](../getting-started.md)
3. [Configuration](../configuration-guide.md)

## Need Help?

- [Troubleshooting Guide](../troubleshooting.md)
- [FAQ](../faq.md)
- [GitHub Issues](https://github.com/RolandStrauss/Lancelot-extension/issues)
```

## When to Create Feature Documentation

### Required For

✅ **All new features** - Complete documentation before release
✅ **Major enhancements** - Significant functionality changes
✅ **Breaking changes** - Migration guides and new behavior
✅ **Public APIs** - Interfaces exposed to other extensions

### Create Before

- ⏰ **Before PR merge** - Documentation reviewed with code
- ⏰ **Before release** - Users have access to documentation
- ⏰ **Before deprecation** - Migration path documented

## Documentation Quality Checklist

Before submitting feature documentation:

- [ ] File in `docs/features/` directory
- [ ] Kebab-case filename
- [ ] Added to `docs/features/README.md` index
- [ ] Status badge and version number included
- [ ] Quick Start section complete
- [ ] At least 2 practical examples
- [ ] Configuration reference included
- [ ] Troubleshooting section with common issues
- [ ] Related documentation linked
- [ ] Code examples tested and working
- [ ] Screenshots added (if UI feature)

## Real-World Example

For complete example showing all template sections in practice, see `docs/features/oauth-authentication.md` which demonstrates:
- Full header with status badge, version, category
- Overview with key benefits (4 bullets)
- Quick Start (prerequisites, 5-step setup, expected result)
- Two practical examples with scenarios/steps/results
- Troubleshooting with symptoms/solutions
- Security considerations (token storage, PKCE)
- Related documentation links with descriptive text
- Changelog with version history

**Key Pattern:** Start simple (Quick Start), then progressively disclose complexity (Detailed Usage, Advanced Topics) while maintaining user focus ("what can I do" not "how it works internally").

## Best Practices

### Writing Style

1. **Clear and Concise** - Short paragraphs, bullet points
2. **Action-Oriented** - Focus on what users can do
3. **Examples First** - Show, then explain
4. **Progressive Disclosure** - Simple to advanced
5. **User-Focused** - Benefits before technical details

### Code Examples

1. **Complete and Runnable** - Full working examples
2. **Commented** - Explain non-obvious parts
3. **Realistic** - Real-world scenarios
4. **Tested** - Verify examples work

### Screenshots

1. **Annotated** - Highlight important areas
2. **Up-to-Date** - Match current UI
3. **Readable** - High quality, proper size
4. **Necessary** - Only when text isn't clear

### Maintenance

1. **Version Changes** - Update when feature changes
2. **Deprecations** - Mark and provide migration path
3. **Links** - Verify links still work
4. **Examples** - Test examples with each release

## Integration with Development Workflow

### In Feature Development

**Definition of Done includes:**
```markdown
- [ ] Feature implemented and tested
- [ ] Feature documentation created
- [ ] Documentation reviewed
- [ ] Examples tested
- [ ] Added to features index
```

### In Pull Request

**PR checklist includes:**
```markdown
- [ ] Feature documentation added/updated
- [ ] Link: `docs/features/feature-name.md`
- [ ] Screenshots attached (if UI change)
- [ ] Examples tested in clean environment
```

### In Release Notes

**Reference feature docs:**
```markdown
## New Features
- OAuth2 Authentication (#328)
  - Documentation: [OAuth2 Authentication](docs/features/oauth-authentication.md)
  - Quick Start guide included
```

## References

- Lancelot Instructions: `.github/instructions/lancelot.instructions.md` (Rule #74)
- Markdown Guidelines: `.github/instructions/markdown.instructions.md`
- VS Code Extension Guide: https://code.visualstudio.com/api/references/extension-guidelines
