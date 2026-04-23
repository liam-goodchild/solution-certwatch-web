variable "location" {
  type        = string
  description = "Resource location for Azure resources."
  default     = "uksouth"
}

variable "location_short" {
  type        = string
  description = "Short Azure region token for resource naming."
  default     = "uks"
}

variable "environment" {
  type        = string
  description = "Name of Azure environment."
}

variable "workload" {
  type        = string
  description = "Workload short name for resource naming."
  default     = "certwatch"
}

variable "instance" {
  type        = string
  description = "Instance number for resource naming."
  default     = "01"
}

variable "entra_api_client_id" {
  type        = string
  description = "App registration client ID for the Functions API audience."
  sensitive   = true
}

variable "entra_client_secret" {
  type        = string
  description = "Entra app registration client secret for SWA authentication."
  sensitive   = true
}
