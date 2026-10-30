# DESIGN.md - Design System & UI/UX Guidelines

## 1. Warna Utama (Color Palette)
Aplikasi wajib menggunakan palet warna "Soft & Fresh Cyan/Teal" berikut secara konsisten di seluruh komponen Tailwind:
- Primary Bright: `#09BAED` (Gunakan untuk tombol utama, active state, dan icon utama).
- Secondary / Hover: `#08A0C9` (Gunakan untuk hover state tombol atau border aktif).
- Accent: `#067FA1` (Gunakan untuk badge, highlight teks penting, atau progress bar).
- Dark Contrast: `#055F78` (Gunakan untuk sub-heading atau latar sekunder).
- Deep Navy: `#033F4F` (Gunakan untuk teks utama/headings agar kontras terbaca jelas).
- Background: `#F4FBFC` (Warna latar halaman yang lembut/soft).

## 2. Tipografi & Font
- Font Family: `Plus Jakarta Sans`, atau fallback ke `system-ui, -apple-system, sans-serif`.
- Ukuran Teks:
  - Heading 1 (Title): `text-2xl font-bold text-[#033F4F]`
  - Heading 2 (Section): `text-lg font-semibold text-[#055F78]`
  - Body Text: `text-sm text-[#055F78]/80`

## 3. Komponen & Aturan UI (Strict Rules untuk AI Anggota Tim)
Agar AI anggota tim tidak ngawur atau membuat desain melenceng, ikuti aturan wajib berikut:
- **Border Radius:** Gunakan `rounded-2xl` atau `rounded-xl` untuk card, modal, dan button agar terlihat modern dan ramah (soft UI).
- **Shadow:** Gunakan `shadow-sm` atau `shadow-md` dengan nuansa tipis, hindari drop-shadow yang terlalu hitam pekat.
- **Layout Container:** Setiap halaman harus dibungkus dalam container maksimal ukuran mobile (`max-w-md mx-auto` atau card terpusat) dengan padding `p-6` agar rapi dilihat dari browser PC maupun HP.
- **State Kosong & Loading:** Setiap komponen interaktif wajib memiliki state loading sederhana dan penanganan error text jika input kosong. Jangan biarkan tombol bisa diklik saat form belum valid.
