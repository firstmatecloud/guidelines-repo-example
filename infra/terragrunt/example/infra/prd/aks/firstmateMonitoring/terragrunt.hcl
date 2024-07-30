terraform {
  source = "../../../../modules/kubernetes/firstmateMonitoring"
}

prevent_destroy = false

include {
  path = find_in_parent_folders()
}


dependency "cluster" {
  config_path = "${get_parent_terragrunt_dir()}/aks/cluster"
}

inputs = {
  kubernetes_configuration = {
    host                   = dependency.cluster.outputs.host
    client_key             = dependency.cluster.outputs.client_key
    client_certificate     = dependency.cluster.outputs.client_certificate
    cluster_ca_certificate = dependency.cluster.outputs.cluster_ca_certificate
  }

}