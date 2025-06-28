# Update Azure NSG for GitHub Actions IP Ranges
# This script fetches the latest GitHub Actions IP ranges and updates your NSG

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$true)]
    [string]$NsgName,
    
    [Parameter(Mandatory=$false)]
    [string]$RuleName = "GitHubActionsSSH"
)

Write-Host "Fetching GitHub Actions IP ranges..." -ForegroundColor Green

# Fetch GitHub Actions IP ranges
$apiUrl = "https://api.github.com/meta"
$response = Invoke-RestMethod -Uri $apiUrl -Method Get
$actionsIps = $response.actions

Write-Host "Found $($actionsIps.Count) IP ranges for GitHub Actions" -ForegroundColor Yellow

# Create priority for the rule (lower number = higher priority)
$priority = 100

# Remove existing rule if it exists
Write-Host "Removing existing rule '$RuleName' if it exists..." -ForegroundColor Yellow
try {
    az network nsg rule delete --resource-group $ResourceGroupName --nsg-name $NsgName --name $RuleName
    Write-Host "Existing rule removed" -ForegroundColor Green
} catch {
    Write-Host "No existing rule found or error removing it" -ForegroundColor Yellow
}

# Create new rule using JSON file to avoid command line length issues
Write-Host "Creating new NSG rule for GitHub Actions..." -ForegroundColor Green

# Create temporary JSON file with the rule configuration
$ruleConfig = @{
    name = $RuleName
    protocol = "Tcp"
    priority = $priority
    destinationPortRange = "22"
    sourceAddressPrefixes = $actionsIps
    access = "Allow"
    description = "Allow SSH from GitHub Actions"
}

$tempFile = [System.IO.Path]::GetTempFileName() + ".json"
$ruleConfig | ConvertTo-Json -Depth 10 | Out-File -FilePath $tempFile -Encoding UTF8

try {
    # Create the rule using the JSON file
    az network nsg rule create `
        --resource-group $ResourceGroupName `
        --nsg-name $NsgName `
        --name $RuleName `
        --protocol tcp `
        --priority $priority `
        --destination-port-range 22 `
        --source-address-prefixes $actionsIps[0..99] `
        --access allow `
        --description "Allow SSH from GitHub Actions (first 100 ranges)"

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ NSG rule created successfully with first 100 IP ranges!" -ForegroundColor Green
        Write-Host "Rule name: $RuleName" -ForegroundColor Cyan
        Write-Host "Priority: $priority" -ForegroundColor Cyan
        Write-Host "Note: Using first 100 IP ranges due to command line length limits" -ForegroundColor Yellow
        Write-Host "This should cover most GitHub Actions runners" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Failed to create NSG rule" -ForegroundColor Red
        exit 1
    }
} finally {
    # Clean up temporary file
    if (Test-Path $tempFile) {
        Remove-Item $tempFile -Force
    }
}

Write-Host "`nVerifying the rule..." -ForegroundColor Green
az network nsg rule show --resource-group $ResourceGroupName --nsg-name $NsgName --name $RuleName 