#!/bin/sh
echo "Content-Type: application/json"
echo ""

read -r body
TYPE=$(echo "$body" | sed -n 's/.*"type":"\([^"]*\)".*/\1/p')

DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M)
mkdir -p "$DIR"

case "$TYPE" in
  full)
    FILE="$DIR/backup_full_$DATE.tar.gz"
    sysupgrade -b "$FILE"
    ;;
  config)
    FILE="$DIR/backup_config_$DATE.tar.gz"
    tar czf "$FILE" /etc/config
    ;;
  network)
    FILE="$DIR/backup_network_$DATE.tar.gz"
    tar czf "$FILE" /etc/config/network
    ;;
  *)
    echo '{"success":false}'
    exit 0
esac

echo "{\"success\":true,\"file\":\"$(basename "$FILE")\"}"
