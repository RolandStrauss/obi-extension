---
name: ibmi-rpgle
description: Guides Copilot when assisting with IBM i RPGLE development, modernization, security, and DevOps workflows.
license: PROPRIETARY
metadata:
	author: RolandStrauss
	version: "1.0"
---

# RPGLE Skills (IBM i 7.6+)

## Overview

This skill teaches Copilot how to support IBM i RPGLE developers as they modernize legacy systems, compose hybrid solutions, and operate within enterprise DevOps pipelines. Prioritize modern free-form RPGLE idioms, embedded SQL, and hybrid scenarios that combine RPG services with Node.js, Python, or REST/JSON APIs.

## When to activate this skill

- The user mentions RPGLE, IBM i, Db2 for i, PASE, or any RPG modernization effort.
- Questions involve refactoring existing RPG code, introducing RESTful APIs via RPG API Express, or integrating RPG programs with GitHub, Jenkins, or other DevOps tooling.
- Security, compliance, audit, backup, localization, or performance tuning topics for IBM i workloads arise.

## Step-by-step assistance

1. **Understand the business context.** Identify the application's tier (batch, interactive, API) and whether the work targets IBM i 7.6+ or earlier releases; note constraints such as MFA, exit programs, or strict auditing.
2. **Favor modern RPG constructs.** Recommend free-form control and data structures, use service programs, and leverage embedded SQL with new functions (SQLSTATE_INFO, data-change-table-reference) whenever database interaction is required.
3. **Highlight hybrid integration patterns.** When bridging to REST/JSON, show how to marshal data through YAJL or RPG API Express, keep Web service payload handling consistent, and document how PASE-hosted Node.js/Python services should handshake with RPG logic.
4. **Stress DevOps and automation.** Advise on storing RPG sources in Git, running linting/analysis via Code for IBM i, wiring automated testing (unit tests, regression suites), and integrating builds with GitHub Actions or Jenkins pipelines.
5. **Emphasize security & compliance.** Call out MFA, least privilege, audit journaling, stateful session management, encryption, and disaster recovery expectations, ensuring suggestions include defensive checks and logging.
6. **Teach monitoring and observability.** Mention RPG debugging tools, profiling strategies, logging standards, and how to surface IBM i performance metrics for Db2 tuning and IFS scanning.
7. **Document outcomes clearly.** Present results with references to release processes, version control commits, and user stories so the wider team can validate deployments and trace changes.

## Key capabilities and focus areas

- **Modular RPGLE design:** Recommend service programs, procedures, structured error handling, and clear interface contracts to make RPG logic testable and reusable.
- **Db2 for i tuning:** Translate optimization requests into SQL/Db2 strategies (indexes, partitioning, query optimization) and mention CASE or CTE patterns when appropriate.
- **RPG modernization playbook:** Offer paths for legacy code refactoring, UI refresh, internationalization, and cloud-service exposure while noting backward compatibility needs.
- **AI-assisted refactoring:** Guide use of tools like Watsonx Code Assistant or Copilot itself to analyze dependencies, suggest function extraction, and update documentation.
- **Lifecycle & release:** Describe release gating, backup, rollback, and change management steps, including how to prepare artifacts for audit and distribute via IBM i deployment techniques.

## Common pitfalls & checks

- Avoid suggesting fixed-format syntax unless the codebase explicitly targets V5R4 or earlier; prefer free-form for maintainability.
- Do not ignore Db2 concurrency or journaling requirements when proposing schema changes; mention the need for audits and recovery procedures.
- When introducing REST endpoints, ensure RPG programs still enforce input validation, and include CSRF/role checks if the endpoint is user-facing.
- Always tie security-sensitive advice (encryption, session state, credentials) back to IBM i security best practices rather than generic web guidance.

## References & resources

- [.github/skills/ibmi-extension-management/SKILL.md](../../skills/ibmi-extension-management/SKILL.md) for broader IBM i skill context.
- [docs/ibmi-extension-management.md](../../docs/ibmi-extension-management.md) for operational standards, DevOps workflows, and release guidelines.
- [docs/ibmi/IBM_i_Testing_Summary.md](../../docs/ibmi/IBM_i_Testing_Summary.md) for regression and automation examples.
