# PRD: Water Reminder (Product Requirement Document)

## 1. Deskripsi Produk
Water Reminder adalah aplikasi berbasis web (React.js + Vite + Tailwind CSS) untuk membantu pengguna mencatat, menghitung, dan mengingatkan konsumsi air harian secara fleksibel.

## 2. Fitur Utama & Pembagian Tugas Anggota
Anggota tim dapat memberikan dokumen PRD ini ke AI (seperti ChatGPT/Claude) untuk panduan koding mandiri.

### A. Akmal: Halaman Input Data Diri & Kalkulator Air (Fitur 1)
- **Tujuan:** Membuat form input berat badan, jenis kelamin, dan tingkat aktivitas.
- **Logika Perhitungan:** 
  - `Total Air (ml) = Berat Badan (kg) * Multiplier` (Multiplier: 30 untuk normal, 40 untuk aktif).
- **Output:** Menyimpan hasil kebutuhan air ke `localStorage` / state global agar bisa dibaca halaman lain.

### B. Keysha: Halaman Setup Jadwal Fleksibel & Tombol Kontrol (Fitur 2)
- **Tujuan:** Membuat interface penentuan jam mulai dan jam selesai minum air harian secara mandiri (tanpa paksaan sistem).
- **Logika:** 
  - User pilih jam mulai (misal 08:00) dan jam selesai (22:00).
  - Sistem membagi interval waktu secara bertahap (misal tiap 2 jam sekali).
  - Menyediakan tombol "Mulai Jadwal" dan "Stop Jadwal" yang mengubah status aktif/non-aktif.

### C. Salsabila: Komponen UI Notifikasi Pop-up (Toast) & Audio (Fitur 3)
- **Tujuan:** Membuat komponen pemberitahuan (toast/pop-up) di layar mirip WhatsApp.
- **Fitur Tambahan:** 
  - Memutar file audio dering (beep/water drop sound) saat notifikasi muncul.
  - Tombol aksi di dalam pop-up (contoh: "Sudah Minum" atau "Tunda 10 Menit").

### D. Inyaa: Halaman Dashboard Utama, Rekap Harian, & Integrasi Supabase
- **Tujuan:** Menggabungkan semua fitur (Hitung Air, Jadwal, Notifikasi) ke satu halaman Dashboard utama.
- **Fitur:**
  - Progress bar melingkar atau persentase air yang sudah diminum hari ini.
  - Tombol tambah konsumsi air manual (+250ml).
  - Integrasi sinkronisasi data ke Supabase (backend disiapkan oleh Ketua).

---

## 3. Panduan Alur Kerja (Workflow) untuk Anggota Tim
Setiap anggota wajib mengikuti langkah terminal/git berikut setelah repo dibuat oleh Ketua:

1. **Clone Repository:**
   git clone https://github.com/Greeezzz/Water-Reminder.git
   cd Water-Reminder
   npm install

2. **Membuat Branch Kerja Masing-Masing:**
   - Akmal: `git checkout -b feature/akmal-kalkulator`
   - Keysha: `git checkout -b feature/keysha-jadwal`
   - Salsabila: `git checkout -b feature/salsabila-notif`
   - Inyaa: `git checkout -b feature/inyaa-dashboard`

3. **Menjalankan Development Server:**
   npm run dev

4. **Menyelesaikan Tugas & Push ke GitHub:**
   git add .
   git commit -m "feat: selesai bagian [nama fitur]"
   git push origin feature/[nama-branch-kamu]
   
5. **Membuat Pull Request (PR):**
   Buka GitHub, buat PR dari branch masing-masing ke branch `main` untuk direview oleh Ketua.
