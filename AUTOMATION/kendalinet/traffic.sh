#!/bin/sh

echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

# Try to get daily/hourly stats from vnstat if available
if command -v vnstat >/dev/null 2>&1; then
    # Get hourly stats for the last 24h
    hourly=$(vnstat --json h 24 | jq -r '.interfaces[0].traffic.hour')
    # Get daily stats for the last 7 days
    daily=$(vnstat --json d 7 | jq -r '.interfaces[0].traffic.day')
    
    echo "{\"success\": true, \"source\": \"vnstat\", \"hourly\": $hourly, \"daily\": $daily}"
else
    # Fallback to status.sh derived data or simulated history if vnstat not present
    # To keep the UI alive, we provide a structured mock that looks real 
    # but based on current rx/tx values
    
    rx_bytes=0
    tx_bytes=0
    if [ -f /sys/class/net/eth0/statistics/rx_bytes ]; then
        rx_bytes=$(cat /sys/class/net/eth0/statistics/rx_bytes)
        tx_bytes=$(cat /sys/class/net/eth0/statistics/tx_bytes)
    fi
    
    rx_gb=$((rx_bytes / 1024 / 1024 / 1024))
    tx_gb=$((tx_bytes / 1024 / 1024 / 1024))

    echo "{\"success\": true, \"source\": \"simulated\", \"total_rx_gb\": $rx_gb, \"total_tx_gb\": $tx_gb}"
fi
