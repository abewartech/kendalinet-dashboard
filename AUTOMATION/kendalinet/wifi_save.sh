#!/bin/sh

echo "Content-Type: application/json"
echo ""

# Read JSON from POST body
read -r post_data

# Parse JSON (simple parsing, for production use jq if available)
ssid=$(echo "$post_data" | grep -o '"ssid":"[^"]*' | cut -d'"' -f4)
hidden=$(echo "$post_data" | grep -o '"hidden":[^,}]*' | grep -o '[tf][ru][ue]*')
password=$(echo "$post_data" | grep -o '"password":"[^"]*' | cut -d'"' -f4)

if [ -z "$ssid" ]; then
    echo '{"success": false, "error": "Missing SSID"}'
    exit 0
fi

# Update UCI config
uci set wireless.default_radio0.ssid="$ssid"

if [ "$hidden" = "true" ]; then
    uci set wireless.default_radio0.hidden="1"
else
    uci set wireless.default_radio0.hidden="0"
fi

if [ -n "$password" ]; then
    uci set wireless.default_radio0.key="$password"
fi

uci commit wireless
wifi reload >/dev/null 2>&1

echo '{"success": true}'

