# Deployment Guide - Water Reminder

## Prerequisites
- Supabase project sudah setup dengan:
  - Google OAuth enabled
  - Tables: `profiles`, `water_logs`, `schedules`
  - Environment variables ready

## Vercel Deployment Steps

### 1. Push ke GitHub
```bash
git add .
git commit -m "feat: add Google OAuth authentication"
git push origin main
```

### 2. Import Project ke Vercel
- Login ke https://vercel.com
- New Project → Import dari GitHub
- Pilih repository `Water-Reminder`
- Framework Preset: **Vite**

### 3. Set Environment Variables di Vercel
Dashboard → Project → Settings → Environment Variables

Tambahkan 2 variable ini:

```
VITE_SUPABASE_URL=https://[your-project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
```

**Cara dapet nilai:**
- Login Supabase Dashboard
- Project Settings → API
- Copy **Project URL** → paste ke `VITE_SUPABASE_URL`
- Copy **anon/public key** → paste ke `VITE_SUPABASE_ANON_KEY`

### 4. Deploy
- Klik **Deploy**
- Tunggu build selesai (~2-3 menit)
- Vercel kasih URL: `https://water-reminder-xxx.vercel.app`

### 5. Update Google OAuth Redirect
- Google Cloud Console → Credentials
- Edit OAuth Client ID
- **Authorized redirect URIs** → Tambah:
  ```
  https://[your-project-ref].supabase.co/auth/v1/callback
  https://water-reminder-xxx.vercel.app
  ```
- Save

### 6. Update Supabase Site URL
- Supabase Dashboard → Authentication → URL Configuration
- **Site URL**: `https://water-reminder-xxx.vercel.app`
- **Redirect URLs**: Tambah `https://water-reminder-xxx.vercel.app/**`

## Testing
1. Buka URL Vercel kamu
2. Klik "Masuk dengan Google"
3. Login → Setup profile
4. Tambah konsumsi air
5. Cek Supabase Dashboard → Table Editor → `water_logs` (data harus masuk!)

## Troubleshooting

### Error: "Invalid redirect URL"
- Pastikan redirect URL di Google Console sama persis dengan Supabase callback URL
- Cek Site URL di Supabase Auth settings

### Error: "Missing environment variables"
- Vercel → Settings → Environment Variables
- Pastikan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` ada
- Redeploy setelah tambah env vars

### Data tidak tersimpan ke Supabase
- Buka browser Console (F12)
- Lihat error message
- Biasanya RLS policy issue → cek Supabase policies di table `water_logs`

## File Changes Summary
```
New files:
- src/contexts/AuthContext.jsx (Auth state management)
- src/components/LoginPage.jsx (Google OAuth login)
- src/components/SetupProfile.jsx (First-time profile setup)

Modified files:
- src/App.jsx (Auth routing & protection)
- src/components/Dashboard.jsx (Supabase sync dengan user_id)
```

## Production Checklist
- [x] Google OAuth configured
- [x] Supabase tables created
- [x] Environment variables set
- [x] Auth flow tested
- [x] Data persistence tested
- [ ] RLS policies enabled (security!)
- [ ] Custom domain (optional)
