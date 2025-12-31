#!/bin/sh
echo "Content-Type: application/json"
echo ""

# Example: manual upgrade not allowed from UI yet
echo '{"success": false, "message": "Firmware upgrade via UI is disabled for safety"}'
