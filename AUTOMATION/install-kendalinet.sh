#!/bin/sh

set -e

BASE_URL="https://your-vps-domain/kendalinet/api"
CGI_DIR="/www/cgi-bin/kendalinet"

echo "[+] Installing KendaliNet CGI API..."

# Check root
if [ "$(id -u)" != "0" ]; then
  echo "[-] Please run as root"
  exit 1
fi

# Create directory
echo "[+] Creating CGI directory..."
mkdir -p "$CGI_DIR"

# Download scripts
for f in status devices system wifi wifi_save; do
  echo "[+] Downloading $f.sh"
  curl -fsSL "$BASE_URL/$f.sh" -o "$CGI_DIR/$f.sh"
done

# Set permissions
echo "[+] Setting permissions..."
chmod 755 "$CGI_DIR"
chmod +x "$CGI_DIR"/*.sh
chown root:root "$CGI_DIR"/*.sh

# Restart web server
echo "[+] Restarting web server..."
/etc/init.d/uhttpd restart >/dev/null 2>&1 || true

echo "[✓] KendaliNet API installed successfully!"
echo "[✓] Test: http://<router-ip>/cgi-bin/kendalinet/status.sh"

