#!/bin/sh
echo "Content-Type: application/json"
echo ""

opkg update >/dev/null 2>&1

UPDATES=$(opkg list-upgradable | wc -l)

if [ "$UPDATES" -gt 0 ]; then
  echo '{"updateAvailable": true}'
else
  echo '{"updateAvailable": false}'
fi
