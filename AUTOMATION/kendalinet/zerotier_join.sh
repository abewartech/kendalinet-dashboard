#!/bin/sh
echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

read -r body
NETWORK_ID=$(echo "$body" | sed -n 's/.*"networkId":"\([^"]*\)".*/\1/p')

[ -z "$NETWORK_ID" ] && echo '{"success":false,"error":"Missing networkId"}' && exit 0

zerotier-cli join "$NETWORK_ID" >/dev/null 2>&1

echo '{"success":true,"status":"pending"}'
