#!/bin/sh
echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

DIR="/etc/opennds/ndsvouchers"
mkdir -p "$DIR"

# Read POST body
read -r body

# Simple parsing of JSON-like body (or use defaults if empty)
# Expecting: {"duration": 60, "quota": 5120, "speedLimit": 10}
EXPIRE=$(echo "$body" | sed -n 's/.*"duration":\([^,}]*\).*/\1/p' | tr -d ' ')
QUOTA=$(echo "$body" | sed -n 's/.*"quota":\([^,}]*\).*/\1/p' | tr -d ' ')
RATE=$(echo "$body" | sed -n 's/.*"speedLimit":\([^,}]*\).*/\1/p' | tr -d ' ')

[ -z "$EXPIRE" ] && EXPIRE=60
[ -z "$QUOTA" ] && QUOTA=5120
[ -z "$RATE" ] && RATE=10

# Generate voucher code
CODE=$(tr -dc A-Z0-9 </dev/urandom | head -c4)-$(tr -dc A-Z0-9 </dev/urandom | head -c4)

cat <<EOF > "$DIR/$CODE"
expire=$EXPIRE
quota=$QUOTA
rate=$RATE
EOF

echo "{\"success\":true,\"code\":\"$CODE\",\"duration\":$EXPIRE,\"quota\":$QUOTA,\"speedLimit\":$RATE}"
