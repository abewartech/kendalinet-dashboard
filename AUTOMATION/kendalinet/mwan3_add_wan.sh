#!/bin/sh
echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

read -r body

NAME=$(echo "$body" | sed -n 's/.*"name":"\([^"]*\)".*/\1/p')
IFACE=$(echo "$body" | sed -n 's/.*"iface":"\([^"]*\)".*/\1/p')
WEIGHT=$(echo "$body" | sed -n 's/.*"weight":\([^,}]*\).*/\1/p')
METRIC=$(echo "$body" | sed -n 's/.*"metric":\([^,}]*\).*/\1/p')

[ -z "$IFACE" ] && echo '{"success":false,"error":"Missing interface"}' && exit 0

# Interface config in mwan3
uci set mwan3.$IFACE=interface
uci set mwan3.$IFACE.enabled='1'
uci set mwan3.$IFACE.family='ipv4'
uci set mwan3.$IFACE.track_ip='8.8.8.8 1.1.1.1'
uci set mwan3.$IFACE.track_method='ping'
uci set mwan3.$IFACE.reliability='1'
uci set mwan3.$IFACE.count='1'
uci set mwan3.$IFACE.timeout='2'
uci set mwan3.$IFACE.interval='5'
uci set mwan3.$IFACE.down='3'
uci set mwan3.$IFACE.up='8'

# Member config
MEMBER_NAME="${IFACE}_m1"
uci set mwan3.$MEMBER_NAME=member
uci set mwan3.$MEMBER_NAME.interface="$IFACE"
uci set mwan3.$MEMBER_NAME.weight="${WEIGHT:-1}"
uci set mwan3.$MEMBER_NAME.metric="${METRIC:-1}"

uci commit mwan3
/etc/init.d/mwan3 restart >/dev/null 2>&1

echo "{\"success\":true,\"iface\":\"$IFACE\"}"
