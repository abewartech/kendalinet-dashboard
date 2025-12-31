#!/bin/sh
echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

read -r body
NETWORK_ID=$(echo "$body" | sed -n 's/.*"networkId":"\([^"]*\)".*/\1/p')
ENABLE=$(echo "$body" | sed -n 's/.*"enabled":\([^,}]*\).*/\1/p')

[ -z "$NETWORK_ID" ] && echo '{"success":false,"error":"Missing networkId"}' && exit 0

ZT_IF="zt$NETWORK_ID"

# Wait until interface exists
for i in 1 2 3 4 5; do
  ip link show "$ZT_IF" >/dev/null 2>&1 && break
  sleep 1
done

if [ "$ENABLE" = "true" ]; then
  brctl addif br-lan "$ZT_IF" 2>/dev/null || true
else
  brctl delif br-lan "$ZT_IF" 2>/dev/null || true
fi

echo '{"success":true}'
