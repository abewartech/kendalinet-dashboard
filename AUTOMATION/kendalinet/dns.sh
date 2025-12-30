#!/bin/sh

echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

# Get current DNS settings from UCI
dns_list=$(uci get network.wan.dns 2>/dev/null)

if [ -z "$dns_list" ]; then
    # If not set in wan, check if set in dhcp (common for all)
    dns_list=$(uci get dhcp.@dnsmasq[0].server 2>/dev/null)
fi

# Detect provider
provider="custom"
if echo "$dns_list" | grep -q "1.1.1.1"; then
    provider="cloudflare"
elif echo "$dns_list" | grep -q "8.8.8.8"; then
    provider="google"
elif echo "$dns_list" | grep -q "94.140.14.14"; then
    provider="adguard"
elif echo "$dns_list" | grep -q "9.9.9.9"; then
    provider="quad9"
fi

# Output JSON
cat <<EOF
{
  "provider": "$provider",
  "dns": "$dns_list",
  "current_dns": "$dns_list"
}
EOF
