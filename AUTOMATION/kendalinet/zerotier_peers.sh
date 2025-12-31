#!/bin/sh
echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

peers="["
first=true

# zerotier-cli peers format:
# <ztaddr> <ver> <role> <lat> <link> <lastTX> <lastRX> <path>
zerotier-cli peers | tail -n +2 | while read -r id ver role latency link tx rx path rest; do
  [ -z "$id" ] && continue
  [ "$first" = true ] || peers="$peers,"
  first=false

  status="offline"
  [ "$latency" != "-" ] && status="online"

  peers="$peers{
    \"id\":\"$id\",
    \"name\":\"$id\",
    \"address\":\"$id\",
    \"latency\":\"$latency\",
    \"role\":\"$role\",
    \"status\":\"$status\",
    \"path\":\"$path\"
  }"
done

peers="$peers]"

echo "{\"peers\":$peers}"
