terraform {
  backend "azurerm" {}

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.94.0"
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

resource "azurerm_subnet" "subnet" {
  name                 = "${var.name}-sta-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = var.vnet_name
  address_prefixes     = [var.subnet_prefix]
  service_endpoints    = ["Microsoft.Sql", "Microsoft.Storage"]
}

resource "azurerm_storage_account" "storage" {
  name                      = var.name
  location                  = var.location
  resource_group_name       = var.resource_group_name
  account_tier              = "Standard"
  account_replication_type  = "GRS"

  network_rules {
    default_action             = "Deny"
    ip_rules                   = ["81.243.85.201"]
    virtual_network_subnet_ids = [azurerm_subnet.subnet.id]
  }

  tags = local.tags
}


