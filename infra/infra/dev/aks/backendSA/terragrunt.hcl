
terraform {
  source = "../../../../modules/kubernetes/userManagedIdentity"
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
dependency "keyvault" {
  config_path = "${get_parent_terragrunt_dir()}/global/keyVault"
}

inputs = {
  name                = "backend"
  namespace           = "firstmate-dev"
  resourceId          = dependency.keyvault.outputs.id
  role                = "Contributor"
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

  tags = {
    Application = "firstmate"
    Environment = "DEV"
  }
}