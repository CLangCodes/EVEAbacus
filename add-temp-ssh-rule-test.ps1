# Add temporary SSH rule to test NSG functionality
# This will help us determine if the issue is with our IP ranges or something else

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$true)]
    [string]$NSGName
)

Write-Host "Adding temporary SSH rule to test NSG functionality..." -ForegroundColor Green

# Get the NSG
$nsg = Get-AzNetworkSecurityGroup -ResourceGroupName $ResourceGroupName -Name $NSGName

if (-not $nsg) {
    Write-Error "NSG '$NSGName' not found in resource group '$ResourceGroupName'"
    exit 1
}

Write-Host "Updating NSG: $NSGName" -ForegroundColor Green

# Remove any existing temporary rule
$tempRule = $nsg.SecurityRules | Where-Object { $_.Name -eq "TEMP-TestSSH" }
if ($tempRule) {
    Write-Host "Removing existing temporary rule: TEMP-TestSSH" -ForegroundColor Yellow
    Remove-AzNetworkSecurityRuleConfig -NetworkSecurityGroup $nsg -Name "TEMP-TestSSH"
}

# Add temporary SSH rule for testing
Write-Host "Adding temporary SSH rule..." -ForegroundColor Green
$tempRule = New-AzNetworkSecurityRuleConfig `
    -Name "TEMP-TestSSH" `
    -Description "Temporary rule to test SSH connectivity" `
    -Access Allow `
    -Protocol Tcp `
    -Direction Inbound `
    -Priority 190 `
    -SourceAddressPrefix "0.0.0.0/0" `
    -SourcePortRange * `
    -DestinationAddressPrefix * `
    -DestinationPortRange 22

$nsg.SecurityRules.Add($tempRule)

# Update the NSG
Write-Host "Updating NSG with temporary rule..." -ForegroundColor Green
Set-AzNetworkSecurityGroup -NetworkSecurityGroup $nsg

Write-Host "✅ Successfully added temporary SSH rule!" -ForegroundColor Green
Write-Host "Added rule:" -ForegroundColor Cyan
Write-Host "  - TEMP-TestSSH (Priority 90) - Port 22 from any IP" -ForegroundColor Cyan

Write-Host "`n⚠️  WARNING: This rule allows SSH from ANY IP address!" -ForegroundColor Red
Write-Host "This is for testing only. Test your deployment now, then remove this rule!" -ForegroundColor Yellow
Write-Host "To remove this rule later, run: Remove-AzNetworkSecurityRuleConfig -NetworkSecurityGroup \$nsg -Name 'TEMP-TestSSH'" -ForegroundColor Yellow 