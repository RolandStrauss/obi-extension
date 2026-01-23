---
name: ibmi-extension-management
description: Guidance for overseeing the IBM i-specific aspects of the Lancelot VS Code extension, from release hygiene through operational maturity.
license: PROPRIETARY
metadata:
	author: RolandStrauss
	version: "1.0"
---

# IBM i Extension Management Skills

## Overview

This skill teaches Copilot how to support the operational side of the Lancelot VS Code extension that serves IBM i developers. Focus on release readiness, compliance, secure configuration, and observability for IBM i integrations so that every build, packaging run, and deployment respects the unique reliability and governance needs of IBM i environments.

## When to activate this skill

- The work touches extension packaging, versioning, or release notes that document IBM i-specific behavior.
- You need to define or validate configuration settings, secrets, telemetry, or automation tied to IBM i hosts, GitLab flows, or IBM i tooling dependencies.
- Security, compliance, or auditing questions arise for the IBM i workflows Powering this extension (e.g., token handling, telemetry controls, or audit logging of IBM i commands).
- Guidance is required for maintaining `.artifacts/`, release documentation, commercialization readiness, or packaging best practices that explicitly reference IBM i capabilities.

## Step-by-step assistance

1. **Review prerequisites.** Confirm the auto-increment/versioning scripts, `.vscodeignore`, and `package.json` metadata accurately reflect the IBM i-tailored extension (publisher, categories, description, configuration keys like `lancelot.gitlab.baseUrl`, and IBM i telemetry settings).
2. **Validate configuration and secrets.** Ensure any IBM i credentials, GitLab tokens, and telemetry connection strings are injected via environment variables or secure stores (never hardcoded) and documented in the docs and `.github/skills/ibmi-extension-management/SKILL.md` for reference.
3. **Protect packaging.** When building VSIX packages, keep `PUPPETEER_SKIP_DOWNLOAD=1`, confirm the artifact lands under `.artifacts/vsix/`, and update `.artifacts/releases/release_notes_X.X.X.md` plus `CHANGELOG.md` with IBM i-specific updates, compliance notes, and release instructions from `.artifacts/releases/release_notes_template.md`.
4. **Document IBM i behaviors.** Capture IBM i-specific limitations, configuration values, and telemetry/telemetry toggles in `docs/ibmi-extension-management.md` and mention them whenever release notes or README sections describe IBM i workflows.
5. **Secure telemetry and logging.** Recommend using App Insights connection strings only when configured via settings (e.g., `lancelot.telemetry.connectionString`) and ensure telemetry respects IBM i privacy—notify users about data collection, allow opt-out, and log sensitive actions via `trackEvent` for IBM i authentication, validation, or deployment events.
6. **Cross-platform sanity.** Verify IBM i hooks work on Windows, macOS, and Linux (packaging scripts, telemetry, and CLI helpers must not rely on platform-specific paths). Document in release notes or docs how to reproduce issues per platform.
7. **Promotion and support.** Tie IBM i release communications (from `docs/ibmi-extension-management.md`) to the commercialization validation checklist by highlighting release readiness, install guides, and troubleshooting steps, and reference `docs/ibmi/IBM_i_Testing_Summary.md` when describing regression coverage.

## Key capabilities and focus areas

- **Release hygiene:** Keep versioning automatic, docs synchronized, release notes templated, and `.artifacts/` folders clean per the auto-version increment and commercialization readiness rules.
- **Documentation stewardship:** Summarize IBM i configuration, onboarding, and troubleshooting content in `docs/ibmi-extension-management.md` so every release has a clear path for IBM i consumers.
- **Security compliance:** Emphasize environment-variable-driven secrets, secure telemetry via `trackEvent`, and audit-friendly logging around IBM i commands.
- **Telemetry and observability:** Recommend telemetry coverage for IBM i credential validation, GitLab automation events, and rate-limited API calls, while keeping data minimal and explicit.
- **Operational readiness:** Outline runbooks for packaging, vsix placement, documentation updates, and cross-platform validation, referencing relevant `.github/instructions/` files.

## Common pitfalls & checks

- Forgetting to update IBM i-specific sections in `CHANGELOG.md`, release notes, and documentation when code or configuration changes occur.
- Shipping secrets (GitLab tokens, IBM i credentials) in source files instead of secure vaults or environment variables.
- Publishing VSIX outside of `.artifacts/vsix/` or without running the auto-increment scripts described in `auto-version-increment.instructions.md`.
- Mixing platform-specific assumptions (e.g., Windows-only paths) into IBM i helpers.
- Omitting IBM i usage telemetry from release notes, leaving administrators unaware of what events are tracked and why.

## References

- `.github/instructions/auto-version-increment.instructions.md` for release automation and documentation sync.
- `.github/instructions/commercialization-readiness.instructions.md` for packaging, documentation, and support expectations.
- `.github/instructions/security-and-owasp.instructions.md` to keep IBM i telemetry and secrets handling secure.
- `docs/ibmi-extension-management.md` for operational runbooks, troubleshooting, and IBM i-specific onboarding guidance (expand as needed).
- `docs/ibmi/IBM_i_Testing_Summary.md` for regression and automation evidence when you mention IBM i quality assurance.
