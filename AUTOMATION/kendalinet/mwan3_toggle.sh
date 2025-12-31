#!/bin/sh
echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

read -r body
ENABLE=$(echo "$body" | sed -n 's/.*"enabled":\([^,}]*\).*/\1/p')

if [ "$ENABLE" = "true" ]; then
  /etc/init.d/mwan3 start >/dev/null 2>&1
  /etc/init.d/mwan3 enable >/dev/null 2>&1
else
  /etc/init.d/mwan3 stop >/dev/null 2>&1
  /etc/init.d/mwan3 disable >/dev/null 2>&1
fi

echo '{"success":true}'
