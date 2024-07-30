terraform {
  source = "../../../../modules/resourceGroup"
}

prevent_destroy = true

include {
  path = find_in_parent_folders()
}

inputs = {
  name     = "firstmate-prd"
  location = "Germany West Central"
  tags = {
    Application = "firstmate"
    Environment = "PRD"
  }
}