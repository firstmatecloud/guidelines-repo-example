output "id" {
  description = "The resource group identifier"
  value       = azurerm_resource_group.resource_group.id
}

output "name" {
  description = "The name of the created resource group"
  value       = azurerm_resource_group.resource_group.name
}

output "location" {
  description = "The location in which the resource group is created"
  value       = azurerm_resource_group.resource_group.location
}

output "contributor_group_object_id" {
  value = azuread_group.ad_group.object_id
}