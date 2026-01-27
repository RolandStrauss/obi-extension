---
name: ibmi-sqlrpgle
description: Skill guidance for SQLRPGLE development, release, and observability inside the Lancelot extension.
license: PROPRIETARY
metadata:
  author: RolandStrauss
  version: "1.0"
---

# IBM i SQLRPGLE Skill

## Overview

SQLRPGLE is a key technology for the IBM i-integrated features of Lancelot. This skill teaches Copilot how to support SQLRPGLE-focused workstreams such as compile/deploy automation, release documentation, secure configuration, and telemetry. Always align SQLRPGLE guidance to the companion `instructions/ibmi-sqlrpgle.instructions.md` and the broader IBM i instructions (`instructions/ibm-i-extension-management.instructions.md` and `instructions/lancelot.instructions.md`).

## When to activate this skill

- A change touches SQLRPGLE sources (`src/ibmi/`, `ibmi-scripts/`, `qrpglesrc`, `qrpgleref`, or similar) or introduces new RPG/SQL objects.
- You are defining configuration keys, documentation, or telemetry specifically for SQLRPGLE workflows (e.g., compile library, target job, SQL host, or in-flight telemetry events).
- SQLRPGLE behavior (compilation, deployment, validation) is part of release notes, packaging, or troubleshooting workflows.
- There is a need for secure telemetry, credential handling, or audit logging tied to SQLRPGLE automation (trackEvent instrumentation, auditing compile results, etc.).

## Step-by-step guidance

1. **Release readiness.** Before shipping SQLRPGLE changes, run the auto-versioning packaging scripts (`npm run package`, `package:minor`, `package:major`). These commands update `package.json`, `CHANGELOG.md`, `.artifacts/releases/release_notes_X.X.X.md`, and `.artifacts/vsix/`. Mention SQLRPGLE work in the release notes (use `.artifacts/releases/release_notes_template.md`) and cross-link to `docs/ibmi-extension-management.md` for extra context.
2. **Document SQLRPGLE flows.** Record compile/deploy steps, required environment variables, and cross-platform instructions inside `docs/ibmi-extension-management.md` and add test coverage notes to `docs/ibmi/IBM_i_Testing_Summary.md`. Describe how to trigger SQLRPGLE builds, what security controls guard them, and how to inspect failures.
3. **Secure configuration.** Read IBM i hostnames, users, passwords, GitLab tokens, and telemetry connection strings from environment variables, `.env` placeholders, or VS Code SecretStorage; never embed them in source. Document the required keys and recommended scopes in the docs so operators can reproduce setups safely.
4. **Telemetry & observability.** Emit descriptive `trackEvent` calls for SQLRPGLE compile (`sqlrpgle.compile`), deploy (`sqlrpgle.deploy`), validation (`sqlrpgle.validate`), and error (`sqlrpgle.error`) flows. Include metadata such as library name, job, duration, success/failure, and failure reason. Provide guidance in docs for accepting or disabling telemetry, especially for sensitive IBM i usage scenarios.
5. **Cross-platform validation.** Avoid operating-system-specific paths or commands in SQLRPGLE helpers. Use Node's `path` module, keep packaging scripts shell-agnostic, and execute the SQLRPGLE-related tests via the Mocha batch suites (`npm run test:batch:*`) to prove coverage across Windows, macOS, and Linux.
6. **Troubleshooting & support.** When diagnosing issues, point maintainers to the release notes, SQLRPGLE docs, and telemetry events. Document recovery steps, escalate to IBM i support resources only after isolating SQLRPGLE-specific blockers, and log sensitive actions via `trackEvent` rather than verbose console output.

## Key capabilities & focus areas

- **Release automation:** Help the user understand auto-incrementing version behavior and ensure SQLRPGLE artifacts follow the `.artifacts/releases` and `.artifacts/vsix` conventions.
- **Documentation:** Encourage detailed, accessible instructions in `docs/ibmi-extension-management.md` and `docs/ibmi/IBM_i_Testing_Summary.md` so operators know how to build, deploy, and troubleshoot SQLRPGLE flows.
- **Security & secrets:** Reinforce environment-variable-driven secrets, secure telemetry, and masked logging for all SQLRPGLE commands.
- **Telemetry & auditability:** Keep SQLRPGLE telemetry events minimal, descriptive, and opt-out friendly, linking back to instrumentation in the instructions file.
- **Cross-platform reliability:** Ensure SQLRPGLE tooling runs equally well on Windows, macOS, and Linux (scripts must use portable paths and Node APIs).

## Common pitfalls & checks

- Forgetting to describe SQLRPGLE release contributions in `CHANGELOG.md`, release notes, and `docs/ibmi-extension-management.md`.
- Shipping secrets (IBM i credentials, GitLab tokens) inside commits instead of storing them securely and documenting the required settings.
- Failing to include SQLRPGLE telemetry events or explain how to disable them, leaving admins unsure whether data is collected.
- Building or packaging SQLRPGLE assets without following the `.artifacts/vsix/` convention or the auto-versioning packaging scripts.
- Introducing platform-specific paths/commands that break SQLRPGLE automation on macOS or Linux.

## References

- `.github/instructions/ibmi-sqlrpgle.instructions.md`
- `.github/instructions/ibm-i-extension-management.instructions.md`
- `.github/instructions/auto-version-increment.instructions.md`
- `.github/instructions/commercialization-readiness.instructions.md`
- `.github/instructions/security-and-owasp.instructions.md`
- `docs/ibmi-extension-management.md`
- `docs/ibmi/IBM_i_Testing_Summary.md`
