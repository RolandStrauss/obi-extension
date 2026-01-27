#!/bin/bash
# File: .github/skills/diagram-assistant/scripts/export_diagram.sh
# Description: Export a Mermaid (.mmd) or Draw.io (.drawio) diagram to PNG, SVG, or PDF.
# Usage: ./export_diagram.sh <diagram_file> [png|svg|pdf]

file="$1"
format="${2:-png}"  # Default to PNG if no format is specified

if [[ -z "$file" ]]; then
  echo "Usage: $0 <diagram.drawio|diagram.mmd> [png|svg|pdf]"
  exit 1
fi

if [[ "$file" == *.drawio ]]; then
  # Use Draw.io CLI to export
  drawio_bin="${DRAWIO_PATH:-draw.io}"  # Use DRAWIO_PATH env var or assume 'draw.io' is in PATH
  "$drawio_bin" --export --input "$file" --output "${file%.*}.$format" --format "$format"
elif [[ "$file" == *.mmd ]]; then
  # Use Mermaid CLI (mmdc) to export
  mmdc -i "$file" -o "${file%.*}.$format"
else
  echo "Unsupported file type. Please provide a .drawio or .mmd file."
  exit 1
fi
