terraform {
  backend "azurerm" {}

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.94.0"
    }
  }
}

provider "azurerm" {
  skip_provider_registration = true # This is only required when the User, Service Principal, or Identity running Terraform lacks the permissions to register Azure Resource Providers.
  features {}
}

locals {
  default_tags = {
    Name      = var.name
    ManagedBy = "Terraform"
  }
  tags          = merge(local.default_tags, var.tags)
  tags_lowercase = {
    for key in keys(local.tags) :
    lower(key) => local.tags[key]
  }
}

resource "azurerm_subnet" "aks" {
  name                 = "${var.name}-aks-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = var.vnet_name
  address_prefixes     = [var.subnet_prefix]
}

resource "azurerm_kubernetes_cluster" "aks" {
  name                          = var.name
  location                      = var.location
  resource_group_name           = var.resource_group_name
  dns_prefix                    = "${var.name}-aks"
  oidc_issuer_enabled           = true
  workload_identity_enabled     = true
  sku_tier                      = "Free"


  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_D2_v2"
    vnet_subnet_id = azurerm_subnet.aks.id
    tags = local.tags_lowercase
    upgrade_settings {
      max_surge = "10%"
    }
  }
  network_profile {
    network_plugin      = "azure"
    network_policy      = "cilium"
    network_plugin_mode = "overlay"
    ebpf_data_plane     = "cilium"
    load_balancer_sku   = "standard"
    load_balancer_profile {
      outbound_ip_address_ids = var.static_ip_id == "" ? [] : [var.static_ip_id]
    }
  }

  identity {
    type = "SystemAssigned"
  }

  tags = local.tags
}
