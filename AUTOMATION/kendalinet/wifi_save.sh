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

# Function to find the first WiFi interface
find_wifi_interface() {
    # Try common interface names
    for iface in default_radio0 wlan0 radio0 @wifi-iface[0]; do
        if uci get wireless.$iface.ssid 2>/dev/null; then
            echo "$iface"
            return 0
        fi
    done
    
    # If not found, try to get first wifi-iface section
    uci show wireless | grep -m1 "wifi-iface\[" | cut -d'.' -f2 | cut -d'=' -f1
}

# Read JSON from POST body
read -r post_data

# Log for debugging (optional, comment out in production)
# echo "$post_data" >> /tmp/wifi_save.log

# Parse JSON - try jq first, fallback to grep
if command -v jq >/dev/null 2>&1; then
    ssid=$(echo "$post_data" | jq -r '.ssid // empty')
    hidden=$(echo "$post_data" | jq -r '.hidden // false')
    password=$(echo "$post_data" | jq -r '.password // empty')
else
    # Fallback to grep/cut parsing
    ssid=$(echo "$post_data" | grep -o '"ssid":"[^"]*' | cut -d'"' -f4)
    hidden=$(echo "$post_data" | grep -o '"hidden":[^,}]*' | grep -o '[tf][ru][ue]*')
    password=$(echo "$post_data" | grep -o '"password":"[^"]*' | cut -d'"' -f4)
fi

# Validate SSID
if [ -z "$ssid" ]; then
    echo '{"success": false, "error": "Missing SSID"}'
    exit 0
fi

# Find WiFi interface
WIFI_IFACE=$(find_wifi_interface)

if [ -z "$WIFI_IFACE" ]; then
    echo '{"success": false, "error": "WiFi interface not found"}'
    exit 0
fi

# Update UCI config
if ! uci set wireless.$WIFI_IFACE.ssid="$ssid" 2>/dev/null; then
    echo '{"success": false, "error": "Failed to set SSID"}'
    exit 0
fi

# Set hidden status
if [ "$hidden" = "true" ]; then
    uci set wireless.$WIFI_IFACE.hidden="1"
else
    uci set wireless.$WIFI_IFACE.hidden="0"
fi

# Set password if provided
if [ -n "$password" ]; then
    uci set wireless.$WIFI_IFACE.key="$password"
    # Ensure encryption is enabled
    uci set wireless.$WIFI_IFACE.encryption="psk2"
fi

# Commit changes
if ! uci commit wireless 2>/dev/null; then
    echo '{"success": false, "error": "Failed to commit changes"}'
    exit 0
fi

# Reload WiFi
if wifi reload >/dev/null 2>&1; then
    echo "{\"success\": true, \"message\": \"WiFi settings updated\", \"interface\": \"$WIFI_IFACE\"}"
else
    echo '{"success": false, "error": "Failed to reload WiFi, but settings were saved"}'
fi
