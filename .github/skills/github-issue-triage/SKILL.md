---
name: github-issue-triage
description: 'Analyze, triage, plan, and manage GitHub issues systematically. Use this skill when you need to triage an existing issue, create implementation plans, analyze root causes, estimate effort, or update issues with structured analysis. Triggers on requests like "triage this issue", "analyze issue #X", "create a plan for this issue", "review issue completeness", or "estimate effort for this issue".'
---

# GitHub Issue Triage & Planning

Systematically analyze, triage, plan, and manage GitHub issues using structured workflows and the MCP GitHub tools.

## Lancelot Context

You operate as an IT Architect and DevSecOps Architect for the Lancelot VS Code extension, which provides GitLab-assisted workflows for IBM i 7.6 development. Your analysis must be:

- **Architecturally sound**: Consider VS Code extension patterns, IBM i constraints, GitLab 18.6 API capabilities
- **Security-first**: Follow DevSecOps best practices, shift-left security, secure-by-default patterns
- **Practical**: Provide actionable guidance with clear acceptance criteria and realistic estimates
- **Structured**: Use mermaid diagrams, Must/Should/Nice-to-have grouping, and comprehensive documentation

## When to Use This Skill

Use this skill when you need to:

- **Triage** an issue: categorize, assign labels, determine priority, suggest assignees
- **Analyze** an issue: understand root cause, map impacts, identify dependencies
- **Plan** an issue: create implementation roadmap, estimate effort, break into subtasks
- **Review** an issue: assess completeness, identify missing information, suggest improvements
- **Update** an issue: add structured analysis, implementation plan, or triage metadata

**Do NOT use** for creating new issues from scratch — use the `github-issues` skill instead.

## Available MCP Tools

| Tool | Purpose |
|------|---------|
| `mcp__github__get_issue` | Fetch issue details |
| `mcp__github__update_issue` | Update issue with analysis/plan |
| `mcp__github__add_issue_comment` | Add comments with findings |
| `mcp__github__search_issues` | Find related/duplicate issues |
| `mcp__github__list_issues` | List repository issues |

## Workflow

### 1. **Ingest**
Obtain the issue to analyze:
- Accept issue number, URL, or full text from user
- Call `mcp__github__get_issue` to fetch current state
- Read existing body, labels, comments, assignees, milestone

### 2. **Analyze**
Understand the issue deeply:
- **Categorize**: Bug, feature, enhancement, task, documentation, or complex architectural change
- **Extract key information**: Problem statement, current vs expected behavior, impact
- **Identify gaps**: Missing acceptance criteria, unclear requirements, incomplete reproduction steps
- **Research context**: Search for related issues, check project/milestone alignment

### 3. **Triage**
Apply structured categorization:
- **Type**: Determine primary type (bug/feature/enhancement/task/docs/architecture)
- **Priority**: Assess urgency (critical/high/medium/low) based on impact and user base
- **Severity**: Rate technical impact (critical/high/medium/low)
- **Labels**: Recommend specific labels from the repository taxonomy
- **Assignees**: Suggest team members based on expertise areas
- **Milestone**: Recommend sprint/release milestone if applicable

See [references/triage-criteria.md](references/triage-criteria.md) for detailed rubrics.

### 4. **Address** (if complex)
For architectural or complex issues:
- **Root cause analysis**: Identify underlying cause (if bug) or design gap (if feature)
- **Impact mapping**: Document effects on users, systems, security, compliance
- **Constraints**: Identify technical, platform, or business constraints
- **Dependencies**: Map dependencies on other issues, external systems, or team work
- **Solution approach**: Propose high-level solution with alternatives considered

### 5. **Plan** (if needed)
For issues requiring implementation:
- **Architecture & Design**: Component overview, data flow diagram, integration points
- **Acceptance Criteria**: Group by Must/Should/Nice-to-have for prioritization
- **Implementation Details**: Key technical approach, patterns, security controls
- **Effort Estimation**: Size (S/M/L), hours/days estimate, breakdown by phase
- **Testing Strategy**: Unit, integration, end-to-end, security, accessibility
- **Success Metrics**: Measurable outcomes (latency, error rate, adoption, satisfaction)
- **Implementation Plan**: Step-by-step roadmap with dependencies
- **Risks**: Identify blockers, unknowns, and mitigation strategies

See [references/planning-framework.md](references/planning-framework.md) for detailed templates.

### 6. **Update**
Apply the analysis back to GitHub:
- **Option A (Recommended)**: Update issue body with structured analysis using `mcp__github__update_issue`
- **Option B**: Add analysis as comment using `mcp__github__add_issue_comment`
- **Option C**: Present findings to user for manual application

Always include:
- Updated labels reflecting triage decisions
- Priority/severity labels if not present
- Links to related issues discovered during analysis

### 7. **Confirm**
Report results to user:
- Summarize triage decisions (type, priority, labels, assignees)
- Highlight key findings from analysis
- Confirm issue URL and next recommended actions
- Mention any blockers or open questions identified

## Triage Criteria Quick Reference

### Priority Levels

| Priority | Criteria | Response Time |
|----------|----------|---------------|
| **Critical** | System down, data loss, security breach | Immediate (< 4 hours) |
| **High** | Major functionality broken, blocking workflow | Same/next business day |
| **Medium** | Feature impaired, workaround exists | 1-2 weeks |
| **Low** | Minor issue, cosmetic, nice-to-have | Backlog |

### Severity Levels

| Severity | Technical Impact |
|----------|------------------|
| **Critical** | System crash, data corruption, security vulnerability |
| **High** | Core feature broken, significant performance degradation |
| **Medium** | Partial feature impairment, minor performance impact |
| **Low** | Cosmetic issue, edge case, documentation gap |

### Lancelot-Specific Labels

| Label | Use For |
|-------|---------|
| `architecture` | Architectural design, component structure, integration patterns |
| `devsecops` | Security, compliance, DevOps automation, shift-left concerns |
| `ibmi` | IBM i 7.6 specific work (SQLRPGLE, CLLE, DB2, jobs, profiles) |
| `gitlab-integration` | GitLab 18.6 API, OAuth2, webhooks, CI/CD triggers |
| `vscode-extension` | VS Code extension API, webviews, commands, activation |
| `telemetry` | Application Insights, logging, metrics, observability |
| `accessibility` | Screen reader support, keyboard navigation, ARIA |
| `i18n` | Internationalization, localization, translation |
| `testing` | Unit tests, integration tests, test coverage |
| `documentation` | README, docs/, JSDoc, code comments |
| `needs-triage` | Awaiting categorization and prioritization |

Full taxonomy and decision trees: [references/triage-criteria.md](references/triage-criteria.md)

## Planning Framework Quick Reference

### Implementation Plan Structure

```markdown
# Implementation Plan

## Phase 1: Foundation (X hours)
1. [Task]
2. [Task]

## Phase 2: Core Features (Y hours)
1. [Task]
2. [Task]

## Phase 3: Integration & Testing (Z hours)
1. [Task]
2. [Task]

## Phase 4: Documentation & Release (W hours)
1. [Task]
2. [Task]

**Total Estimated Effort**: N hours (M days)
```

### Effort Estimation Guide

| Size | Complexity | Hours | Days |
|------|------------|-------|------|
| **XS** | Trivial change, single file | 1-2h | < 0.5 days |
| **S** | Simple feature, few files | 2-8h | 0.5-1 days |
| **M** | Moderate complexity, multiple components | 8-24h | 1-3 days |
| **L** | Complex feature, cross-system integration | 24-80h | 3-10 days |
| **XL** | Architectural change, major refactoring | 80h+ | 10+ days |

Full framework with templates: [references/planning-framework.md](references/planning-framework.md)

## Examples

### Example 1: Triage a Bug Report

**User**: "Triage issue #540 - login timeout error"

**Action**:
1. **Ingest**: Fetch issue #540 via `mcp__github__get_issue`
2. **Analyze**:
   - Type: Bug (login functionality broken)
   - Current behavior: Login times out after 10s
   - Expected: Should complete within 30s
   - Impact: All users with slow networks affected
3. **Triage**:
   - Type: bug
   - Priority: high (blocking login for subset of users)
   - Severity: high (core authentication feature)
   - Labels: `bug`, `priority/high`, `severity/high`, `gitlab-integration`, `needs-investigation`
   - Assignee: @auth-team-lead (owns authentication module)
4. **Address**:
   - Root cause: Likely network timeout configuration too low (10s hardcoded)
   - Constraint: GitLab API may be slow in some regions
   - Solution: Make timeout configurable, default to 30s
5. **Update**: Call `mcp__github__update_issue` with labels and brief analysis comment
6. **Confirm**: "Issue #540 triaged as high-priority bug. Root cause likely hardcoded timeout. Assigned to @auth-team-lead. Labels updated."

### Example 2: Create Implementation Plan for Feature Request

**User**: "Create a plan for issue #537 - auto-generate VS Code profiles from IBM i profiles"

**Action**:
1. **Ingest**: Fetch issue #537 (already has comprehensive template, but lacks implementation plan)
2. **Analyze**:
   - Type: Feature (new capability in Merge Services)
   - Complexity: Medium (requires profile parsing, VS Code settings generation, UI updates)
   - Dependencies: VS Code Settings API, IBM i profile metadata format
3. **Plan**:
   - **Architecture**: Add ProfileGenerator service, SettingsWriter utility, UI command
   - **Data Flow**: Diagram showing IBM i profile → parser → VS Code settings → user profile
   - **Acceptance Criteria**:
     - Must: Parse IBM i profiles, generate VS Code settings, validate output
     - Should: Support multiple profiles, allow customization, provide preview
     - Nice-to-have: Auto-sync on profile changes, preset templates
   - **Effort**: 20-24 hours (Medium), breakdown:
     - ProfileGenerator: 8h
     - SettingsWriter: 6h
     - UI integration: 4h
     - Testing: 4h
     - Documentation: 2h
   - **Testing Strategy**: Unit (parser), integration (end-to-end profile generation), manual (VS Code UI)
   - **Success Metrics**: Profile generation success rate ≥99%, user onboarding time reduced 30%
   - **Implementation Plan**:
     1. Create ProfileGenerator service with unit tests
     2. Implement SettingsWriter with validation
     3. Add Merge Services UI command
     4. Integration testing
     5. Documentation update
4. **Update**: Call `mcp__github__update_issue` to append implementation plan section
5. **Confirm**: "Implementation plan added to issue #537. Estimated 20-24h (Medium). Plan includes 5 phases with testing and metrics."

### Example 3: Review Issue for Completeness

**User**: "Review issue #550 - it seems incomplete"

**Action**:
1. **Ingest**: Fetch issue #550
2. **Analyze**:
   - Current state: Vague description "GitLab sync not working"
   - Missing: Steps to reproduce, expected behavior, error messages, environment details
3. **Triage**:
   - Type: bug (likely)
   - Priority: Cannot determine (insufficient info)
   - Labels: `needs-info`, `needs-triage`
4. **Address**: Create checklist of missing information:
   - [ ] Specific steps to reproduce the sync failure
   - [ ] Expected sync behavior
   - [ ] Actual behavior and error messages (logs, screenshots)
   - [ ] Environment: VS Code version, Lancelot version, GitLab version, OS
   - [ ] When did this start? Was it working before?
   - [ ] Which GitLab repository and branch?
5. **Update**: Call `mcp__github__add_issue_comment` with missing info checklist
6. **Confirm**: "Issue #550 needs additional information. Posted comment requesting reproduction steps, error messages, and environment details. Added `needs-info` label."

### Example 4: Analyze Root Cause and Suggest Fix

**User**: "Analyze issue #555 - performance degradation in GitLab API calls"

**Action**:
1. **Ingest**: Fetch issue #555
2. **Analyze**:
   - Type: Bug (performance regression)
   - Symptoms: API calls taking 5-10s, previously <1s
   - Timeline: Started after v0.12.0 release
3. **Triage**:
   - Type: bug
   - Priority: high (impacts all GitLab features)
   - Severity: medium (degraded but functional)
   - Labels: `bug`, `priority/high`, `severity/medium`, `gitlab-integration`, `performance`
4. **Address**:
   - **Root Cause Analysis**:
     - v0.12.0 introduced OAuth2 token refresh on every API call (code review confirms)
     - Previous versions refreshed only when expired (every 1 hour)
     - Token refresh adds 2-3s latency per call
   - **Impact**: All GitLab API-dependent features slowed (merge requests, pipelines, issues)
   - **Solution**: Cache token validity, only refresh when expired or within 5min of expiry
   - **Alternative**: Implement token refresh in background worker
5. **Plan**:
   - **Implementation**:
     - Add token expiry timestamp to cache
     - Check timestamp before refresh
     - Add telemetry for refresh frequency
   - **Effort**: 4-6 hours (Small)
   - **Testing**: Mock token expiry scenarios, measure latency improvement
   - **Success Metrics**: API call latency p95 <500ms (vs current 5-10s)
6. **Update**: Call `mcp__github__update_issue` with root cause analysis and implementation plan
7. **Confirm**: "Root cause identified in issue #555: unnecessary token refresh on every API call. Proposed fix: cache token validity. Estimated 4-6h effort. Latency should drop to <500ms."

## Integration with GitHub Issues Skill

This skill **complements** the `github-issues` skill:

| Skill | Primary Use |
|-------|-------------|
| **github-issues** | Create new issues from scratch with templates |
| **github-issue-triage** | Analyze and plan existing issues |

**Typical Workflow**:
1. User reports a problem → Use `github-issues` to create structured issue
2. Issue needs analysis/planning → Use `github-issue-triage` to add depth
3. Issue ready for work → Developer picks up from comprehensive triage/plan

**When to use which**:
- "Create an issue for X" → `github-issues`
- "Triage issue #123" → `github-issue-triage`
- "Plan how to implement issue #456" → `github-issue-triage`
- "Review issue #789 for completeness" → `github-issue-triage`

## Tips

- **Always fetch first**: Use `mcp__github__get_issue` to get current state before making recommendations
- **Search for context**: Use `mcp__github__search_issues` to find related issues, duplicates, or prior discussions
- **Be specific with labels**: Use the full Lancelot label taxonomy, not just generic labels
- **Estimate conservatively**: Round effort up to account for unknowns, testing, and documentation
- **Include diagrams**: Use mermaid for logic flow, data flow, architecture when planning complex issues
- **Group acceptance criteria**: Use Must/Should/Nice-to-have to help prioritization
- **Link related work**: Always cross-reference related issues, dependencies, and blockers
- **Consider security**: Flag DevSecOps concerns, shift-left opportunities, and compliance requirements
- **Think holistically**: Consider impact on users, systems, CI/CD, telemetry, documentation, testing

