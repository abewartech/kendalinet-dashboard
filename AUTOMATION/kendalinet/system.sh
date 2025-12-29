#!/bin/sh

echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

# Get system info
uptime=$(cut -d. -f1 /proc/uptime)
hostname=$(cat /proc/sys/kernel/hostname 2>/dev/null || echo "OpenWrt")

# Get memory info
total_mem=0
free_mem=0
if [ -f /proc/meminfo ]; then
    total_mem=$(grep MemTotal /proc/meminfo | awk '{print $2}')
    free_mem=$(grep MemAvailable /proc/meminfo | awk '{print $2}')
    if [ -z "$free_mem" ]; then
        free_mem=$(grep MemFree /proc/meminfo | awk '{print $2}')
    fi
fi

used_mem=$((total_mem - free_mem))
mem_percent=0
if [ $total_mem -gt 0 ]; then
    mem_percent=$((used_mem * 100 / total_mem))
fi

# Get CPU load
cpu_load="0.00"
if [ -f /proc/loadavg ]; then
    cpu_load=$(cat /proc/loadavg | awk '{print $1}')
fi

# Get model/firmware (from /etc/openwrt_release or ubus)
model="OpenWrt Device"
firmware="OpenWrt"

if command -v ubus >/dev/null 2>&1; then
    board_info=$(ubus call system board 2>/dev/null)
    if [ -n "$board_info" ]; then
        model=$(echo "$board_info" | grep -o '"model":"[^"]*' | cut -d'"' -f4 || echo "$model")
    fi
fi

cat <<EOF
{
  "hostname": "$hostname",
  "model": "$model",
  "firmware": "$firmware",
  "uptime": $uptime,
  "cpu_load": "$cpu_load",
  "memory_percent": $mem_percent
}
EOF

