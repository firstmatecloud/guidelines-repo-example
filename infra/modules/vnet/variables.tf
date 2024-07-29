variable "name" {
  description = "Name of the resource group where the network will be created in"
  type        = string
  default     = "firstmate"
}
variable "resource_group_name" {
  description = "Name of the resource group where the network will be created in"
  type        = string
}
variable "location" {
  description = "Location of the vnet"
  type        = string
}
variable "tags" {
  description = "The tags to associate with the resource group"
  type        = map(string)
  default     = {}
}

variable "address_space" {
  description = "Network address space, or CIDR block"
  type        = string
  default     = "10.0.0.0/12"
}
