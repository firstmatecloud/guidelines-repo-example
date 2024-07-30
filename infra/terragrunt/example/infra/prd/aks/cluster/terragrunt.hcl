
terraform {
  source = "../../../../modules/aks"
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

inputs = {
  name                = "firstmate-prd"
  location            = dependency.rg.outputs.location
  resource_group_name = dependency.rg.outputs.name
  vnet_name           = dependency.vnet.outputs.vnet_name
  subnet_prefix       = "10.1.0.0/16"
  static_ip_name      = dependency.ip.outputs.public_ip_name
  static_ip_id        = dependency.ip.outputs.public_ip_id

  tags = {
    Application = "firstmate"
    Environment = "PRD"
  }
}