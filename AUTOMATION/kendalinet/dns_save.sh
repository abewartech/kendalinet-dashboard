#!/bin/sh

echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo "Access-Control-Allow-Methods: POST, OPTIONS"
echo "Access-Control-Allow-Headers: Content-Type"

if [ "$REQUEST_METHOD" = "OPTIONS" ]; then
    echo ""
    exit 0
fi

echo ""

# Read JSON from POST body
read -r post_data

# Parse JSON
if command -v jq >/dev/null 2>&1; then
    provider=$(echo "$post_data" | jq -r '.provider // empty')
    dns1=$(echo "$post_data" | jq -r '.dns1 // empty')
    dns2=$(echo "$post_data" | jq -r '.dns2 // empty')
else
    provider=$(echo "$post_data" | grep -o '"provider":"[^"]*' | cut -d'"' -f4)
    dns1=$(echo "$post_data" | grep -o '"dns1":"[^"]*' | cut -d'"' -f4)
    dns2=$(echo "$post_data" | grep -o '"dns2":"[^"]*' | cut -d'"' -f4)
fi

# Set DNS servers based on provider
case "$provider" in
    "cloudflare")
        dns_servers="1.1.1.1 1.0.0.1"
        ;;
    "google")
        dns_servers="8.8.8.8 8.8.4.4"
        ;;
    "adguard")
        dns_servers="94.140.14.14 94.140.15.15"
        ;;
    "quad9")
        dns_servers="9.9.9.9 149.112.112.112"
        ;;
    "custom")
        dns_servers="$dns1 $dns2"
        ;;
    *)
        echo '{"success": false, "error": "Invalid provider"}'
        exit 0
        ;;
esac

# Update UCI
uci del network.wan.dns 2>/dev/null
for dns in $dns_servers; do
    uci add_list network.wan.dns="$dns"
done

# Apply changes
if uci commit network; then
    /etc/init.d/network restart >/dev/null 2>&1
    echo "{\"success\": true, \"message\": \"DNS updated to $provider\", \"dns\": \"$dns_servers\"}"
else
    echo '{"success": false, "error": "Failed to save DNS settings"}'
fi
