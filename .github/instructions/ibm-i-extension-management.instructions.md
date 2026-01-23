---
description: 'Repository-level direction for safely packaging, documenting, and supporting IBM i-focused features in the Lancelot extension.'
applyTo: '*'
---

# IBM i Extension Management Instructions

## Purpose

This instruction set mirrors the `.github/skills/ibmi-extension-management/SKILL.md` guidance and anchors it in a compliance-ready format for repo automation, documentation, and Copilot behavior. Apply it whenever an issue, feature, or release touches the IBM i-specific surface area of the extension.

## When to activate this guidance

- Changes affect packaging, release notes, or documentation that describe IBM i behaviors, configuration keys, or telemetry events.
- Questions involve IBM i credentials, GitLab tokens, telemetry toggles, or automation that call IBM i hosts and must be secured through environment variables, a `.env` file, or VS Code SecretStorage.
- Work touches telemetry, logging, or observability for IBM i validation, deployment, or automation flows that must keep telemetry opt-out friendly and privacy conscious.
- Assistance is needed to align commercialization, release hygiene, or onboarding materials with IBM i requirements.

## Key workflows

1. **Release hygiene**: Always run one of `npm run package`, `npm run package:minor`, or `npm run package:major` before bundling a VSIX. These scripts auto-increment `package.json`, `CHANGELOG.md`, and all documentation references. Keep VSIX artifacts under `.artifacts/vsix/` and release notes (templated in `.artifacts/releases/release_notes_template.md`) under `.artifacts/releases/` as detailed in `auto-version-increment.instructions.md` and `commercialization-readiness.instructions.md`.
2. **Documentation stewardship**: Update `docs/ibmi-extension-management.md` and any README sections describing IBM i features as part of a release. Call out IBM i limitations, configuration keys such as `lancelot.gitlab.baseUrl` or `lancelot.telemetry.connectionString`, and link to this skill/instruction set so future maintainers know where to look for operational guidance.
3. **Configuration & secrets**: Never hardcode IBM i credentials, GitLab tokens, or telemetry connection strings. Inject them via environment variables, `.env`, or VS Code SecretStorage, then document those dependencies in both the docs and this instruction set. Use `trackEvent` (with a `Logger` fallback) for event telemetry tied to IBM i authentication, validation, or deployment actions.
4. **Packaging safeguards**: Set `PUPPETEER_SKIP_DOWNLOAD=1` when running packaging scripts that include Puppeteer. Ensure the VSIX sits in `.artifacts/vsix/`, release notes mention IBM i updates, and cross-platform tests cover Windows, macOS, and Linux paths tied to IBM i tooling so the extension remains reliable everywhere.
5. **Observability & compliance**: Tie IBM i telemetry coverage to release notes, mention privacy opt-out options, and ensure automation scripts reference `docs/ibmi/IBM_i_Testing_Summary.md` when describing validation coverage.

## Common checks

- Did you update `CHANGELOG.md`, `docs/ibmi-extension-management.md`, and `.artifacts/releases/release_notes_X.X.X.md` with the IBM i-specific story for the change?
- Are IBM i secrets flowing through secure channels instead of being committed to repository files?
- Do telemetry stories reference `trackEvent` tags that justify why the data is collected and how administrators can opt out?
- Is any new platform-specific logic or path documented for all supported OS families?
- Does the release note or README reference this instruction set and the skill at `.github/skills/ibmi-extension-management/SKILL.md` so future reviewers understand where the operational guidance lives?

## References

- `.github/skills/ibmi-extension-management/SKILL.md`
- `.github/instructions/auto-version-increment.instructions.md`
- `.github/instructions/commercialization-readiness.instructions.md`
- `.github/instructions/security-and-owasp.instructions.md`
- `docs/ibmi/ibmi-extension-management.md`
- `docs/ibmi/IBM_i_Testing_Summary.md`