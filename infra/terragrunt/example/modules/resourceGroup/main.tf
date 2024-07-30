terraform {
  backend "azurerm" {}

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.94.0"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "=2.15.0"
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

  ad_group_name = "${var.name} Contributors"
  tags          = merge(local.default_tags, var.tags)
}

resource "azurerm_resource_group" "resource_group" {
  name     = var.name
  location = var.location
}

resource "azuread_group" "ad_group" {
  display_name = local.ad_group_name
  security_enabled = true
}

resource "azurerm_role_assignment" "contributor" {
  principal_id         = azuread_group.ad_group.object_id
  scope                = azurerm_resource_group.resource_group.id
  role_definition_name = "Contributor"
}