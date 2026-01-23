---
applyTo: '**'
description: 'DB2 for i (DB2 for IBM i) guidelines and best practices tailored for the Lancelot VS Code extension, focusing on security, packaging, telemetry, and cross-platform reliability.'
---

# DB2 for i (Db2 for IBM i) Instructions

This document provides repository-level guidance when making changes related to DB2 for i (also known as Db2 for IBM i, DB2/400) in the Lancelot VS Code extension. Apply these rules when adding features, documentation, packaging, or telemetry that touch DB2 interaction layers.

Guiding principles:
- Security-first: never hardcode credentials or sensitive SQL. Use secure stores, parameterized queries, and least-privilege connections.
- Test and validate across all supported platforms (Windows, macOS, Linux) even when DB2 access is remote.
- Keep CI reproducible and do not require DB2 in unit tests; prefer integration tests guarded by environment variables.
- Follow accessibility, localization, and telemetry opt-out policies from the main project instructions.

## When to use this file

Apply these instructions when:
- Adding or changing DB2 connection code (drivers, connectors, pooling, timeouts).
- Adding SQL templates, compile/run scripts, or DDL/DDL-like assets.
- Adding telemetry, logging, or export/import features that include DB2 metadata.
- Updating documentation that instructs administrators how to configure DB2 connections.

## Configuration and secrets

- Do NOT store credentials, connection strings, or any secrets in repository files. Always read them from one of:
  - VS Code SecretStorage (preferred for user-scoped secrets)
  - Environment variables (for CI or automation) — document required env vars in `docs/`.
  - External secret stores (e.g., HashiCorp Vault, Azure Key Vault) for enterprise deployments
- Provide a `.env.example` or docs snippet showing required variables (e.g., DB2_HOST, DB2_PORT, DB2_USER, DB2_DATABASE) but use placeholder values only.
- When secrets are required in tests, use test fixtures that read from environment variables and skip tests when not set.

## Connection Management

- Use well-supported Node drivers or lightweight bridge layers; prefer maintained packages (document chosen driver and version).
- Use connection pooling with sensible defaults and per-workspace configurable pool sizes to avoid exhausting DB2 resources.
- Set explicit network timeouts and retries configurable through settings (e.g., `lancelot.ibmi.db2.timeoutMs`). Avoid infinite waits.
- Validate server certificates when using TLS. Provide a setting to opt-in to insecure(=false) mode only for local dev with explicit warnings.

## SQL Safety and Injection

- Always use parameterized/prepared statements for queries; never build SQL strings by concatenation with untrusted input.
- When building dynamic SQL (DDL generation templates, migrations), validate identifiers and sanitize inputs. Prefer using safe identifier-quoting helpers.
- For any operation that executes user-provided SQL, require a deliberate confirmation step and log the action to audit telemetry (if enabled).

## Testing Strategy

- Unit tests: mock DB interactions or use lightweight in-memory abstractions. Do not require a real DB for unit tests.
- Integration tests: gate behind environment variables (e.g., `IBMI_DB2_TEST_URI`) and a CI pipeline job that runs only when a DB2 test host is available.
- Use test batch scripts similar to existing project patterns (e.g., `npm run test:batch:*`) and document how to run integration tests locally.

## Observability & Telemetry

- Emit telemetry events for major DB2 lifecycle events (connect, query error, pool exhausted, reconnect attempts). Make telemetry optional and respect user opt-out.
- Do not send sensitive data in telemetry. Redact SQL text or parameter values containing secrets.
- Log detailed errors to the extension logger for troubleshooting; summarize errors in telemetry with safe metadata only (e.g., error code, sanitized message).

## Packaging and Runtime Considerations

- Avoid shipping large native DB drivers in the VSIX where possible. If a native dependency is required, document supported platforms, binaries, and any build steps required.
- When packaging, ensure large or optional binaries are excluded from the VSIX via `.vscodeignore` and provide an in-extension helper that downloads platform-specific binaries on demand.
- Document required runtime prerequisites (e.g., compatible OpenSSL versions) in `docs/` when necessary.

## Performance & Reliability

- Add sensible defaults for fetch sizes and pagination to prevent large, unbounded queries.
- Use streaming APIs for large result sets rather than loading everything into memory.
- Add circuit-breaker-style protections (e.g., backoff + max retry) for repeated transient failures.

## Error Handling

- Surface clear, actionable error messages to users with remediation steps (e.g., authentication failure -> check secret storage or env var).
- For transient network errors, implement retry with exponential backoff and log retry attempts.

## Documentation

- Update `docs/` when adding configuration keys (include examples and recommended secure setup steps).
- Provide a troubleshooting guide for common DB2 errors (authentication, network, SSL, library mismatch).

## Accessibility & Internationalization

- Ensure any interactive UI that displays DB2 results is keyboard navigable, supports screen readers, and uses localized strings in `package.nls.json`.

## Release Notes

- When releasing DB2-related changes, include compatibility notes, known prerequisites, and migration steps in `.artifacts/releases/release_notes_X.X.X.md` and `CHANGELOG.md`.

## Quick checklist

- [ ] No credentials in code
- [ ] Parameterized queries used
- [ ] Timeouts and retries configurable
- [ ] Telemetry redacts secrets and opt-out honored
- [ ] Integration tests gated and documented
- [ ] Packaging excludes large native binaries from VSIX

## References

- IBM Db2 for i documentation (link in docs recommended for maintainers)
- Project-level instructions: `instructions/lancelot_built_tool.instructions.md`, `instructions/security-and-owasp.instructions.md`
- VS Code Extension API docs (SecretStorage, Telemetry, Packaging)
