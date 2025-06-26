#!/bin/bash

# Quick GitHub Actions NSG Rules Setup
# Usage: ./quick-github-actions-setup.sh <ResourceGroup> <NSGName>

RESOURCE_GROUP=$1
NSG_NAME=$2
PRIORITY=100

if [ -z "$RESOURCE_GROUP" ] || [ -z "$NSG_NAME" ]; then
    echo "Usage: $0 <ResourceGroup> <NSGName>"
    exit 1
fi

echo "Adding GitHub Actions IP ranges to NSG: $NSG_NAME"

# GitHub Actions IP ranges
RANGES=(
    "4.148.0.0/16" "4.149.0.0/18" "4.150.0.0/18" "4.151.0.0/16" "4.152.0.0/15"
    "4.154.0.0/15" "4.156.0.0/15" "4.175.0.0/16" "4.180.0.0/16" "4.207.0.0/16"
    "4.208.0.0/15" "4.210.0.0/17" "4.227.0.0/17" "4.231.0.0/17" "4.236.0.0/17"
    "4.242.0.0/17" "4.245.0.0/17" "4.246.0.0/17" "4.249.0.0/17" "4.255.0.0/17"
    "192.30.252.0/22" "185.199.108.0/22" "140.82.112.0/20" "143.55.64.0/20"
)

for range in "${RANGES[@]}"; do
    rule_name="GitHubActions-$(echo $range | sed 's/[./]/-/g')"
    echo "Adding rule: $rule_name for range: $range"
    
    az network nsg rule create \
        --resource-group $RESOURCE_GROUP \
        --nsg-name $NSG_NAME \
        --name $rule_name \
        --protocol tcp \
        --priority $PRIORITY \
        --destination-port-range 443 \
        --source-address-prefix $range \
        --access allow \
        --description "GitHub Actions deployment access"
    
    ((PRIORITY++))
done

echo "Successfully added ${#RANGES[@]} GitHub Actions IP ranges!" 