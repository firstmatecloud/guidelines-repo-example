remote_state {
  backend = "azurerm"
  config = {
    storage_account_name = "firstmateterraform"
    resource_group_name  = "infra"
    container_name       = "terraform-states-dev"
    subscription_id      = "9ba3e7d9-3dea-451e-a4bb-3507618c141c"
    tenant_id            = "f82bf646-31b2-4efa-a5f1-56cef35e498b"
    key                  = "${path_relative_to_include()}/terraform.tfstate"
  }
}

terraform {
  extra_arguments "retry_lock" {
    commands  = get_terraform_commands_that_need_locking()
    arguments = ["-lock-timeout=30m"]
  }
}