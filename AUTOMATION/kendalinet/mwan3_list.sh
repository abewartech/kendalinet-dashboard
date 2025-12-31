#!/bin/sh
echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

interfaces="["
first=true

# Get interfaces from mwan3 config
IFACES=$(uci show mwan3 | grep "=interface" | cut -d. -f2)

for iface in $IFACES; do
  [ "$first" = true ] || interfaces="$interfaces,"
  first=false

  enabled=$(uci -q get mwan3.$iface.enabled || echo "0")
  metric=$(uci -q get mwan3.${iface}_m1.metric || echo "1")
  weight=$(uci -q get mwan3.${iface}_m1.weight || echo "1")
  
  # Check status from mwan3 status
  status="offline"
  mwan3 status | grep -q "interface $iface is online" && status="online"

  interfaces="$interfaces{
    \"id\":\"$iface\",
    \"name\":\"$iface\",
    \"iface\":\"$iface\",
    \"enabled\":$( [ "$enabled" = "1" ] && echo "true" || echo "false" ),
    \"status\":\"$status\",
    \"weight\":$weight,
    \"metric\":$metric
  }"
done

interfaces="$interfaces]"

echo "{\"interfaces\":$interfaces}"
