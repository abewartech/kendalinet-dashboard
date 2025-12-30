#!/bin/sh

echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo "Access-Control-Allow-Methods: POST, OPTIONS"
echo "Access-Control-Allow-Headers: Content-Type"

if [ "$REQUEST_METHOD" = "OPTIONS" ]; then
    echo ""
    exit 0
fi

echo ""

# Read JSON from POST body
read -r post_data

# Parse JSON
if command -v jq >/dev/null 2>&1; then
    mac=$(echo "$post_data" | jq -r '.mac // empty')
    rate=$(echo "$post_data" | jq -r '.rate // empty')
else
    mac=$(echo "$post_data" | grep -o '"mac":"[^"]*' | cut -d'"' -f4)
    rate=$(echo "$post_data" | grep -o '"rate":"[^"]*' | cut -d'"' -f4)
fi

if [ -z "$mac" ] || [ -z "$rate" ]; then
    echo '{"success": false, "error": "Missing MAC or rate"}'
    exit 0
fi

# Helper: Get IP from ARP
get_ip() {
    grep -i "$1" /proc/net/arp | awk '{print $1}' | head -n 1
}

# Helper: Apply TC (Traffic Control)
# We use Class ID based on IP last octet to prevent collisions
apply_tc() {
    local dev="br-lan"
    local ip=$1
    local mbps=$2
    local id=$(echo $ip | cut -d. -f4)
    
    # Ensure root qdisc exists
    tc qdisc add dev $dev root handle 1: htb default 10 2>/dev/null
    
    # Remove existing class/filter for this ID
    tc filter del dev $dev parent 1: protocol ip prio 1 handle $id fw 2>/dev/null
    tc class del dev $dev parent 1: classid 1:$id 2>/dev/null
    
    if [ "$mbps" != "0" ] && [ "$mbps" != "" ]; then
        # Add class with rate limit
        tc class add dev $dev parent 1: classid 1:$id htb rate ${mbps}mbit ceil ${mbps}mbit
        # Add filter to match IP
        tc filter add dev $dev parent 1: protocol ip prio 1 u32 match ip dst $ip/32 flowid 1:$id
    fi
}

target_ip=$(get_ip "$mac")

if [ -z "$target_ip" ]; then
    echo "{\"success\": false, \"error\": \"Device is not online (no IP found for MAC)\"}"
    exit 0
fi

# Store config
mkdir -p /etc/kendalinet
config_file="/etc/kendalinet/bandwidth_limits.conf"
grep -v "^$mac" "$config_file" > "${config_file}.tmp" 2>/dev/null
[ "$rate" != "0" ] && echo "$mac,$rate,$target_ip" >> "${config_file}.tmp"
mv "${config_file}.tmp" "$config_file"

# Apply real TC
apply_tc "$target_ip" "$rate"

echo "{\"success\": true, \"message\": \"Bandwidth limit for $mac ($target_ip) set to $rate Mbps\", \"status\": \"applied\"}"
