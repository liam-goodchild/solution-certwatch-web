resource "azurerm_resource_group" "main" {
  name     = "${local.prefix}-rg-01"
  location = var.location
  tags     = local.tags
}

resource "azurerm_static_web_app" "main" {
  name                = "${local.prefix}-stapp-01"
  resource_group_name = azurerm_resource_group.main.name
  location            = "westeurope"
  sku_tier            = "Free"
  sku_size            = "Free"

  app_settings = {
    # Entra External ID (CIAM) — SWA auth integration
    ENTRA_CLIENT_ID     = var.entra_api_client_id
    ENTRA_CLIENT_SECRET = var.entra_client_secret

    # Cosmos DB — key-based auth for managed functions
    COSMOS_ENDPOINT = azurerm_cosmosdb_account.main.endpoint
    COSMOS_KEY      = azurerm_cosmosdb_account.main.primary_key
    COSMOS_DATABASE = azurerm_cosmosdb_sql_database.certwatch.name

    # Azure Communication Services — connection string for managed functions
    ACS_CONNECTION_STRING = azurerm_communication_service.main.primary_connection_string
    ACS_SENDER_EMAIL      = "DoNotReply@${azurerm_email_communication_service_domain.main.mail_from_sender_domain}"
  }

  tags = local.tags
}
