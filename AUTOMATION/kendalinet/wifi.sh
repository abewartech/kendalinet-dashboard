#!/bin/sh

echo "Content-Type: application/json"
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

# Find WiFi interface
WIFI_IFACE=$(find_wifi_interface)

if [ -z "$WIFI_IFACE" ]; then
    cat <<EOF
{
  "error": "WiFi interface not found",
  "ssid": "",
  "hidden": false,
  "password": ""
}
EOF
    exit 0
fi

# Read WiFi config from UCI
ssid=$(uci get wireless.$WIFI_IFACE.ssid 2>/dev/null || echo "")
hidden=$(uci get wireless.$WIFI_IFACE.hidden 2>/dev/null || echo "0")
key=$(uci get wireless.$WIFI_IFACE.key 2>/dev/null || echo "")

# Handle empty SSID
if [ -z "$ssid" ]; then
    ssid="No SSID configured"
fi

# Convert hidden to boolean
if [ "$hidden" = "1" ]; then
    hidden_bool=true
else
    hidden_bool=false
fi

# Output JSON
cat <<EOF
{
  "ssid": "$ssid",
  "hidden": $hidden_bool,
  "password": "$key",
  "interface": "$WIFI_IFACE"
}
EOF
