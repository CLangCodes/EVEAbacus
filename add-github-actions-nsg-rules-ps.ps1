#!/usr/bin/env pwsh

# GitHub Actions IP Ranges for Azure NSG using Azure PowerShell
# This script adds all necessary GitHub Actions IP ranges to your NSG

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$true)]
    [string]$NsgName,
    
    [Parameter(Mandatory=$false)]
    [int]$Priority = 100,
    
    [Parameter(Mandatory=$false)]
    [string]$Description = "GitHub Actions deployment access"
)

# Check if Azure PowerShell module is installed
if (-not (Get-Module -ListAvailable -Name Az.Network)) {
    Write-Host "Installing Azure PowerShell module..." -ForegroundColor Yellow
    Install-Module -Name Az -Force -AllowClobber
}

# Import the required module
Import-Module Az.Network

# GitHub Actions IP ranges from https://api.github.com/meta
$githubActionsRanges = @(
    "4.148.0.0/16",
    "4.149.0.0/18", 
    "4.150.0.0/18",
    "4.151.0.0/16",
    "4.152.0.0/15",
    "4.154.0.0/15",
    "4.156.0.0/15",
    "4.175.0.0/16",
    "4.180.0.0/16",
    "4.207.0.0/16",
    "4.208.0.0/15",
    "4.210.0.0/17",
    "4.227.0.0/17",
    "4.231.0.0/17",
    "4.236.0.0/17",
    "4.242.0.0/17",
    "4.245.0.0/17",
    "4.246.0.0/17",
    "4.249.0.0/17",
    "4.255.0.0/17"
)

# GitHub API/Web IP ranges
$githubApiRanges = @(
    "192.30.252.0/22",
    "185.199.108.0/22",
    "140.82.112.0/20",
    "143.55.64.0/20"
)

Write-Host "Adding GitHub Actions IP ranges to NSG: $NsgName" -ForegroundColor Green

# Get the NSG
$nsg = Get-AzNetworkSecurityGroup -ResourceGroupName $ResourceGroupName -Name $NsgName
if (-not $nsg) {
    Write-Error "NSG '$NsgName' not found in resource group '$ResourceGroupName'"
    exit 1
}

# Add GitHub Actions runner ranges
foreach ($range in $githubActionsRanges) {
    $ruleName = "GitHubActions-$($range.Replace('/', '-').Replace('.', '-'))"
    
    Write-Host "Adding rule: $ruleName for range: $range" -ForegroundColor Yellow
    
    $securityRule = New-AzNetworkSecurityRuleConfig `
        -Name $ruleName `
        -Description "$Description - GitHub Actions Runner" `
        -Access Allow `
        -Protocol Tcp `
        -Direction Inbound `
        -Priority $Priority `
        -SourceAddressPrefix $range `
        -SourcePortRange * `
        -DestinationAddressPrefix * `
        -DestinationPortRange 443
    
    $nsg.SecurityRules.Add($securityRule)
    $Priority++
}

# Add GitHub API ranges
foreach ($range in $githubApiRanges) {
    $ruleName = "GitHubAPI-$($range.Replace('/', '-').Replace('.', '-'))"
    
    Write-Host "Adding rule: $ruleName for range: $range" -ForegroundColor Yellow
    
    $securityRule = New-AzNetworkSecurityRuleConfig `
        -Name $ruleName `
        -Description "$Description - GitHub API" `
        -Access Allow `
        -Protocol Tcp `
        -Direction Inbound `
        -Priority $Priority `
        -SourceAddressPrefix $range `
        -SourcePortRange * `
        -DestinationAddressPrefix * `
        -DestinationPortRange 443
    
    $nsg.SecurityRules.Add($securityRule)
    $Priority++
}

# Update the NSG
Write-Host "Updating NSG with new rules..." -ForegroundColor Cyan
Set-AzNetworkSecurityGroup -NetworkSecurityGroup $nsg

Write-Host "Successfully added all GitHub Actions IP ranges to NSG!" -ForegroundColor Green
Write-Host "Total rules added: $($githubActionsRanges.Count + $githubApiRanges.Count)" -ForegroundColor Cyan 