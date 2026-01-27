# Name: Document Versioning & Sign‑off
# Description: Insert and maintain ISO 9001 / PRINCE2‑aligned Document Control, Revision/Version History, and Approvals in scoping, sign‑off, and completion documents.
# Version: 1.0.0
# Author: Roland Strauss

## When to activate
Activate when user intent includes: "document control", "version history", "revision history",
"approvals", "sign‑off", "signoff", "closure", "completion report", "project scope", "PRD", "SOW",
or when opening a markdown/plain text document that lacks a Document Control section as detected
by patterns in `resources/detectors/headings.regex.txt`.

## What to do (ordered)
1. **Detect existing control block**
   If the document already contains a "Document Control" (or equivalent) heading, do not duplicate it.
   Instead, proceed to step 3.

2. **Insert initial block (if missing)**
   Insert the template that best matches the file format:
   - Markdown: `resources/version-templates/markdown.md`
   - Plain text: `resources/version-templates/plaintext.txt`
   Preserve the document’s existing first-level heading if present.

3. **Append a new Revision row on request**
   When asked to “bump version” or “record changes”, add a new row to the **Revision / Version History**
   table (see `resources/snippets/version-table.md` for structure) with:
   - Date: `YYYY-MM-DD`
   - Version: bumped per SemVer (patch/minor/major)
   - Author: use supplied name or leave blank if unknown
   - Reviewer / Approver: leave blank as placeholders unless provided
   - Change Summary: one-line summary
   - Reference: Work item / Change ID (optional)

4. **Versioning policy (SemVer + governance)**
   - **patch**: editorial/typo, formatting, non-functional clarifications
   - **minor**: new scope detail or non-breaking additions
   - **major**: major scope/acceptance changes requiring re‑approval; set Status to **Draft** and add note: “Re‑baselined; approval required”.
   (Aligns with project release communication practices.)
# SemVer classification hints (from team convention)
# PATCH: fixes/maintenance; safe to update
# MINOR: new features (backward‑compatible)
# MAJOR: breaking changes; needs planning and documentation

5. **Approvals block**
   Keep roles succinct (Sponsor, Architecture, Delivery/QA). Use the snippet in
   `resources/snippets/approval-block.md`. Respect existing org roles if already present.

6. **House style & compliance notes**
   - Use headings and column names consistent with internal SOP patterns (“Document Control”,
     “Document Review and Approval History”).
   - Keep wording concise and auditable (ISO 9001 7.5.3).
   - If a “Location” field is present, capture SharePoint/Repo path.

## Don’ts
- Don’t reorder existing history rows.
- Don’t remove legacy “Signatories” sections; migrate to “Approvals” only on request.
- Don’t change capitalization or house style if the document already uses an approved template.

## References (for the agent)
- ISO 9001:2015 clause 7.5.3 Controlled documented information (structure, approvals, status).
- PRINCE2 document/version control conventions (draft 0.xx, baseline 1.0, minor 1.x, major 2.0+).
- Internal SOP exemplars show “Document Control” and “Document Review and Approval History” tables.
