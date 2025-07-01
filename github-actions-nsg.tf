# GitHub Actions IP Ranges for Azure NSG
# This Terraform configuration adds all necessary GitHub Actions IP ranges

locals {
  github_actions_ranges = [
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
  ]

  github_api_ranges = [
    "192.30.252.0/22",
    "185.199.108.0/22",
    "140.82.112.0/20",
    "143.55.64.0/20"
  ]
}

# GitHub Actions Runner Rules
resource "azurerm_network_security_rule" "github_actions_runners" {
  for_each = toset(local.github_actions_ranges)

  name                        = "GitHubActions-${replace(replace(each.value, "/", "-"), ".", "-")}"
  priority                    = 100 + index(local.github_actions_ranges, each.value)
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "443"
  source_address_prefix       = each.value
  destination_address_prefix  = "*"
  resource_group_name         = var.resource_group_name
  network_security_group_name = var.nsg_name

  description = "GitHub Actions deployment access"
}

# GitHub API Rules
resource "azurerm_network_security_rule" "github_api" {
  for_each = toset(local.github_api_ranges)

  name                        = "GitHubAPI-${replace(replace(each.value, "/", "-"), ".", "-")}"
  priority                    = 120 + index(local.github_api_ranges, each.value)
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "443"
  source_address_prefix       = each.value
  destination_address_prefix  = "*"
  resource_group_name         = var.resource_group_name
  network_security_group_name = var.nsg_name

  description = "GitHub API access"
}

# Variables
variable "resource_group_name" {
  description = "Name of the resource group containing the NSG"
  type        = string
}

variable "nsg_name" {
  description = "Name of the Network Security Group"
  type        = string
} 