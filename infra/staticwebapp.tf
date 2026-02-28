#########################################
# Azure Static Web Apps — Free tier
#########################################

resource "azurerm_static_web_app" "main" {
  name                = "${local.prefix}-stapp-01"
  resource_group_name = azurerm_resource_group.main.name
  location            = "westeurope"
  sku_tier            = "Free"
  sku_size            = "Free"

  tags = local.tags
}
