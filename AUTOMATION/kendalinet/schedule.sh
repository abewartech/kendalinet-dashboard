#!/bin/sh

echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

# Get existing schedules from cron
schedules=$(crontab -l 2>/dev/null | grep "kendalinet-block" | sed 's/"/\\"/g')

# Get blocking status per device
blocking_config="/etc/kendalinet/blocking.conf"
blocking_json="[]"

if [ -f "$blocking_config" ]; then
    blocking_json="["
    first=true
    while IFS= read -r line; do
        if [ -n "$line" ]; then
            if [ "$first" = true ]; then
                first=false
            else
                blocking_json="$blocking_json,"
            fi
            mac=$(echo "$line" | cut -d',' -f1)
            time=$(echo "$line" | cut -d',' -f2)
            blocking_json="$blocking_json{\"mac\":\"$mac\",\"time\":\"$time\"}"
        fi
    done < "$blocking_config"
    blocking_json="$blocking_json]"
fi

cat <<EOF
{
  "active_schedules": "$schedules",
  "device_blocking": $blocking_json
}
EOF
