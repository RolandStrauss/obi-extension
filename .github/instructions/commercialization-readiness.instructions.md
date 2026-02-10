---
applyTo: '*'
description: 'Marketplace packaging: VSIX size optimization, metadata validation, documentation standards, pre-publish checklist.'
---

# Commercialization Readiness

This instructions file defines practical, repository-level rules and a checklist to prepare the Lancelot extension for commercial distribution, packaging, and ongoing releases. Apply these rules during release engineering, PR review, and release planning.

## Goals

- Ensure distributed packages include accurate metadata and follow marketplace expectations
- Keep VSIX artifacts lean and deterministic (watch for heavy dependencies such as Puppeteer)
- Provide clear documentation and onboarding for customers
- Externalize environment-specific settings so builds are portable and secure
- Automate releases and collect user feedback to continuously improve the product

## 1) package.json metadata (required)

Ensure the `package.json` contains complete and accurate metadata. At minimum include:

- `publisher` (exact publisher name used for VS Code Marketplace)
- `displayName` (human-friendly product name)
- `description` (short single-line summary)
- `categories` (array of marketplace categories, e.g. `"SCM Providers"`)
- `keywords` (array of discovery keywords)
- `license` (SPDX identifier or proprietary statement)

Example snippet:

```json
{
    "publisher": "RolandStrauss",
    "displayName": "Lancelot",
    "description": "Lancelot: Git Repo assisted workflows for IBM i development with intelligent UI interface.",
    "categories": ["Other", "SCM Providers"],
    "keywords": ["gitlab", "ibm-i", "workflow", "vscode-extension"],
    "license": "PROPRIETARY"
}
```

Verification steps:

- Add a CI check to validate these fields exist and are non-empty before publishing.
- Add README and Marketplace screenshots referenced from `package.json` where applicable.

## 2) Packaging and vsce usage

- Use `vsce package` or the official publishing flow to create `.vsix` artifacts.
- Monitor `.vsix` size before publishing. Large artifacts increase user friction and can block marketplace uploads.
- Watch for heavy dependencies (notably `puppeteer`) which often include a bundled Chromium download and inflate package size.

Mitigations for large dependencies:

- Use `puppeteer-core` where the runtime browser is provided externally rather than bundled.
- Set environment variable `PUPPETEER_SKIP_DOWNLOAD=1` during build/package to avoid shipping Chromium where appropriate (the repository already uses this pattern in `package.json` scripts).
- Consider shipping optional runtime helpers that download browsers on-demand, or instruct users to install the runtime browser separately.
- Exclude large dev/test-only files from the VSIX via `.vscodeignore` (or `files`/`package.json` rules) and ensure build outputs are deterministic.

Checklist:

- [ ] `.vsix` size measured and reported in CI artifacts
- [ ] `.vscodeignore` confirmed to exclude unnecessary files (node_modules large binaries, test assets, local docs)
- [ ] Puppeteer-related downloads skipped in release packaging (PUPPETEER_SKIP_DOWNLOAD or switching to puppeteer-core)

## 3) Documentation and onboarding

Provide clear, user-focused documentation for commercial users:

- Usage examples and quick-start steps in `README.md` and `docs/`.
- Configuration examples for common deployment scenarios (e.g., GitLab integration, IBM i hosts, authentication flows).
- Troubleshooting and support channels (issue template or support.md) and clear instructions for reporting problems.
- Maintain a `docs/` site or wiki for longer onboarding guides and enterprise integration patterns.

Docs checklist:

- [ ] Quick-start / minimal example added to `README.md`
- [ ] A full installation & configuration guide in `docs/` (or a generated docs site)
- [ ] Troubleshooting and support guidance (how to gather logs, attach VS Code debug logs)

## 4) Externalize environment-specific settings

Never hardcode environment-specific or sensitive values into the repo or artifacts. Externalize configuration such as:

- GitLab base URLs and tokens
- IBM i hostnames, credentials, and connection strings
- Any customer-specific endpoint, secrets or tokens

Recommended approaches:

- Use environment variables for runtime configuration. Document the expected variables and their formats.
- Use VS Code `configuration` settings where appropriate and document settings keys in `contributes.configuration` (already present in `package.json`).
- Use secure storage for tokens (e.g., VS Code SecretStorage) and document token refresh flows.

Security checklist:

- [ ] Document all required environment variables in `docs/` or configuration reference
- [ ] Ensure secrets are read from secure stores at runtime and are never written to logs or persisted in plaintext

## 5) Changelog & structured release notes

- Maintain a `CHANGELOG.md` using the Keep a Changelog format. Keep an `Unreleased` section at the top.
- For commercial releases, include a short “What’s new for administrators” in release notes summarizing major changes, migration steps, and upgrade instructions.
- Consider generating a docs site release notes page from `CHANGELOG.md` for non-technical readers.

Checklist:

- [ ] `CHANGELOG.md` present and kept up to date
- [ ] Release notes generated and attached to CI artifacts

## 6) CI/CD release automation and marketplace publishing

Plan a CI/CD flow that builds, packages, validates, and publishes releases:

- Build matrix: run tests and lint in CI on supported Node versions and target platforms.
- Packaging step: run `npm run bundle`/`vsce package` with `PUPPETEER_SKIP_DOWNLOAD` set in the packaging environment.
- Validation: run markdown-lint, eslint, typecheck, and a lightweight smoke test against the built extension (if possible with headless runner).
- Release: publish the `.vsix` artifact and optionally use `vsce publish` to push to the marketplace. Ensure proper credentials are available in CI (publish token stored in secrets).
- Post-release: create a GitHub Release and attach the `.vsix` and release notes.

Suggested CI checks:

- Validate `package.json` metadata
- Measure and fail if `.vsix` > threshold (configurable)
- Run `npm run verify:all` before packaging

## 7) User feedback, telemetry and support loops

- Decide on telemetry and privacy policy. If telemetry is enabled, document the data collected and provide an opt-out.
- Provide clear channels for support and feedback (issue templates, support email, or paid support flow).
- Track and act on user feedback (bug triage, feature requests) as part of release planning.

## 8) Additional operational considerations

- Licensing: If proprietary, ensure license text and distribution terms are clear and included in the VSIX.
- Legal and compliance: For commercial usage, confirm any third-party dependency license obligations (link to a generated license report if needed).
- Security: Apply secure coding guidance (see `security-and-owasp.instructions.md`) when handling secrets, network interactions, and third-party integrations.

## 9) Quick checklist for a single release

- [ ] CI green (tests, lint, typecheck)
- [ ] package.json metadata validated
- [ ] `.vsix` packaged with PUPPETEER_SKIP_DOWNLOAD set (or puppeteer-core used)
- [ ] `.vsix` size measured and within threshold
- [ ] CHANGELOG.md updated and release notes prepared
- [ ] Docs updated (README, docs/) and onboarding materials attached
- [ ] Release created (GitHub Release + Marketplace publish) with artifacts
- [ ] Post-release monitoring & feedback loop activated

If you'd like, I can:

- Add CI job templates (GitHub Actions) to implement the packaging + size check step
- Add a small `.vscodeignore` template tuned to avoid shipping dev/test artifacts
- Create a `docs/release-process.md` with a step-by-step runbook for maintainers
