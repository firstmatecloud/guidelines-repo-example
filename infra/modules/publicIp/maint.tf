terraform {
  backend "azurerm" {}

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.0.0"
    }
  }
}

provider "azurerm" {
  features {}
}

locals {
  default_tags = {
    Name      = var.name
    ManagedBy = "Terraform"
  }
  tags          = merge(local.default_tags, var.tags)
}


resource "azurerm_public_ip" "ip" {
  name                = var.name
  resource_group_name = var.resource_group_name
  location            = var.location
  allocation_method   = "Static"
  sku                 = "Standard"
  tags = local.tags
}

