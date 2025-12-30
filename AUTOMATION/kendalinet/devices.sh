#!/bin/sh

echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

# Read DHCP leases
devices="["
first=true

if [ -f /tmp/dhcp.leases ]; then
    while IFS= read -r line; do
        if [ -n "$line" ]; then
            if [ "$first" = true ]; then
                first=false
            else
                devices="$devices,"
            fi
            
            # Parse: timestamp mac ip hostname
            timestamp=$(echo "$line" | awk '{print $1}')
            mac=$(echo "$line" | awk '{print $2}')
            ip=$(echo "$line" | awk '{print $3}')
            name=$(echo "$line" | awk '{print $4}')
            
            if [ -z "$name" ]; then
                name="unknown"
            fi
            
            # Check if device is online (ping)
            online=false
            if ping -c 1 -W 1 "$ip" >/dev/null 2>&1; then
                online=true
            fi
            
            # Check if blocked
            blocked=false
            if [ -f /etc/kendalinet/blocked_macs ]; then
                if grep -qi "$mac" /etc/kendalinet/blocked_macs; then
                    blocked=true
                fi
            fi

            # Get Bandwidth Limit
            limit=$(grep -i "^$mac" /etc/kendalinet/bandwidth_limits.conf 2>/dev/null | cut -d',' -f2)
            if [ -z "$limit" ]; then limit=0; fi

            # Fake current usage (real usage requires complex tracking like iptmon or traffic-monitor)
            usage=$((RANDOM % 5))
            
            devices="$devices{\"mac\":\"$mac\",\"ip\":\"$ip\",\"name\":\"$name\",\"online\":$online,\"usage\":$usage,\"limit\":$limit,\"blocked\":$blocked}"
        fi
    done < /tmp/dhcp.leases
fi

devices="$devices]"
echo "$devices"

