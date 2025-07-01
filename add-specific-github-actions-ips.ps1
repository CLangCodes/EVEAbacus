# Add specific GitHub Actions IP ranges to Azure NSG
# These are the core GitHub Actions IP ranges

param(
    [string]$ResourceGroupName = "EVEAbacus",
    [string]$NSGName = "EVEAbacus-nsg"
)

# Specific GitHub Actions IP ranges
$githubActionsIPv4 = @(
    "192.30.252.0/22",
    "185.199.108.0/22", 
    "140.82.112.0/20",
    "143.55.64.0/20"
)
$githubActionsIPv6 = @(
    "2a0a:a440::/29",
    "2606:50c0::/32"
)

Write-Host "Adding specific GitHub Actions IP ranges to NSG: $NSGName" -ForegroundColor Green

try {
    # Get the NSG
    $nsg = Get-AzNetworkSecurityGroup -ResourceGroupName $ResourceGroupName -Name $NSGName
    
    if (-not $nsg) {
        Write-Error "NSG '$NSGName' not found in resource group '$ResourceGroupName'"
        exit 1
    }
    
    # Create security rule for SSH (port 22) - IPv4
    $sshRuleIPv4 = New-AzNetworkSecurityRuleConfig `
        -Name "AllowGitHubActionsSSH-IPv4" `
        -Description "Allow SSH from specific GitHub Actions IPv4 ranges" `
        -Access Allow `
        -Protocol Tcp `
        -Direction Inbound `
        -Priority 200 `
        -SourceAddressPrefix $githubActionsIPv4 `
        -SourcePortRange * `
        -DestinationAddressPrefix * `
        -DestinationPortRange 22
    
    # Create security rule for SSH (port 22) - IPv6
    $sshRuleIPv6 = New-AzNetworkSecurityRuleConfig `
        -Name "AllowGitHubActionsSSH-IPv6" `
        -Description "Allow SSH from specific GitHub Actions IPv6 ranges" `
        -Access Allow `
        -Protocol Tcp `
        -Direction Inbound `
        -Priority 201 `
        -SourceAddressPrefix $githubActionsIPv6 `
        -SourcePortRange * `
        -DestinationAddressPrefix * `
        -DestinationPortRange 22
    
    # Create security rule for HTTPS (port 443) - IPv4
    $httpsRuleIPv4 = New-AzNetworkSecurityRuleConfig `
        -Name "AllowGitHubActionsHTTPS-IPv4" `
        -Description "Allow HTTPS from specific GitHub Actions IPv4 ranges" `
        -Access Allow `
        -Protocol Tcp `
        -Direction Inbound `
        -Priority 202 `
        -SourceAddressPrefix $githubActionsIPv4 `
        -SourcePortRange * `
        -DestinationAddressPrefix * `
        -DestinationPortRange 443
    
    # Create security rule for HTTPS (port 443) - IPv6
    $httpsRuleIPv6 = New-AzNetworkSecurityRuleConfig `
        -Name "AllowGitHubActionsHTTPS-IPv6" `
        -Description "Allow HTTPS from specific GitHub Actions IPv6 ranges" `
        -Access Allow `
        -Protocol Tcp `
        -Direction Inbound `
        -Priority 203 `
        -SourceAddressPrefix $githubActionsIPv6 `
        -SourcePortRange * `
        -DestinationAddressPrefix * `
        -DestinationPortRange 443
    
    # Add rules to NSG
    $nsg.SecurityRules.Add($sshRuleIPv4)
    $nsg.SecurityRules.Add($sshRuleIPv6)
    $nsg.SecurityRules.Add($httpsRuleIPv4)
    $nsg.SecurityRules.Add($httpsRuleIPv6)
    
    # Update the NSG
    Set-AzNetworkSecurityGroup -NetworkSecurityGroup $nsg
    
    Write-Host "Successfully added GitHub Actions IP ranges to NSG!" -ForegroundColor Green
    Write-Host "Added IPv4 ranges:" -ForegroundColor Yellow
    foreach ($ip in $githubActionsIPv4) {
        Write-Host "  - $ip" -ForegroundColor Cyan
    }
    Write-Host "Added IPv6 ranges:" -ForegroundColor Yellow
    foreach ($ip in $githubActionsIPv6) {
        Write-Host "  - $ip" -ForegroundColor Cyan
    }
    
} catch {
    Write-Error "Failed to add GitHub Actions IP ranges: $($_.Exception.Message)"
    exit 1
} 