variable "name" {
  description = "Name of the resource group where the network will be created in"
  type        = string
  default     = "firstmate"
}

variable "location" {
  description = "Name of the resource group where the network will be created in"
  type        = string
  default     = "West Europe"
}
variable "tags" {
  description = "The tags to associate with the resource group"
  type        = map(string)
  default     = {}
}
