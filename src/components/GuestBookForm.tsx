"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Swal from "sweetalert2";
// Daftar desa dan kelurahan di Kecamatan Kalipuro
const desaKelurahanList = [
  "Desa Bulusari",
  "Desa Kelir",
  "Desa Ketapang",
  "Desa Pesucen",
  "Desa Telemung",
  "Kelurahan Bulusan",
  "Kelurahan Gombengsari",
  "Kelurahan Kalipuro",
  "Kelurahan Klatak",
];

const formSchema = z.object({
  nama: z.string().min(2, { message: "Nama harus diisi minimal 2 karakter" }),
  nik: z
    .string()
    .length(16, { message: "NIK harus terdiri dari 16 digit" })
    .regex(/^\d+$/, { message: "NIK hanya boleh berisi angka" }),
  desaKelurahan: z.string().min(1, { message: "Desa/Kelurahan harus diisi" }),
  alamat: z.string().min(5, { message: "Alamat lengkap harus diisi" }),
  noTelepon: z
    .string()
    .min(10, { message: "No telepon minimal 10 digit" })
    .max(15, { message: "No telepon maksimal 15 digit" })
    .regex(/^\d+$/, { message: "No telepon hanya boleh berisi angka" }),
  keperluan: z
    .string()
    .min(5, { message: "Keperluan harus diisi minimal 5 karakter" }),
  // Use any type for file uploads since FileList is not available in SSR
  dokumentasiPelayanan: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function GuestBookForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      nik: "",
      desaKelurahan: "",
      alamat: "",
      noTelepon: "",
      keperluan: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // Upload file to Supabase or local storage as fallback if a file is selected
      let dokumentasiUrl = null;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        try {
          // First attempt with Supabase (our preferred method)
          console.log("Uploading file to Supabase:", selectedFile.name);
          try {
            // Try the standard upload API which now has better fallback handling
            const supabaseResponse = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });

            let supabaseResult;
            try {
              supabaseResult = await supabaseResponse.json();
            } catch (parseError) {
              console.error(
                "Failed to parse Supabase response as JSON:",
                parseError
              );
              throw new Error("Failed to parse upload response");
            }

            // Check if Supabase upload was successful
            if (supabaseResponse.ok && supabaseResult && supabaseResult.url) {
              console.log("Supabase upload successful:", supabaseResult);
              dokumentasiUrl = supabaseResult.url;
              // We have a successful upload, no need for fallback
            } else {
              // If we have errors from Supabase, log them in detail
              console.error(
                "Supabase upload failed with status:",
                supabaseResponse.status,
                "Response:",
                supabaseResult
              );

              // Here we'll throw to trigger the fallback
              throw new Error(
                supabaseResult?.error || "Supabase upload failed"
              );
            }
          } catch (supabaseError) {
            // If Supabase failed for any reason, try local upload as fallback
            console.warn(
              "Using local upload as fallback after Supabase failure"
            );
            console.error("Original Supabase error:", supabaseError);

            // Try local upload as fallback
            console.log(
              "Uploading file locally as fallback:",
              selectedFile.name
            );
            const localUploadResponse = await fetch("/api/local-upload", {
              method: "POST",
              body: formData,
            });

            let localUploadResult;
            try {
              localUploadResult = await localUploadResponse.json();
            } catch (parseError) {
              console.error(
                "Failed to parse local upload response as JSON:",
                parseError
              );
              throw new Error("Failed to parse local upload response");
            }

            if (!localUploadResponse.ok) {
              console.error("Local upload error:", localUploadResult);
              throw new Error(
                localUploadResult?.error || "Failed to upload file locally"
              );
            }

            console.log(
              "Local upload successful (fallback):",
              localUploadResult
            );
            dokumentasiUrl = localUploadResult.url;

            // Show warning that file is only stored locally
            await Swal.fire({
              icon: "warning",
              title: "Peringatan",
              text: "File disimpan secara lokal karena upload ke Supabase tidak berhasil",
              showCancelButton: false,
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Lanjutkan",
              footer: "File tetap akan disimpan di server lokal",
            });
          }
        } catch (uploadError: any) {
          console.error("File upload error:", uploadError);
          await Swal.fire({
            icon: "error",
            title: "Upload Gagal",
            text: `File tidak dapat diunggah: ${uploadError.message}. Form akan tetap disimpan tanpa dokumentasi.`,
            confirmButtonColor: "#d33",
            confirmButtonText: "Lanjutkan",
          });
          // Continue form submission without the file
        }
      } // Submit form data to API
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: data.nama,
          nik: data.nik,
          desaKelurahan: data.desaKelurahan,
          alamat: data.alamat,
          noTelepon: data.noTelepon,
          keperluan: data.keperluan,
          dokumentasiPelayanan: dokumentasiUrl,
        }),
      });

      // Debug untuk Vercel
      console.log("API response status:", response.status);

      let responseData;
      try {
        responseData = await response.json();
        console.log("API response data:", responseData);
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
      }

      if (!response.ok) {
        console.error("Form submission error:", responseData);
        throw new Error(
          responseData?.error || `Failed with status ${response.status}`
        );
      } // Show success notification with SweetAlert2
      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: dokumentasiUrl
          ? `Data dan dokumentasi berhasil disimpan! Terima kasih ${data.nama} telah mengunjungi Kantor Kecamatan Kalipuro.`
          : `Data berhasil disimpan! Terima kasih ${data.nama} telah mengunjungi Kantor Kecamatan Kalipuro.`,
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
        // You can uncomment this once you have a check-mark.gif file in the public directory
        // backdrop: `
        //   rgba(0,123,255,0.2)
        //   url("/check-mark.gif")
        //   left top
        //   no-repeat
        // `,
      });

      reset();
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Error submitting form:", error);

      await Swal.fire({
        icon: "error",
        title: "Gagal",
        html: `
            <div>
              <p>Gagal menyimpan data: ${error.message}</p>
              <p class="mt-2 text-sm">Silakan periksa koneksi internet Anda dan coba kembali.</p>
              <p class="mt-2 text-sm">Jika masalah berlanjut, hubungi administrator sistem.</p>
            </div>
          `,
        confirmButtonColor: "#d33",
        confirmButtonText: "Coba Lagi",
        footer:
          '<a href="/api/guestbook/debug" target="_blank">Cek Status Koneksi Database</a>',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Formulir Buku Tamu
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Kolom dengan tanda <span className="text-red-600">*</span> wajib diisi
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="nama"
              className="block text-sm font-semibold text-gray-800 mb-1"
            >
              Nama Lengkap <span className="text-red-600">*</span>
            </label>
            <input
              id="nama"
              type="text"
              placeholder="Masukkan nama lengkap"
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white hover:border-blue-400 ${
                errors.nama ? "border-red-500" : "border-gray-400"
              }`}
              {...register("nama")}
            />
            {errors.nama && (
              <p className="mt-1 text-sm text-red-600">{errors.nama.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="nik"
              className="block text-sm font-semibold text-gray-800 mb-1"
            >
              NIK <span className="text-red-600">*</span>
            </label>
            <input
              id="nik"
              type="text"
              placeholder="Masukkan 16 digit NIK"
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white hover:border-blue-400 ${
                errors.nik ? "border-red-500" : "border-gray-400"
              }`}
              {...register("nik")}
              maxLength={16}
            />
            {errors.nik && (
              <p className="mt-1 text-sm text-red-600">{errors.nik.message}</p>
            )}
          </div>{" "}
          <div>
            <label
              htmlFor="desaKelurahan"
              className="block text-sm font-semibold text-gray-800 mb-1"
            >
              Desa/Kelurahan <span className="text-red-600">*</span>
            </label>{" "}
            <select
              id="desaKelurahan"
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white hover:border-blue-400 ${
                errors.desaKelurahan ? "border-red-500" : "border-gray-400"
              }`}
              {...register("desaKelurahan")}
            >
              <option value="">-- Pilih Desa/Kelurahan --</option>
              {desaKelurahanList.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.desaKelurahan && (
              <p className="mt-1 text-sm text-red-600">
                {errors.desaKelurahan.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="noTelepon"
              className="block text-sm font-semibold text-gray-800 mb-1"
            >
              Nomor Telepon <span className="text-red-600">*</span>
            </label>
            <input
              id="noTelepon"
              type="text"
              placeholder="Masukkan nomor telepon"
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white hover:border-blue-400 ${
                errors.noTelepon ? "border-red-500" : "border-gray-400"
              }`}
              {...register("noTelepon")}
            />
            {errors.noTelepon && (
              <p className="mt-1 text-sm text-red-600">
                {errors.noTelepon.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="alamat"
            className="block text-sm font-semibold text-gray-800 mb-1"
          >
            Alamat Lengkap (RT/RW/Dusun) <span className="text-red-600">*</span>
          </label>
          <input
            id="alamat"
            type="text"
            placeholder="Masukkan alamat lengkap (RT/RW/Dusun)"
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white hover:border-blue-400 ${
              errors.alamat ? "border-red-500" : "border-gray-400"
            }`}
            {...register("alamat")}
          />
          {errors.alamat && (
            <p className="mt-1 text-sm text-red-600">{errors.alamat.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="keperluan"
            className="block text-sm font-semibold text-gray-800 mb-1"
          >
            Keperluan <span className="text-red-600">*</span>
          </label>
          <textarea
            id="keperluan"
            rows={3}
            placeholder="Jelaskan keperluan Anda"
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white hover:border-blue-400 ${
              errors.keperluan ? "border-red-500" : "border-gray-400"
            }`}
            {...register("keperluan")}
          ></textarea>
          {errors.keperluan && (
            <p className="mt-1 text-sm text-red-600">
              {errors.keperluan.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="dokumentasiPelayanan"
            className="block text-sm font-semibold text-gray-800 mb-1"
          >
            Dokumentasi Pelayanan
          </label>{" "}
          <input
            id="dokumentasiPelayanan"
            type="file"
            accept="image/*"
            onChange={(e) => {
              handleFileChange(e);
              // Register file with react-hook-form
              register("dokumentasiPelayanan").onChange(e);
            }}
            className="w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white hover:border-blue-400"
          />{" "}
          <p className="mt-1 text-sm text-gray-600">
            Unggah foto dokumentasi pelayanan (opsional)
          </p>
          {selectedFile && (
            <p className="mt-1 text-sm text-green-600">
              File dipilih: {selectedFile.name}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-base font-bold shadow-md ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Data"}
          </button>
        </div>
      </form>
    </div>
  );
}
