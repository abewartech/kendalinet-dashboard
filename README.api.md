## ▶️ How to Run & Use `useLuciApi` (LuCI OpenWrt API Hook)

Hook `useLuciApi` adalah React hook untuk menghubungkan **Dashboard KendaliNet / PantauWrt** dengan **OpenWrt LuCI API (Lua)**.

Hook ini:
- Mengambil data status jaringan
- Mengambil daftar device
- Mengambil & menyimpan konfigurasi WiFi
- Polling otomatis setiap 5 detik
- Mendukung **Simulation Mode** via flag `enabled`

---

## 📦 Prerequisites

### Frontend
- Node.js ≥ 18
- React + Vite + TypeScript
- Dashboard dijalankan di browser

### Backend (OpenWrt)
Pastikan API LuCI sudah tersedia di router:

```
/cgi-bin/luci/admin/kendalinet/api/status
/cgi-bin/luci/admin/kendalinet/api/devices
/cgi-bin/luci/admin/kendalinet/api/wifi
/cgi-bin/luci/admin/kendalinet/api/wifi_save
/cgi-bin/luci/admin/kendalinet/api/system
```

> ⚠️ API hanya bisa diakses **setelah login LuCI**

---

## 🚀 Running the Frontend

```bash
# install dependencies
npm install

# run dev server
npm run dev
```

Buka di browser:
```
http://localhost:5173
```

---

## 🔌 Using the Hook

### Import Hook
```ts
import { useLuciApi } from '@/hooks/useLuciApi';
```

### Enable API Mode
```ts
const {
  status,
  devices,
  wifi,
  system,
  loading,
  error,
  saveWifi
} = useLuciApi(true);
```
> `true` = API aktif
> `false` = API tidak dipanggil (cocok untuk demo / simulasi)

---

## 📊 Returned Data

### `status`
```ts
{
  speed: number;
  rx_mb: number;
  tx_mb: number;
  uptime: number;
  online: boolean;
}
```

### `devices`
```ts
[
  {
    mac: string;
    ip: string;
    name: string;
    online: boolean;
    bandwidth?: number;
  }
]
```

### `wifi`
```ts
{
  ssid: string;
  hidden: boolean;
}
```

### `system`
```ts
{
  hostname: string;
  model: string;
  uptime: number;
  load: number[];
}
```

---

## 📡 Saving WiFi Configuration

```ts
await saveWifi(
  'MySSID',
  false,
  'password123'
);
```
This will:
- Update UCI wireless config
- Commit changes
- Reload WiFi automatically

---

## 🔁 Auto Polling

When enabled:
- Status, devices, and system info are refreshed every **5 seconds**
- WiFi config is fetched once on load

Polling interval:
```ts
setInterval(..., 5000);
```

---

## 🧪 Simulation / Demo Mode

To run dashboard **without OpenWrt**:
```ts
useLuciApi(false);
```

You can:
- Mock data in UI
- Animate speedometer & charts
- Use for demo / marketing

Recommended pattern:
```ts
const isDemo = import.meta.env.VITE_DEMO === 'true';
useLuciApi(!isDemo);
```

---

## 🔐 Security Notes
- API relies on LuCI session (cookie-based)
- Do NOT expose `/cgi-bin/luci` to WAN
- Frontend should be accessed from LAN or embedded in LuCI

---

## 🧠 Common Issues

### ❌ 403 / 404 Error
- Not logged into LuCI
- API controller not installed on router

### ❌ CORS Error
- Frontend not served from router
- Use proxy or deploy frontend inside OpenWrt / LuCI

---

## ✅ Recommended Usage
- Use `useLuciApi(true)` for **production**
- Use `useLuciApi(false)` for **demo & preview**
- Keep Simulation Mode always available

---

## 🛣️ Next Improvements
- WebSocket / SSE real-time update
- Per-device traffic stats
- Firewall block/unblock API
- Multi-router support
