# Buku Tamu Digital - Kantor Kecamatan Kalipuro

Website modern dan responsif untuk Kantor Kecamatan Kalipuro dengan fitur buku tamu digital. Dibangun dengan Next.js, Tailwind CSS, Supabase, dan Prisma.

## Fitur Utama

- **Halaman Beranda**: Menampilkan informasi tentang Kecamatan Kalipuro
- **Formulir Buku Tamu**: Mengumpulkan informasi pengunjung termasuk:
  - Nama
  - NIK
  - Desa/Kelurahan
  - Alamat Lengkap (RT/RW/Dusun)
  - No Telepon
  - Keperluan
  - Tanggal Pelayanan (otomatis)
  - Dokumentasi Pelayanan (upload foto opsional)
- **Admin Dashboard**: Mengelola dan melihat data tamu yang telah diisi
  - Daftar tamu dengan paginasi dan pencarian
  - Halaman detail untuk melihat informasi lengkap
  - Fitur ekspor data

## Teknologi

- **Frontend**: Next.js 15 dengan TypeScript dan App Router
- **Styling**: Tailwind CSS 4
- **Form Handling**: React Hook Form dengan validasi Zod
- **Database**: PostgreSQL (melalui Supabase)
- **ORM**: Prisma 6
- **Storage**: Supabase Storage untuk upload gambar
- **Notifications**: React Hot Toast

## Setup dan Instalasi

### Prasyarat

- Node.js (v20+)
- npm atau yarn
- Akun Supabase (untuk database dan storage)

### Langkah Instalasi

1. Clone repository

   ```
   git clone https://github.com/username/buku-tamu-nextjs.git
   cd buku-tamu-nextjs
   ```

2. Install dependencies

   ```
   npm install
   # atau
   yarn install
   ```

3. Setup environment variables

   - Copy file `.env.example` menjadi `.env.local`
   - Isi dengan kredensial Supabase dan database Anda

4. Setup Supabase Storage

   - Login ke [dashboard Supabase](https://app.supabase.com/)
   - Pilih atau buat project baru
   - Di sidebar, pilih "Storage"
   - Klik "Create a new bucket" dan beri nama "dokumentasi"
   - Set bucket ke "Public" untuk memungkinkan akses publik ke file
   - Di "Settings" > "API", salin URL dan anon/public key
   - Update file `.env.local` dengan nilai-nilai tersebut

5. Setup database dengan Prisma

   ```
   npx prisma migrate dev --name init
   ```

6. Jalankan development server

   ```
   npm run dev
   # atau
   yarn dev
   ```

7. Buka [http://localhost:3000](http://localhost:3000) di browser Anda

## Struktur Proyek

```
buku-tamu-nextjs/
├── prisma/              # Prisma schema dan migrations
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── admin/       # Admin routes
│   │   ├── api/         # API routes
│   │   └── buku-tamu/   # Buku tamu page
│   ├── components/      # Shared components
│   └── lib/             # Utility functions and clients
├── .env                 # Environment variables
└── .env.example         # Example environment variables
```

## API Endpoints

- **POST /api/guestbook**: Membuat entri tamu baru
- **GET /api/guestbook**: Mendapatkan daftar tamu dengan pagination
- **GET /api/guestbook/:id**: Mendapatkan detail tamu berdasarkan ID
- **PUT /api/guestbook/:id**: Update data tamu
- **DELETE /api/guestbook/:id**: Menghapus data tamu
- **POST /api/upload**: Upload file ke Supabase Storage
- **POST /api/local-upload**: Upload file ke penyimpanan lokal (fallback)

## Troubleshooting

### Masalah Upload File ke Supabase

1. **File hanya disimpan secara lokal tetapi tidak ke Supabase**

   - Pastikan kredensial Supabase sudah benar di `.env.local`
   - Periksa apakah bucket "dokumentasi" telah dibuat di Supabase Storage
   - Pastikan bucket memiliki izin publik (Public)
   - Periksa konsol browser untuk melihat error yang terjadi

2. **Kesalahan Permission**

   - Pastikan anon key memiliki izin untuk membaca dan menulis ke Storage
   - Di dashboard Supabase, pergi ke Authentication > Policies dan periksa kebijakan untuk bucket "dokumentasi"

3. **File Terlalu Besar**

   - Supabase memiliki batasan ukuran file, coba kompres gambar sebelum upload

4. **Upload Timeout**
   - Peningkatan timeout pada API route atau gunakan chunked upload untuk file besar

### Masalah Umum

1. **Migrations Error**

   - Pastikan database PostgreSQL berjalan
   - Periksa string koneksi DATABASE_URL di `.env.local`
   - Coba `npx prisma db push` untuk memaksa skema tanpa migrations

2. **Komponen Error di Browser**
   - Pastikan semua komponen yang menggunakan state telah menambahkan "use client" di bagian atas file
   - Periksa console browser untuk melihat error React yang spesifik

- **DELETE /api/guestbook/:id**: Hapus data tamu
- **POST /api/upload**: Upload file dokumentasi

## Deployment

Proyek ini siap untuk di-deploy ke layanan seperti Vercel atau Netlify. Pastikan untuk mengatur environment variables yang sesuai pada platform deployment.

```bash
# Build untuk produksi
npm run build
# atau
yarn build
```

## Panduan Troubleshooting

Dokumentasi troubleshooting lengkap tersedia untuk membantu mengatasi masalah umum:

- [Troubleshooting Database](docs/troubleshooting-database.md) - Mengatasi masalah koneksi database dan caching
- [Troubleshooting Server Exception](docs/troubleshooting-server-exceptions.md) - Mengatasi error server-side pada admin detail page
- [Panduan Setup Supabase Storage](docs/supabase-storage-setup.md) - Konfigurasi untuk upload file
- [Panduan Vercel Deployment](docs/vercel-deployment.md) - Instruksi deployment ke Vercel

### Fitur Diagnostik

Aplikasi ini dilengkapi dengan alat diagnostik untuk membantu troubleshooting:

- `/admin/diagnostic` - Menampilkan status sistem secara menyeluruh
- `/admin/debug` - Diagnosa koneksi database
- `/admin/supabase-test` - Uji koneksi Supabase
- `/admin/api-test` - Uji endpoint API
- `/admin/network-monitor` - Monitor respons API dan status cache

## Lisensi

MIT
