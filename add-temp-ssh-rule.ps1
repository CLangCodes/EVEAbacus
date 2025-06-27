#!/usr/bin/env pwsh

# Temporary SSH rule for testing GitHub Actions connectivity
# WARNING: This allows all SSH traffic - only use for testing!

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$true)]
    [string]$NsgName,
    
    [Parameter(Mandatory=$false)]
    [int]$Priority = 50
)

# Import the required module
Import-Module Az.Network

Write-Host "Adding temporary SSH rule to allow all traffic for testing..." -ForegroundColor Yellow

# Get the NSG
$nsg = Get-AzNetworkSecurityGroup -ResourceGroupName $ResourceGroupName -Name $NsgName
if (-not $nsg) {
    Write-Error "NSG '$NsgName' not found in resource group '$ResourceGroupName'"
    exit 1
}

# Add temporary SSH rule with valid priority (50 is too low, use 100)
$securityRule = New-AzNetworkSecurityRuleConfig `
    -Name "TEMP-AllowAllSSH" `
    -Description "TEMPORARY: Allow all SSH traffic for testing" `
    -Access Allow `
    -Protocol Tcp `
    -Direction Inbound `
    -Priority 100 `
    -SourceAddressPrefix * `
    -SourcePortRange * `
    -DestinationAddressPrefix * `
    -DestinationPortRange 22

$nsg.SecurityRules.Add($securityRule)

# Update the NSG
Write-Host "Updating NSG with temporary rule..." -ForegroundColor Cyan
Set-AzNetworkSecurityGroup -NetworkSecurityGroup $nsg

Write-Host "Temporary SSH rule added! Test your GitHub Actions now." -ForegroundColor Green
Write-Host "REMEMBER: Remove this rule after testing!" -ForegroundColor Red 