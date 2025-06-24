# Troubleshooting Koneksi Database di Vercel

Panduan ini berisi langkah-langkah untuk memecahkan masalah ketika aplikasi berhasil di-deploy ke Vercel, tetapi data tidak tersimpan ke database Supabase.

## Masalah: Data tidak tersimpan ke database meskipun alert sukses muncul

### 1. Periksa Environment Variables di Vercel

Pastikan semua variabel lingkungan berikut sudah diatur di dashboard Vercel:

1. `DATABASE_URL` - Koneksi string PostgreSQL Supabase dengan format:

   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

2. `DIRECT_URL` - Koneksi langsung ke PostgreSQL dengan format:

   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
   ```

3. `NEXT_PUBLIC_SUPABASE_URL` - URL proyek Supabase, contoh:

   ```
   https://[project-ref].supabase.co
   ```

4. `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Kunci anonymous Supabase

5. `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` - Nama bucket storage, biasanya `dokumentasi`

### 2. Cek Status Koneksi Database

1. Akses endpoint `/api/guestbook/debug` untuk melihat status koneksi database
2. Akses halaman admin `/admin/debug` untuk melihat status dan melakukan test submit data

### 3. Periksa Log di Vercel

1. Buka dashboard Vercel
2. Pilih proyek Anda
3. Klik tab "Deployments"
4. Pilih deployment terakhir
5. Klik tab "Functions"
6. Cari dan klik pada fungsi API `/api/guestbook`
7. Periksa log untuk error

### 4. Masalah Umum dan Solusinya

#### Database URL tidak valid

- Pastikan format URL database sudah benar
- Periksa password dan credential lainnya
- Pastikan tidak ada spasi atau karakter khusus yang tidak terenkode

#### Row Level Security (RLS) Supabase

- Pastikan RLS policy sudah dikonfigurasi dengan benar
- Untuk API route, pastikan policy INSERT diaktifkan

#### Kesalahan Schema Prisma

- Jalankan `npx prisma generate` sebelum build
- Tambahkan script postinstall di package.json:
  ```json
  "postinstall": "prisma generate"
  ```

#### Timeout Database

- Periksa apakah database sleeping atau inactive
- Verifikasi koneksi database dari Vercel ke Supabase

#### Data Di Admin Tidak Sinkron Dengan Supabase

Jika halaman `/admin` tidak menampilkan data terbaru dari Supabase meski `/admin/debug` berjalan dengan baik:

1. **Masalah Caching**: Next.js mungkin melakukan caching pada halaman dan data. Pastikan:

   - Halaman menggunakan `export const dynamic = 'force-dynamic'`
   - Halaman menggunakan `export const revalidate = 0`
   - Komponen client menggunakan SWR dengan revalidasi yang tepat

2. **Solusi Untuk Admin Page**:

   - Ganti komponen `GuestList` dengan `GuestListSWR` yang menggunakan SWR
   - Pastikan setiap API request menyertakan header cache control
   - Tambahkan parameter timestamp pada URL API untuk mencegah caching

3. **Refresh Manual**: Tambahkan tombol "Refresh Data" di halaman admin

4. **Bersihkan Cache Browser**: Pengguna dapat mencoba:
   - Tekan Ctrl+F5 untuk refresh tanpa cache
   - Buka DevTools (F12) > Tab Network > Centang "Disable cache"

### 5. Menggunakan Local Storage sebagai Fallback

Jika masalah persisten dengan Supabase, pertimbangkan untuk menggunakan local storage sebagai fallback:

```typescript
// Simpan secara lokal jika API gagal
if (!response.ok) {
  // Simpan ke localStorage
  const localEntries = JSON.parse(localStorage.getItem("guestEntries") || "[]");
  const newEntry = {
    id: `local-${Date.now()}`,
    ...formData,
    createdAt: new Date().toISOString(),
  };
  localEntries.push(newEntry);
  localStorage.setItem("guestEntries", JSON.stringify(localEntries));

  // Tampilkan notifikasi
  alert("Data disimpan secara lokal karena server sedang bermasalah");
  return;
}
```

## Kontak Bantuan

Jika masalah tetap berlanjut, hubungi tim support teknis di:

- Email: admin@kecamatankalipuro.go.id
- Telepon: 08123456789
