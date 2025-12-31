#!/bin/sh
echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

networks="["
first=true

# zerotier-cli listnetworks format:
# <nwid> <name> <dev> <status> <type> <dev> <ZT addr>
# Using tail -n +2 to skip header
zerotier-cli -j listnetworks > /tmp/zt_networks.json 2>/dev/null

if [ $? -eq 0 ]; then
    # If the version supports -j (json), use it!
    cat /tmp/zt_networks.json
    rm /tmp/zt_networks.json
else
    # Fallback to manual parsing
    zerotier-cli listnetworks | tail -n +2 | while read -r id name dev status type dev2 ip rest; do
      [ -z "$id" ] && continue
      [ "$first" = true ] || networks="$networks,"
      first=false

      state="pending"
      [ "$status" = "OK" ] && state="connected"

      networks="$networks{
        \"id\":\"$id\",
        \"networkId\":\"$id\",
        \"name\":\"$name\",
        \"status\":\"$state\",
        \"assignedIp\":\"$ip\",
        \"dev\":\"$dev\"
      }"
    done
    networks="$networks]"
    echo "{\"networks\":$networks}"
fi
