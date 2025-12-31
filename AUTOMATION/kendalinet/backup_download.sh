#!/bin/sh
FILE="/root/backups/$(basename "$QUERY_STRING")"
[ -f "$FILE" ] || exit 1

echo "Content-Type: application/gzip"
echo "Content-Disposition: attachment; filename=$(basename "$FILE")"
echo ""

cat "$FILE"
