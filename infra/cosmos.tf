#########################################
# Cosmos DB — Serverless (NoSQL API)
#########################################

resource "azurerm_cosmosdb_account" "main" {
  name                = "${local.prefix}-cosmos-01"
  location            = var.location
  resource_group_name = azurerm_resource_group.main.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  capacity {
    total_throughput_limit = 4000
  }

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = var.location
    failover_priority = 0
  }

  capabilities {
    name = "EnableServerless"
  }

  tags = local.tags
}

resource "azurerm_cosmosdb_sql_database" "certwatch" {
  name                = "certwatch"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
}

resource "azurerm_cosmosdb_sql_container" "users" {
  name                = "users"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  database_name       = azurerm_cosmosdb_sql_database.certwatch.name
  partition_key_paths = ["/userId"]

  indexing_policy {
    indexing_mode = "consistent"

    included_path {
      path = "/*"
    }
  }
}

resource "azurerm_cosmosdb_sql_container" "certifications" {
  name                = "certifications"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  database_name       = azurerm_cosmosdb_sql_database.certwatch.name
  partition_key_paths = ["/userId"]

  # Enable TTL at container level (individual items opt-in via _ttl property)
  default_ttl = -1

  indexing_policy {
    indexing_mode = "consistent"

    included_path {
      path = "/*"
    }

    # Composite index for reminder engine cross-partition query
    composite_index {
      index {
        path  = "/expirationDate"
        order = "Ascending"
      }
      index {
        path  = "/userId"
        order = "Ascending"
      }
    }
  }
}

resource "azurerm_cosmosdb_sql_container" "reminder_logs" {
  name                = "reminderLogs"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  database_name       = azurerm_cosmosdb_sql_database.certwatch.name
  partition_key_paths = ["/userId"]

  # Auto-expire reminder log entries after 90 days
  default_ttl = 7776000

  indexing_policy {
    indexing_mode = "consistent"

    included_path {
      path = "/*"
    }
  }
}

# RBAC: grant Function App identity data contributor access to Cosmos DB
resource "azurerm_cosmosdb_sql_role_assignment" "function_app" {
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  role_definition_id  = "${azurerm_cosmosdb_account.main.id}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
  principal_id        = azurerm_linux_function_app.main.identity[0].principal_id
  scope               = azurerm_cosmosdb_account.main.id
}
