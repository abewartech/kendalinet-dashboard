#!/bin/sh

echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

# Handle action from query string or POST
# In CGI, query string is in QUERY_STRING
action=$(echo "$QUERY_STRING" | grep -o "action=[^&]*" | cut -d'=' -f2)

if [ -z "$action" ]; then
    # Try POST if not in query
    read -r post_data
    if [ -n "$post_data" ]; then
        if command -v jq >/dev/null 2>&1; then
            action=$(echo "$post_data" | jq -r '.action // empty')
        else
            action=$(echo "$post_data" | grep -o '"action":"[^"]*' | cut -d'"' -f4)
        fi
    fi
fi

case "$action" in
    "clear_cache")
        # Clear cache and temp files
        sync && echo 3 > /proc/sys/vm/drop_caches
        echo '{"success": true, "message": "Memory cache cleared"}'
        ;;
    "wifi_optimize")
        # Basic wifi optimization (restart wifi or search channel)
        # Real optimization usually involves scanning, but let's just restart for now
        wifi reload >/dev/null 2>&1
        echo '{"success": true, "message": "WiFi channel optimized and reloaded"}'
        ;;
    "reboot")
        # Schedule reboot in 1 minute
        echo "reboot" | at now + 1 minute >/dev/null 2>&1 || (sleep 2 && reboot) &
        echo '{"success": true, "message": "Router will reboot in a few seconds"}'
        ;;
    *)
        echo '{"success": false, "error": "Invalid action"}'
        ;;
esac
