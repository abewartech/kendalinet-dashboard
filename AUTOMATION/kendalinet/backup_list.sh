#!/bin/sh
echo "Content-Type: application/json"
echo ""

DIR="/root/backups"
echo '['
first=true

[ -d "$DIR" ] || mkdir -p "$DIR"

for f in "$DIR"/*.tar.gz; do
  [ -f "$f" ] || continue
  [ "$first" = true ] || echo ','
  first=false
  echo "{
    \"name\":\"$(basename "$f")\",
    \"size\":\"$(du -h "$f" | cut -f1)\",
    \"date\":\"$(date -r "$f" '+%d %b %Y %H:%M')\"
  }"
done

echo ']'
