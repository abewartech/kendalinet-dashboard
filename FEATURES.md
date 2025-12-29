# 📱 KendaliNet - Daftar Fitur Lengkap

**KendaliNet (PantauWrt)** adalah dashboard network monitoring & management modern untuk OpenWrt.

---

## 🏠 1. Beranda (Home Dashboard)

| Fitur | Deskripsi |
|-------|-----------|
| **Speedometer Animasi** | Visualisasi kecepatan Download/Upload real-time dengan angka besar |
| **Wave Animation** | Grafik gelombang animasi menunjukkan traffic jaringan |
| **Statistik Kuota** | Kartu menampilkan sisa GB, progress bar penggunaan, timestamp update terakhir |
| **Status Koneksi** | Header dengan nama router dan status online/uptime |
| **Game Mode** | Toggle untuk prioritas gaming dengan optimasi ping |

---

## 📱 2. Perangkat (Device Management)

| Fitur | Deskripsi |
|-------|-----------|
| **Daftar Device Aktif** | Menampilkan semua perangkat terhubung dari DHCP leases |
| **Status Online** | Indikator hijau untuk perangkat yang aktif |
| **Block Device** | Putuskan koneksi perangkat tertentu |
| **Limit Bandwidth** | Atur batas kecepatan per perangkat |

---

## 👥 3. Grup Perangkat (Device Grouping) ✨ *BARU*

| Fitur | Deskripsi |
|-------|-----------|
| **Buat Grup** | Kelompokkan perangkat per pelanggan/ruangan/keluarga |
| **Label Warna** | 6 pilihan warna untuk identifikasi grup |
| **Deskripsi Grup** | Tambahkan catatan untuk setiap grup |
| **Statistik Grup** | Lihat jumlah perangkat dan status online per grup |
| **Perangkat Tanpa Grup** | Tampilan terpisah untuk device yang belum dikelompokkan |

---

## 📊 4. Monitor Penggunaan (Bandwidth per Device) ✨ *BARU*

| Fitur | Deskripsi |
|-------|-----------|
| **Real-time Monitoring** | Pantau penggunaan bandwidth setiap perangkat secara live |
| **Total Download/Upload** | Ringkasan total data yang digunakan |
| **Top User** | Identifikasi pengguna dengan konsumsi tertinggi |
| **Progress Bar** | Visualisasi perbandingan penggunaan antar perangkat |
| **Data Harian** | Tab untuk melihat statistik per hari (coming soon) |

---

## 🔒 5. Keamanan (Anti-Intruder/Anti-Maling)

| Fitur | Deskripsi |
|-------|-----------|
| **Deteksi Perangkat Baru** | Notifikasi saat device tidak dikenal terhubung |
| **Whitelist Mode** | Izinkan hanya perangkat keluarga, blokir otomatis yang lain |
| **Notifikasi Browser** | Push notification di browser saat ada intruder |
| **Notifikasi WhatsApp** | Kirim alert via webhook (n8n/Zapier/Fonnte) |
| **Notifikasi Telegram** | Kirim alert langsung ke Telegram Bot |
| **Riwayat Deteksi** | Log semua perangkat baru yang pernah terdeteksi |
| **Panduan n8n** | Template workflow untuk integrasi WhatsApp |

---

## ⏰ 6. Jadwal (Parental Control)

| Fitur | Deskripsi |
|-------|-----------|
| **Timer per Device** | Blokir internet perangkat tertentu di jam yang ditentukan |
| **Waktunya Makan** | Tombol satu klik untuk blokir semua device selama 30 menit |
| **Jadwal Berulang** | Atur jadwal harian/mingguan untuk pembatasan |

---

## 📶 7. Bandwidth Limiter

| Fitur | Deskripsi |
|-------|-----------|
| **Limit per Device** | Atur batas kecepatan 1-50 Mbps per perangkat |
| **Preset Profile** | Basic (2 Mbps), Streaming (10 Mbps), Gaming (25 Mbps) |
| **Quick Apply** | Terapkan limit dengan satu klik |

---

## 🎫 8. Voucher System

| Fitur | Deskripsi |
|-------|-----------|
| **Generate Voucher** | Buat kode voucher untuk akses WiFi |
| **Durasi Kustom** | Atur masa aktif voucher (jam/hari) |
| **Cetak Voucher** | Layout siap cetak untuk distribusi |

---

## 🌐 9. DNS Custom ✨ *BARU*

| Fitur | Deskripsi |
|-------|-----------|
| **Cloudflare DNS** | Tercepat di dunia, privasi terjamin (1.1.1.1) |
| **Google DNS** | Sangat stabil, uptime tinggi (8.8.8.8) |
| **AdGuard DNS** | Blokir iklan & tracker di seluruh jaringan |
| **Quad9 DNS** | Keamanan tinggi, blokir malware |
| **Custom DNS** | Input DNS primer/sekunder sendiri |
| **Info Manfaat** | Penjelasan kelebihan setiap DNS provider |

---

## ⚡ 10. Optimasi (Network Cleaner)

| Fitur | Deskripsi |
|-------|-----------|
| **Segarkan Network** | Bersihkan cache dan optimasi channel WiFi |
| **Auto-Reboot Terjadwal** | Restart router otomatis (default: 03:00 AM) |
| **Tombol Satu Klik** | Eksekusi maintenance dengan mudah |

---

## 💰 11. Tagihan (Billing Report)

| Fitur | Deskripsi |
|-------|-----------|
| **Grafik 30 Hari** | Chart penggunaan data harian selama sebulan |
| **Total Bulanan** | Ringkasan total data yang digunakan |
| **Rata-rata Harian** | Kalkulasi penggunaan rata-rata per hari |
| **Estimasi Biaya** | Input harga per GB, hitung total Rupiah |
| **Data Pelanggan** | Simpan nama, alamat, nomor telepon |
| **Export CSV/PDF** | Unduh laporan untuk dokumentasi |
| **Riwayat Billing** | Arsip tagihan bulanan sebelumnya |

---

## 📡 12. WiFi Settings

| Fitur | Deskripsi |
|-------|-----------|
| **Edit SSID** | Ubah nama jaringan WiFi |
| **Ganti Password** | Update password WiFi |
| **Hidden SSID** | Toggle untuk sembunyikan nama jaringan |
| **Auto Reload** | Simpan dan reload WiFi otomatis |

---

## 📲 13. QR Code Generator

| Fitur | Deskripsi |
|-------|-----------|
| **Generate QR** | Buat QR Code standar untuk berbagi WiFi |
| **Toggle Visibility** | Tampilkan/sembunyikan password |
| **Share** | Bagikan via Web Share API atau clipboard |
| **Print Layout** | Layout khusus untuk cetak fisik |
| **Download PNG** | Unduh gambar QR Code |

---

## ⚙️ 14. Admin Panel

| Fitur | Deskripsi |
|-------|-----------|
| **Info Sistem** | Detail OpenWrt, versi, hostname |
| **Status WAN** | Informasi koneksi internet |
| **Uptime Router** | Durasi router menyala |
| **Mode Simulasi** | Demo mode tanpa koneksi router asli |

---

## 🖥️ 15. Multi-Router Management

| Fitur | Deskripsi |
|-------|-----------|
| **Tambah Router** | Daftarkan multiple router profile |
| **Router Selector** | Switch antar router dari header |
| **Dashboard Gabungan** | Lihat status semua router sekaligus |
| **Backup/Restore** | Export & import konfigurasi router |

---

## 💬 16. Support Chatbot

| Fitur | Deskripsi |
|-------|-----------|
| **FAQ Interaktif** | Jawab pertanyaan umum pengguna |
| **Bantuan Cepat** | Panduan penggunaan fitur |

---

## 🎨 Desain & UI

| Aspek | Detail |
|-------|--------|
| **Theme** | Clean Dark Mode + Glassmorphism |
| **Warna Utama** | Cyan/Teal (primary), Hijau (success) |
| **Font** | Inter (clean & readable) |
| **Icons** | Lucide Icons |
| **Animasi** | Speedometer smooth, wave traffic, micro-interactions |
| **Responsif** | Mobile-first, bottom navigation scrollable |

---

## 🎯 Target Pengguna

1. **Pengguna Rumahan** - Kelola WiFi pribadi
2. **Orang Tua** - Parental control untuk disiplin anak
3. **Operator RT/RW Net** - Manajemen jaringan komunitas, billing, accountability

---

## 🛠️ Teknologi

### Frontend
- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Capacitor (Android wrapper)

### Backend
- OpenWrt + LuCI (Lua)
- UCI + ubus
- CGI Scripts (status.sh, devices.sh, etc.)

---

## 📡 API Endpoints

| Endpoint | Deskripsi |
|----------|-----------|
| `/api/status` | Speed, kuota, uptime |
| `/api/devices` | Daftar device aktif |
| `/api/wifi` | Ambil konfigurasi WiFi |
| `/api/wifi_save` | Simpan WiFi & reload |
| `/api/system` | Info sistem OpenWrt |

---

*Dokumentasi ini dibuat otomatis berdasarkan fitur yang terImplementasi di KendaliNet v1.0*
