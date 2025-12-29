#!/bin/sh

echo "Content-Type: application/json"
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
            
            # Simulate bandwidth
            bandwidth=$((RANDOM % 100 + 1))
            
            devices="$devices{\"mac\":\"$mac\",\"ip\":\"$ip\",\"name\":\"$name\",\"online\":$online,\"bandwidth\":$bandwidth}"
        fi
    done < /tmp/dhcp.leases
fi

devices="$devices]"
echo "$devices"

