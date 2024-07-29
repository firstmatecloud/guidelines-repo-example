
terraform {
  source = "../../../../modules/kubernetes/certManager"
}

prevent_destroy = false

include {
  path = find_in_parent_folders()
}


dependency "rg" {
  config_path = "${get_parent_terragrunt_dir()}/global/resourceGroup"
}
dependency "vnet" {
  config_path = "${get_parent_terragrunt_dir()}/global/vnet"
}
dependency "cluster" {
  config_path = "${get_parent_terragrunt_dir()}/aks/cluster"
}

inputs = {
  location            = dependency.rg.outputs.location
  resource_group_name = dependency.rg.outputs.name

  kubernetes_configuration = {
    host                   = dependency.cluster.outputs.host
    client_key             = dependency.cluster.outputs.client_key
    client_certificate     = dependency.cluster.outputs.client_certificate
    cluster_ca_certificate = dependency.cluster.outputs.cluster_ca_certificate
    token                  = dependency.cluster.outputs.password
    kube_config_raw        = dependency.cluster.outputs.kube_config_raw
    oidc_issuer_url        = dependency.cluster.outputs.oidc_issuer_url
  }


  dns_zones = {
    "firstmate.cloud" = {
      dns_zone_id         = "/subscriptions/58d37159-9137-4c39-8bab-cbdaf2b96392/resourceGroups/firstmate/providers/Microsoft.Network/dnszones/firstmate.cloud"
      production_mode     = true
      wildcard_dns_name   = "firstmate.cloud"
      resource_group_name = "firstmate"
      subscription_id     = "58d37159-9137-4c39-8bab-cbdaf2b96392"
    },
    "eu.firstmate.cloud" = {
      dns_zone_id         = "/subscriptions/58d37159-9137-4c39-8bab-cbdaf2b96392/resourceGroups/firstmate/providers/Microsoft.Network/dnszones/eu.firstmate.cloud"
      production_mode     = true
      wildcard_dns_name   = "eu.firstmate.cloud"
      resource_group_name = "firstmate"
      subscription_id     = "58d37159-9137-4c39-8bab-cbdaf2b96392"
    }
  }

  tags = {
    Application = "firstmate"
    Environment = "DEV"
  }
}