# PowerShell script to generate TypeScript types from .NET C# models
# This script parses C# model files and generates corresponding TypeScript interfaces

param(
    [string]$SourceDir = "EVEAbacus.Domain/Models",
    [string]$OutputFile = "eve-abacus-webui/src/types/generated.ts"
)

Write-Host "Generating TypeScript types from .NET models..."

# Create output directory if it doesn't exist
$outputDir = Split-Path $OutputFile -Parent
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force
}

# Start building the TypeScript file
$tsContent = @"
// Auto-generated TypeScript types from .NET models
// Generated on: $(Get-Date)
// Source: $SourceDir

"@

# Function to convert C# type to TypeScript
function Convert-CsTypeToTs {
    param([string]$csType)
    
    switch -Regex ($csType) {
        '^string$' { return 'string' }
        '^int$|^long$|^decimal$|^double$|^float$' { return 'number' }
        '^bool$' { return 'boolean' }
        '^DateTime$' { return 'string' }
        '^List<(.+)>$' { return "$($matches[1])[]" }
        '^(.+)\?$' { return "$($matches[1]) | null" }
        default { return $csType }
    }
}

# Function to parse C# property
function Get-CsProperty {
    param([string]$line)
    
    if ($line -match 'public\s+(\w+(?:<[^>]+>)?(?:\?)?)\s+(\w+)\s*\{\s*get;\s*set;\s*\}') {
        $type = $matches[1]
        $name = $matches[2]
        $tsType = Convert-CsTypeToTs $type
        return "  $name`: $tsType;"
    }
    return $null
}

# Process C# model files
Get-ChildItem -Path $SourceDir -Recurse -Filter "*.cs" | ForEach-Object {
    $fileName = $_.Name
    $className = [System.IO.Path]::GetFileNameWithoutExtension($fileName)
    
    Write-Host "Processing: $fileName"
    
    $content = Get-Content $_.FullName -Raw
    $lines = $content -split "`n"
    
    $properties = @()
    $inClass = $false
    
    foreach ($line in $lines) {
        $trimmedLine = $line.Trim()
        
        if ($trimmedLine -match '^public\s+class\s+(\w+)') {
            $inClass = $true
            $className = $matches[1]
            continue
        }
        
        if ($inClass -and $trimmedLine -eq '}') {
            break
        }
        
        if ($inClass) {
            $property = Get-CsProperty $trimmedLine
            if ($property) {
                $properties += $property
            }
        }
    }
    
    if ($properties.Count -gt 0) {
        $tsContent += @"

export interface $className {
$($properties -join "`n")
}
"@
    }
}

# Write the generated TypeScript file
$tsContent | Out-File -FilePath $OutputFile -Encoding UTF8

Write-Host "TypeScript types generated successfully: $OutputFile"
Write-Host "Generated $(($tsContent -split "export interface" | Measure-Object).Count - 1) interfaces" 