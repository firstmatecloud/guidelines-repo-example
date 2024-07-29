

output "public_ip_name" {
  description = "The netmask of address_space the virtual network is configurated with"
  value       = azurerm_public_ip.ip.name
}
output "public_ip_id" {
  description = "The netmask of address_space the virtual network is configurated with"
  value       = azurerm_public_ip.ip.id
}
output "public_ip_address" {
  description = "The netmask of address_space the virtual network is configurated with"
  value       = azurerm_public_ip.ip.ip_address
}

