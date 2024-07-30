terraform {
  source = "${get_parent_terragrunt_dir()}/../../modules/publicIp"
}

prevent_destroy = true

include {
  path = find_in_parent_folders()
}


dependency "rg" {
  config_path = "${get_parent_terragrunt_dir()}/global/resourceGroup"
}

inputs = {
  name     = "dev"
  location            = dependency.rg.outputs.location
  resource_group_name = dependency.rg.outputs.name

  tags = {
    Application = "firstmate"
    Environment = "DEV"
  }
}