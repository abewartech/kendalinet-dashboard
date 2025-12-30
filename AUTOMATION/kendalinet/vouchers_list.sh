#!/bin/sh
echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

DIR="/etc/opennds/ndsvouchers"
vouchers="["
first=true

[ -d "$DIR" ] || mkdir -p "$DIR"

for f in "$DIR"/*; do
  [ -f "$f" ] || continue

  code=$(basename "$f")
  expire=$(grep expire "$f" | cut -d= -f2)
  quota=$(grep quota "$f" | cut -d= -f2)
  rate=$(grep rate "$f" | cut -d= -f2)

  # Check if expired (optional: you could check timestamps here)
  status="active"

  [ "$first" = true ] || vouchers="$vouchers,"
  first=false

  vouchers="$vouchers{\"id\":\"$code\",\"code\":\"$code\",\"duration\":$expire,\"quota\":$quota,\"speedLimit\":$rate,\"status\":\"$status\"}"
done

vouchers="$vouchers]"
count=$(ls "$DIR" 2>/dev/null | wc -l)

echo "{\"vouchers\":$vouchers,\"count\":$count}"
