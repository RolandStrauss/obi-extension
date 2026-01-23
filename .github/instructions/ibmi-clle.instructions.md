# CLLE Development Instructions (IBM i 7.6)

## Purpose
- Provide safe, traceable guidance for Control Language (CLLE) artifacts that orchestrate IBM i automation inside the Lancelot extension. Apply these rules whenever a change touches CLLE programs, commands, job definitions, or the workflows that depend on them.

## Key Standards
- Favor **modular CLLE procedures** (PGM/PROC) over monolithic scripts so each job can be tested, versioned, and logged independently.
- Keep CL commands declarative and avoid embedding business logic; delegate calculations or data access to RPGLE or SQL stored procedures that have their own unit tests.
- Every new CLLE program must include descriptive comments and `DCL` statements with explicit documentation of parameters, return codes, and expected job descriptions for traceability.
- Automate job control, spool handling, file backups, and security checks via CLLE when no higher-level API exists; use documented naming conventions so PowerShell/Node adapters can predict job names.
- Always invoke CL builds from the VS Code IBM i tooling (e.g., `code-for-ibmi.compile`) so compilation errors are surfaced in the editor and the resulting object references are captured in Git history.

## Security & Secrets
- Run CLLE under user profiles with **security level 40+** and only the minimum special authorities required for the task (e.g., `*JOBCTL` for job manipulation but never `*ALLOBJ`).
- Do not embed passwords or tokens in CLLE source. Any credentials must be injected via secure environment variables or VS Code SecretStorage, and referenced through parameter lists.
- Use dedicated **exit programs** for command-level protection whenever the CLLE program may be executed interactively or triggered by unattended automation. Document the exit program pair in the source header.
- For sensitive operations (file transfers, job control, security auditing), ensure the CLLE program invokes encryption-aware APIs (e.g., `QSYS2.QCMDEXC` with logging) and optionally writes `QAUDJRN` entries describing the action.

## Observability & Telemetry
- Emit structured logging (via custom `LOG` programs or the telemetry service) for critical CL events such as job submission, waiting for active jobs, and cleanup. Include the operation name, target library, and result status so telemetry tooling can correlate with VS Code actions.
- Capture CLLE failure diagnostics (e.g., job logs, message queues) alongside the Lancelot telemetry event `clle.operation.failure`. If the job is part of an IBM i workflow, include the `lancelot.telemetry.trackingId` to trace issues across the extension.

## Documentation & Release Hygiene
- Document new or modified CLLE programs in `docs/ibmi-extension-management.md` and mention them in `docs/IBM_i_Testing_Summary.md` with the associated test cases and environment requirements.
- Because CLLE code is tied to release automation, run the auto-versioning packaging scripts (`npm run package`, `package:minor`, or `package:major`) before publishing. All CLLE changes must be noted in `CHANGELOG.md` and mirrored in the release notes created from `.artifacts/releases/release_notes_template.md`.
- Keep VSIX artifacts and release notes under `.artifacts/` per the commercialization and auto-version instructions. Mention any CLLE-specific dependencies or environment variables (e.g., IBM i host, job queue) in the release comments so administrators can reproduce the workflow.

## Testing & Validation
- Execute the CLLE-specific job in the IBM i test environment and capture the job log. Record the validation steps (e.g., submit job, verify file updates, inspect message file) in the docs or `test-results.txt` entries associated with the change.
- When CI exercises CLLE flows (e.g., through IBM i emulators or mocked APIs), run the relevant `npm run test:batch:*` suites and document any platform-specific adjustments in `CROSS-PLATFORM-SETUP-FIXES.md`.
- Add regression tests or smoke scripts that submit the CLLE job through the extension, ensuring the automation path (VS Code command → CLLE program) is exercised in the telemetry pipeline.

## When to Apply
- Whenever you touch `ibmi-scripts/`, `docs/ibmi-*`, `src/ibmi/`, or any automation that uses CLLE programs for deployment, job control, or file handling.
- When updates impact IBM i configuration (job queues, libraries, credentials), coordinate with the IBM i extension management instructions and double-check there is no hard-coded environment detail.

## References
- Follow the broader guidance in `instructions/ibm-i-extension-management.instructions.md`, `commercialization-readiness.instructions.md`, and `auto-version-increment.instructions.md` to maintain secure packaging, documentation, and release traceability.
- Review `docs/ibmi-extension-management.md` and `docs/IBM_i_Testing_Summary.md` before shipping CLLE changes so the documentation and tests remain synchronized with the code.