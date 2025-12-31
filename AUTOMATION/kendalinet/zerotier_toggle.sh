#!/bin/sh
echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

read -r body
ENABLE=$(echo "$body" | sed -n 's/.*"enabled":\([^,}]*\).*/\1/p')

if [ "$ENABLE" = "true" ]; then
  /etc/init.d/zerotier start >/dev/null 2>&1
  # Give it a moment to start
  sleep 1
else
  /etc/init.d/zerotier stop >/dev/null 2>&1
fi

echo '{"success":true}'
