---
name: Test Scenario Documentation
description: Create comprehensive test scenario documents for every issue fix or enhancement following Lancelot standards. Use when user documents test scenarios, fixes issues, creates test plans, or mentions test scenarios, Given/When/Then, or issue testing.
---

# Test Scenario Documentation

Create comprehensive, standardized test scenario documents for every issue that is fixed or remediated in the Lancelot extension.

## Quick Start

```bash
# For issue #192
touch docs/testing/issue-192-test-scenarios.md

# Copy template and customize
code docs/testing/issue-192-test-scenarios.md
```

**Rule:** Every fixed or remediated issue MUST have a corresponding test scenarios document.

## Document Template

### File Naming Convention

```
docs/testing/issue-{NUMBER}-test-scenarios.md
```

**Examples:**
- `docs/testing/issue-192-test-scenarios.md`
- `docs/testing/issue-328-test-scenarios.md`
- `docs/testing/issue-489-test-scenarios.md`

### Full Template Structure

```markdown
# Test Scenarios: Issue #{NUMBER} - {Issue Title}

## Feature Overview

**Issue:** #{NUMBER}
**Title:** {Brief issue title}
**Type:** {Bug Fix | Enhancement | Feature}
**Component:** {Which part of the extension this affects}

### Description
{2-3 sentence description of what was fixed/added}

### Related Components
- {Component 1}
- {Component 2}
- {Affected services/modules}

---

## Basic Functionality Test Scenarios

### Scenario 1: {Primary functionality test}

**Objective:** {What this test validates}

**Preconditions:**
- {Setup requirement 1}
- {Setup requirement 2}

**Test Steps:**
1. {Step 1}
2. {Step 2}
3. {Step 3}

**Expected Results:**
- {Expected outcome 1}
- {Expected outcome 2}

**Acceptance Criteria:**
- [ ] {Criterion 1}
- [ ] {Criterion 2}

---

### Scenario 2: {Secondary functionality test}

{Repeat structure above}

---

## Edge Case Scenarios

### Edge Case 1: {Boundary condition}

**Objective:** Test behavior at limits/boundaries

**Test Steps:**
1. {Step focusing on edge condition}
2. {Verification step}

**Expected Results:**
- {How system should handle edge case}
- {Error messages or fallback behavior}

---

### Edge Case 2: {Invalid input/error condition}

**Objective:** Test error handling

**Test Steps:**
1. {Step that triggers error condition}
2. {Verify error handling}

**Expected Results:**
- {Appropriate error message}
- {System remains stable}
- {User receives helpful guidance}

---

## Performance Testing Scenarios

### Performance 1: {Load/stress test}

**Objective:** Validate performance under load

**Test Configuration:**
- {Load parameters}
- {System resources}
- {Duration}

**Test Steps:**
1. {Setup load conditions}
2. {Execute operations}
3. {Measure metrics}

**Performance Targets:**
- Response time: {< X ms}
- Memory usage: {< Y MB}
- CPU usage: {< Z%}

**Acceptance Criteria:**
- [ ] Meets response time targets
- [ ] No memory leaks
- [ ] Graceful degradation under load

---

## Regression Testing Scenarios

### Regression 1: {Verify existing functionality}

**Objective:** Ensure fix doesn't break existing features

**Test Steps:**
1. {Test related feature 1}
2. {Test related feature 2}
3. {Verify integration points}

**Expected Results:**
- {All existing features work correctly}
- {No new errors introduced}

---

## User Experience Validation

### UX 1: {Workflow validation}

**Objective:** Validate complete user workflow

**User Persona:** {Target user type}

**Workflow Steps:**
1. {User action 1}
2. {User action 2}
3. {Completion step}

**UX Criteria:**
- [ ] Intuitive and discoverable
- [ ] Clear error messages
- [ ] Consistent with VS Code patterns
- [ ] Accessible (keyboard navigation, screen readers)

---

## Cross-Platform Testing

**Platforms to Test:**
- [ ] Windows 11
- [ ] macOS (latest)
- [ ] Linux (Ubuntu/Fedora)

**Platform-Specific Considerations:**
- {Any platform-specific behaviors}
- {Path separators, case sensitivity, etc.}

---

## Acceptance Criteria

### Must Pass (P0)
- [ ] {Critical criterion 1}
- [ ] {Critical criterion 2}
- [ ] All basic functionality scenarios pass
- [ ] No regressions detected

### Should Pass (P1)
- [ ] {Important criterion 1}
- [ ] All edge cases handled gracefully
- [ ] Performance targets met

### Nice to Have (P2)
- [ ] {Enhancement criterion}
- [ ] Additional optimizations

---

## Test Execution Results

### Test Run 1: {Date}

**Environment:**
- OS: {Platform}
- VS Code Version: {Version}
- Extension Version: {Version}

**Results:**
- Basic Functionality: {Pass/Fail}
- Edge Cases: {Pass/Fail}
- Performance: {Pass/Fail}
- Regression: {Pass/Fail}
- UX Validation: {Pass/Fail}

**Issues Found:**
- {Issue 1 with severity}
- {Issue 2 with severity}

---

## Sign-Off

**Tested By:** {Name}
**Date:** {YYYY-MM-DD}
**Status:** {Ready for Release | Needs Rework}

**Approvals:**
- [ ] Developer Sign-Off
- [ ] QA Sign-Off
- [ ] Product Owner Sign-Off (if applicable)

**Notes:**
{Any additional comments or observations}
```

## Template Customization Guide

### For Bug Fixes

**Focus on:**
1. Reproducing the original bug
2. Verifying the fix
3. Testing that the bug doesn't regress
4. Related functionality still works

**Example sections to emphasize:**
- Basic Functionality (reproducing original bug)
- Regression Testing (comprehensive)
- Edge Cases (variations of the bug)

### For Features

**Focus on:**
1. Complete feature workflow
2. Integration with existing features
3. User experience and discoverability
4. Performance under expected load

**Example sections to emphasize:**
- Basic Functionality (feature workflow)
- User Experience Validation (comprehensive)
- Performance Testing (feature-specific metrics)

### For Enhancements

**Focus on:**
1. Before/after comparison
2. Improvement validation
3. Backward compatibility
4. Migration scenarios (if applicable)

**Example sections to emphasize:**
- User Experience Validation (improvement verification)
- Regression Testing (existing behavior)
- Performance Testing (showing improvement)

## Real-World Examples

### Example 1: Bug Fix Documentation

**File:** `docs/testing/issue-192-test-scenarios.md`

```markdown
# Test Scenarios: Issue #192 - GitLab API Pagination Error

## Feature Overview

**Issue:** #192
**Title:** Resolve GitLab API pagination handling bug
**Type:** Bug Fix
**Component:** GitLab Integration / API Service

### Description
Fixed bug where large result sets from GitLab API were truncated due to
improper pagination handling. Now correctly follows cursor-based pagination
for all API endpoints.

### Related Components
- `src/gitlab/gitlabService.ts`
- `src/gitlab/paginationHandler.ts`
- API rate limiting system

---

## Basic Functionality Test Scenarios

### Scenario 1: Fetch large project list (>100 items)

**Objective:** Verify pagination correctly retrieves all projects

**Preconditions:**
- GitLab instance with >100 projects
- Valid authentication token
- User has access to projects

**Test Steps:**
1. Open Lancelot Projects view
2. Click "Refresh Projects"
3. Wait for loading to complete
4. Scroll through entire project list

**Expected Results:**
- All projects appear in list
- No truncation or missing projects
- Loading indicator shows progress
- Final count matches GitLab project count

**Acceptance Criteria:**
- [ ] All projects loaded (verified against GitLab API)
- [ ] No pagination errors in console
- [ ] Performance acceptable (<5s for 200 projects)
```

### Example 2: Feature Documentation

**File:** `docs/testing/issue-328-test-scenarios.md`

```markdown
# Test Scenarios: Issue #328 - OAuth2 Authentication

## Feature Overview

**Issue:** #328
**Title:** Implement OAuth2 authentication with GitLab
**Type:** Feature
**Component:** Authentication System

### Description
Added OAuth2/OIDC authentication flow for GitLab integration. Users can now
authenticate using browser-based OAuth flow instead of personal access tokens.
Includes token refresh and secure storage in VS Code SecretStorage.

---

## Basic Functionality Test Scenarios

### Scenario 1: First-time OAuth login

**Objective:** User can authenticate via OAuth for first time

**Preconditions:**
- No existing GitLab credentials stored
- Browser available on system
- Internet connectivity

**Test Steps:**
1. Open Lancelot extension
2. Click "Connect to GitLab"
3. Select "OAuth2 Login"
4. Browser opens with GitLab login
5. Enter credentials and authorize
6. Browser redirects back to VS Code
7. Extension shows connected status

**Expected Results:**
- Login succeeds without errors
- Token stored securely
- User information displayed
- GitLab features accessible

**Acceptance Criteria:**
- [ ] OAuth flow completes successfully
- [ ] Token stored in SecretStorage (not plaintext)
- [ ] User can access GitLab features immediately
- [ ] No sensitive data in logs
```

## When to Create Test Scenarios

### Required For

✅ **All bug fixes** - Verify fix and prevent regression
✅ **All new features** - Complete feature validation
✅ **All enhancements** - Improvement verification
✅ **Security fixes** - Comprehensive security testing
✅ **Performance improvements** - Metrics and benchmarks

### Create Before

- ⏰ **Before code review** - Reviewer can validate test coverage
- ⏰ **Before merging PR** - Ensures testability
- ⏰ **Before release** - QA can execute scenarios

## Quality Checklist

Before submitting test scenarios document:

- [ ] File follows naming convention: `issue-{NUMBER}-test-scenarios.md`
- [ ] Located in `docs/testing/` directory
- [ ] All template sections included
- [ ] Test steps are clear and executable
- [ ] Expected results are specific and measurable
- [ ] Acceptance criteria are testable
- [ ] Platform considerations noted
- [ ] Performance targets defined (if applicable)
- [ ] Sign-off section included

## Integration with Development Workflow

### In Issue Tracker

**When creating issue:**
```markdown
**Definition of Done:**
- [ ] Code implemented and reviewed
- [ ] Test scenarios document created
- [ ] All test scenarios pass
- [ ] Documentation updated
```

### In Pull Request

**PR checklist includes:**
```markdown
- [ ] Test scenarios document created/updated
- [ ] All scenarios tested and passing
- [ ] Link: `docs/testing/issue-XXX-test-scenarios.md`
```

### In Release Notes

**Reference test documentation:**
```markdown
## Fixed Issues
- #192: GitLab API pagination error
  - Test scenarios: `docs/testing/issue-192-test-scenarios.md`
  - All scenarios verified across platforms
```

## Common Scenarios by Issue Type

### Authentication Issues

**Focus areas:**
- Credential validation
- Token refresh
- Secure storage
- Error handling (invalid creds, network errors)
- Multi-user scenarios

### API Integration Issues

**Focus areas:**
- Request/response handling
- Pagination
- Rate limiting
- Error handling (timeouts, API errors)
- Data mapping

### UI/UX Issues

**Focus areas:**
- User workflows
- Accessibility (keyboard, screen readers)
- Error messages
- Loading states
- Responsive behavior

### Performance Issues

**Focus areas:**
- Load time metrics
- Memory usage
- CPU utilization
- Large dataset handling
- Concurrent operations

## Best Practices

1. **Be Specific** - Clear, unambiguous test steps
2. **Be Measurable** - Quantifiable expected results
3. **Be Comprehensive** - Cover happy path, errors, and edge cases
4. **Be Realistic** - Test real-world usage scenarios
5. **Be Consistent** - Follow template structure
6. **Be Accessible** - Anyone should be able to execute tests
7. **Be Maintained** - Update as requirements change

## References

- Lancelot Instructions: `.github/instructions/lancelot.instructions.md` (Rule #68)
- Test Framework: Mocha/Chai (see `test/` directory)
- VS Code Testing: https://code.visualstudio.com/api/working-with-extensions/testing-extension
