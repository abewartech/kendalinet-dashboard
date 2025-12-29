# 🚀 KendaliNet – PantauWrt Dashboard

**KendaliNet (PantauWrt)** adalah dashboard **network monitoring & management** modern untuk **OpenWrt**, dengan desain **Clean Dark Mode + Glassmorphism premium**.  
Terinspirasi dari dashboard network monitoring modern seperti **UniFi Network** dan **ASUS Router App**.

Dirancang ringan, cepat, dan siap demo / siap jual untuk:
- ISP Lokal
- RT/RW Net
- Router OpenWrt skala kecil
- Presentasi dan marketing

---

## ✨ Fitur Utama

### 🏠 Beranda
- Speedometer animasi (real-time / simulasi)
- Wave visualization traffic
- Statistik kuota RX / TX
- Status koneksi & uptime

### 📱 Perangkat
- Daftar device aktif (DHCP leases)
- Status online (indikator hijau)
- Aksi cepat:
  - Block device
  - Bandwidth limiter *(opsional / pengembangan)*

### 📡 WiFi Settings
- Edit SSID
- Ganti password WiFi
- Toggle hide SSID
- Simpan konfigurasi & reload WiFi otomatis

### 👨‍💼 Admin / System
- Informasi sistem OpenWrt
- Status WAN
- Uptime router
- Mode Simulasi (Demo Mode)

### 🧭 Bottom Navigation
- Bottom navigation modern
- Mobile-first design
- Smooth animation

---

## 🎨 Desain & UI

- Dark Mode dengan subtle gradient
- Glassmorphism cards (blur + transparency)
- Warna:
  - Cyan / Teal (primary)
  - Hijau (status online)
- Font: **Inter**
- Animasi:
  - Speedometer smooth
  - Wave traffic
  - Micro-interaction pada tombol

---

## 🧪 Mode Simulasi (Demo Mode)

Mode simulasi memungkinkan dashboard berjalan **tanpa OpenWrt**.

Fungsi:
- Data kecepatan & kuota bergerak otomatis
- Cocok untuk demo jualan & presentasi
- Bisa diaktifkan via frontend atau API flag

---

## 🧠 Arsitektur Sistem

[ Frontend Dashboard (React + Vite) ]
│
│ REST API (JSON)
▼
[ OpenWrt LuCI API (Lua) ]
│
┌───────┼────────┐
▼ ▼ ▼
UCI ubus /proc
(WiFi) (Network) (Traffic)


- Native OpenWrt
- Tanpa Node.js di router
- Ringan & aman untuk router kecil

---

## 🔌 API Backend (OpenWrt Lua)

Backend API dibuat menggunakan **LuCI (Lua)**.

### Endpoint API

| Endpoint | Deskripsi |
|-------|----------|
| `/api/status` | Speed, kuota, uptime |
| `/api/devices` | Daftar device aktif |
| `/api/wifi` | Ambil konfigurasi WiFi |
| `/api/wifi_save` | Simpan WiFi & reload |

Semua API mengembalikan **JSON** dan hanya dapat diakses setelah login LuCI.

---

## 🛠️ Teknologi yang Digunakan

### Frontend
- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn-ui
- Glassmorphism UI

### Backend
- OpenWrt
- LuCI (Lua)
- UCI
- ubus

---

## 🚀 Cara Development (Frontend)

### Prasyarat
- Node.js ≥ 18
- npm / pnpm

### Langkah
```bash
# Clone repository
git clone <YOUR_GIT_URL>

# Masuk ke folder project
cd kendalinet-dashboard

# Install dependency
npm install

# Jalankan development server
npm run dev
