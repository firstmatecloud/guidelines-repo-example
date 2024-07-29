output "vnet_id" {
  description = "The unique identifier of the virtual network"
  value       = azurerm_virtual_network.vnet.id
}

output "vnet_name" {
  description = "The virtual network name"
  value       = azurerm_virtual_network.vnet.name
}

output "location" {
  value = azurerm_virtual_network.vnet.location
}

output "resource_group_name" {
  value = azurerm_virtual_network.vnet.resource_group_name
}

output "address_space" {
  description = "The address_space the virtual network is configurated with"
  value       = azurerm_virtual_network.vnet.address_space[0]
}

output "address_space_ip" {
  description = "The IP address prefix of address_space the virtual network is configurated with"
  value       = cidrhost(azurerm_virtual_network.vnet.address_space[0], 0)
}

output "address_space_netmask" {
  description = "The netmask of address_space the virtual network is configurated with"
  value       = cidrnetmask(azurerm_virtual_network.vnet.address_space[0])
}
