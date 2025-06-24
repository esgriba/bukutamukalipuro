# Panduan Deployment ke Vercel

Dokumen ini memberikan panduan langkah demi langkah untuk men-deploy aplikasi Buku Tamu Digital Kecamatan Kalipuro ke Vercel.

## Persiapan Sebelum Deployment

1. Pastikan repository sudah di-push ke GitHub
2. Pastikan Supabase project sudah siap dengan bucket dokumentasi yang sudah dibuat
3. Pastikan database Prisma sudah di-migrate di Supabase

## Langkah-langkah Deployment

### 1. Buat New Project di Vercel

- Login ke [Vercel](https://vercel.com/)
- Klik tombol "Add New" > "Project"
- Import repository GitHub yang berisi proyek ini
- Konfigurasikan project seperti di bawah ini

### 2. Konfigurasi Environment Variables

Tambahkan variabel lingkungan berikut di Vercel (Settings > Environment Variables):

```
DATABASE_URL=postgresql://postgres.ujjxluxutvyvzjwqrmxv:password123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.ujjxluxutvyvzjwqrmxv:password123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://ujjxluxutvyvzjwqrmxv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[supabase-anon-key-anda]
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=dokumentasi
```

> **Penting!** Jangan lupa untuk mengganti `[supabase-anon-key-anda]` dengan nilai key Supabase yang sebenarnya.

Pastikan untuk mengganti nilai-nilai dengan kredensial Supabase Anda yang sebenarnya.

### 3. Konfigurasi Build Command (opsional)

Jika perlu, Anda dapat mengubah Build Command di Settings:

Default: `npm run build`

### 4. Deploy Project

- Klik "Deploy" untuk memulai proses deployment
- Vercel akan menginstall dependencies, build project, dan deploy aplikasi

### 5. Troubleshooting

Jika terjadi error saat build:

1. **Error ESLint**: Sudah ditangani dengan konfigurasi `next.config.js`, tetapi jika masih bermasalah:

   - Tambahkan `NEXT_LINT=false` ke Environment Variables

2. **Error TypeScript**: Sudah ditangani dengan konfigurasi `typescript.ignoreBuildErrors` di `next.config.js`

   - Jika masih muncul error tipe, periksa file yang bermasalah dan sesuaikan tipenya

3. **Error Database**: Pastikan string koneksi database benar dan database dapat diakses dari Vercel

   - Pastikan Prisma generate dijalankan dengan menambahkan `npx prisma generate` dalam script build atau postinstall

4. **Error Supabase Storage**: Pastikan bucket sudah dibuat dan kebijakan (policy) sudah diatur dengan benar

### 6. Custom Domain (opsional)

- Di dashboard project Vercel, buka tab "Domains"
- Tambahkan domain kustom sesuai kebutuhan
- Ikuti petunjuk untuk mengkonfigurasi DNS

## Setelah Deployment

- Periksa aplikasi yang sudah di-deploy apakah berfungsi dengan baik
- Test fitur upload gambar dan pastikan berjalan dengan benar
- Periksa log di Vercel jika ada error yang perlu diperbaiki
