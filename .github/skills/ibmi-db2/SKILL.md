---
title: "DB2 for i (ibmi-db2) Skill"
applyTo: '**'
summary: |
  This skill provides instructions and best-practice guidance for working with Db2 for IBM i (DB2 for i) related code, configuration, and documentation inside the Lancelot extension. It follows the agent skills specification and Visual Studio Code guidance for custom agent skills.
---

# DB2 for i Skill (ibmi-db2)

Purpose
-------

This skill helps an AI agent perform tasks related to Db2 for IBM i (DB2 for i) in the Lancelot extension repository. It is designed for safety, security, and maintainability. Use it when writing, reviewing, or testing code that interacts with DB2 for i, or when editing documentation and packaging related to DB2 features.

Specification compliance
------------------------

This SKILL conforms with the Agents Skills specification (<https://agentskills.io/specification>) and the Visual Studio Code guidance for custom agent skills (<https://code.visualstudio.com/docs/copilot/customization/agent-skills>). It includes:

- Intents and triggers
- Capabilities (what the skill can do)
- Safety constraints and non-goals
- Examples (good prompts and tasks)
- Integration guidance for VS Code extension authors

Intents
-------

The skill supports these primary intents:

- `db2.connect`: Establish and validate DB2 connections (non-production credentials only).
- `db2.query`: Build safe, parameterized queries and execute them against a DB2 abstraction (use mock or integration environments as required).
- `db2.migrations`: Generate DDL migration scripts and validate SQL compatibility with DB2 for i.
- `db2.docs`: Produce or update documentation related to DB2 setup, troubleshooting, and packaging.
- `db2.testing`: Create and manage tests for DB2 logic (unit mocks, integration gating, CI configuration).

Triggers
--------

Activate this skill when:

- Files under `src/ibmi/`, `docs/ibmi/`, or `.github/instructions/ibmi-db2.instructions.md` are modified.
- A PR or issue mentions DB2, DB2 for i, Db2, DB2/400, SQLRPGLE DDL, or similar.
- The user asks for SQL generation, DB2 connectivity guidance, or packaging instructions that involve DB2 drivers.

Capabilities
------------

When invoked, the agent may:

- Provide code snippets for parameterized queries using the project's chosen DB driver (explicitly call out driver and version).
- Add or update configuration entries (settings key examples) and document required environment variables.
- Generate tests: unit tests that mock DB calls and integration test stubs that are gated by environment variables.
- Produce secure documentation and troubleshooting notes, including sample .env.example and guidance to use VS Code SecretStorage.
- Suggest packaging changes to avoid shipping large native binaries in VSIX and provide an on-demand download strategy.

Safety constraints and non-goals
-------------------------------

The skill must NOT:

- Insert hardcoded credentials, secrets, or any sensitive data.
- Execute destructive SQL (DROP/DELETE) against unknown or production databases without explicit, authenticated human approval and safe-guarded test harnesses.
- Change README.md automatically unless explicitly requested in the task (project rule).

Design and implementation guidance
---------------------------------

Follow project-level guidelines in `instructions/lancelot_built_tool.instructions.md`, `instructions/security-and-owasp.instructions.md`, and `.github/instructions/ibmi-db2.instructions.md` when using this skill. Additional guidance:

- Use strict TypeScript types for any DB models and avoid `any`.
- Use localized strings for UI text (update `package.nls.json` and provide context for translators).
- When adding webviews or UI showing DB data, follow the webview accessibility guidance in `instructions/lancelot_built_tool.instructions.md` (avoid setting `aria-hidden` on `body`, prefer inert or sibling-level `aria-hidden`).

Testing guidance
----------------

- Unit tests should mock DB layer using dependency injection and service abstractions.
- Integration tests must be opt-in via environment variables (e.g., `IBMI_DB2_TEST_URI`) and have their own timeouts. Skip integration tests if variables are not set.
- Provide test data generators and cleanup scripts for integration runs; prefer using a disposable schema or a dedicated test instance.

CI and packaging
-----------------

- Do not include large platform-specific DB driver binaries in the VSIX. Instead use an on-demand download flow or require users to install the appropriate native client.
- Add CI gating that verifies packaging excludes large binaries and runs linter/typecheck/test batches.

Examples (prompts and tasks)
----------------------------

Good prompts the skill should handle:

- "Create a parameterized query to fetch user accounts by email for DB2 for i using the configured driver."
- "Generate an integration test stub that connects to DB2 when IBMI_DB2_TEST_URI is set, otherwise mocks queries."
- "Write docs for configuring TLS and certificate validation for DB2 connections in the extension."

Bad prompts the skill must refuse or constrain:

- "Connect to my production DB and run DROP TABLE" — refuse unless explicit authenticated manual review and a safety plan exist.

References and Resources
------------------------

- Agents Skills spec: <https://agentskills.io/specification>
- VS Code agent skills guidance: <https://code.visualstudio.com/docs/copilot/customization/agent-skills>
- Project-level instructions: `.github/instructions/lancelot_built_tool.instructions.md`

Maintenance
-----------

Update this SKILL.md when:

- DB2-related APIs change in the extension
- Packaging or CI rules affecting DB2 drivers change
- New security or accessibility requirements are adopted by the project
- New intents or capabilities are added for DB2 interactions
- Documentation standards for DB2 features evolve
