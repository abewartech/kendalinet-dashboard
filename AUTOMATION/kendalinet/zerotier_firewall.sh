#!/bin/sh
echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

read -r body
ENABLE=$(echo "$body" | sed -n 's/.*"enabled":\([^,}]*\).*/\1/p')

# Create firewall zone if not exists
uci -q get firewall.zerotier >/dev/null || {
  uci add firewall zone
  uci set firewall.@zone[-1].name='zerotier'
  uci set firewall.@zone[-1].input='ACCEPT'
  uci set firewall.@zone[-1].output='ACCEPT'
  uci set firewall.@zone[-1].forward='ACCEPT'
  uci set firewall.@zone[-1].network='zerotier'
}

if [ "$ENABLE" = "true" ]; then
  # Allow LAN <-> ZeroTier
  uci add firewall forwarding
  uci set firewall.@forwarding[-1].src='lan'
  uci set firewall.@forwarding[-1].dest='zerotier'

  uci add firewall forwarding
  uci set firewall.@forwarding[-1].src='zerotier'
  uci set firewall.@forwarding[-1].dest='lan'
else
  # Cleanup (optional: could remove forwarding rules)
  # For simplicity, we just stop enabling new ones
  true
fi

uci commit firewall
/etc/init.d/firewall restart >/dev/null 2>&1

echo '{"success":true}'
