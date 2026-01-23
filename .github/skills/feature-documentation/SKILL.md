---
name: Feature Documentation
description: Create standardized feature documentation in docs/features/ directory following Lancelot conventions
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

## Document Template

### Standard Feature Documentation

```markdown
# {Feature Name}

> **Status:** {Alpha | Beta | Stable | Deprecated}
> **Since Version:** {X.Y.Z}
> **Category:** {Authentication | Integration | Workflow | UI | etc.}

## Overview

{2-3 sentence description of what the feature does and why it exists}

### Key Benefits

- {Benefit 1: Why users need this}
- {Benefit 2: Problem it solves}
- {Benefit 3: How it improves workflow}

---

## Quick Start

### Prerequisites

- {Requirement 1}
- {Requirement 2}
- {System/extension requirements}

### Basic Setup

```bash
# Step 1: Configuration
{Command or action}

# Step 2: Initialization
{Command or action}
```

### First Use

1. {Simple first step}
2. {Simple second step}
3. {Verification step}

**Expected Result:** {What user should see/experience}

---

## Detailed Usage

### Feature Component 1

**Description:** {What this component does}

**Usage:**
```typescript
// Example code showing how to use this component
{code example}
```

**Configuration:**
```json
{
  "lancelot.feature.setting1": "value",
  "lancelot.feature.setting2": true
}
```

**Options:**
- `setting1` - {Description and default value}
- `setting2` - {Description and default value}

---

### Feature Component 2

{Repeat structure for each major component}

---

## Configuration Reference

### VS Code Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `lancelot.feature.enabled` | boolean | `true` | Enable/disable feature |
| `lancelot.feature.option1` | string | `"auto"` | {Description} |
| `lancelot.feature.option2` | number | `30` | {Description} |

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `LANCELOT_FEATURE_KEY` | Yes | {Description} |
| `LANCELOT_FEATURE_URL` | No | {Description and default} |

---

## Examples

### Example 1: {Common use case}

**Scenario:** {What user wants to accomplish}

**Steps:**
1. {Step with explanation}
2. {Step with explanation}
3. {Verification}

**Result:**
```
{Expected output or behavior}
```

---

### Example 2: {Advanced use case}

{Repeat structure}

---

## Integration

### With GitLab

{How this feature integrates with GitLab, if applicable}

### With IBM i

{How this feature integrates with IBM i, if applicable}

### With Other Features

- **{Feature A}:** {Integration description}
- **{Feature B}:** {Integration description}

---

## Troubleshooting

### Common Issues

#### Issue 1: {Common problem}

**Symptoms:**
- {What user experiences}
- {Error messages}

**Solution:**
1. {Step to resolve}
2. {Verification step}

**Prevention:** {How to avoid this issue}

---

#### Issue 2: {Another common problem}

{Repeat structure}

---

### Diagnostic Commands

```bash
# Check feature status
{diagnostic command}

# View feature logs
{log command}

# Reset feature state
{reset command}
```

---

## Advanced Topics

### Performance Considerations

{Performance tips, limits, optimization advice}

### Security Considerations

{Security best practices, sensitive data handling}

### Customization

{How to customize/extend the feature}

---

## API Reference

### TypeScript Interfaces

```typescript
/**
 * {Interface description}
 */
export interface IFeatureService {
  /**
   * {Method description}
   * @param param1 - {Description}
   * @returns {Description}
   */
  methodName(param1: string): Promise<Result>;
}
```

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `feature.activated` | `{ timestamp: number }` | {When fired} |
| `feature.error` | `{ error: Error }` | {When fired} |

---

## FAQ

### Question 1: {Common question}

{Clear answer with examples if needed}

### Question 2: {Common question}

{Clear answer}

---

## Related Documentation

- [{Related Feature 1}](./related-feature-1.md)
- [{Related Feature 2}](./related-feature-2.md)
- [API Documentation](../api/feature-api.md)
- [Configuration Guide](../getting-started.md)

---

## Changelog

### Version X.Y.Z (YYYY-MM-DD)
- {Change description}
- {Change description}

### Version X.Y.Z-1 (YYYY-MM-DD)
- Initial release

---

## Contributing

Found an issue with this documentation? Please [open an issue](https://github.com/RolandStrauss/Lancelot-extension/issues).

Want to improve this feature? See [CONTRIBUTING.md](../../CONTRIBUTING.md).
```

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

### File: `docs/features/oauth-authentication.md`

```markdown
# OAuth2 Authentication

> **Status:** 🟢 Stable
> **Since Version:** 0.9.0
> **Category:** Authentication

## Overview

OAuth2 authentication provides a secure, browser-based login flow for GitLab
integration. Users authenticate through their browser using GitLab credentials,
eliminating the need to manually create and manage personal access tokens.

### Key Benefits

- **Secure** - No need to copy/paste tokens
- **Easy** - Browser-based login with familiar GitLab interface
- **Automatic** - Token refresh handled automatically
- **Standards-based** - Uses OAuth2/OIDC protocols

---

## Quick Start

### Prerequisites

- GitLab instance with OAuth2 enabled
- Browser installed on system
- Internet connectivity
- Lancelot extension v0.9.0+

### Basic Setup

1. Open Lancelot extension
2. Click "Connect to GitLab"
3. Select "OAuth2 Login"
4. Complete browser authentication
5. Return to VS Code - you're connected!

**Expected Result:** GitLab features now accessible, user info displayed

---

## Detailed Usage

### Authentication Flow

1. **Initiate Login**
   - User clicks "OAuth2 Login" button
   - Extension generates PKCE challenge
   - Browser opens to GitLab authorization endpoint

2. **User Authorization**
   - User enters GitLab credentials
   - Grants permission to application
   - GitLab redirects back to VS Code

3. **Token Exchange**
   - Extension receives authorization code
   - Exchanges code for access token
   - Stores token securely in SecretStorage

4. **Token Refresh**
   - Automatic token refresh before expiration
   - No user intervention required
   - Falls back to re-login if refresh fails

### Configuration

```json
{
  "lancelot.gitlab.authMethod": "oauth2",
  "lancelot.gitlab.oauthClientId": "your-client-id",
  "lancelot.gitlab.oauthRedirectUri": "vscode://RolandStrauss.lancelot/oauth-callback"
}
```

---

## Examples

### Example 1: First-time Setup

**Scenario:** New user connecting to GitLab for first time

**Steps:**
1. Install Lancelot extension
2. Open Command Palette (Ctrl+Shift+P)
3. Run "Lancelot: Connect to GitLab"
4. Select "OAuth2 Login"
5. Browser opens to GitLab
6. Enter credentials and click "Authorize"
7. Browser closes, return to VS Code
8. See "Connected to GitLab" status

**Result:** User authenticated, can now use GitLab features

---

## Troubleshooting

### Common Issues

#### Issue 1: Browser Doesn't Open

**Symptoms:**
- Click OAuth login but browser doesn't launch
- Error: "Failed to open browser"

**Solution:**
1. Check default browser is set in system settings
2. Verify browser is installed
3. Try running from Command Palette instead of button
4. Check VS Code has permission to open URLs

---

### Diagnostic Commands

```bash
# Check OAuth configuration
code --list-extensions | grep lancelot

# View authentication logs
# In VS Code: Help > Toggle Developer Tools > Console
# Filter for "auth" or "oauth"
```

---

## Security Considerations

### Token Storage

- Tokens stored in VS Code SecretStorage
- Never in plaintext or version control
- Encrypted at rest
- Cleared on logout

### PKCE Protection

- Uses PKCE (Proof Key for Code Exchange)
- Prevents authorization code interception
- No client secret stored

---

## Related Documentation

- [Token Management](./token-management.md)
- [GitLab Integration](./gitlab-integration.md)
- [Security Guide](../security-guide.md)

---

## Changelog

### Version 0.9.0 (2025-12-01)
- Initial OAuth2 implementation
- PKCE support
- Automatic token refresh
```

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

- Lancelot Instructions: `.github/instructions/lancelot_built_tool.instructions.md` (Rule #74)
- Markdown Guidelines: `.github/instructions/markdown.instructions.md`
- VS Code Extension Guide: https://code.visualstudio.com/api/references/extension-guidelines
