#!/bin/sh
echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

INFO="$(zerotier-cli info 2>/dev/null)"
ONLINE=false

echo "$INFO" | grep -q "ONLINE" && ONLINE=true

NODE_ID="$(echo "$INFO" | awk '{print $3}')"

cat <<EOF
{
  "enabled": $ONLINE,
  "nodeId": "$NODE_ID"
}
EOF
