#!/bin/sh
echo "Content-Type: application/json"
echo ""

read -r body
FILE=$(echo "$body" | sed -n 's/.*"file":"\([^"]*\)".*/\1/p')

BACKUP="/root/backups/$FILE"

[ -f "$BACKUP" ] || echo '{"success":false}' && exit 0

sysupgrade -r "$BACKUP" >/dev/null 2>&1 &

echo '{"success":true,"reboot":true}'
