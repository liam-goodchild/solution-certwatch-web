resource "azurerm_storage_account" "functions" {
  name                     = "${local.st_prefix}st01"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  allow_nested_items_to_be_public = false

  tags = local.tags
}

resource "azurerm_storage_container" "deployment" {
  name               = "app-package"
  storage_account_id = azurerm_storage_account.functions.id
}

resource "azurerm_service_plan" "functions" {
  name                = "${local.prefix}-asp-01"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  os_type             = "Linux"
  sku_name            = "FC1"

  tags = local.tags
}

resource "azurerm_function_app_flex_consumption" "main" {
  name                = "${local.prefix}-func-01"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  service_plan_id     = azurerm_service_plan.functions.id

  storage_container_type      = "blobContainer"
  storage_container_endpoint  = "${azurerm_storage_account.functions.primary_blob_endpoint}${azurerm_storage_container.deployment.name}"
  storage_authentication_type = "SystemAssignedIdentity"

  runtime_name    = "node"
  runtime_version = "20"

  site_config {}

  app_settings = {
    # Entra ID — supports both main tenant and CIAM
    ENTRA_TENANT_ID = var.entra_tenant_id
    ENTRA_JWKS_URI  = var.entra_tenant_name != "" ? "https://${var.entra_tenant_name}.ciamlogin.com/${var.entra_tenant_id}/v2.0/.well-known/openid-configuration" : "https://login.microsoftonline.com/${var.entra_tenant_id}/v2.0/.well-known/openid-configuration"
    ENTRA_AUDIENCE  = var.entra_api_client_id

    # Cosmos DB — endpoint only; auth via Managed Identity
    COSMOS_ENDPOINT = azurerm_cosmosdb_account.main.endpoint
    COSMOS_DATABASE = azurerm_cosmosdb_sql_database.certwatch.name

    # Azure Communication Services — endpoint only; auth via Managed Identity
    ACS_ENDPOINT     = "https://${azurerm_communication_service.main.name}.communication.azure.com"
    ACS_SENDER_EMAIL = "noreply@${azurerm_email_communication_service_domain.main.mail_from_sender_domain}"

    # Key Vault URI for vendor secrets
    KEY_VAULT_URI = azurerm_key_vault.main.vault_uri
  }

  identity {
    type = "SystemAssigned"
  }

  tags = local.tags
}

# Grant Function App identity blob data access to its backing storage account
resource "azurerm_role_assignment" "function_storage_blob" {
  scope                = azurerm_storage_account.functions.id
  role_definition_name = "Storage Blob Data Owner"
  principal_id         = azurerm_function_app_flex_consumption.main.identity[0].principal_id
}
