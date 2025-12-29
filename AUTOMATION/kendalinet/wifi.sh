#!/bin/sh

echo "Content-Type: application/json"
echo ""

# Read WiFi config from UCI
ssid=$(uci get wireless.default_radio0.ssid 2>/dev/null || echo "")
hidden=$(uci get wireless.default_radio0.hidden 2>/dev/null || echo "0")
key=$(uci get wireless.default_radio0.key 2>/dev/null || echo "")

if [ "$hidden" = "1" ]; then
    hidden_bool=true
else
    hidden_bool=false
fi

cat <<EOF
{
  "ssid": "$ssid",
  "hidden": $hidden_bool,
  "password": "$key"
}
EOF

