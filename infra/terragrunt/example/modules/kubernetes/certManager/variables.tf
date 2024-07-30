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

variable "cert_manager_name" {
  default = "cert-manager"
}

variable "namespace" {
  default = "cert-manager"
}

variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "production_mode" {
  type    = bool
  default = false
}

variable "cert_manager_version" {
  default = "v1.14.5"
}

variable "dns_zones" {
  type = map(object({
    dns_zone_id         = string
    resource_group_name = string
    production_mode     = bool
    wildcard_dns_name   = string
    subscription_id     = string
  }))
  description = "List of DNS zones to be managed by Cert-Manager. The key should correspond to the DNS Zone name e.g.: 'example.com'"
}


variable "dns_name" {
  description = "a wildcard certificate will be created for this domain name."
  type        = string
  default     = null
}

variable "cluster_issuer_name" {
  description = "The custom cluster issuer name"
  type        = string
  default     = "firstmate"
}

variable "cluster_issuer_email" {
  description = "The email address for the cluster issuer"
  type        = string
  default     = "info@firstmate.cloud"
}
variable "tags" {
  description = "The tags to associate with the resource group"
  type        = map(string)
  default     = {}
}
