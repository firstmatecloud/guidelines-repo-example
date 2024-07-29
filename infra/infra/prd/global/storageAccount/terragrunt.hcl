
terraform {
  source = "../../../../modules/storageAccount"
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


inputs = {
  name                = "firstmateprd"
  location            = dependency.rg.outputs.location
  resource_group_name = dependency.rg.outputs.name
  vnet_name           = dependency.vnet.outputs.vnet_name
  subnet_prefix       = "10.2.0.0/16"

  tags = {
    Application = "firstmate"
    Environment = "DEV"
  }
}