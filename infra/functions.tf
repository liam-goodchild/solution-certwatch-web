#########################################
# Azure Functions — Consumption Plan
#########################################

# Random suffix ensures globally unique storage account name
resource "random_string" "st_suffix" {
  length  = 4
  upper   = false
  special = false
}

resource "azurerm_storage_account" "functions" {
  name                     = "${local.st_prefix}fnst01${random_string.st_suffix.result}"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  # Minimal settings for Functions backing storage — no public blob access needed
  allow_nested_items_to_be_public = false

  tags = local.tags
}

resource "azurerm_service_plan" "functions" {
  name                = "${local.prefix}-asp-01"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  os_type             = "Linux"
  sku_name            = "Y1"

  tags = local.tags
}

resource "azurerm_linux_function_app" "main" {
  name                       = "${local.prefix}-func-01"
  resource_group_name        = azurerm_resource_group.main.name
  location                   = var.location
  storage_account_name       = azurerm_storage_account.functions.name
  storage_account_access_key = azurerm_storage_account.functions.primary_access_key
  service_plan_id            = azurerm_service_plan.functions.id

  site_config {
    application_stack {
      node_version = "20"
    }

    cors {
      allowed_origins     = ["https://${azurerm_static_web_app.main.default_host_name}"]
      support_credentials = true
    }
  }

  app_settings = {
    # Entra ID — supports both main tenant and CIAM
    ENTRA_TENANT_ID  = var.entra_tenant_id
    ENTRA_JWKS_URI   = var.entra_tenant_name != "" ? "https://${var.entra_tenant_name}.ciamlogin.com/${var.entra_tenant_id}/v2.0/.well-known/openid-configuration" : "https://login.microsoftonline.com/${var.entra_tenant_id}/v2.0/.well-known/openid-configuration"
    ENTRA_AUDIENCE   = var.entra_api_client_id

    # Cosmos DB — endpoint only; auth via Managed Identity
    COSMOS_ENDPOINT  = azurerm_cosmosdb_account.main.endpoint
    COSMOS_DATABASE  = azurerm_cosmosdb_sql_database.certwatch.name

    # Azure Communication Services — endpoint only; auth via Managed Identity
    ACS_ENDPOINT     = "https://${azurerm_communication_service.main.name}.communication.azure.com"
    ACS_SENDER_EMAIL = "noreply@${azurerm_email_communication_service_domain.main.mail_from_sender_domain}"

    # Key Vault URI for vendor secrets
    KEY_VAULT_URI = azurerm_key_vault.main.vault_uri

    # Disable Application Insights sampling at low volume
    APPINSIGHTS_SAMPLING_PERCENTAGE = "100"
  }

  identity {
    type = "SystemAssigned"
  }

  tags = local.tags
}
