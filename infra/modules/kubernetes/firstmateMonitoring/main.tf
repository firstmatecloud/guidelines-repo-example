terraform {
  backend "azurerm" {}

}

provider "azurerm" {
  features {}
}


module "firstmate_monitoring" {
  source = "git::git@github.com:firstmatecloud/firstmate-terraform-modules.git//modules/kubernetes/firstmate-monitoring?ref=add-http-call"

  kube_config ={
    host                   = var.kubernetes_configuration.host
    client_key             = base64decode(var.kubernetes_configuration.client_key)
    client_certificate     = base64decode(var.kubernetes_configuration.client_certificate)
    cluster_ca_certificate = base64decode(var.kubernetes_configuration.cluster_ca_certificate)
  }

  cluster_name = "firstmate-prd"
  api_key = "UIiZMmrThWWXdM9P5rCjXmI7mbrmMqRQcth3CVYnNUR5rNnSfM"

  permissions = {
    nodesMetrics = true
    kubeMetrics = true
    appsMetrics = true
    scalingMetrics = true
  }
}






