---
applyTo: '*'
description: 'Lancelot extension architecture, workflow, and development instructions for maintainers and contributors.'
---

# Lancelot Extension Instructions

## Project Overview

Lancelot is a comprehensive VS Code extension that provides GitLab-assisted workflows specifically designed for IBM i development. It offers an intelligent UI interface that streamlines development processes, automates CI/CD workflows, and integrates seamlessly with GitLab repositories and REST APIs.

## Branch & Commit Naming

See `.github/skills/branch-naming-workflow/SKILL.md` for comprehensive branch naming conventions, commit message standards, and CI validation setup.

## Core Development Principles

### Architecture & Design Patterns

1. Follow the codebase's architecture and design patterns (TypeScript, VS Code API, modular structure).
2. Register all new features as commands or panels in `src/extension.ts` and document in `package.json`.
3. Use clear, consistent UI labels (e.g., "Project" not "Repository").
4. Use icons from the `images/` folder; update the activity bar icon in `package.json` as needed.
5. Apply dependency injection for services; avoid hardcoded dependencies.
6. Separate business logic from UI logic; use service classes for integrations.
7. Place shared services/utilities in `src/core/`.
8. **UI Implementation Strategy**: Prefer VS Code native UI elements (dialogs, QuickPick, status bar, etc.) for consistency and performance. However, when a web UI (webview) solution provides significantly better user experience, enhanced functionality, or superior workflow efficiency, web UI implementations are permitted and encouraged. Consider web UI for: complex dashboards, rich data visualization, multi-step forms with real-time validation, or interactive data manipulation interfaces.

### Code Quality & Standards

9. Use async/await for asynchronous operations; handle errors gracefully.
10. Apply strict TypeScript types and interfaces for all public APIs and module boundaries. See `.github/skills/typescript-strict-typing/SKILL.md` for strict typing standards and never use `any`.
11. Write maintainable code with descriptive comments for complex logic. See `self-explanatory-code-commenting.instructions.md`.
12. **File Header Change Summary**: When making changes to any file with a header comment block containing a "Change Summary:" field, MUST update that field with a brief description of what changed. This maintains accurate file-level change tracking and helps future maintainers understand the evolution of the code.
13. Optimize extension activation events for minimal startup time.
14. Avoid global state; use VS Code context and workspace storage.
15. Follow [Semantic Versioning 2.0.0](https://semver.org/) (MAJOR.MINOR.PATCH); update `CHANGELOG.md` using the [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) structure and the extra guidance outlined in this document for every release.
16. Use Prettier and ESLint for formatting and linting.
17. Remove unused files, comments, and code snippets.
18. Follow platform-specific rules from `.github/copilot-instructions.md` for PowerShell syntax, file operations, and environment setup.
19. Prefer Node.js APIs or libraries for scripting and automation where possible. If PowerShell is required for platform-specific tasks, invoke `pwsh` from Node.js using `child_process.spawn` with proper error handling and document any PowerShell dependencies and required modules.
20. **VSIX Package Location**: All VSIX packages are created directly in the `.artifacts/vsix/` folder via the `--out` flag in package scripts. Release notes are created in `.artifacts/releases/` folder to maintain a clean workspace root.
21. **Auto-Increment Version Management**: ALL VSIX package builds MUST automatically increment the version number and update related documentation. Use `npm run package` (patch), `npm run package:minor`, or `npm run package:major`. See `auto-version-increment.instructions.md` and `.github/skills/version-management/SKILL.md` for details.
22. **NEVER update README.md automatically**: Do not modify README.md files without explicit user request or instruction to do so.

### Accessibility - Webview Best Practices

- Avoid setting `aria-hidden` on `document.body` or other host-level ancestors. Setting `aria-hidden` broadly can block assistive technologies and produce runtime accessibility warnings when focused descendants remain active. Instead:
    - Use the WICG `inert` semantics (or a polyfill) to make background content unfocusable when showing overlays/modals inside webviews.
    - If `inert` is not available, set `aria-hidden="true"` only on individual sibling elements (never on `body`) so the overlay itself remains operable and focusable.
    - When hiding background content, ensure any element that currently has focus is blurred or moved to the overlay before applying `inert`/`aria-hidden` changes to avoid blocked focus issues.
    - Prefer a message-driven lifecycle between the extension host and webviews (e.g., host posts `{ type: 'showOverlay', overlayId }` / `{ type: 'hideOverlay' }`), and perform inert/aria-hidden manipulation inside the webview in response to those messages. This ensures the webview controls ordering and focus safely.

These rules prevent the common accessibility error "Blocked aria-hidden on an element because its descendant retained focus" caused by programmatically hiding broad ancestors while a descendant still retains focus. Follow them when implementing or refactoring any webview that displays overlays, dialogs, or panels.

### Cross-Platform Compatibility

- The Lancelot extension MUST be able to run on Windows, macOS, and Linux environments. Ensure that all build, packaging, test and runtime steps (including VSIX creation, installation scripts, and any helper tooling) are compatible with these platforms.
- CI/CD pipelines MUST include cross-platform validation (e.g., build and smoke-test jobs for Windows, macOS, and Linux) before publishing artifacts. Fail the release if cross-platform validation does not pass.
- Avoid hard-coded platform-specific paths, shell syntax, or separators in source files and scripts. When platform-specific behavior is required, detect the platform at runtime and provide safe, documented fallbacks.
- If native modules or platform-specific binaries are necessary, provide clear documentation in `docs/` about required system dependencies and include automated checks during packaging to ensure the correct artifacts are produced for each OS.


### Root Folder Organization & Project Structure

23. **Keep Root Folder Clean**: See `.github/skills/lancelot-folder-structure/SKILL.md` for comprehensive folder organization standards, approved files, structure guidelines, and best practices.

### Integration Architecture

31. Use `src/authentication/` modules for authentication (OAuth2/OIDC).
32. Use `src/gitlab/` for GitLab integration with rate limiting and caching.
33. Use `src/rest/` for REST API integration with comprehensive error handling.
34. Use `src/ibmi/` and `src/workspace/` for source synchronization.
35. Integrate IBM i compilation/deployment with existing tooling and workflows.

## CI/CD & Workflow Automation

### Automated Pipeline Requirements

36. Implement REST API-triggered workflows for ticket status changes.
37. Support sparse checkout for monorepo optimization with user-guided file selection.
38. Automate branch creation using REST API ticket numbers (e.g., `RequestNumber/PROJ-123`).
39. Automate document generation for technical discussion and impact analysis.
40. Manage database artifacts (SQL/DDL, DDS) with promotion strategies.
41. Support automated testing pipelines and QA1/QA2 environment promotion.
42. Integrate Change Management workflows with CAB approval.
43. Automate cleanup of branches and temporary artifacts post-deployment.

### Workflow Phase Implementation

44. Implement all workflow phases: registration, requests, development, review, deployment, post-deployment.
45. Use robust error handling with retry and fallback procedures.
46. Provide comprehensive audit logging for all automated processes and user interactions.
47. Enable real-time notifications for status changes, approvals, and milestones.

## Security & Performance

### Security-First Development

48. Never store long-lived secrets in the extension or on user machines.
49. Use VS Code SecretStorage for short-lived tokens with secure refresh flows.
50. Enforce TLS encryption for all API communications.
51. Apply least-privilege access patterns with explicit role-based escalation.
52. Maintain comprehensive audit trails for authentication and authorization events.
52a. **Telemetry-First Logging:** Always use `trackEvent()` from telemetry service for logging critical events (authentication, validation, errors). Only use `Logger` as a safe fallback when telemetry is unavailable. This ensures consistent metrics collection across the extension. Example: `trackEvent('gitlab_validation_success', { username, cacheSource })` with logger fallback for initialization failures.

### Performance & Reliability

53. Implement rate limiting per service to prevent API abuse and manage system load.
54. Use intelligent caching for GET responses with configurable TTL.
55. Support graceful degradation when external services are unavailable.
56. Ensure RBAC API responses ≤ 200ms p95 within the corporate network.
57. Automate monitoring and alerting for performance degradation.

## Testing & Quality Assurance

### Comprehensive Testing

58. Cover all new code with unit tests in the `test/` folder.
59. Ensure new features are covered by integration tests.
60. Write unit tests for all new features and bug fixes.
61. Run and pass all tests before merging changes.
62. Implement end-to-end testing for workflow automation.
63. Test the extension on all supported platforms (Windows, macOS, Linux).
64. Test batching rule: For large test suites (e.g., Mocha running 100+ files), always execute tests in batches to improve stability and reduce wall-clock time. Prefer 3–4 batches of ~30–40 files each; use higher Node heap (8–16GB) if needed. In CI, run batches in parallel when feasible.

### Quality Gates

64. Implement error handling and input validation for all user-facing commands.
65. Maintain backward compatibility for public APIs and configuration options.
66. Ensure accessibility and localization for all UI elements and messages.
67. Regularly review and refactor code for performance and maintainability.

### Issue Test Scenarios

68. **Test Scenario Documentation**: See `.github/skills/test-scenario-documentation/SKILL.md` for comprehensive test scenario standards and requirements for every issue fix or remediation.

## Documentation & Reporting

### Documentation Requirements

69. Document all new commands, features, and configuration options in `README.md` only when explicitly requested by the user.
70. **Version Number Updates**: ALWAYS update `README.md` with the new version number each time a new version is created and released. This includes updating version references in installation instructions, feature lists, and any version-specific sections. Version numbers in README must be kept synchronized with package.json and CHANGELOG.md to avoid confusion for users.
71. Keep the PRD document up to date and use it as a reference for all development work.
72. Update checklist and chat-prompts files whenever workflow or requirements change.
73. Document all changes and decisions made during development for future reference.
74. **Feature Documentation**: See `.github/skills/feature-documentation/SKILL.md` for comprehensive feature documentation standards and requirements.

### Development Tracking

75. Log user prompts and Copilot actions in `chat-prompts.md`.
76. Track development progress and checklist items in `run_tasks.md`.
77. Add sprint tasks as checklist/todo actions in `run_tasks.md`.
78. Break down large tasks into smaller, manageable subtasks.
79. Generate weekly summary reports in `docs/development/reports/Weekly/` (name: work*done*<week*start_date>\_to*<week_end_date>.md).
80. Generate sprint reports in `docs/development/reports/Sprints/` (name: Sprint*<week_number>*<week*start_date>\_to*<week_end_date>.md; include planned actions for the next sprint).
81. Include code snippets, design decisions, and challenges in reports as applicable.
82. **Version Management**: Follow the auto-increment version management rules detailed in `.github/instructions/auto-version-increment.instructions.md` for all VSIX releases and documentation updates.
83. **Memory Bank & Core Docs:** Keep all `memory-bank/` files, `launch.json`, `tasks.json`, and `CHANGELOG.md` synchronized with the ongoing Lancelot work. Update them as the project evolves so that the memory bank reflects active context, the workspace launch/tasks configs represent current scripts, and the changelog records every release or notable state change.

### Changelog Standards

See `.github/skills/changelog-management/SKILL.md` for comprehensive CHANGELOG.md format and management guidance following Keep a Changelog 1.1.0.

## Continuous Improvement

### Feedback & Enhancement

84. Request clarification or additional requirements when needed.
85. Seek feedback from peers and stakeholders to refine development practices.
86. Regularly review and update the development workflow for effectiveness.
87. Implement agreed changes and track their impact.

### Process Evolution

88. Review and update these Lancelot instructions based on feedback and changing requirements.
89. Foster a culture of continuous improvement by encouraging workflow enhancements.
90. Establish clear processes for handling and incorporating feedback into development workflows.

## Extension Development Workflow

- Keep `copilot-instructions.md`, `chat-prompts.md`, `ibmi/product_requirements_document.md`, and `run_tasks.md` up to date.
- Use modular TypeScript and VS Code extension best practices.
- Validate all changes with comprehensive testing and update documentation accordingly.
- Request user input for unclear requirements or missing information.
- Follow security-first development practices with comprehensive audit logging.
- Implement CI/CD automation patterns aligned with PRD requirements.
- Break down complex tasks into manageable subtasks with clear acceptance criteria.

### Webview and Tree View Feature Parity

See `.github/skills/webview-tree-parity/SKILL.md` for comprehensive guidance on maintaining feature parity between Webview and Tree View implementations, shared-service patterns, and code examples.

## Related Instruction Files

- **TypeScript**: `instructions/typescript-5-es2022.instructions.md`
- **Security**: `instructions/security-and-owasp.instructions.md`
- **Performance**: `instructions/performance-optimization.instructions.md`
- **Testing**: `instructions/playwright-typescript.instructions.md`
- **Auto Versioning**: `instructions/auto-version-increment.instructions.md`
- **i18n**: `instructions/i18n.instructions.md`
