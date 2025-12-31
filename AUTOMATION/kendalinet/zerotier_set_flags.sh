#!/bin/sh
echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

read -r body

NETWORK_ID=$(echo "$body" | sed -n 's/.*"networkId":"\([^"]*\)".*/\1/p')
ALLOW_DEFAULT=$(echo "$body" | sed -n 's/.*"allowDefault":\([^,}]*\).*/\1/p')
ALLOW_GLOBAL=$(echo "$body" | sed -n 's/.*"allowGlobal":\([^,}]*\).*/\1/p')
ALLOW_MANAGED=$(echo "$body" | sed -n 's/.*"allowManaged":\([^,}]*\).*/\1/p')

CONF="/etc/zerotier/networks.d/$NETWORK_ID.conf"

[ -z "$NETWORK_ID" ] && echo '{"success":false,"error":"Missing networkId"}' && exit 0

mkdir -p /etc/zerotier/networks.d
touch "$CONF"

set_flag () {
  key="$1"
  val="$2"
  grep -q "^$key=" "$CONF" && \
    sed -i "s/^$key=.*/$key=$val/" "$CONF" || \
    echo "$key=$val" >> "$CONF"
}

[ "$ALLOW_DEFAULT" = "true" ] && set_flag allowDefault 1 || set_flag allowDefault 0
[ "$ALLOW_GLOBAL" = "true" ] && set_flag allowGlobal 1 || set_flag allowGlobal 0
[ "$ALLOW_MANAGED" = "true" ] && set_flag allowManaged 1 || set_flag allowManaged 0

# Restart ZeroTier to apply
/etc/init.d/zerotier restart >/dev/null 2>&1

echo '{"success":true}'
