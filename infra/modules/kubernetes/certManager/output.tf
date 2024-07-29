output "cluster_issuers" {
  value = {
    for key, dns_zone in var.dns_zones : key => "cluster-issuer-${replace(key, ".", "-")}"
  }
}
