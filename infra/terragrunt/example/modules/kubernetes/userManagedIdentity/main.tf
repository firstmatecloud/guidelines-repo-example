terraform {
  backend "azurerm" {}

  required_providers {
    helm       = {
      source  = "hashicorp/helm"
      version = "=2.1.2"
    }
    kubernetes =  {
      source  = "hashicorp/kubernetes"
      version = "=2.3.1"
    }
    kubectl = {
      source  = "alekc/kubectl"
      version = "~> 2.0.4"
    }
    azurerm    = {
      source  = "hashicorp/azurerm"
      version = "=3.94.0"
    }
  }
}

provider "azurerm" {
  features {}
}

provider "kubernetes" {
  host                   = var.kubernetes_configuration.host
  client_key             = base64decode(var.kubernetes_configuration.client_key)
  client_certificate     = base64decode(var.kubernetes_configuration.client_certificate)
  cluster_ca_certificate = base64decode(var.kubernetes_configuration.cluster_ca_certificate)
}
provider "kubectl" {
  host                   = var.kubernetes_configuration.host
  client_key             = base64decode(var.kubernetes_configuration.client_key)
  client_certificate     = base64decode(var.kubernetes_configuration.client_certificate)
  cluster_ca_certificate = base64decode(var.kubernetes_configuration.cluster_ca_certificate)
}

provider "helm" {
  kubernetes {
    host                   = var.kubernetes_configuration.host
    client_key             = base64decode(var.kubernetes_configuration.client_key)
    client_certificate     = base64decode(var.kubernetes_configuration.client_certificate)
    cluster_ca_certificate = base64decode(var.kubernetes_configuration.cluster_ca_certificate)
  }
}

locals {
  default_tags = {
    Name      = var.name
    ManagedBy = "Terraform"
  }
  tags          = merge(local.default_tags, var.tags)
}

data "azurerm_client_config" "current" {}


resource "azurerm_user_assigned_identity" "identity" {
  location            = var.location
  name                = var.name
  resource_group_name = var.resource_group_name
  tags                = local.tags
}


resource "azurerm_role_assignment" "keyvault_access" {
  principal_id         = azurerm_user_assigned_identity.identity.principal_id
  role_definition_name = var.role
  scope                = var.resourceId
}


data "kubectl_file_documents" "docs" {
  content = templatefile("templates/serviceAccount.yaml",{
        NAME = var.name
  })
}

resource "kubectl_manifest" "clusterIssuer" {
  for_each  = data.kubectl_file_documents.docs.manifests
  override_namespace = var.namespace
  yaml_body = each.value
}

resource "azurerm_federated_identity_credential" "example" {
  name                = var.name
  resource_group_name = var.resource_group_name
  audience            = ["api://AzureADTokenExchange"]
  issuer              = var.kubernetes_configuration.oidc_issuer_url
  parent_id           = azurerm_user_assigned_identity.identity.id
  subject             = "system:serviceaccount:${var.namespace}:${var.name}"
  depends_on          = [kubectl_manifest.clusterIssuer]
}