#!/bin/sh
echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

DIR="/etc/opennds/ndsvouchers"
read -r body
CODE=$(echo "$body" | sed -n 's/.*"code":"\([^"]*\)".*/\1/p')

if [ -z "$CODE" ]; then
    # Try to get from query string if not in body
    CODE=$(echo "$QUERY_STRING" | sed -n 's/.*code=\([^&]*\).*/\1/p')
fi

[ -z "$CODE" ] && echo '{"success":false,"error":"No code provided"}' && exit 0

rm -f "$DIR/$CODE"

echo "{\"success\":true,\"code\":\"$CODE\"}"
