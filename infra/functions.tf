resource "azurerm_storage_account" "functions" {
  name                     = "st${local.resource_suffix_flat}"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  allow_nested_items_to_be_public = false
  public_network_access_enabled   = false #checkov:skip=CKV_AZURE_59
  min_tls_version                 = "TLS1_2"
  shared_access_key_enabled       = true #checkov:skip=CKV2_AZURE_40 - Azure Functions require shared key access to storage

  blob_properties {
    delete_retention_policy {
      days = 7
    }
  }

  tags = local.tags
}

resource "azurerm_storage_container" "deployment" {
  name               = "app-package"
  storage_account_id = azurerm_storage_account.functions.id
}

resource "azurerm_service_plan" "functions" {
  name                = "asp-${local.resource_suffix}"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  os_type             = "Linux"
  sku_name            = "FC1"

  tags = local.tags
}

resource "azurerm_function_app_flex_consumption" "main" {
  name                = "func-${local.resource_suffix}"
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
    COSMOS_ENDPOINT = azurerm_cosmosdb_account.main.endpoint
    COSMOS_DATABASE = azurerm_cosmosdb_sql_database.certwatch.name
    ACS_ENDPOINT    = "https://${azurerm_communication_service.main.name}.communication.azure.com"

    ACS_SENDER_EMAIL = "DoNotReply@${azurerm_email_communication_service_domain.main.mail_from_sender_domain}"
  }

  identity {
    type = "SystemAssigned"
  }

  tags = local.tags
}
