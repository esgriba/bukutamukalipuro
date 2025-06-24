# Panduan Konfigurasi Supabase Storage untuk Buku Tamu Digital

Dokumen ini berisi panduan langkah demi langkah untuk mengatur Supabase Storage dengan benar untuk aplikasi Buku Tamu Digital Kecamatan Kalipuro.

## Masalah: Kebijakan Keamanan Row-Level Security (RLS)

Jika Anda melihat error seperti ini:

```json
{
  "success": false,
  "message": "Bucket exists but upload failed",
  "bucketCheck": {
    "success": false,
    "error": "Failed to create bucket: new row violates row-level security policy"
  },
  "uploadError": {
    "statusCode": "403",
    "error": "Unauthorized",
    "message": "new row violates row-level security policy"
  }
}
```

Ini berarti bahwa kunci anonim Supabase tidak memiliki izin yang diperlukan untuk membuat atau menulis ke bucket penyimpanan karena kebijakan Row-Level Security (RLS).

## Penyebab Masalah

Aplikasi ini menggunakan dua jenis operasi Supabase Storage:

1. **Operasi Administratif** - seperti pemeriksaan bucket, pembuatan bucket, atau daftar bucket yang memerlukan izin tingkat admin
2. **Operasi File** - upload, download, atau hapus file yang dapat diatur dengan kebijakan RLS

Kunci anonim Supabase (ANON KEY) yang digunakan di frontend **tidak memiliki izin admin**, sehingga operasi administratif akan gagal dengan error 403 kecuali kebijakan RLS dikonfigurasi dengan benar.

## Solusi yang Diimplementasikan

Dalam versi terbaru aplikasi, kami telah:

1. Memodifikasi upload API untuk tetap bekerja meskipun pemeriksaan bucket gagal
2. Menambahkan fallback ke penyimpanan lokal jika upload Supabase gagal
3. Meningkatkan penanganan error untuk memberikan informasi lebih jelas

## Langkah-langkah Perbaikan

### 1. Login ke Dashboard Supabase

- Buka [https://app.supabase.com](https://app.supabase.com)
- Login dengan akun Anda
- Pilih project yang digunakan untuk aplikasi Buku Tamu Digital

### 2. Buat Bucket Storage

- Di sidebar kiri, klik "Storage"
- Klik tombol "New Bucket"
- Masukkan nama bucket: `dokumentasi`
- Aktifkan opsi "Public bucket" untuk mengizinkan akses publik
- Klik "Create bucket"

### 3. Konfigurasi Row-Level Security (RLS) untuk Bucket

- Masih di halaman Storage, klik tab "Policies" di bagian atas
- Pilih bucket "dokumentasi" dari dropdown

#### Tambahkan Policy untuk Upload (INSERT)

1. Klik tombol "Add Policy" atau "New Policy"
2. Pilih template "For full customization" atau opsi kustom
3. Berikan nama policy: "Allow public uploads"
4. Untuk "Policy definition", gunakan:
   ```sql
   (bucket_id = 'dokumentasi')
   ```
5. Untuk "Roles", pilih "public" atau "authenticated" sesuai kebutuhan
6. Di bagian "Operations", pilih "INSERT"
7. Simpan policy

#### Tambahkan Policy untuk Download (SELECT)

1. Klik tombol "Add Policy" lagi
2. Pilih template "For full customization" atau opsi kustom
3. Berikan nama policy: "Allow public downloads"
4. Untuk "Policy definition", gunakan:
   ```sql
   (bucket_id = 'dokumentasi')
   ```
5. Untuk "Roles", pilih "public" atau "authenticated" sesuai kebutuhan
6. Di bagian "Operations", pilih "SELECT"
7. Simpan policy

#### (Opsional) Tambahkan Policy untuk Update dan Delete

Jika aplikasi Anda membutuhkan kemampuan untuk memperbarui atau menghapus file:

1. Ikuti langkah-langkah serupa untuk membuat policy baru
2. Pilih operation "UPDATE" atau "DELETE"
3. Pertimbangkan untuk membatasi ini hanya untuk peran "authenticated" untuk keamanan

### 4. Periksa Kembali Environment Variables

Pastikan file `.env.local` memiliki nilai-nilai yang benar:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=dokumentasi
```

### 5. Test Konfigurasi

Setelah mengonfigurasi policies, kunjungi endpoint testing:

```
http://localhost:3000/api/admin/test-bucket
```

Atau gunakan form Buku Tamu untuk mengunggah file.

## Troubleshooting

### Error 403 saat Upload

Jika Anda masih mendapatkan error 403 saat mengupload file:

1. **Periksa RLS Policy** - Pastikan policy untuk INSERT sudah benar
2. **Periksa Bucket Name** - Pastikan bucket name di policy dan di kode sama (case sensitive)
3. **Gunakan Endpoint Direct Upload** - Endpoint `/api/direct-upload` lebih sederhana dan tidak memerlukan izin administratif
4. **Reset Bucket** - Coba hapus dan buat ulang bucket melalui dashboard

### Masalah Konfigurasi pada Aplikasi yang Di-deploy

Jika aplikasi berjalan baik di lokal tetapi gagal saat di-deploy:

1. Pastikan variabel lingkungan sudah dikonfigurasi dengan benar di platform hosting Anda
2. Jangan gunakan kunci anonim di server side jika memungkinkan (gunakan service role key sebagai gantinya)
3. Periksa bahwa URL Supabase dan Key yang digunakan valid

### Debugging Tools

Aplikasi menyediakan beberapa endpoint untuk debugging:

- `/api/admin/test-bucket` - Test bucket dan upload kebijakan
- `/api/debug-supabase` - Lihat konfigurasi Supabase dan status koneksi
- `/admin/storage-test` - UI untuk menguji berbagai operasi penyimpanan
