"use client";

import React from "react";
import Link from "next/link";

interface SupabaseSetupGuideProps {
  error?: any;
}

export default function SupabaseSetupGuide({ error }: SupabaseSetupGuideProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-500">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Konfigurasi Supabase Storage Diperlukan
      </h2>

      <div className="prose max-w-none">
        <p className="text-gray-600 mb-4">
          File tidak dapat diunggah karena masalah izin di Supabase Storage.
          Untuk menyelesaikan masalah ini, Anda perlu mengatur kebijakan
          Row-Level Security (RLS) di dashboard Supabase.
        </p>

        <h3 className="text-lg font-medium text-gray-700 mt-4 mb-2">
          Langkah-langkah perbaikan:
        </h3>

        <ol className="list-decimal pl-5 space-y-2 text-gray-600">
          <li>
            Login ke{" "}
            <a
              href="https://app.supabase.com"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              dashboard Supabase
            </a>
          </li>
          <li>Pilih project yang Anda gunakan untuk aplikasi ini</li>
          <li>
            Di sidebar kiri, klik <strong>Storage</strong>
          </li>
          <li>
            Pastikan bucket{" "}
            <code className="bg-gray-100 px-1 py-0.5 rounded">dokumentasi</code>{" "}
            sudah dibuat. Jika belum, buat bucket baru dengan nama tersebut dan
            aktifkan opsi <strong>Public bucket</strong>
          </li>
          <li>
            Klik tab <strong>Policies</strong> di bagian atas
          </li>
          <li>
            Tambahkan policy untuk <strong>Upload</strong>:
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto mt-1">
              CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT
              TO public WITH CHECK (bucket_id = 'dokumentasi')
            </pre>
          </li>
          <li>
            Tambahkan policy untuk <strong>Download</strong>:
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto mt-1">
              CREATE POLICY "Allow public downloads" ON storage.objects FOR
              SELECT TO public USING (bucket_id = 'dokumentasi')
            </pre>
          </li>
        </ol>

        <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
          <p className="text-blue-700">
            Untuk panduan lengkap dengan screenshot, lihat dokumentasi kami
            tentang{" "}
            <Link
              href="/docs/supabase-storage-setup.md"
              className="font-medium underline"
            >
              mengatur Supabase Storage
            </Link>
            .
          </p>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
            <h4 className="font-medium text-gray-700 mb-1">Detail Error:</h4>
            <pre className="text-xs overflow-x-auto whitespace-pre-wrap text-red-600">
              {typeof error === "string"
                ? error
                : JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
