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

## 🔌 17. Port Forwarding ✨ *BARU*

| Fitur | Deskripsi |
|-------|-----------|
| **Kelola Port Rules** | Tambah, edit, hapus aturan port forwarding |
| **Protokol Fleksibel** | Mendukung TCP, UDP, atau TCP+UDP |
| **Port Mapping** | Atur external port ke internal IP:port |
| **Preset Templates** | Template siap pakai (HTTP, SSH, Minecraft, dll) |
| **Toggle Status** | Aktifkan/nonaktifkan rule dengan satu klik |
| **Statistik Rules** | Ringkasan jumlah rule aktif dan nonaktif |

---

## 🛡️ 18. Firewall Rules ✨ *BARU*

| Fitur | Deskripsi |
|-------|-----------|
| **Kelola Firewall** | Tambah, edit, hapus aturan firewall |
| **Action Types** | Accept, Drop, atau Reject traffic |
| **Protokol Support** | TCP, UDP, ICMP, atau All protocols |
| **Traffic Direction** | Input, Output, atau Forward rules |
| **IP/Port Filtering** | Filter berdasarkan source/dest IP dan port |
| **Preset Templates** | Template keamanan (Block All, Allow HTTPS, dll) |
| **Toggle Status** | Aktifkan/nonaktifkan rule dengan satu klik |

---

## 🎛️ 19. Kontrol Lanjutan (Advanced Control) ✨ *BARU*

| Fitur | Deskripsi |
|-------|-----------|
| **VPN Management** | Kelola profil OpenVPN, WireGuard, L2TP, PPTP |
| **Proxy Inject** | Konfigurasi HTTP/SSL/WebSocket proxy dengan payload |
| **Adblock DNS** | Blokir iklan & tracker di level DNS (AdGuard-style) |
| **App Blocker** | Blokir aplikasi (Facebook, TikTok, YouTube) dengan jadwal |

---

## 📊 20. QoS Management ✨ *BARU*

| Fitur | Deskripsi |
|-------|-----------|
| **Priority Levels** | Atur prioritas (Highest, High, Normal, Low) |
| **Traffic Rules** | Buat aturan berdasarkan aplikasi atau perangkat |
| **Bandwidth Allocation** | Alokasi persentase upload/download |
| **Preset Profiles** | Gaming Mode, Work From Home, Streaming Mode |
| **Toggle Status** | Aktifkan/nonaktifkan rule dengan satu klik |

---

## 🔄 21. UPnP Management ✨ *BARU*

| Fitur | Deskripsi |
|-------|-----------|
| **UPnP Toggle** | Aktifkan/nonaktifkan Universal Plug and Play |
| **Secure Mode** | Mode aman untuk batasi UPnP requests |
| **Active Rules** | Lihat daftar port mapping aktif |
| **Rule Management** | Hapus atau toggle rule individual |
| **Security Warnings** | Peringatan tentang risiko keamanan UPnP |

---

## ⚙️ 22. System Management (Sistem) ✨ *BARU*

| Fitur | Deskripsi |
|-------|-----------|
| **Firmware Update** | Cek dan install update firmware router |
| **Version Tracking** | Lacak versi firmware saat ini |
| **Flash Progress** | Progress bar saat proses flash |
| **Changelog** | Daftar perubahan per versi |
| **Full Backup** | Backup seluruh konfigurasi router |
| **Network Backup** | Backup konfigurasi jaringan saja |
| **Restore Config** | Restore dari file backup JSON |
| **Download/Upload** | Export dan import file backup |

---

## 🚪 23. Captive Portal ✨ *BARU*

| Fitur | Deskripsi |
|-------|-----------|
| **Content Editor** | Atur judul, subtitle, welcome message, logo |
| **Design Customization** | Kustomisasi warna background, primary, text |
| **Live Preview** | Preview real-time tampilan portal |
| **Password Auth** | Login dengan password WiFi |
| **Voucher Auth** | Login menggunakan kode voucher |
| **Social Login** | Login via Facebook, Google, dll |
| **Email Auth** | Login dengan verifikasi email |
| **Session Timeout** | Atur durasi sesi login (menit) |
| **Redirect URL** | URL redirect setelah login berhasil |
| **Statistics** | Statistik login harian, total users, active sessions |

---

## 🌐 24. Load Balancing (Multi-WAN) ✨ *BARU*

| Fitur | Deskripsi |
|-------|-----------|
| **Multiple WAN** | Kelola beberapa koneksi internet sekaligus |
| **Weighted Mode** | Distribusi traffic berdasarkan bobot |
| **Failover Mode** | Backup otomatis saat koneksi utama down |
| **Round-Robin** | Distribusi bergantian antar WAN |
| **Least-Connections** | Prioritas ke koneksi paling sedikit beban |
| **Health Check** | Monitoring kesehatan setiap koneksi |
| **Failover Threshold** | Batas kegagalan sebelum switch |
| **Interface Management** | Tambah, hapus, edit WAN interface |
| **Status Monitoring** | Online/Offline/Standby per interface |
| **Speed & Latency** | Tampilkan Mbps dan ms per koneksi |
| **Traffic Distribution** | Grafik distribusi traffic antar WAN |

---

## 🔄 25. MAC Cloning ✨ *BARU*

| Fitur | Deskripsi |
|-------|-----------|
| **Interface Selection** | Pilih WAN atau LAN interface |
| **Current MAC** | Tampilkan MAC address saat ini |
| **Random Generator** | Generate MAC address acak |
| **Custom MAC Input** | Input MAC address manual |
| **Apply MAC** | Terapkan MAC baru ke interface |
| **Reset to Original** | Kembalikan ke MAC asli |
| **Per-Interface Toggle** | Aktifkan/nonaktifkan per interface |
| **Use Case Info** | Penjelasan kapan perlu MAC cloning |

---

## 🔀 26. VLAN Management ✨ *BARU*

| Fitur | Deskripsi |
|-------|-----------|
| **Create VLAN** | Buat Virtual LAN dengan ID unik (1-4094) |
| **VLAN Name** | Nama deskriptif untuk identifikasi |
| **Interface Assignment** | Assign ke LAN atau WAN interface |
| **IP Configuration** | Set IP address untuk VLAN |
| **Subnet Mask** | Konfigurasi subnet (/24, /16, dll) |
| **Tagged/Untagged** | Toggle VLAN tagging (802.1Q) |
| **Color Labels** | Warna identifikasi per VLAN |
| **Enable/Disable** | Toggle VLAN aktif/nonaktif |
| **Edit VLAN** | Ubah konfigurasi VLAN existing |
| **Delete VLAN** | Hapus VLAN yang tidak dibutuhkan |
| **Statistics** | Total, active, dan tagged VLAN count |

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
4. **Power Users** - VPN, Proxy, VLAN, dan konfigurasi lanjutan
5. **Network Engineers** - Load balancing, QoS, firewall management

---

## 🛠️ Teknologi

### Frontend
- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Capacitor (Android wrapper)
- Recharts (Charts & Graphs)
- Lucide React (Icons)

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
| `/api/traffic` | Statistik traffic jaringan |
| `/api/vouchers` | CRUD voucher system |
| `/api/firewall` | Kelola firewall rules |
| `/api/qos` | Konfigurasi QoS |
| `/api/vlan` | Manajemen VLAN |

---

## 🧭 Struktur Navigasi

Total **26 menu** dalam bottom navigation:

1. Beranda (Home)
2. Perangkat (Devices)
3. WiFi (Settings)
4. Keamanan (Security)
5. Jadwal (Schedule)
6. Optimasi (Optimization)
7. Tagihan (Billing)
8. Bandwidth (Limiter)
9. Voucher (System)
10. QR Code
11. DNS
12. Grup Device (Grouping)
13. Monitor (Usage)
14. Speedtest
15. Guest WiFi
16. Traffic (Statistics)
17. Kontrol (VPN, Proxy, Adblock, App Blocker)
18. Port Fwd
19. Firewall
20. QoS
21. UPnP
22. Sistem (Firmware/Backup)
23. Portal (Captive)
24. Multi-WAN (Load Balance)
25. MAC Clone
26. VLAN

---

*Dokumentasi ini dibuat otomatis berdasarkan fitur yang terImplementasi di KendaliNet v2.0*
