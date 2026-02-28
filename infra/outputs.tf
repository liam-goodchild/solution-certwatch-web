#########################################
# Outputs
#########################################

output "static_web_app_url" {
  description = "Default hostname of the Static Web App."
  value       = "https://${azurerm_static_web_app.main.default_host_name}"
}

output "function_app_url" {
  description = "Default hostname of the Function App."
  value       = "https://${azurerm_linux_function_app.main.default_hostname}"
}

output "cosmos_db_endpoint" {
  description = "Cosmos DB account endpoint."
  value       = azurerm_cosmosdb_account.main.endpoint
}

output "key_vault_uri" {
  description = "Key Vault URI."
  value       = azurerm_key_vault.main.vault_uri
}

output "acs_endpoint" {
  description = "Azure Communication Services endpoint."
  value       = "https://${azurerm_communication_service.main.name}.communication.azure.com"
}

output "acs_sender_email" {
  description = "Email address used as the sender for reminder emails."
  value       = "noreply@${azurerm_email_communication_service_domain.main.mail_from_sender_domain}"
}
