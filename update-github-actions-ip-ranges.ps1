# Update GitHub Actions IP ranges in Azure NSG
# This script gets the latest IP ranges from GitHub API and updates the NSG

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$true)]
    [string]$NSGName
)

Write-Host "Getting latest GitHub Actions IP ranges..." -ForegroundColor Green

# Get the latest GitHub Actions IP ranges
$githubMeta = Invoke-RestMethod -Uri "https://api.github.com/meta"

# Extract the actions IP ranges (both IPv4 and IPv6)
$actionsIPv4 = $githubMeta.actions
$actionsIPv6 = $githubMeta.actions_ipv6

Write-Host "Found $($actionsIPv4.Count) IPv4 ranges and $($actionsIPv6.Count) IPv6 ranges" -ForegroundColor Yellow

# Get the NSG
$nsg = Get-AzNetworkSecurityGroup -ResourceGroupName $ResourceGroupName -Name $NSGName

if (-not $nsg) {
    Write-Error "NSG '$NSGName' not found in resource group '$ResourceGroupName'"
    exit 1
}

Write-Host "Updating NSG: $NSGName" -ForegroundColor Green

# Remove existing GitHub Actions rules
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

# Add new GitHub Actions rules for HTTPS (port 443)
Write-Host "Adding GitHub Actions HTTPS rule..." -ForegroundColor Green
$httpsRule = New-AzNetworkSecurityRuleConfig `
    -Name "GitHubActions-HTTPS" `
    -Description "Allow GitHub Actions IP ranges for HTTPS" `
    -Access Allow `
    -Protocol Tcp `
    -Direction Inbound `
    -Priority 100 `
    -SourceAddressPrefix $actionsIPv4 `
    -SourcePortRange * `
    -DestinationAddressPrefix * `
    -DestinationPortRange 443

$nsg.SecurityRules.Add($httpsRule)

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
Write-Host "Updating NSG with new rules..." -ForegroundColor Green
Set-AzNetworkSecurityGroup -NetworkSecurityGroup $nsg

Write-Host "✅ Successfully updated NSG with latest GitHub Actions IP ranges!" -ForegroundColor Green
Write-Host "Added rules:" -ForegroundColor Cyan
Write-Host "  - GitHubActions-HTTPS (Priority 100) - Port 443" -ForegroundColor Cyan
Write-Host "  - GitHubActions-SSH (Priority 101) - Port 22" -ForegroundColor Cyan
Write-Host "Removed temporary rule: TEMP-AllowAllSSH" -ForegroundColor Cyan

Write-Host "`nYou can now test your GitHub Actions deployment!" -ForegroundColor Green 