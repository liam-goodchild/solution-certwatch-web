resource "azurerm_static_web_app" "main" {
  name                = "stapp-${local.resource_suffix}"
  resource_group_name = azurerm_resource_group.main.name
  location            = "westeurope"
  sku_tier            = "Free"
  sku_size            = "Free"

  app_settings = {
    ENTRA_CLIENT_ID     = var.entra_api_client_id
    ENTRA_CLIENT_SECRET = var.entra_client_secret
    COSMOS_ENDPOINT     = azurerm_cosmosdb_account.main.endpoint
    COSMOS_KEY          = azurerm_cosmosdb_account.main.primary_key
    COSMOS_DATABASE     = azurerm_cosmosdb_sql_database.certwatch.name

    ACS_CONNECTION_STRING = azurerm_communication_service.main.primary_connection_string
    ACS_SENDER_EMAIL      = "DoNotReply@${azurerm_email_communication_service_domain.main.mail_from_sender_domain}"
  }

  tags = local.tags
}

resource "time_sleep" "dns_propagation" {
  create_duration = "60s"

  depends_on = [cloudflare_dns_record.swa_certwatch]
}

resource "azurerm_static_web_app_custom_domain" "certwatch" {
  static_web_app_id = azurerm_static_web_app.main.id
  domain_name       = "certwatch.skyhaven.ltd"
  validation_type   = "cname-delegation"

  depends_on = [time_sleep.dns_propagation]
}
