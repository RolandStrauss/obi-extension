---
description: SQLRPGLE-focused instructions that complement the IBM i Copilot skill by giving actionable, release-ready guidance for RPG/SQL workflows.
applyTo: '**'
---

# IBM i SQLRPGLE Instructions

Use this document whenever SQLRPGLE sources, deployment scripts, or telemetry events change so that SQLRPGLE-specific guidance stays aligned with the broader IBM i policies in `instructions/ibm-i-extension-management.instructions.md` and `instructions/lancelot_built_tool.instructions.md`.

## Purpose

This mirrors `.github/skills/ibmi-sqlrpgle/SKILL.md` and provides the activation cues, configuration expectations, release hygiene, and observability conventions you must follow when working with SQLRPGLE assets.

## When to apply these instructions
- You add, refactor, or document SQLRPGLE sources, compile scripts, or SQL DDL definitions used by the extension.
- You introduce new configuration keys, settings, or notebook content that affect SQLRPGLE behavior (such as compile libraries, environment flags, or deploy targets).
- You add telemetry, logging, or error tracking related to SQLRPGLE flows (compile, sync, deploy, job execution).
- SQLRPGLE delivery touches packaging, release notes, documentation, or troubleshooting guides.

## SQLRPGLE best practices
1. **Release hygiene** — Always run one of the auto-versioning packaging scripts (`npm run package`, `package:minor`, `package:major`) so that `package.json`, `CHANGELOG.md`, `.artifacts/releases/release_notes_X.X.X.md`, and the VSIX outputs stay synchronized. Mention SQLRPGLE compiler/deployer changes in the release notes (use the template in `.artifacts/releases/release_notes_template.md`), and ensure any VSIX artifacts land in `.artifacts/vsix/`.
2. **Documentation** — Capture SQLRPGLE compilation, deploy, and troubleshooting steps in `docs/ibmi-extension-management.md` and expand `docs/ibmi/IBM_i_Testing_Summary.md` with regression coverage details. Document new configuration keys (e.g., `lancelot.ibmi.sqlrpgle.library`, `lancelot.ibmi.sqlrpgle.job`) so operators understand how to tune the workflow.
3. **Secure configuration** — Never hardcode credentials or secrets. Read IBM i hostnames, user credentials, GitLab tokens, and telemetry connection strings from environment variables, `.env` placeholders, or VS Code SecretStorage, and list the required keys in docs. Obscure sensitive values in logs and telemetry outputs.
4. **Observability & telemetry** — Emit targeted `trackEvent` calls for SQLRPGLE compile (`sqlrpgle.compile`), deploy (`sqlrpgle.deploy`), and validation (`sqlrpgle.validate`) flows. Include metadata such as library name, compiler flags, result status, and failure reason. Make telemetry optional by honoring user opt-outs and describing them in docs.
5. **Cross-platform checks** — Use platform-agnostic Node APIs, avoid Windows-only paths, and confirm SQLRPGLE automation runs on Windows, macOS, and Linux. Run the SQLRPGLE-related tests via the batch suites (`npm run test:batch:*`) to demonstrate coverage across OSs.

## Validation checklist
- Document the SQLRPGLE change in release notes, changelog, and `docs/ibmi-extension-management.md`.
- Keep secrets out of source control by using secure storage and placeholders in `.env` when needed.
- Include telemetry events where they add value and summarize them so administrators can evaluate opt-out procedures.
- Ensure new SQLRPGLE tooling or scripts ship inside the `.artifacts/vsix/` build output.
- Cross-reference this file and `.github/skills/ibmi-sqlrpgle/SKILL.md` from any documentation that describes SQLRPGLE workflows.

## References
- `.github/skills/ibmi-sqlrpgle/SKILL.md`
- `.github/instructions/ibm-i-extension-management.instructions.md`
- `.github/instructions/auto-version-increment.instructions.md`
- `.github/instructions/security-and-owasp.instructions.md`
- `.github/instructions/commercialization-readiness.instructions.md`
- `docs/ibmi-extension-management.md`
- `docs/ibmi/IBM_i_Testing_Summary.md`
