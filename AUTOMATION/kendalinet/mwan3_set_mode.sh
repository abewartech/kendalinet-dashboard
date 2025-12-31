#!/bin/sh
echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

read -r body
MODE=$(echo "$body" | sed -n 's/.*"mode":"\([^"]*\)".*/\1/p')

# This is a simplified version. A real one would need to know which members to use.
# We'll assume members are named <iface>_m1

# Get all interfaces enabled in mwan3
MEMBERS=$(uci show mwan3 | grep "=member" | cut -d. -f2)
USE_MEMBERS=""

for m in $MEMBERS; do
    USE_MEMBERS="$USE_MEMBERS $m"
done

# Remove existing default policies if they exist or just overwrite
uci -q delete mwan3.balanced
uci -q delete mwan3.failover

if [ "$MODE" = "failover" ]; then
  uci set mwan3.failover=policy
  uci set mwan3.failover.use_member="$USE_MEMBERS"
  uci set mwan3.failover.last_resort='unreachable'
  # Note: logic for failover vs balanced depends on metrics/weights of members
else
  uci set mwan3.balanced=policy
  uci set mwan3.balanced.use_member="$USE_MEMBERS"
  uci set mwan3.balanced.last_resort='unreachable'
fi

# Set default rule to use this policy
uci set mwan3.default_rule.use_policy="$MODE"

uci commit mwan3
/etc/init.d/mwan3 restart >/dev/null 2>&1

echo "{\"success\":true,\"mode\":\"$MODE\"}"
