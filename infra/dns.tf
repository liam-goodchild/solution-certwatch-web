resource "cloudflare_dns_record" "swa_certwatch" {
  zone_id = data.cloudflare_zone.skyhaven_ltd.id
  name    = "certwatch"
  type    = "CNAME"
  content = azurerm_static_web_app.main.default_host_name
  ttl     = 300
  proxied = false
}
