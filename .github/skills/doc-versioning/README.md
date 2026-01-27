# Document Versioning & Sign‑off (Agent Skill)

This skill inserts and maintains Document Control sections, Revision/Version History tables, and Approvals blocks in project scoping, sign‑off, and completion documents.

## Enable Agent Skills (VS Code)
1. Open Settings and search **Copilot Agent Skills**.
2. Enable: **GitHub > Copilot Chat: Use Agent Skills**.

## How to use (examples)
- “Insert a document control block at the top.”
- “Bump the document version with a **minor** change and note the scope clarification.”
- “Add an approvals section under the history table.”

## Versioning Policy
Uses Semantic Versioning for document versions:
- patch → editorial/non-functional clarifications
- minor → new, backward-compatible content
- major → breaking scope or acceptance changes; re‑approval required

## Compliance notes
- Mirrors our common SOP patterns for “Document Control” and “Document Review and Approval History”.
- Supports ISO 9001 (7.5.3) expectations for controlled documents.

## Tips
- Put SharePoint/Repo path in **Location** for auditability.
- Keep “Status” in sync: Draft → Approved → Obsolete (as appropriate).
