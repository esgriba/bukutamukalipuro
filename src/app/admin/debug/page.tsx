"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";

export default function DebugPage() {
  const [databaseStatus, setDatabaseStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/guestbook/debug");
        const data = await response.json();
        setDatabaseStatus(data);
      } catch (err: any) {
        setError(
          err.message || "Terjadi kesalahan saat memeriksa koneksi database"
        );
      } finally {
        setLoading(false);
      }
    };

    checkDatabase();
  }, []);

  const testFormSubmission = async () => {
    try {
      setLoading(true);
      const testData = {
        nama: "Test User Debug",
        nik: "1234567890123456",
        desaKelurahan: "Desa Test",
        alamat: "Jl Test RT/RW 01/02",
        noTelepon: "081234567890",
        keperluan: "Testing database connection",
      };

      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      const result = await response.json();

      alert(
        response.ok
          ? `Berhasil menyimpan data uji: ID ${result.id || "tidak diketahui"}`
          : `Gagal: ${result.error || "Unknown error"}`
      );
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      // Refresh data
      router.refresh();
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Halaman Diagnostik Database</h1>

      <AdminNav />

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Info:</strong> Untuk diagnosa sistem yang lebih lengkap,
              kunjungi{" "}
              <Link href="/admin/diagnostic" className="font-medium underline">
                halaman diagnostik baru
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {loading && <p className="text-gray-600">Memuat data...</p>}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {databaseStatus && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Status Koneksi Database
            </h2>
            <div className="flex items-center mb-4">
              <div
                className={`w-4 h-4 rounded-full mr-2 ${
                  databaseStatus.status === "success"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              ></div>
              <p>
                {databaseStatus.status === "success"
                  ? "Terhubung"
                  : "Tidak Terhubung"}
              </p>
            </div>
            <p className="text-gray-700">{databaseStatus.message}</p>
          </div>

          {databaseStatus.status === "success" && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Informasi Database</h2>
              <p className="mb-2">
                Jumlah Entry: {databaseStatus.databaseInfo?.entryCount || 0}
              </p>
              <button
                onClick={testFormSubmission}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? "Memproses..." : "Test Submit Data"}
              </button>
            </div>
          )}

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Environment Variables
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Variable
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {databaseStatus.envInfo &&
                    Object.entries(databaseStatus.envInfo).map(
                      ([key, value]: [string, any]) => (
                        <tr key={key}>
                          <td className="border border-gray-300 px-4 py-2">
                            {key}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {typeof value === "boolean"
                              ? value
                                ? "Tersedia"
                                : "Tidak Tersedia"
                              : key.includes("URL") && typeof value === "string"
                              ? value.substring(0, 15) + "..."
                              : String(value || "Tidak Tersedia")}
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">
              Langkah-langkah untuk Perbaikan
            </h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Pastikan variabel lingkungan sudah dikonfigurasi dengan benar di
                Vercel
              </li>
              <li>Periksa koneksi database dengan Supabase</li>
              <li>Periksa kredensial koneksi database</li>
              <li>
                Pastikan Supabase RLS policy sudah dikonfigurasi dengan benar
              </li>
              <li>Periksa Schema Prisma</li>
            </ol>
          </div>
        </div>
      )}

      <div className="mt-8">
        <a
          href="/admin"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          Kembali ke Admin
        </a>
      </div>
    </div>
  );
}
