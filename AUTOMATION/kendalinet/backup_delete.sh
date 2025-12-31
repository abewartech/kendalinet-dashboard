#!/bin/sh
echo "Content-Type: application/json"
echo ""

read -r body
FILE=$(echo "$body" | sed -n 's/.*"file":"\([^"]*\)".*/\1/p')

rm -f "/root/backups/$FILE"

echo '{"success":true}'
