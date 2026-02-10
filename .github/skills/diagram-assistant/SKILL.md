---
name: diagram-assistant
description: Generates flowcharts, process diagrams, and other visuals using Mermaid or Draw.io. Use this skill when a user asks to create or visualize a process, workflow, or diagram (especially if they mention "Mermaid", "draw.io", or need an image for documentation). The skill decides the appropriate format and provides the diagram definition along with guidance to export it as PNG/SVG.
license: MIT
---

**Skill Overview:** This skill helps the assistant create diagrams in two ways:
using **Mermaid** (a text-based diagram language) or **Draw.io** (diagram XML format).
It will decide which to use based on the user’s request, generate the diagram code,
and then explain how to get an image for embedding.

### 1. Determine Diagram Format (Mermaid vs Draw.io)

- **Default to Mermaid** for most cases (especially if the user doesn’t specify the format).
  Mermaid is great for quick flowcharts, sequence diagrams, etc., and can be easily embedded in Markdown.
- **Use Draw.io** if the user explicitly requests a Draw.io diagram or needs a complex layout/icon that Mermaid can’t easily produce.
- If unsure, you can briefly ask the user’s preference: e.g., "Do you prefer a Mermaid (text) diagram or a Draw.io diagram file?"

### 2. Generate the Diagram

**If using Mermaid:**
1. Choose the appropriate Mermaid diagram type:
   - Use `flowchart` for general process flows (with `LR` for left-to-right or `TD` for top-down orientation).
   - Use `sequenceDiagram` for sequence of interactions.
   - Use `classDiagram` for class or entity-relationship diagrams, etc.
   *(Refer to Mermaid syntax for other types like state diagrams, gantt, etc., as needed.)*
2. Construct the diagram in Mermaid syntax:
   - Begin with the diagram keyword (e.g., `flowchart LR`).
   - Define nodes and connect them with arrows. Use text in square brackets for node labels. For decisions, use `{} ` for condition nodes.
   - For example, a flowchart node definition: `A[Start] --> B{Decision?}`.
3. Output the Mermaid code in a fenced code block with **```mermaid** to ensure it renders correctly.
4. Following the code block, provide a brief note like: "The above is a Mermaid diagram. You can preview it in VS Code or using Mermaid Live Editor."

*Example (Mermaid flowchart):*

User asks: *"Show the login process as a flowchart."*

Assistant responds with:
```mermaid
flowchart LR
    A[User enters credentials] --> B{Credentials valid?}
    B -- Yes --> C[Display Dashboard]
    B -- No --> D[Show error message]
