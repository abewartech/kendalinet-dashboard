#!/bin/sh

echo "Content-Type: application/json"
echo "Access-Control-Allow-Origin: *"
echo ""

# Get Port Forwarding Rules
pf_rules="["
first=true

# Parse UCI firewall redirect sections
config_load() {
    local type="$1"
    uci show firewall | grep "=redirect" | cut -d'.' -f2 | cut -d'=' -f1 | while read section; do
        name=$(uci get firewall.$section.name 2>/dev/null)
        proto=$(uci get firewall.$section.proto 2>/dev/null)
        src_port=$(uci get firewall.$section.src_dport 2>/dev/null)
        dest_ip=$(uci get firewall.$section.dest_ip 2>/dev/null)
        dest_port=$(uci get firewall.$section.dest_port 2>/dev/null)
        enabled=$(uci get firewall.$section.enabled 2>/dev/null || echo "1")
        
        # Format as JSON
        rule="{\"id\":\"$section\",\"name\":\"$name\",\"proto\":\"$proto\",\"src_port\":\"$src_port\",\"dest_ip\":\"$dest_ip\",\"dest_port\":\"$dest_port\",\"enabled\":$enabled}"
        echo "$rule"
    done
}

rules_output=$(config_load)
for r in $rules_output; do
    if [ "$first" = true ]; then
        first=false
    else
        pf_rules="$pf_rules,"
    fi
    pf_rules="$pf_rules$r"
done
pf_rules="$pf_rules]"

# Get Basic Firewall Stats
total_rules=$(uci show firewall | grep -c "=rule")

cat <<EOF
{
  "port_forwarding": $pf_rules,
  "total_firewall_rules": $total_rules
}
EOF
