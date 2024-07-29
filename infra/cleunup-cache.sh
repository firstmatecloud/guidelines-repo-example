find ./infra/dev -name ".terragrunt-cache" -type d  -exec rm -rf {} +
find ./infra/dev -name ".terraform.lock.hcl" -delete
