#!/bin/sh

echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

# Get list of vouchers (simulate or read from file)
voucher_file="/etc/kendalinet/vouchers.db"
vouchers="[]"

if [ -f "$voucher_file" ]; then
    vouchers="["
    first=true
    while IFS= read -r line; do
        if [ -n "$line" ]; then
            if [ "$first" = true ]; then
                first=false
            else
                vouchers="$vouchers,"
            fi
            
            code=$(echo "$line" | cut -d',' -f1)
            duration=$(echo "$line" | cut -d',' -f2)
            status=$(echo "$line" | cut -d',' -f3)
            
            vouchers="$vouchers{\"code\":\"$code\",\"duration\":\"$duration\",\"status\":\"$status\"}"
        fi
    done < "$voucher_file"
    vouchers="$vouchers]"
fi

cat <<EOF
{
  "vouchers": $vouchers,
  "count": $(grep -c "" "$voucher_file" 2>/dev/null || echo "0")
}
EOF
