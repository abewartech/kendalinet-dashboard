#!/bin/sh
echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

uci commit mwan3
/etc/init.d/mwan3 restart >/dev/null 2>&1

echo '{"success":true}'
