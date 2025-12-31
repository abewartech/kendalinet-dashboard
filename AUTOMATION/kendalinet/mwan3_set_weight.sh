#!/bin/sh
echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

read -r body
IFACE=$(echo "$body" | sed -n 's/.*"iface":"\([^"]*\)".*/\1/p')
WEIGHT=$(echo "$body" | sed -n 's/.*"weight":\([^,}]*\).*/\1/p')

[ -z "$IFACE" ] && echo '{"success":false,"error":"Missing interface"}' && exit 0

MEMBER_NAME="${IFACE}_m1"
uci set mwan3.$MEMBER_NAME.weight="$WEIGHT"
uci commit mwan3
/etc/init.d/mwan3 restart >/dev/null 2>&1

echo '{"success":true}'
