# 💧 Water Reminder

Aplikasi web untuk memantau dan mengingatkan konsumsi air harian kamu. Dengan desain neobrutalist yang modern dan integrasi cloud database, Water Reminder membantu kamu tetap terhidrasi dengan optimal.

## ✨ Fitur Utama

### 🏠 Dashboard Utama
- Progress bar dinamis dengan indikator warna (merah, kuning, biru, hijau)
- Tombol quick add untuk mencatat konsumsi air (+100ml, +250ml, +500ml)
- Status jadwal reminder real-time
- Sinkronisasi otomatis ke cloud database

### 🧮 Kalkulator Kebutuhan Air
- Hitung kebutuhan air harian berdasarkan berat badan
- Pilihan tingkat aktivitas (normal/aktif)
- Formula EFSA (European Food Safety Authority)
- Rekomendasi konsumsi dalam ml dan jumlah gelas

### ⏰ Jadwal Reminder Fleksibel
- Set waktu mulai dan selesai reminder
- Interval waktu yang bisa disesuaikan (30 menit - 4 jam)
- Notifikasi toast dengan suara water drop
- Kontrol on/off jadwal

### 🔐 Autentikasi & Profil
- Login dengan Google OAuth
- Setup profil personal (nama, berat badan, target air)
- Data tersimpan secara aman di cloud
- Multi-device sync

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS v4** - Styling framework
- **Neobrutalist Design** - Design system

### Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication (Google OAuth)
  - Row Level Security (RLS)
  - Real-time sync

### Deployment
- **Vercel** - Hosting & CI/CD
- **GitHub** - Version control

## 🎨 Design System

**Color Palette:**
- Primary: `#09BAED` (Cyan)
- Secondary: `#08A0C9`, `#067FA1`
- Accent: `#055F78`
- Dark: `#033F4F`
- Light BG: `#EAF8FD`
- Border: `#BFE9F5`

**Progress Bar Colors:**
- 🔴 0-39%: `#FB7185` (Pink)
- 🟡 40-69%: `#FACC15` (Yellow)
- 🔵 70-99%: `#09BAED` (Blue)
- 🟢 100%+: `#22C55E` (Green)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm atau yarn
- Supabase account
- Google Cloud Console (untuk OAuth)

### Installation

1. **Clone repository:**
```bash
git clone https://github.com/Greeezzz/Water-Reminder.git
cd Water-Reminder
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment variables:**
Buat file `.env` di root folder:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. **Run development server:**
```bash
npm run dev
```

5. **Buka di browser:**
```
http://localhost:5173
```

### Database Setup

Run SQL script di Supabase SQL Editor:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  weight NUMERIC NOT NULL,
  target_water NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Water logs table
CREATE TABLE water_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schedules table
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own profile"
ON profiles FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage own logs"
ON water_logs FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own schedules"
ON schedules FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

## 📦 Build & Deploy

### Build production:
```bash
npm run build
```

### Deploy to Vercel:
```bash
npm install -g vercel
vercel --prod
```

Atau push ke GitHub dan connect dengan Vercel untuk auto-deployment.

**Live Demo:** https://water-reminder-seven.vercel.app

## 👥 Contributors

Proyek kolaboratif dari tim Water Reminder:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Greeezzz">
        <img src="https://github.com/Greeezzz.png" width="100px;" alt="Chelo"/><br />
        <sub><b>Chelo (Greeezzz)</b></sub>
      </a><br />
      <sub>UI/UX Design, OAuth Integration, Dashboard</sub>
    </td>
    <td align="center">
      <a href="https://github.com/ikavibes">
        <img src="https://github.com/ikavibes.png" width="100px;" alt="Akmal"/><br />
        <sub><b>Akmal</b></sub>
      </a><br />
      <sub>Kalkulator Air & Logika Input</sub>
    </td>
    <td align="center">
      <a href="https://github.com/keyshafebriyanti7-creator">
        <img src="https://github.com/keyshafebriyanti7-creator.png" width="100px;" alt="Keysha"/><br />
        <sub><b>Keysha</b></sub>
      </a><br />
      <sub>Setup Jadwal Fleksibel</sub>
    </td>
    <td align="center">
      <a href="https://github.com/salsabila388sasa-stack">
        <img src="https://github.com/salsabila388sasa-stack.png" width="100px;" alt="Salsabila"/><br />
        <sub><b>Salsabila</b></sub>
      </a><br />
      <sub>UI Notifikasi Toast & Audio</sub>
    </td>
  </tr>
</table>

## 📄 License

MIT License - bebas digunakan untuk keperluan personal maupun komersial.

## 🙏 Acknowledgments

- Design inspiration: Neobrutalism movement
- Water intake formula: EFSA (European Food Safety Authority)
- Icons: Heroicons
- Hosting: Vercel
- Backend: Supabase

---

**Dibuat dengan 💙 oleh Tim Water Reminder**

Jaga kesehatan dengan tetap terhidrasi! 💧
