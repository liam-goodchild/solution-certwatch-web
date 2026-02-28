resource "azurerm_key_vault" "main" {
  name                = "${local.prefix}-kv-01"
  location            = var.location
  resource_group_name = azurerm_resource_group.main.name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"

  rbac_authorization_enabled = true
  soft_delete_retention_days = 7
  purge_protection_enabled   = false

  tags = local.tags
}

resource "azurerm_role_assignment" "function_kv_secrets_user" {
  scope                = azurerm_key_vault.main.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_function_app_flex_consumption.main.identity[0].principal_id
}

resource "azurerm_key_vault_secret" "microsoft_cert_api_key" {
  name         = "microsoft-cert-api-key"
  value        = "REPLACE_ME"
  key_vault_id = azurerm_key_vault.main.id

  depends_on = [azurerm_role_assignment.function_kv_secrets_user]
}

resource "azurerm_key_vault_secret" "aws_cert_api_key" {
  name         = "aws-cert-api-key"
  value        = "REPLACE_ME"
  key_vault_id = azurerm_key_vault.main.id

  depends_on = [azurerm_role_assignment.function_kv_secrets_user]
}

resource "azurerm_key_vault_secret" "comptia_cert_api_key" {
  name         = "comptia-cert-api-key"
  value        = "REPLACE_ME"
  key_vault_id = azurerm_key_vault.main.id

  depends_on = [azurerm_role_assignment.function_kv_secrets_user]
}
