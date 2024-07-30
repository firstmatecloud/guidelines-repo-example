variable "kubernetes_configuration" {
  type = object({
    host                   = string
    client_key             = string
    client_certificate     = string
    cluster_ca_certificate = string
    kube_config_raw        = string
    oidc_issuer_url        = string
  })
}


variable "name" {
  type = string
}

variable "namespace" {
  type = string
}

variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "resourceId" {
  type = string
}
variable "role" {
  type = string
}

variable "tags" {
  description = "The tags to associate with the resource group"
  type        = map(string)
  default     = {}
}
