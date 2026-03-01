variable "location" {
  type        = string
  description = "Resource location for Azure resources."
}

variable "environment" {
  type        = string
  description = "Name of Azure environment."
}

variable "project" {
  type        = string
  description = "Project short name."
}

variable "solution" {
  type        = string
  description = "Solution short name (e.g. certwatch)."
}

variable "entra_tenant_id" {
  type        = string
  description = "Entra External ID tenant ID (GUID)."
  sensitive   = true
}

variable "entra_tenant_name" {
  type        = string
  description = "Entra External ID tenant name (subdomain, e.g. mytenantname)."
}

variable "entra_api_client_id" {
  type        = string
  description = "App registration client ID for the Functions API audience."
  sensitive   = true
}

variable "service" {
  description = "Service short name for resource naming."
  type        = string
}

variable "entra_client_secret" {
  type        = string
  description = "Entra app registration client secret for SWA authentication."
  sensitive   = true
}
