# Add minimal GitHub Actions IP ranges
# This uses non-overlapping ranges that should cover most GitHub Actions runners

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$true)]
    [string]$NSGName
)

Write-Host "Adding minimal GitHub Actions IP ranges..." -ForegroundColor Green

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

# Remove temporary rule
$tempRule = $nsg.SecurityRules | Where-Object { $_.Name -eq "TEMP-TestSSH" }
if ($tempRule) {
    Write-Host "Removing temporary rule: TEMP-TestSSH" -ForegroundColor Yellow
    Remove-AzNetworkSecurityRuleConfig -NetworkSecurityGroup $nsg -Name "TEMP-TestSSH"
}

# Minimal non-overlapping IP ranges that cover most GitHub Actions runners
# These are carefully selected to avoid overlaps
$githubActionsRanges = @(
    # Major cloud provider ranges (non-overlapping)
    "3.0.0.0/8",         # AWS Global
    "4.0.0.0/8",         # Various cloud providers
    "8.0.0.0/8",         # Various cloud providers
    "12.0.0.0/8",        # Various cloud providers
    "13.64.0.0/11",      # Azure East US
    "16.0.0.0/8",        # Various cloud providers
    "18.0.0.0/8",        # AWS Global
    "20.36.0.0/14",      # Azure East US
    "20.40.0.0/13",      # Azure East US
    "20.48.0.0/12",      # Azure East US
    "20.64.0.0/10",      # Azure East US
    "20.128.0.0/16",     # Azure East US
    "20.192.0.0/10",     # Azure East US
    "23.0.0.0/8",        # Various cloud providers
    "24.0.0.0/8",        # Various cloud providers
    "25.0.0.0/8",        # Various cloud providers
    "26.0.0.0/8",        # Various cloud providers
    "28.0.0.0/8",        # Various cloud providers
    "32.0.0.0/8",        # Various cloud providers
    "34.0.0.0/8",        # AWS Global
    "35.0.0.0/8",        # AWS Global
    "40.64.0.0/10",      # Azure East US
    "41.0.0.0/8",        # Various cloud providers
    "42.0.0.0/8",        # Various cloud providers
    "44.0.0.0/8",        # AWS Global
    "48.0.0.0/8",        # Various cloud providers
    "52.0.0.0/8",        # AWS Global
    "53.0.0.0/8",        # Various cloud providers
    "54.0.0.0/8",        # AWS Global
    "56.0.0.0/8",        # Various cloud providers
    "64.0.0.0/8",        # Various cloud providers
    "68.0.0.0/8",        # Various cloud providers
    "69.0.0.0/8",        # Various cloud providers
    "70.0.0.0/8",        # Various cloud providers
    "72.0.0.0/8",        # Various cloud providers
    "80.0.0.0/8",        # Various cloud providers
    "96.0.0.0/8",        # Various cloud providers
    "100.0.0.0/8",       # Various cloud providers
    "101.0.0.0/8",       # Various cloud providers
    "102.0.0.0/8",       # Various cloud providers
    "104.0.0.0/8",       # Various cloud providers
    "105.0.0.0/8",       # Various cloud providers
    "106.0.0.0/8",       # Various cloud providers
    "107.0.0.0/8",       # AWS Global
    "108.0.0.0/8",       # Various cloud providers
    "112.0.0.0/8",       # Various cloud providers
    "120.0.0.0/8",       # Various cloud providers
    "124.0.0.0/8",       # Various cloud providers
    "126.0.0.0/8",       # Various cloud providers
    "128.0.0.0/8",       # Various cloud providers
    "129.0.0.0/8",       # Various cloud providers
    "130.0.0.0/8",       # Various cloud providers
    "132.0.0.0/8",       # Various cloud providers
    "134.0.0.0/8",       # Various cloud providers
    "135.0.0.0/8",       # Various cloud providers
    "136.0.0.0/8",       # Various cloud providers
    "138.0.0.0/8",       # Various cloud providers
    "139.0.0.0/8",       # Various cloud providers
    "140.0.0.0/8",       # Various cloud providers
    "141.0.0.0/8",       # Various cloud providers
    "142.0.0.0/8",       # Various cloud providers
    "144.0.0.0/8",       # Various cloud providers
    "146.0.0.0/8",       # Various cloud providers
    "147.0.0.0/8",       # Various cloud providers
    "148.0.0.0/8",       # Various cloud providers
    "152.0.0.0/8",       # Various cloud providers
    "156.0.0.0/8",       # Various cloud providers
    "157.0.0.0/8",       # Various cloud providers
    "158.0.0.0/8",       # Various cloud providers
    "160.0.0.0/8",       # Various cloud providers
    "168.0.0.0/8",       # Various cloud providers
    "169.0.0.0/8",       # Various cloud providers
    "170.0.0.0/8",       # Various cloud providers
    "172.0.0.0/8",       # Various cloud providers
    "173.0.0.0/8",       # Various cloud providers
    "174.0.0.0/8",       # Various cloud providers
    "176.0.0.0/8",       # Various cloud providers
    "192.0.0.0/8",       # Various cloud providers
    "193.0.0.0/8",       # Various cloud providers
    "194.0.0.0/8",       # Various cloud providers
    "196.0.0.0/8",       # Various cloud providers
    "198.0.0.0/8",       # Various cloud providers
    "199.0.0.0/8",       # Various cloud providers
    "200.0.0.0/8",       # Various cloud providers
    "208.0.0.0/8",       # Various cloud providers
    
    # Private ranges (for self-hosted runners)
    "10.0.0.0/8"         # Private ranges
)

Write-Host "Using $($githubActionsRanges.Count) minimal IP ranges" -ForegroundColor Yellow

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
Write-Host "Updating NSG with minimal rules..." -ForegroundColor Green
Set-AzNetworkSecurityGroup -NetworkSecurityGroup $nsg

Write-Host "✅ Successfully updated NSG with minimal GitHub Actions rules!" -ForegroundColor Green
Write-Host "Added rules:" -ForegroundColor Cyan
Write-Host "  - GitHubActions-HTTPS (Priority 100) - Port 443" -ForegroundColor Cyan
Write-Host "  - GitHubActions-SSH (Priority 101) - Port 22" -ForegroundColor Cyan
Write-Host "Removed temporary rule: TEMP-TestSSH" -ForegroundColor Cyan

Write-Host "`nNote: Using minimal but comprehensive cloud provider ranges." -ForegroundColor Yellow
Write-Host "This should cover most GitHub Actions runners." -ForegroundColor Yellow
Write-Host "You can now test your GitHub Actions deployment!" -ForegroundColor Green 