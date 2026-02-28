#########################################
# Resource Group
#########################################

resource "azurerm_resource_group" "main" {
  name     = "${local.prefix}-rg-01"
  location = var.location
  tags     = local.tags
}
