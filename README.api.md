## ▶️ How to Run & Use `useLuciApi` (OpenWrt API Hook)

Hook `useLuciApi` adalah React hook untuk menghubungkan **Dashboard KendaliNet / PantauWrt** dengan **OpenWrt API**.

Hook ini:
- Mengambil data status jaringan
- Mengambil daftar device
- Mengambil & menyimpan konfigurasi WiFi
- Polling otomatis setiap 5 detik
- Mendukung **Simulation Mode** via flag `enabled`
- **Mendukung 3 metode API:** `/ubus` (resmi LuCI 24.x), LuCI Controller, dan Custom CGI Scripts

---

## 📦 Prerequisites

### Frontend
- Node.js ≥ 18
- React + Vite + TypeScript
- Dashboard dijalankan di browser

### Backend (OpenWrt)

Hook ini mendukung **3 metode API**:

#### 1️⃣ **UBUS API** (Rekomendasi - Future-Proof) ⭐
- **Endpoint:** `/ubus` (resmi LuCI 24.x)
- **Tidak perlu controller** - Langsung call ubus
- **Aman** - Session-based authentication
- **Cocok untuk:** OpenWrt 24.x ke atas

#### 2️⃣ **LuCI Controller** (Legacy)
- **Endpoint:** `/cgi-bin/luci/admin/kendalinet/api/*`
- **Membutuhkan:** Lua controller di router
- **Cocok untuk:** OpenWrt dengan LuCI lama

#### 3️⃣ **Custom CGI Scripts** (Paling Mudah) 🚀
- **Endpoint:** `/cgi-bin/kendalinet/*.sh`
- **Tidak perlu Lua** - Hanya shell script
- **Ringan** - Cocok untuk router kecil
- **Lihat:** [CGI-SCRIPTS.md](./CGI-SCRIPTS.md) untuk setup lengkap

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
import type { ApiMethod } from '@/hooks/useLuciApi';
```

### Basic Usage
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
> `true` = API aktif, `false` = API tidak dipanggil (demo mode)

### Pilih Metode API

```ts
// Method 1: UBUS API (Default - Recommended) ⭐
const api = useLuciApi(true, 'ubus');

// Method 2: LuCI Controller (Legacy)
const api = useLuciApi(true, 'luci');

// Method 3: Custom CGI Scripts
const api = useLuciApi(true, 'cgi');
```

### Environment-based Configuration

```ts
// Auto-detect method from env
const apiMethod: ApiMethod = 
  import.meta.env.VITE_API_METHOD === 'cgi' ? 'cgi' :
  import.meta.env.VITE_API_METHOD === 'luci' ? 'luci' : 'ubus';

const api = useLuciApi(true, apiMethod);
```

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

### UBUS API (`'ubus'`)
- Menggunakan session-based authentication
- Session ID diambil dari LuCI cookie
- Pastikan frontend diakses dari LAN atau embedded di LuCI

### LuCI Controller (`'luci'`)
- API relies on LuCI session (cookie-based)
- **Do NOT expose** `/cgi-bin/luci` to WAN
- Frontend should be accessed from LAN or embedded in LuCI

### CGI Scripts (`'cgi'`)
- **Tidak ada built-in authentication** - Tambahkan sendiri jika perlu
- Pastikan file permissions benar: `chmod 755`, `chown root:root`
- Untuk production, tambahkan input validation & rate limiting
- Lihat [CGI-SCRIPTS.md](./CGI-SCRIPTS.md) untuk security best practices

---

## 🧠 Common Issues

### ❌ 403 / 404 Error

**UBUS Method:**
- Pastikan `/ubus` endpoint tersedia (LuCI 24.x)
- Check session cookie jika menggunakan authentication

**LuCI Controller Method:**
- Not logged into LuCI
- API controller not installed on router
- Check: `/lua/luci/controller/kendalinet.lua` exists

**CGI Scripts Method:**
- Script tidak executable: `chmod +x /www/cgi-bin/kendalinet/*.sh`
- Folder tidak ada: `mkdir -p /www/cgi-bin/kendalinet`
- Check uhttpd config untuk CGI support

### ❌ CORS Error
- Frontend not served from router
- Use proxy or deploy frontend inside OpenWrt / LuCI
- Atau gunakan CGI scripts (tidak ada CORS issue jika di-serve dari router)

### ❌ ubus call failed
- Pastikan OpenWrt versi 24.x atau lebih baru
- Check: `ubus call system info` works dari terminal router
- Pastikan session ID valid (default: `00000000000000000000000000000000`)

---

## ✅ Recommended Usage

### Production
```ts
// OpenWrt 24.x+ → Gunakan UBUS (default)
useLuciApi(true, 'ubus');

// OpenWrt lama dengan LuCI → Gunakan LuCI Controller
useLuciApi(true, 'luci');

// Router kecil / tanpa Lua → Gunakan CGI Scripts
useLuciApi(true, 'cgi');
```

### Development / Demo
```ts
// Demo mode - tidak call API
useLuciApi(false);
```

### Best Practice
- **OpenWrt 24.10+:** Gunakan `'ubus'` (future-proof, official)
- **Router kecil:** Gunakan `'cgi'` (ringan, tidak perlu Lua)
- **Legacy system:** Gunakan `'luci'` (backward compatible)

---

## 📚 Additional Resources

- **[CGI-SCRIPTS.md](./CGI-SCRIPTS.md)** - Panduan lengkap setup Custom CGI Scripts
- **[UBUS API Docs](https://openwrt.org/docs/techref/ubus)** - Dokumentasi resmi ubus
- **[LuCI Documentation](https://openwrt.org/docs/guide-user/luci/start)** - LuCI user guide

## 🛣️ Next Improvements
- WebSocket / SSE real-time update
- Per-device traffic stats
- Firewall block/unblock API
- Multi-router support
- Auto-detect API method based on router capabilities
