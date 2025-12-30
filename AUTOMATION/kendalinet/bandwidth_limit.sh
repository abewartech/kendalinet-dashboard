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
    mac=$(echo "$post_data" | jq -r '.mac // empty')
    rate=$(echo "$post_data" | jq -r '.rate // empty')
else
    mac=$(echo "$post_data" | grep -o '"mac":"[^"]*' | cut -d'"' -f4)
    rate=$(echo "$post_data" | grep -o '"rate":"[^"]*' | cut -d'"' -f4)
fi

if [ -z "$mac" ] || [ -z "$rate" ]; then
    echo '{"success": false, "error": "Missing MAC or rate"}'
    exit 0
fi

# Implementation logic (example using uci for a hypothetical 'qos' config)
# In real OpenWrt, this depends on what QOS package is installed.
# We'll use a generic approach of saving to a config file.

mkdir -p /etc/kendalinet
config_file="/etc/kendalinet/bandwidth_limits.conf"

# Remove existing limit for this MAC if any
grep -v "^$mac" "$config_file" > "${config_file}.tmp" 2>/dev/null
echo "$mac,$rate" >> "${config_file}.tmp"
mv "${config_file}.tmp" "$config_file"

# Apply logic here (e.g., call tc or restart sqm)
# /etc/init.d/sqm restart >/dev/null 2>&2

echo "{\"success\": true, \"message\": \"Bandwidth limit for $mac set to $rate Mbps\"}"
