---
title: "IBM i DSPF Skills"
description: "Comprehensive IBM i DSPF guidance spanning modernization, automation, security, telemetry, and documentation."
---

# DSPF Modernization and Delivery Skills (IBM i 7.6+)

## Core DSPF Modernization Skills

- Modernize legacy DDS panels with incremental UI upgrades, Profound UI/Valence ports, and responsive layouts.
- Replace procedural DSPF workflows with hybrid experiences that call REST, GraphQL, or GitLab APIs for orchestration.
- Apply security hardening (exit programs, audit journaling, row/field-level authority) and verify with automated scans.
- Manage release automation: tie DSPF changes to auto-versioned releases, release notes in `.artifacts/releases/`, and VSIX packaging scripts (`npm run package*`).
- Keep documentation in sync (docs/ibmi-extension-management.md, docs/getting-started.md) when DSPF behaviors change.
- Maintain dependency maps (SQLRPGLE, APIs, services) alongside DSPF assets to simplify regression impact analysis.
- Instrument telemetry and logging via `trackEvent` wrappers so IBM i actions (compile, deploy, transport) emit structured events with opt-out guidance.
- Design DSPF tests (unit, integration, smoke) that run in batched Mocha suites (`npm run test:batch:*`) and capture platform coverage (Windows, macOS, Linux).

## Delivery and Compliance Patterns

- Document security and compliance procedures for DSPF changes, referencing `docs/ENTERPRISE-SECURITY-CHECKLIST.md` and telemetry opt-out docs.
- Use VS Code SecretStorage or `.env` placeholders for IBM i credentials, never check secrets into the repo, and note the required env vars for each flow.
- Maintain release readiness with versioned release notes per `release_notes_template.md`, keep the changelog aligned, and auto-increment versions via `npm run package` scripts before packaging.
- Ensure accessibility guidance is followed for any new webview or UI surfaces that accompany DSPF updates.

## Support and Observability

- When telemetry is added, describe which events are emitted, how to opt out, and link to `docs/ibmi/IBM_i_Testing_Summary.md` for coverage.
- Provide troubleshooting documentation (error codes, compile logs) and links to `docs/ibmi-extension-management.md` for IBM i-specific guidance.
- Collect cross-platform test results and store them in `test-results.txt` or the `test-results` directory to prove coverage.
- Emphasize that DSPF modernization must be core-numbered, documented, telemetry-enabled, and release-friendly before merging.

## References

- IBM i extension instructions: `.github/instructions/ibm-i-extension-management.instructions.md`
- SQLRPGLE guidance: `.github/instructions/ibmi-sqlrpgle.instructions.md`
- Versioning & release guidance: `.github/instructions/auto-version-increment.instructions.md` and `.github/instructions/commercialization-readiness.instructions.md`
- Security: `.github/instructions/security-and-owasp.instructions.md`
- Accessibility: `.github/instructions/a11y.instructions.md`
