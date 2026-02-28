#########################################
# Azure Communication Services — Email
#########################################

resource "azurerm_communication_service" "main" {
  name                = "${local.prefix}-acs-01"
  resource_group_name = azurerm_resource_group.main.name
  data_location       = "United Kingdom"

  tags = local.tags
}

resource "azurerm_email_communication_service" "main" {
  name                = "${local.prefix}-acs-email-01"
  resource_group_name = azurerm_resource_group.main.name
  data_location       = "United Kingdom"

  tags = local.tags
}

# Azure-managed domain (free, no DNS configuration required)
resource "azurerm_email_communication_service_domain" "main" {
  name              = "AzureManagedDomain"
  email_service_id  = azurerm_email_communication_service.main.id
  domain_management = "AzureManaged"
}

# Link the email domain to the communication service
resource "azurerm_communication_service_email_domain_association" "main" {
  communication_service_id = azurerm_communication_service.main.id
  email_service_domain_id  = azurerm_email_communication_service_domain.main.id
}

# Grant Function App identity contributor access to ACS
resource "azurerm_role_assignment" "function_acs_contributor" {
  scope                = azurerm_communication_service.main.id
  role_definition_name = "Contributor"
  principal_id         = azurerm_linux_function_app.main.identity[0].principal_id
}
