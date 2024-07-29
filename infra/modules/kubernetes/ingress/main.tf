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
provider "helm" {
  kubernetes {
    host                   = var.kubernetes_configuration.host
    client_key             = base64decode(var.kubernetes_configuration.client_key)
    client_certificate     = base64decode(var.kubernetes_configuration.client_certificate)
    cluster_ca_certificate = base64decode(var.kubernetes_configuration.cluster_ca_certificate)
  }
}

locals {
  values = templatefile("templates/values.tmpl.yaml", {
    STATIC_IP               = var.static_ip
    AZURE_LOAD_BALANCER_RG  = var.lb_resource_group_name
    AZURE_PIP_NAME          = var.static_ip_name
  })

  default_tags = {
    Name      = var.name
    ManagedBy = "Terraform"
  }
  tags          = merge(local.default_tags, var.tags)
}

data "azurerm_client_config" "current" {}

resource "kubernetes_namespace" "ingress" {
  metadata {
    annotations = {
      name = var.namespace
    }
    labels = local.tags
    name = var.namespace
  }
}


resource "azurerm_role_assignment" "network_access" {
  scope                = var.ip_resource_group_id
  role_definition_name = "Network Contributor"
  principal_id         = var.kubernetes_configuration.principal_id
}

resource "helm_release" "ingress" {
  chart      = "ingress-nginx"
  repository = "https://kubernetes.github.io/ingress-nginx"
  name       = var.name
  namespace  = var.namespace
  version    = var.ingress_version

  create_namespace = false
  values = compact([
    local.values
  ])
#  TODO: make templates with variables.

}
