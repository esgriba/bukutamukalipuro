# Notifikasi dengan SweetAlert2 di Buku Tamu Digital

Aplikasi ini menggunakan SweetAlert2 untuk menampilkan notifikasi yang menarik kepada pengguna. Berikut adalah panduan untuk menggunakan dan menyesuaikan notifikasi:

## Fitur Notifikasi

1. **Notifikasi Sukses** - Muncul ketika data berhasil disimpan
2. **Notifikasi Error** - Muncul ketika terjadi kesalahan
3. **Notifikasi Peringatan** - Muncul saat file diupload secara lokal karena Supabase gagal

## Cara Menggunakan

Seluruh implementasi notifikasi sudah terintegrasi di dalam komponen `GuestBookForm.tsx`. Notifikasi akan muncul secara otomatis pada kejadian yang sesuai.

## Kustomisasi

### Mengubah Animasi

Untuk menggunakan animasi kustom pada notifikasi sukses:

1. Buat file GIF atau animasi dengan nama `check-mark.gif`
2. Simpan di direktori `public/`
3. Buka file `GuestBookForm.tsx` dan uncomment bagian `backdrop` pada notifikasi sukses

```typescript
// Uncomment bagian ini:
backdrop: `
  rgba(0,123,255,0.2)
  url("/check-mark.gif")
  left top
  no-repeat
`,
```

### Generator Animasi

Untuk membuat file animasi check mark:

1. Buka file `public/check-mark-generator.html` di browser
2. Klik tombol "Generate & Download check-mark.gif"
3. Simpan file yang diunduh ke direktori `public/`

## Opsi Kustomisasi Lainnya

SweetAlert2 menyediakan banyak opsi kustomisasi. Berikut beberapa yang bisa diubah:

### Warna dan Tampilan

```typescript
Swal.fire({
  // Ubah warna tombol
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",

  // Tambahkan kelas CSS kustom
  customClass: {
    container: "my-swal-container",
    popup: "my-swal-popup",
    title: "my-swal-title",
    confirmButton: "my-swal-confirm-button",
  },
});
```

### Durasi dan Timer

```typescript
Swal.fire({
  // Mengontrol berapa lama notifikasi tampil (dalam milidetik)
  timer: 5000,

  // Menampilkan progress bar timer
  timerProgressBar: true,
});
```

### Mengubah Ikon

```typescript
Swal.fire({
  // Tersedia: 'success', 'error', 'warning', 'info', 'question'
  icon: "success",
});
```

## Dokumentasi Lengkap

Untuk dokumentasi lengkap SweetAlert2, kunjungi:
[https://sweetalert2.github.io/](https://sweetalert2.github.io/)
