
output "name" {
  description = "Name of the storage account"
  value       = azurerm_storage_account.storage.name
}

output "subnetName" {
  description = "The IP address prefix of address_space the virtual network is configurated with"
  value       = azurerm_subnet.subnet.name
}
output "subnetPrefixes" {
  description = "The IP address prefix of address_space the virtual network is configurated with"
  value       = azurerm_subnet.subnet.address_prefixes
}
