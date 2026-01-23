---
applyTo: '*'
description: 'Lancelot extension architecture, workflow, and development instructions for maintainers and contributors.'
---

# Lancelot Extension Instructions

## Project Overview

Lancelot is a comprehensive VS Code extension that provides GitLab-assisted workflows specifically designed for IBM i development. It offers an intelligent UI interface that streamlines development processes, automates CI/CD workflows, and integrates seamlessly with GitLab repositories and REST APIs.

## Branch & Commit Naming

Branch names must follow the `<type>/<assignee>/<description>` pattern. (max 50 chars for <description>)
Types should align with the Conventional Commits spec: `feature`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `ci`, `style`, `build`, 'wip', or `revert`.

- Example: `feature/roland/add-jira-branching`
- Commit messages must follow Conventional Commits (`type(scope?): subject`). Example: `feat(auth): add OAuth2 login flow`.

Release branches must follow `release/<assignee>/<semver>` and hotfixes `hotfix/<assignee>/<description>`.

Server-side workflows enforce these rules by validating branch names and the commits within pushes and pull requests. They typically:

1. Skip validation for `main`, `master`, and semantic version tags (`vX.Y.Z`).
2. Ensure release and hotfix branches follow the stricter formats above.
3. Enforce `<type>/<assignee>/<description>` for other branches and check commits against Conventional Commits.
4. Fail the run if any validation does not pass.

Recommended CI steps:

1. Fetch the full history (`fetch-depth: 0`) so validations see all commits.
2. On pull requests, validate the head ref and every commit in the PR.
3. On pushes, validate the pushed branch name and commits in the `before..after` range.
4. Exit non-zero whenever validation fails so automation marks the run as failed.

Local developer guidance:

- Provide the `scripts/install-commit-hook.ps1` helper so contributors can install a `commit-msg` hook.
- Document these conventions in `CONTRIBUTING.md` and surface quick fixes for lint failures.

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
10. Apply strict TypeScript types and interfaces for all public APIs and module boundaries. Follow strict typing rules from `typescript-5-es2022.instructions.md` - never use `any`.
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
21. **Auto-Increment Version Management**: ALL VSIX package builds MUST automatically increment the version number and update related documentation. Use `npm run package` (patch), `npm run package:minor`, or `npm run package:major` which automatically call `scripts/increment-version.js` before building. This ensures consistent versioning, proper release tracking, and synchronized documentation updates. Manual version changes should be rare and documented. See `auto-version-increment.instructions.md` for details.
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

23. **Keep Root Folder Clean**: The project root folder MUST remain clean and contain only essential files as per industry standards and best practices. This improves repository clarity, maintainability, and discoverability.

24. **Approved Files in Root**:
    - Essential metadata: `package.json`, `package-lock.json`, `tsconfig.json`, `tsconfig.test.json`
    - Build/config: `eslint.config.js`, `vite.config.ts`
    - Documentation: `README.md`, `CHANGELOG.md`, `LICENSE.md`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`
    - CI/CD: `.github/` folder (workflows, instructions)
    - Dotfiles: `.gitignore`, `.prettierrc`, `.prettierignore`, `.editorconfig`, `.vscode/` (settings, extensions, launch configs)
    - Type definitions: `types/` folder (optional, if needed)

25. **Files/Folders That MUST NOT Be in Root**:
    - Source code files (`.ts`, `.js`) → `src/` folder
    - Test files (`.test.ts`, `.spec.ts`) → `test/` folder
    - Documentation (other than primary docs) → `docs/` folder
    - Scripts and utilities → `scripts/` folder
    - Build artifacts → `.artifacts/` folder (or configured output directory)
    - Temporary/debug files → `.agent_work/`, `temp/`, `out/` folders
    - Node modules → `node_modules/` (never commit)
    - Distribution/output files → `.artifacts/`, `dist/`, `out/` folders

26. **Specific Folder Organization Standards**:

    **`src/`** - Source code
    - `src/extension.ts` - Extension entry point
    - `src/core/` - Shared services and utilities
    - `src/authentication/` - Authentication modules
    - `src/gitlab/` - GitLab integration
    - `src/rest/` - REST API integration
    - `src/ibmi/` - IBM i integration
    - `src/workspace/` - Workspace management
    - `src/ui/` - UI components and views
    - `src/commands/` - VS Code commands

    **`test/`** - Test files (mirror `src/` structure)
    - Mocha test files with `*.test.ts` naming
    - Organized by feature/module to match `src/`

    **`docs/`** - Documentation
    - `docs/features/` - Feature documentation
    - `docs/testing/` - Test documentation
    - `docs/architecture/` - Architecture decisions
    - `docs/development/` - Development guides
    - `docs/api/` - API documentation
    - `docs/ibmi/` - IBM i specific documentation
    - `.github/instructions/` - (separate) Copilot and workflow instructions

    **`.artifacts/`** - Build artifacts and releases
    - `.artifacts/vsix/` - VSIX packages
    - `.artifacts/releases/` - Release notes and metadata

    **`scripts/`** - Build and utility scripts
    - PowerShell, Node.js, or Bash scripts
    - No source code or test files here

27. **When Adding New Files/Folders**:
    - Always determine the appropriate subfolder based on file type and purpose
    - Use the folder structure above as the standard
    - If a new folder category is needed, document it in this section and get team approval
    - Never create files in root without explicit justification
    - Update this file to document any new approved root-level files

28. **Migration of Existing Root Files**:
    - Audit root folder regularly for files that don't belong
    - Move misplaced files to appropriate subfolders
    - Update `.gitignore` and build configs to reflect new locations
    - Update documentation to reference new file locations
    - Update CI/CD workflows to use new paths

29. **Artifact Cleanup**:
    - Temporary debugging files go to `.agent_work/` or `temp/` folders (never commit)
    - Build outputs go to `.artifacts/` or configured `out/` directory
    - Add cleanup tasks to CI/CD to remove temporary artifacts after builds
    - Keep only release artifacts in version control

30. **Benefits of Clean Root Folder**:
    - **Clarity**: Contributors immediately understand project structure
    - **Discoverability**: Essential files are easy to locate
    - **Professionalism**: Follows industry standards and best practices
    - **Maintainability**: Easier to manage dependencies and configurations
    - **Scalability**: Clear organization supports project growth
    - **Automation**: Tooling works predictably with standard folder structure

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

68. **Test Scenario Documentation**: For EVERY issue that is fixed or remediated, create a comprehensive test scenarios document in `docs/testing/` directory. Use naming format: `issue-{NUMBER}-test-scenarios.md` (e.g., `issue-192-test-scenarios.md`). The document MUST include:
    - Feature overview
    - Basic functionality test scenarios
    - Edge case scenarios
    - Performance testing scenarios
    - Regression testing scenarios
    - User experience validation
    - Acceptance criteria
    - Sign-off section

    This ensures consistent testing standards and provides clear validation criteria for all bug fixes and enhancements.

## Documentation & Reporting

### Documentation Requirements

69. Document all new commands, features, and configuration options in `README.md` only when explicitly requested by the user.
70. **Version Number Updates**: ALWAYS update `README.md` with the new version number each time a new version is created and released. This includes updating version references in installation instructions, feature lists, and any version-specific sections. Version numbers in README must be kept synchronized with package.json and CHANGELOG.md to avoid confusion for users.
71. Keep the PRD document up to date and use it as a reference for all development work.
72. Update checklist and chat-prompts files whenever workflow or requirements change.
73. Document all changes and decisions made during development for future reference.
74. **Feature Documentation**: ALL feature documentation MUST be created in `docs/features/` directory. Use descriptive kebab-case naming (e.g., `auto-update-feature.md`, `permission-analytics-dashboard.md`). Update `docs/features/README.md` index when adding new features.

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

When editing `CHANGELOG.md`, follow the structure and terminology defined by [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/). The changelog must continue to feel human-readable, provide a chronological release history, link sections such as `[Unreleased]` or `[0.11.3]`, and adhere to Semantic Versioning (MAJOR.MINOR.PATCH).

**Guiding Principles**:
- Changelogs are for humans, not machines.
- There should be an entry for every single release/version (no gaps).
- Like changes should be grouped under the same section (e.g., all new features under `Added`).
- Versions, releases, and sections should be linkable using the `[Version]` bracketed headings recommended by Keep a Changelog.
- Keep an `Unreleased` section at the top to surface future work.
  - This allows readers to understand what may arrive in the next release.
  - When preparing a release, migrate the outstanding `Unreleased` entries into the new release version section, then update `Unreleased` with the work that applies to the following release.
- The release notes must remain in descending order: `Unreleased` first, followed by the most recent released version, and so on.
- Every release entry must show its release date (YYYY-MM-DD).

**Types of Changes**:
- `Added` for new features.
- `Changed` for updates to existing functionality.
- `Deprecated` for features that are still present but scheduled for removal.
- `Removed` for features that are no longer part of the product.
- `Fixed` for bug fixes.
- `Security` for vulnerabilities or security hardening.

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

- When changes are made that affect the UI behavior, presentation, or data model in either a Webview or a Tree View, ensure the equivalent changes are applied to the other view so both remain in feature parity.
    - Examples: if a new action, filter, selection behavior, data column, or context-menu command is added to a Webview, the Tree View should expose the same capability (and vice versa) unless a deliberate, documented divergence is approved.
    - Update shared services, models, and data adapters in `src/core/` or appropriate service layers so logic is centralized and shared between Webview and Tree View implementations to reduce duplication and drift.
    - Include cross-view acceptance criteria in the issue's test scenarios (see `docs/testing/`) and validate parity during code review and QA testing.
    - If a divergence is necessary, document the reason in a Decision Record and include UX / accessibility implications.

    #### Example: Minimal shared-service pattern

    To reduce duplication and keep Webview and Tree View logic in sync, place shared interfaces and adapters in `src/core/`. Here's a minimal example that contributors can copy as a starting point.

    Example TypeScript interface (suggested file: `src/core/uiShared.ts`):

    ```ts
    // src/core/uiShared.ts
    export interface ISelectableItem {
        id: string;
        label: string;
        description?: string;
    }

    export interface IUiSyncService {
        // Returns items for both Webview and Tree View
        getItems(): Promise<ISelectableItem[]>;

        // Select an item; used by both views to maintain a single source of truth
        selectItem(id: string): Promise<void>;

        // Subscribe to changes (optional simple callback pattern)
        onDidChange(callback: (items: ISelectableItem[]) => void): void;
    }
    ```

    Example small README note (suggested file: `docs/features/webview-tree-parity.md`):

    ```md
    # Webview / Tree View Parity

    Use `src/core/uiShared.ts` to implement the shared data and behavior between Webviews and Tree Views. Webviews should call `IUiSyncService.getItems()` to render lists or tables; Tree Views should use the same service to populate their tree nodes. When an item is selected in either view, call `IUiSyncService.selectItem(id)` so both views observe a single source of truth.

    Keep UI-only presentation code (e.g., HTML templating or TreeItem rendering) in the respective view implementations; keep data, selection, and business logic in `src/core/` services so parity is straightforward.
    ```

## Related Instruction Files

- **TypeScript**: `instructions/typescript-5-es2022.instructions.md`
- **Security**: `instructions/security-and-owasp.instructions.md`
- **Performance**: `instructions/performance-optimization.instructions.md`
- **Testing**: `instructions/playwright-typescript.instructions.md`
- **Auto Versioning**: `instructions/auto-version-increment.instructions.md`
- **i18n**: `instructions/i18n.instructions.md`
