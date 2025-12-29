#!/bin/sh

echo "Content-Type: application/json"
echo ""

# Get uptime (in seconds)
uptime=$(cut -d. -f1 /proc/uptime)

# Get WAN interface statistics
rx_bytes=0
tx_bytes=0

if [ -f /sys/class/net/eth0/statistics/rx_bytes ]; then
    rx_bytes=$(cat /sys/class/net/eth0/statistics/rx_bytes)
    tx_bytes=$(cat /sys/class/net/eth0/statistics/tx_bytes)
fi

# Calculate MB
rx_mb=$((rx_bytes / 1024 / 1024))
tx_mb=$((tx_bytes / 1024 / 1024))

# Simulate speed (or calculate from interface stats)
speed=$((RANDOM % 100 + 20))

# Check if online (ping gateway or check interface)
online=true
if ! ping -c 1 -W 1 8.8.8.8 >/dev/null 2>&1; then
    online=false
fi

cat <<EOF
{
  "online": $online,
  "uptime": $uptime,
  "speed": $speed,
  "rx_mb": $rx_mb,
  "tx_mb": $tx_mb
}
EOF

