resource "azurerm_communication_service" "main" {
  name                = "acs-${local.resource_suffix}"
  resource_group_name = azurerm_resource_group.main.name
  data_location       = "UK"

  tags = local.tags
}

resource "azurerm_email_communication_service" "main" {
  name                = "acs-email-${local.resource_suffix}"
  resource_group_name = azurerm_resource_group.main.name
  data_location       = "UK"

  tags = local.tags
}

resource "azurerm_email_communication_service_domain" "main" {
  name              = "AzureManagedDomain"
  email_service_id  = azurerm_email_communication_service.main.id
  domain_management = "AzureManaged"
}

resource "azurerm_communication_service_email_domain_association" "main" {
  communication_service_id = azurerm_communication_service.main.id
  email_service_domain_id  = azurerm_email_communication_service_domain.main.id
}

resource "azurerm_role_assignment" "function_acs_contributor" {
  scope                = azurerm_communication_service.main.id
  role_definition_name = "Contributor"
  principal_id         = azurerm_function_app_flex_consumption.main.identity[0].principal_id
}
