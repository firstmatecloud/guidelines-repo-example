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


resource "azurerm_virtual_network" "vnet" {
  name                = var.name
  location            = var.location
  resource_group_name = var.resource_group_name
  address_space       =  [var.address_space]
  dns_servers         = []

  tags = local.tags
}

