#!/bin/sh

echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

# Get security mode
mode=$(uci get kendalinet.security.mode 2>/dev/null || echo "monitor")
whitelist=$(uci get kendalinet.security.whitelist 2>/dev/null)

# Get intruder log (simulate or read from log)
log_file="/tmp/kendalinet_intruders.log"
logs="[]"

if [ -f "$log_file" ]; then
    logs="["
    first=true
    while IFS= read -r line; do
        if [ "$first" = true ]; then
            first=false
        else
            logs="$logs,"
        fi
        logs="$logs$line"
    done < "$log_file"
    logs="$logs]"
fi

cat <<EOF
{
  "mode": "$mode",
  "whitelist": "$whitelist",
  "intruder_logs": $logs
}
EOF
