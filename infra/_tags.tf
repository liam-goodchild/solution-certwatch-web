locals {
  tags = merge(
    {
      # Required
      Environment  = var.environment == "prd" ? "Prod" : title(var.environment)
      Criticality  = "Low"
      BusinessUnit = "Personal"
      Owner        = "admin@skyhaven.dev"
      CostCenter   = "Personal"
      Application  = "CertWatch"
      OpsTeam      = "Personal"

      # Optional
      Repository = "solution-certwatch-core"
      Project    = "Sky Haven"
    },
  )
}
