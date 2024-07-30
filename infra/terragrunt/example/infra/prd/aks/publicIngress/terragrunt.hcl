
terraform {
  source = "../../../../modules/kubernetes/ingress"
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
dependency "ip" {
  config_path = "${get_parent_terragrunt_dir()}/global/publicIp"
}
dependency "cluster" {
  config_path = "${get_parent_terragrunt_dir()}/aks/cluster"
}

inputs = {
  name                = "ingress-public"
  namespace           = "ingress-public"
  location            = dependency.rg.outputs.location
  resource_group_name = dependency.rg.outputs.name

  kubernetes_configuration = {
    host                   = dependency.cluster.outputs.host
    client_key             = dependency.cluster.outputs.client_key
    client_certificate     = dependency.cluster.outputs.client_certificate
    cluster_ca_certificate = dependency.cluster.outputs.cluster_ca_certificate
    token                  = dependency.cluster.outputs.password
    kube_config_raw        = dependency.cluster.outputs.kube_config_raw
    principal_id           = dependency.cluster.outputs.cluster_principal_id
  }

  lb_resource_group_name    = dependency.rg.outputs.name
  ip_resource_group_id      = dependency.rg.outputs.id
  ip_resource_group_name    = dependency.rg.outputs.name
  static_ip                 = dependency.ip.outputs.public_ip_address
  static_ip_name            = dependency.ip.outputs.public_ip_name

  tags = {
    Application = "firstmate"
    Environment = "DEV"
  }
}