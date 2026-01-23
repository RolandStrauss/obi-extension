# CLLE Skill — IBM i 7.6

## Purpose

Capture the knowledge, policies, and guardrails that Copilot needs to act as an expert on IBM i Control Language (CLP/CLLE) automation within the Lancelot extension. This skill summarizes the secure job-control patterns, observability expectations, documentation hygiene, and testing rituals defined in `.github/instructions/ibmi-clle.instructions.md` so that the agent remains aligned with the latest best practices documented for the repository.

## Key Capabilities and Expectations

- **Modular CLLE Automation:** Favor parameterized CL programs (PGM/PROC) that delegate business logic to RPGLE or SQL services; avoid monolithic scripts that mix data access with control flow.
- **Secure Execution:** Ensure every automation uses an IBM i 7.6 security-level-40+ profile with the least privilege (no `*ALLOBJ`). Inject secrets via secure environments (VS Code SecretStorage or env vars) and document exit programs or audit journaling that control command access.
- **Observability & Telemetry:** Log job submissions, cleanup, and failure states with the `clle.operation.failure` telemetry event, including the `lancelot.telemetry.trackingId`, so failures can be traced alongside VS Code UI actions.
- **Documentation & Release Hygiene:** Document CLI programs in `docs/ibmi-extension-management.md`, add test coverage descriptions to `docs/IBM_i_Testing_Summary.md`, and update `CHANGELOG.md` plus `.artifacts/releases/release_notes_*.md` whenever CLLE code changes ship through the auto-versioning packaging scripts (`npm run package*`).
- **Testing & Validation:** Record job log validation steps, run `npm run test:batch:*` suites when CLLE flows are covered in CI, and add regression scripts that invoke the CLLE job via the extension to exercise the full telemetry pipeline.

## How to Use This Skill (Agent Guidelines)

1. **Ground in instructions:** Always mirror the structure and tone of `.github/instructions/ibmi-clle.instructions.md` when discussing CLLE tasks. Reference security, observability, documentation, and testing sections explicitly.
2. **Follow the agent skills specification:** Align all responses with the guidance from [Agent Skills specification](https://agentskills.io/specification) and Microsoft's [Copilot agent skills documentation](https://code.visualstudio.com/docs/copilot/customization/agent-skills), ensuring clarity about why each recommendation matters and what telemetry/documentation artifacts should accompany it.
3. **Avoid unauthorized changes:** Never suggest edits that bypass the auto-version packaging, fail to mention required docs, or introduce hard-coded IBM i credentials.
4. **Link to references:** When citing policies, point back to `.github/instructions/ibmi-clle.instructions.md`, `instructions/ibm-i-extension-management.instructions.md`, `auto-version-increment.instructions.md`, and `commercialization-readiness.instructions.md` so reviewers can verify compliance.

## When to Activate

- The user is modifying or authoring CLLE/CLP programs, job control scripts, or IBM i automation that depends on CL programs.
- The work touches `src/ibmi/`, `ibmi-scripts/`, `docs/ibmi-*`, release automation, telemetry events, or IBM i configuration keys such as job queues and host credentials.

## References

- `.github/instructions/ibmi-clle.instructions.md`  
- `.github/instructions/ibm-i-extension-management.instructions.md`  
- `.github/instructions/auto-version-increment.instructions.md`  
- `.github/instructions/commercialization-readiness.instructions.md`  
- `docs/ibmi-extension-management.md`  
- `docs/IBM_i_Testing_Summary.md`  
- [Agent Skills specification](https://agentskills.io/specification)  
- [VS Code Copilot agent skills docs](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
