terraform {
  source = "../../../../modules/resourceGroup"
}

prevent_destroy = false

include {
  path = find_in_parent_folders()
}

inputs = {
  name     = "firstmate-dev"
  location = "Germany West Central"
  tags = {
    Application = "firstmate"
    Environment = "DEV"
  }
}