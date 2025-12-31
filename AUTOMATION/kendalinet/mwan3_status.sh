#!/bin/sh
echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

STATUS="$(mwan3 status 2>/dev/null)"

online=$(echo "$STATUS" | grep -c "is online")
offline=$(echo "$STATUS" | grep -c "is offline")

# Get service status
ENABLED="false"
/etc/init.d/mwan3 status >/dev/null 2>&1 && ENABLED="true"

echo "{
  \"enabled\": $ENABLED,
  \"online\": $online,
  \"offline\": $offline
}"
