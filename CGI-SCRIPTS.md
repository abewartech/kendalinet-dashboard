# 🚀 Custom CGI Scripts untuk OpenWrt (Paling Mudah)

Dokumentasi ini menjelaskan cara membuat **Custom CGI Scripts** untuk API KendaliNet Dashboard tanpa bergantung pada LuCI controller.

## ✅ Keuntungan CGI Scripts

- ✔ **OpenWrt 24.10 compatible** - Tidak bergantung Lua LuCI lama
- ✔ **Ringan** - Router kecil aman (tidak perlu Lua runtime)
- ✔ **Mudah** - Hanya shell script sederhana
- ✔ **Future-proof** - Tidak terikat versi LuCI tertentu

---

## 📁 Setup Awal

### 1. Buat Folder CGI

```bash
mkdir -p /www/cgi-bin/kendalinet
```

### 2. Set Permissions

```bash
chmod 755 /www/cgi-bin/kendalinet
```

---

## 📝 Script 1: Status API (`status.sh`)

**Path:** `/www/cgi-bin/kendalinet/status.sh`

```bash
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
```

**Jadikan executable:**
```bash
chmod +x /www/cgi-bin/kendalinet/status.sh
```

**Test:**
```bash
curl http://192.168.2.1/cgi-bin/kendalinet/status.sh
```

---

## 📝 Script 2: Devices API (`devices.sh`)

**Path:** `/www/cgi-bin/kendalinet/devices.sh`

```bash
#!/bin/sh

echo "Content-Type: application/json"
echo ""

# Read DHCP leases
devices="["
first=true

if [ -f /tmp/dhcp.leases ]; then
    while IFS= read -r line; do
        if [ -n "$line" ]; then
            if [ "$first" = true ]; then
                first=false
            else
                devices="$devices,"
            fi
            
            # Parse: timestamp mac ip hostname
            timestamp=$(echo "$line" | awk '{print $1}')
            mac=$(echo "$line" | awk '{print $2}')
            ip=$(echo "$line" | awk '{print $3}')
            name=$(echo "$line" | awk '{print $4}')
            
            if [ -z "$name" ]; then
                name="unknown"
            fi
            
            # Check if device is online (ping)
            online=false
            if ping -c 1 -W 1 "$ip" >/dev/null 2>&1; then
                online=true
            fi
            
            # Simulate bandwidth
            bandwidth=$((RANDOM % 100 + 1))
            
            devices="$devices{\"mac\":\"$mac\",\"ip\":\"$ip\",\"name\":\"$name\",\"online\":$online,\"bandwidth\":$bandwidth}"
        fi
    done < /tmp/dhcp.leases
fi

devices="$devices]"
echo "$devices"
```

**Jadikan executable:**
```bash
chmod +x /www/cgi-bin/kendalinet/devices.sh
```

---

## 📝 Script 3: System Info API (`system.sh`)

**Path:** `/www/cgi-bin/kendalinet/system.sh`

```bash
#!/bin/sh

echo "Content-Type: application/json"
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
```

**Jadikan executable:**
```bash
chmod +x /www/cgi-bin/kendalinet/system.sh
```

---

## 📝 Script 4: WiFi Get API (`wifi.sh`)

**Path:** `/www/cgi-bin/kendalinet/wifi.sh`

```bash
#!/bin/sh

echo "Content-Type: application/json"
echo ""

# Read WiFi config from UCI
ssid=$(uci get wireless.default_radio0.ssid 2>/dev/null || echo "")
hidden=$(uci get wireless.default_radio0.hidden 2>/dev/null || echo "0")
key=$(uci get wireless.default_radio0.key 2>/dev/null || echo "")

if [ "$hidden" = "1" ]; then
    hidden_bool=true
else
    hidden_bool=false
fi

cat <<EOF
{
  "ssid": "$ssid",
  "hidden": $hidden_bool,
  "password": "$key"
}
EOF
```

**Jadikan executable:**
```bash
chmod +x /www/cgi-bin/kendalinet/wifi.sh
```

---

## 📝 Script 5: WiFi Save API (`wifi_save.sh`)

**Path:** `/www/cgi-bin/kendalinet/wifi_save.sh`

```bash
#!/bin/sh

echo "Content-Type: application/json"
echo ""

# Read JSON from POST body
read -r post_data

# Parse JSON (simple parsing, for production use jq if available)
ssid=$(echo "$post_data" | grep -o '"ssid":"[^"]*' | cut -d'"' -f4)
hidden=$(echo "$post_data" | grep -o '"hidden":[^,}]*' | grep -o '[tf][ru][ue]*')
password=$(echo "$post_data" | grep -o '"password":"[^"]*' | cut -d'"' -f4)

if [ -z "$ssid" ]; then
    echo '{"success": false, "error": "Missing SSID"}'
    exit 0
fi

# Update UCI config
uci set wireless.default_radio0.ssid="$ssid"

if [ "$hidden" = "true" ]; then
    uci set wireless.default_radio0.hidden="1"
else
    uci set wireless.default_radio0.hidden="0"
fi

if [ -n "$password" ]; then
    uci set wireless.default_radio0.key="$password"
fi

uci commit wireless
wifi reload >/dev/null 2>&1

echo '{"success": true}'
```

**Jadikan executable:**
```bash
chmod +x /www/cgi-bin/kendalinet/wifi_save.sh
```

**Note:** Untuk parsing JSON yang lebih robust, install `jq`:
```bash
opkg update && opkg install jq
```

Lalu gunakan:
```bash
ssid=$(echo "$post_data" | jq -r '.ssid')
hidden=$(echo "$post_data" | jq -r '.hidden')
password=$(echo "$post_data" | jq -r '.password')
```

---

## 🔧 Konfigurasi Frontend

Setelah script CGI siap, update frontend untuk menggunakan method `'cgi'`:

```ts
import { useLuciApi } from '@/hooks/useLuciApi';

// Gunakan CGI method
const { status, devices, system, wifi } = useLuciApi(true, 'cgi');
```

---

## 🧪 Testing

### Test dari Terminal

```bash
# Status
curl http://192.168.2.1/cgi-bin/kendalinet/status.sh

# Devices
curl http://192.168.2.1/cgi-bin/kendalinet/devices.sh

# System
curl http://192.168.2.1/cgi-bin/kendalinet/system.sh

# WiFi Get
curl http://192.168.2.1/cgi-bin/kendalinet/wifi.sh

# WiFi Save (POST)
curl -X POST http://192.168.2.1/cgi-bin/kendalinet/wifi_save.sh \
  -H "Content-Type: application/json" \
  -d '{"ssid":"MySSID","hidden":false,"password":"mypass123"}'
```

### Test dari Browser

Buka:
```
http://192.168.2.1/cgi-bin/kendalinet/status.sh
```

Harusnya keluar JSON langsung.

---

## 🔐 Security Notes

1. **File Permissions:** Pastikan hanya root yang bisa write:
   ```bash
   chmod 755 /www/cgi-bin/kendalinet/*.sh
   chown root:root /www/cgi-bin/kendalinet/*.sh
   ```

2. **Input Validation:** Script di atas adalah contoh sederhana. Untuk production, tambahkan:
   - Input sanitization
   - Authentication check
   - Rate limiting

3. **HTTPS:** Gunakan HTTPS jika memungkinkan (via uhttpd atau nginx).

---

## 🚀 Deployment Script

Buat script untuk deploy semua CGI scripts sekaligus:

```bash
#!/bin/sh
# deploy-cgi.sh

CGI_DIR="/www/cgi-bin/kendalinet"
mkdir -p "$CGI_DIR"

# Copy all scripts
cp status.sh "$CGI_DIR/"
cp devices.sh "$CGI_DIR/"
cp system.sh "$CGI_DIR/"
cp wifi.sh "$CGI_DIR/"
cp wifi_save.sh "$CGI_DIR/"

# Set permissions
chmod +x "$CGI_DIR"/*.sh
chown root:root "$CGI_DIR"/*.sh

echo "CGI scripts deployed to $CGI_DIR"
```

---

## ✅ Checklist

- [ ] Folder `/www/cgi-bin/kendalinet` dibuat
- [ ] Semua script dibuat dan executable
- [ ] Test dari terminal (curl)
- [ ] Test dari browser
- [ ] Update frontend untuk menggunakan `method: 'cgi'`
- [ ] Test full flow dari dashboard

---

## 🆘 Troubleshooting

### ❌ 404 Not Found
- Pastikan folder ada di `/www/cgi-bin/kendalinet`
- Pastikan uhttpd/web server dikonfigurasi untuk serve CGI

### ❌ 500 Internal Server Error
- Check permissions: `chmod +x script.sh`
- Check syntax: `sh -n script.sh`
- Check logs: `logread | tail -20`

### ❌ JSON tidak valid
- Pastikan `Content-Type: application/json` di-echo sebelum JSON
- Pastikan ada empty line setelah Content-Type
- Test dengan `curl -v` untuk lihat response headers

---

## 📚 Referensi

- [OpenWrt uhttpd CGI](https://openwrt.org/docs/guide-user/services/webserver/uhttpd)
- [Shell Scripting Guide](https://www.shellscript.sh/)
- [UCI Configuration](https://openwrt.org/docs/guide-user/base-system/uci)

