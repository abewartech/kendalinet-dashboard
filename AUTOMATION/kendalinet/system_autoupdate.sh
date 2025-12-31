#!/bin/sh
echo "Content-Type: application/json"
echo ""

read -r body
ENABLE=$(echo "$body" | sed -n 's/.*"enabled":\([^,}]*\).*/\1/p')

CRON="/etc/crontabs/root"

if [ "$ENABLE" = "true" ]; then
  grep -q opkg-upgrade "$CRON" || \
  echo "0 3 * * * opkg update && opkg list-upgradable | cut -f1 -d' ' | xargs opkg upgrade" >> "$CRON"
else
  sed -i '/opkg upgrade/d' "$CRON"
fi

/etc/init.d/cron restart

echo '{"success": true}'
