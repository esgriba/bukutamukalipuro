"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function DetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log detailed error information for debugging
    console.error("Admin detail error:", error);
    console.error("Error message:", error.message);
    console.error("Error name:", error.name);
    console.error("Error digest:", error.digest);
    console.error("Error stack:", error.stack);

    // Report error to any monitoring service if available
    // e.g. if (typeof window !== 'undefined' && window.errorReporter) window.errorReporter(error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link
                href="/admin"
                className="text-blue-600 hover:underline flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Kembali ke Daftar Tamu
              </Link>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-red-200">
              <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                <h1 className="text-2xl font-bold text-red-700">
                  Gagal Memuat Detail Tamu
                </h1>
              </div>

              <div className="p-6">
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                  <p className="font-medium">
                    Terjadi kesalahan saat mengambil data tamu.
                  </p>
                  <p className="text-sm mt-1">
                    {error.message || "Kesalahan tidak diketahui"}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-red-500 mt-1">
                      Reference ID: {error.digest}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => reset()}
                    className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Coba Lagi
                  </button>
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                      Kemungkinan Penyebab
                    </h2>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Data tamu tidak ditemukan atau telah dihapus</li>
                      <li>Koneksi ke database terputus</li>
                      <li>Parameter ID tidak valid atau bukan format angka</li>
                      <li>Kesalahan konfigurasi pada Supabase</li>
                      <li>Environment variables tidak diatur dengan benar</li>
                      <li>Error pada API saat mengambil data detail</li>
                    </ul>
                  </div>

                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                      Langkah-langkah Diagnosa
                    </h2>
                    <div className="space-y-3">
                      <Link
                        href="/admin/diagnostic"
                        className="block w-full bg-indigo-100 text-indigo-800 px-4 py-2 rounded hover:bg-indigo-200 transition-colors text-center"
                      >
                        Cek Diagnostik Sistem
                      </Link>
                      <Link
                        href="/admin/debug"
                        className="block w-full bg-yellow-100 text-yellow-800 px-4 py-2 rounded hover:bg-yellow-200 transition-colors text-center"
                      >
                        Uji Koneksi Database
                      </Link>
                      <Link
                        href="/admin/supabase-test"
                        className="block w-full bg-blue-100 text-blue-800 px-4 py-2 rounded hover:bg-blue-200 transition-colors text-center"
                      >
                        Uji Koneksi Supabase
                      </Link>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                      Langkah Pemecahan Masalah
                    </h2>
                    <ul className="list-decimal list-inside space-y-1 text-gray-600">
                      <li>
                        Kembali ke daftar tamu dan pilih entri yang berbeda
                      </li>
                      <li>Periksa konfigurasi Supabase dan koneksi database</li>
                      <li>
                        <Link
                          href="/admin/debug"
                          className="text-blue-600 hover:underline"
                        >
                          Buka halaman diagnostik
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/admin/network-monitor"
                          className="text-blue-600 hover:underline"
                        >
                          Periksa status koneksi jaringan
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
