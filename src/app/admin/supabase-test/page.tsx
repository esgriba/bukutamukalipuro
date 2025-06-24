"use client";

import { useState } from "react";
import AdminNav from "@/components/AdminNav";
import SupabaseConnectionTest from "@/components/SupabaseConnectionTest";

export default function SupabaseTestPage() {
  const [envVariables, setEnvVariables] = useState({
    DATABASE_URL: "",
    DIRECT_URL: "",
    SUPABASE_URL: "",
    SUPABASE_KEY: "",
    BUCKET_NAME: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  // Handler untuk form input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEnvVariables((prev) => ({ ...prev, [name]: value }));
  };

  // Handler untuk test koneksi manual
  const handleManualTest = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setErrorMessage("");
      const response = await fetch("/api/guestbook/test-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(envVariables),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Test koneksi gagal");
      }

      const data = await response.json();
      alert(data.message || "Koneksi berhasil!");
    } catch (error: any) {
      console.error("Test koneksi error:", error);
      setErrorMessage(
        error.message || "Terjadi kesalahan saat menguji koneksi"
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Testing Database Supabase</h1>
      <AdminNav />

      {/* Test koneksi otomatis */}
      <SupabaseConnectionTest />

      {/* Troubleshooting Guide */}
      <div className="mt-8 p-4 bg-white shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          Panduan Pemecahan Masalah
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-lg">
              Jika Data Tidak Tersimpan ke Supabase:
            </h3>
            <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1 mt-2">
              <li>
                Pastikan semua variabel lingkungan sudah dikonfigurasi dengan
                benar di Vercel
              </li>
              <li>Periksa format DATABASE_URL dan DIRECT_URL</li>
              <li>
                Periksa apakah RLS policy Supabase sudah mengizinkan operasi
                INSERT
              </li>
              <li>
                Cek log di Vercel Functions untuk melihat error yang spesifik
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg">
              Jika Data di Admin Dashboard Tidak Sesuai dengan Supabase:
            </h3>
            <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1 mt-2">
              <li>Refresh browser atau tekan tombol "Refresh Data" di atas</li>
              <li>
                Pastikan format respons API sesuai dengan ekspektasi komponen
              </li>
              <li>Periksa log Vercel untuk kesalahan pada endpoint GET</li>
              <li>
                Coba gunakan "Test Submit Data Baru" di atas untuk menguji
                koneksi
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Test Manual Connection */}
      <div className="mt-8 p-4 bg-white shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Test Koneksi Manual</h2>

        {errorMessage && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleManualTest} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DATABASE_URL
            </label>
            <input
              type="text"
              name="DATABASE_URL"
              value={envVariables.DATABASE_URL}
              onChange={handleInputChange}
              placeholder="postgresql://postgres.[project-ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DIRECT_URL
            </label>
            <input
              type="text"
              name="DIRECT_URL"
              value={envVariables.DIRECT_URL}
              onChange={handleInputChange}
              placeholder="postgresql://postgres.[project-ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SUPABASE_URL
              </label>
              <input
                type="text"
                name="SUPABASE_URL"
                value={envVariables.SUPABASE_URL}
                onChange={handleInputChange}
                placeholder="https://[project-ref].supabase.co"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SUPABASE_ANON_KEY
              </label>
              <input
                type="text"
                name="SUPABASE_KEY"
                value={envVariables.SUPABASE_KEY}
                onChange={handleInputChange}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5c..."
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              BUCKET_NAME
            </label>
            <input
              type="text"
              name="BUCKET_NAME"
              value={envVariables.BUCKET_NAME}
              onChange={handleInputChange}
              placeholder="dokumentasi"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test Koneksi Manual
            </button>
          </div>
        </form>
      </div>

      {/* Dokumentasi */}
      <div className="mt-8 text-center">
        <a
          href="/docs/troubleshooting-database.md"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Baca Dokumentasi Lengkap Troubleshooting Database
        </a>
      </div>
    </div>
  );
}
