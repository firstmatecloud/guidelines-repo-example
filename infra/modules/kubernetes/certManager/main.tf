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
    Name      = "cert-manager"
    ManagedBy = "Terraform"
  }
  tags          = merge(local.default_tags, var.tags)
}

data "azurerm_client_config" "current" {}


resource "azurerm_user_assigned_identity" "cert-manager" {
  location            = var.location
  name                = var.cert_manager_name
  resource_group_name = var.resource_group_name
  tags                = local.tags
}

resource "kubernetes_namespace" "cert_manager" {
  metadata {
    annotations = {
      name = var.namespace
    }
    labels = local.tags
    name = var.namespace
  }
}

resource "helm_release" "cert_manager" {
  chart      = "cert-manager"
  repository = "https://charts.jetstack.io"
  name       = "cert-manager"
  namespace  = var.namespace
  version    = var.cert_manager_version

  create_namespace = false
  #  TODO: make templates with variables.
  values = [
    "${file("templates/values.yaml")}"
  ]

}

resource "time_sleep" "wait" {
  create_duration = "60s"
  depends_on = [helm_release.cert_manager]
}

resource "azurerm_role_assignment" "allow_aks_manage_dns" {
  for_each = var.dns_zones

  principal_id         = azurerm_user_assigned_identity.cert-manager.principal_id
  role_definition_name = "DNS Zone Contributor"
  scope                = each.value.dns_zone_id
}


data "kubectl_filename_list" "manifests" {
  pattern = "templates/*-clusterIssuer.yaml"
  #TODO: finish template setup.
}

resource "kubectl_manifest" "clusterIssuer" {
  count     = length(data.kubectl_filename_list.manifests.matches)
  yaml_body = file(element(data.kubectl_filename_list.manifests.matches, count.index))
}

resource "azurerm_federated_identity_credential" "example" {
  name                = "cert-manager"
  resource_group_name = var.resource_group_name
  audience            = ["api://AzureADTokenExchange"]
  issuer              = var.kubernetes_configuration.oidc_issuer_url
  parent_id           = azurerm_user_assigned_identity.cert-manager.id
  subject             = "system:serviceaccount:cert-manager:cert-manager"
  depends_on          = [kubectl_manifest.clusterIssuer]
}
