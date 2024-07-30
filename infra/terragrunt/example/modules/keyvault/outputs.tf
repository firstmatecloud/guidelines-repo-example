output "id" {
  description = "The resource group identifier"
  value       = azurerm_key_vault.keyvault.id
}

output "name" {
  description = "The name of the created resource group"
  value       = azurerm_key_vault.keyvault.name
}

output "location" {
  description = "The location in which the resource group is created"
  value       = azurerm_key_vault.keyvault.location
}
