locals {
  locations = {
    uksouth = "uks"
  }
  location = local.locations[var.location]
  environment_short = {
    dev = "D"
    prd = "P"
  }
  prefix       = "${var.project}-${var.solution}-${var.environment}-${local.location}"
  prefix_short = "${var.project}${var.solution}${local.environment_short[var.environment]}${local.location}"

  # Storage account names: alphanumeric only, max 24 chars, lowercase
  # Uses abbreviated solution name to stay within limits
  solution_abbr = "cw"
  st_prefix     = lower("${var.project}${local.solution_abbr}${local.environment_short[var.environment]}${local.location}")

  # tflint-ignore: terraform_unused_declarations
  st_naming = {
    long  = replace("${local.prefix}-%sst-01", "-", "")
    short = lower("${local.st_prefix}%sst01")
  }
}
