# File: .github/skills/diagram-assistant/scripts/export_diagram.ps1
<#
.SYNOPSIS
Exports a Mermaid (.mmd) or Draw.io (.drawio) diagram to an image format (PNG by default).

.DESCRIPTION
This script detects the diagram type based on file extension and uses the appropriate CLI tool:
- Mermaid CLI (mmdc) for .mmd files
- Draw.io Desktop CLI for .drawio files

.PARAMETER InputFile
The path to the diagram file (.mmd or .drawio)

.PARAMETER Format
The output format: png, svg, or pdf (default is png)

.EXAMPLE
.\export_diagram.ps1 -InputFile "diagram.mmd" -Format "svg"
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$InputFile,

    [ValidateSet("png", "svg", "pdf")]
    [string]$Format = "png"
)

if ($InputFile.ToLower().EndsWith(".drawio")) {
    $drawio = $env:DRAWIO_PATH
    if (-not $drawio) {
        $drawio = "C:\Program Files\draw.io\draw.io.exe"
    }

    if (-not (Test-Path $drawio)) {
        Write-Error "Draw.io executable not found. Set DRAWIO_PATH environment variable or install Draw.io Desktop."
        exit 1
    }

    & "$drawio" --export --input "$InputFile" --output "${InputFile -replace '\.drawio$', ".$Format"}" --format $Format
}
elseif ($InputFile.ToLower().EndsWith(".mmd")) {
    if (-not (Get-Command "mmdc" -ErrorAction SilentlyContinue)) {
        Write-Error "Mermaid CLI (mmdc) not found in PATH. Please install it using npm install -g @mermaid-js/mermaid-cli"
        exit 1
    }

    & mmdc -i "$InputFile" -o "${InputFile -replace '\.mmd$', ".$Format"}"
}
else {
    Write-Error "Unsupported file type. Please provide a .drawio or .mmd file."
    exit 1
}
