terraform {
  required_providers {
    openwrt = {
      source  = "foxboron/openwrt"
      version = ">= 0.2.0"
    }
  }
}

provider "openwrt" {
  # Example configuration for your router
  host     = "192.168.1.1"
  username = "root"
  password = "your_password"
  # adjust to match your OpenWrt router’s API credentials
}

# Example resource (if supported by the provider)
# resource "openwrt_file" "set_hostname" {
#   path    = "/etc/config/system"
#   content = file("system.conf")
# }
