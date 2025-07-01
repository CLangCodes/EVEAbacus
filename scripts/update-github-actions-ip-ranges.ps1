# Update GitHub Actions SSH IP ranges in Azure NSG
# This script gets the latest GitHub Actions IP ranges and updates the NSG for SSH only

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$true)]
    [string]$NSGName
)

Write-Host "Getting latest GitHub Actions IP ranges..." -ForegroundColor Green

# Get the latest GitHub Actions IP ranges
$githubMeta = Invoke-RestMethod -Uri "https://api.github.com/meta"

# Extract the actions IP ranges (IPv4 only)
$actionsIPv4 = $githubMeta.actions

Write-Host "Found $($actionsIPv4.Count) IPv4 ranges" -ForegroundColor Yellow

# Get the NSG
$nsg = Get-AzNetworkSecurityGroup -ResourceGroupName $ResourceGroupName -Name $NSGName

if (-not $nsg) {
    Write-Error "NSG '$NSGName' not found in resource group '$ResourceGroupName'"
    exit 1
}

Write-Host "Updating NSG: $NSGName" -ForegroundColor Green

# Remove existing GitHub Actions SSH/HTTPS rules
$existingRules = $nsg.SecurityRules | Where-Object { $_.Name -like "*GitHubActions*" }
foreach ($rule in $existingRules) {
    Write-Host "Removing existing rule: $($rule.Name)" -ForegroundColor Yellow
    Remove-AzNetworkSecurityRuleConfig -NetworkSecurityGroup $nsg -Name $rule.Name
}

# Remove temporary rule if it exists
$tempRule = $nsg.SecurityRules | Where-Object { $_.Name -eq "TEMP-AllowAllSSH" }
if ($tempRule) {
    Write-Host "Removing temporary rule: TEMP-AllowAllSSH" -ForegroundColor Yellow
    Remove-AzNetworkSecurityRuleConfig -NetworkSecurityGroup $nsg -Name "TEMP-AllowAllSSH"
}

# Add new GitHub Actions rules for SSH (port 22)
Write-Host "Adding GitHub Actions SSH rule..." -ForegroundColor Green
$sshRule = New-AzNetworkSecurityRuleConfig `
    -Name "GitHubActions-SSH" `
    -Description "Allow GitHub Actions IP ranges for SSH" `
    -Access Allow `
    -Protocol Tcp `
    -Direction Inbound `
    -Priority 101 `
    -SourceAddressPrefix $actionsIPv4 `
    -SourcePortRange * `
    -DestinationAddressPrefix * `
    -DestinationPortRange 22

$nsg.SecurityRules.Add($sshRule)

# Update the NSG
Write-Host "Updating NSG with new SSH rule..." -ForegroundColor Green
Set-AzNetworkSecurityGroup -NetworkSecurityGroup $nsg

Write-Host "✅ Successfully updated NSG with latest GitHub Actions SSH IP ranges!" -ForegroundColor Green
Write-Host "Added rule:" -ForegroundColor Cyan
Write-Host "  - GitHubActions-SSH (Priority 101) - Port 22" -ForegroundColor Cyan
Write-Host "Removed any HTTPS or temporary rules" -ForegroundColor Cyan

Write-Host "`nYou can now test your GitHub Actions deployment!" -ForegroundColor Green 