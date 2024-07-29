variable "kubernetes_configuration" {
  type = object({
    host                   = string
    client_key             = string
    client_certificate     = string
    cluster_ca_certificate = string
    kube_config_raw        = string
    principal_id            = string
  })
}

variable "name" {
  default = "ingress-public"
}

variable "namespace" {
  type = string
  default = "ingress-public"
}

variable "resource_group_name" {
  type = string
}
variable "lb_resource_group_name" {
  type = string
}

variable "ip_resource_group_id" {
  type = string
}
variable "ip_resource_group_name" {
  type = string
}
variable "static_ip" {
  type = string
}
variable "static_ip_name" {
  type = string
}


variable "location" {
  type = string
}

variable "production_mode" {
  type    = bool
  default = false
}

variable "ingress_version" {
  default = "4.10.1"
}


variable "tags" {
  description = "The tags to associate with the resource group"
  type        = map(string)
  default     = {}
}
