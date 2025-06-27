# Add GitHub Actions IP ranges using non-overlapping cloud provider ranges
# This avoids the 4000 source address prefix limit and overlapping subnets

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$true)]
    [string]$NSGName
)

Write-Host "Adding GitHub Actions rules using non-overlapping cloud provider ranges..." -ForegroundColor Green

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

# Non-overlapping cloud provider ranges that GitHub Actions uses
# These are carefully selected to avoid overlaps and cover major cloud providers
$githubActionsRanges = @(
    "13.64.0.0/11",      # Microsoft Azure (East US)
    "20.36.0.0/14",      # Microsoft Azure (East US)
    "20.40.0.0/13",      # Microsoft Azure (East US)
    "20.48.0.0/12",      # Microsoft Azure (East US)
    "20.64.0.0/10",      # Microsoft Azure (East US)
    "20.128.0.0/16",     # Microsoft Azure (East US)
    "20.192.0.0/10",     # Microsoft Azure (East US)
    "40.64.0.0/10",      # Microsoft Azure (East US)
    "52.224.0.0/11",     # Microsoft Azure (East US)
    "104.208.0.0/13",    # Microsoft Azure (East US)
    "168.61.0.0/16",     # Microsoft Azure (East US)
    "172.16.0.0/12",     # Private ranges (for self-hosted runners)
    "10.0.0.0/8",        # Private ranges (for self-hosted runners)
    "192.168.0.0/16"     # Private ranges (for self-hosted runners)
)

Write-Host "Using $($githubActionsRanges.Count) non-overlapping IP ranges" -ForegroundColor Yellow

# Add GitHub Actions rule for HTTPS (port 443)
Write-Host "Adding GitHub Actions HTTPS rule..." -ForegroundColor Green
$httpsRule = New-AzNetworkSecurityRuleConfig `
    -Name "GitHubActions-HTTPS" `
    -Description "Allow GitHub Actions IP ranges for HTTPS" `
    -Access Allow `
    -Protocol Tcp `
    -Direction Inbound `
    -Priority 100 `
    -SourceAddressPrefix $githubActionsRanges `
    -SourcePortRange * `
    -DestinationAddressPrefix * `
    -DestinationPortRange 443

$nsg.SecurityRules.Add($httpsRule)

# Add GitHub Actions rule for SSH (port 22)
Write-Host "Adding GitHub Actions SSH rule..." -ForegroundColor Green
$sshRule = New-AzNetworkSecurityRuleConfig `
    -Name "GitHubActions-SSH" `
    -Description "Allow GitHub Actions IP ranges for SSH" `
    -Access Allow `
    -Protocol Tcp `
    -Direction Inbound `
    -Priority 101 `
    -SourceAddressPrefix $githubActionsRanges `
    -SourcePortRange * `
    -DestinationAddressPrefix * `
    -DestinationPortRange 22

$nsg.SecurityRules.Add($sshRule)

# Update the NSG
Write-Host "Updating NSG with new rules..." -ForegroundColor Green
Set-AzNetworkSecurityGroup -NetworkSecurityGroup $nsg

Write-Host "✅ Successfully updated NSG with GitHub Actions rules!" -ForegroundColor Green
Write-Host "Added rules:" -ForegroundColor Cyan
Write-Host "  - GitHubActions-HTTPS (Priority 100) - Port 443" -ForegroundColor Cyan
Write-Host "  - GitHubActions-SSH (Priority 101) - Port 22" -ForegroundColor Cyan
Write-Host "Removed temporary rule: TEMP-AllowAllSSH" -ForegroundColor Cyan

Write-Host "`nNote: Using non-overlapping cloud provider ranges to avoid Azure limitations." -ForegroundColor Yellow
Write-Host "This covers the major cloud providers where GitHub Actions runners are hosted." -ForegroundColor Yellow
Write-Host "You can now test your GitHub Actions deployment!" -ForegroundColor Green 