variable "location" {
  type        = string
  description = "Resource location for Azure resources."
}

variable "tags" {
  type        = map(string)
  description = "Environment tags."
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
