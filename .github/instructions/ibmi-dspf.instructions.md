# IBM i DSPF Instructions

## Purpose

- Teach contributors how to modernize IBM i Display Files (DSPF) without losing the discipline required for secure releases, telemetry, and documentation.
- Align DSPF work with the broader IBM i guidance (`instructions/ibm-i-extension-management.instructions.md`, `instructions/lancelot_built_tool.instructions.md`) while obeying the agentskills.io/VS Code Copilot skill spec.

## When to follow this guidance

- Changes touch Display File sources (`src/ibmi/dspf/`, `ibmi-scripts/`, or any DDS assets imported as part of the extension).
- You are documenting or automating DSPF compile/deploy/render flows, especially when they surface in release notes, telemetry, or the VSIX package.
- DSPF modernization work requires security controls (auditing, exit programs, protected hosts) or instrumentation (`trackEvent`, `Logger`) that must be consistently recorded.

## Release & packaging hygiene

1. **Auto-version** – Always run one of the packaging scripts (`npm run package`, `package:minor`, `package:major`) before building a VSIX that includes DSPF assets so `package.json`, `CHANGELOG.md`, `.artifacts/releases/release_notes_X.X.X.md`, and `.artifacts/vsix/` stay synchronized.
2. **Release notes** – Use `.artifacts/releases/release_notes_template.md` to document DSPF improvements, modernization milestones, and platform fixes. Link to DSPF sections in `docs/ibmi-extension-management.md` and highlight any IBM i-specific operations.
3. **Artifact location** – Place generated DSPF-related VSIX bundles strictly under `.artifacts/vsix/` and keep release notes under `.artifacts/releases/` per the auto-version instructions.

## Modernization & architecture

- Prefer web-friendly tooling (Profound UI, Valence, React) when rewriting DSPFs; keep DDS artifacts only where they represent the IBM i experience (screen descriptions, record formats).
- Separate UI layout (DSPF/Profound components) from RPG business logic. Encapsulate screen behavior in services under `src/ibmi/dspf/` and reuse components via configuration.
- Document modernization dependencies inside GitHub (use `.github/ISSUE-xxx` templates or `docs/ibmi-extension-management.md`) so the team can trace which DSPFs have been replaced by API-driven or native web components.
- Keep modernization incremental: start with high-impact screens (order entry, approval flows) while the rest fall back to legacy DDS until replacements are certified.

## Documentation & knowledge sharing

- Record DSPF compile, bind, and deploy steps (including object names, library lists, mandatory environment variables) in `docs/ibmi-extension-management.md` and update `docs/ibmi/IBM_i_Testing_Summary.md` to reflect regression coverage across IBM i platforms.
- When adding or renaming DSPF objects, update `docs/ibmi-extension-management.md` and mention the change in `docs/ibmi/IBM_i_Testing_Summary.md` so IBM i teams know what to build/tests.
- Reference this instruction file and the Copilot/agentskills spec (e.g., https://agentskills.io/skill-spec) when authoring new DSPF tasks so future maintainers understand expectations.

## Secure configuration & operational safety

- Do not hardcode IBM i credentials, GitLab tokens, or telemetry keys. Load sensitive values from environment variables, `.env` placeholders, or VS Code SecretStorage and document each required key and scope.
- Enforce least privilege on DSPF authorities via exit programs and audit journaling; mention these requirements in the changelog or release notes when new screens touch sensitive data.
- Mask sensitive logs. Prefer `trackEvent('dspf.render', { id, userRole, success: true })` over dumping user tokens or hostnames to stdout. Never log credentials, encryption keys, or PII.
- Use `SecurityHeaders` (CSP, HSTS) and safe rendering options when DSPFs are surfaced through webviews.

## Telemetry & observability

1. Emit descriptive `trackEvent` calls for DSPF actions: `dspf.compile`, `dspf.deploy`, `dspf.render`, `dspf.error`, including metadata such as library, program, IDE context, and failure reason.
2. Provide guidance on how to opt out of telemetry in docs (link to `lancelot.telemetry.connectionString`) and ensure DSPF telemetry honors user preferences.
3. Pair telemetry with fallback `Logger.trackEvent` calls so DSPF workflows remain observable even when telemetry is unavailable.

## Cross-platform & testing

- Keep DSPF tooling portable: rely on Node path utilities, avoid OS-specific shell syntax, and run DSPF automation via `npm run test:batch:*` to prove compatibility across Windows, macOS, and Linux.
- Document and test DSPF automation using the same batching strategy and mention results in `docs/ibmi/IBM_i_Testing_Summary.md`.
- Include accessibility considerations (focus order, skip links, high contrast, meaningful alt text) whenever a DSPF screen is part of a webview or modern UI to stay aligned with the a11y instructions.

## Telemetry & support

- Use `trackEvent` to surface DSPF insights and feed data to the telemetry-curated dashboards; keep descriptive metadata concise but actionable.
- When troubleshooting DSPF screens, reference telemetry events to reproduce issues rather than relying on manual debugging alone. Add instructions for how to instrument new DSPF flows directly in this document or the companion docs.

## References

- `.github/instructions/ibm-i-extension-management.instructions.md`
- `.github/instructions/auto-version-increment.instructions.md`
- `.github/instructions/commercialization-readiness.instructions.md`
- `.github/instructions/security-and-owasp.instructions.md`
- `.github/instructions/a11y.instructions.md`
- `docs/ibmi-extension-management.md`
- `docs/ibmi/IBM_i_Testing_Summary.md`
- Agent skill specification: https://agentskills.io/skill-spec
***# DSPF Development Instructions (IBM i 7.6)

## Standards
- Use **DDS-free modernization tools** where possible.
- For legacy DSPF, enforce **clear naming conventions** and modular layouts.
- Integrate with **Profound UI/Valence** for browser-native UIs.
- Separate **UI/UX from business logic** (RPG backend).

## Security
- Apply **Secure Boot on Power11** for display file environments.
- Restrict access via **exit programs** and **audit journaling**.
- Enforce **least privilege** for display file authorities.

## Modernization
- Convert green screens to **web-friendly interfaces**.
- Support **mobile-friendly DSPF replacements** via APIs.
- Use **AI-driven dependency mapping** to identify DSPF usage.

## Best Practices
- Prioritize modernization of **high-impact DSPFs** (order entry, customer-facing).
- Automate repetitive screen flows with APIs.
- Document DSPF dependencies in GitHub for collaborative modernization.
