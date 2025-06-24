"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";

// Buat fungsi fetcher khusus untuk menghindari caching
const fetcher = async (url: string) => {
  const res = await fetch(url, {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
    next: { revalidate: 0 }, // Untuk Next.js App Router
  });

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.message = await res.text();
    throw error;
  }

  return res.json();
};

export default function TestSupabaseConnection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [directFetchResult, setDirectFetchResult] = useState<any>(null);

  // Gunakan SWR untuk fetching data
  const { data, error, mutate } = useSWR("/api/guestbook", fetcher, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
    dedupingInterval: 0,
  });

  // Test langsung ke Supabase menggunakan API debug
  const testDirectConnection = async () => {
    try {
      setIsSubmitting(true);

      const res = await fetch("/api/guestbook/debug", {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });
      const result = await res.json();
      setDirectFetchResult(result);
    } catch (err: any) {
      console.error("Error testing connection:", err);
      setDirectFetchResult({ error: err.message || "Unknown error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Test submit data ke Supabase
  const testSubmitData = async () => {
    try {
      setIsSubmitting(true);

      const testData = {
        nama: "Test User " + new Date().toISOString(),
        nik: "1234567890123456",
        desaKelurahan: "Desa Test",
        alamat: "Jl Test RT/RW 01/02",
        noTelepon: "081234567890",
        keperluan: "Testing at " + new Date().toTimeString(),
      };

      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      const result = await res.json();
      setTestResult({
        status: res.status,
        ok: res.ok,
        data: result,
      });

      // Penting! Perbarui data setelah submit
      if (res.ok) {
        mutate();
      }
    } catch (err: any) {
      console.error("Error submitting test:", err);
      setTestResult({ error: err.message || "Unknown error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Tes Koneksi dan Data</h2>

      <div className="space-y-6">
        {/* Status fetching data */}
        <div>
          <h3 className="font-medium mb-2">Status Fetching Data</h3>
          {error ? (
            <div className="bg-red-100 p-2 rounded text-red-700">
              Error: {error.message}
            </div>
          ) : !data ? (
            <div className="bg-yellow-100 p-2 rounded text-yellow-700">
              Memuat data...
            </div>
          ) : (
            <div className="bg-green-100 p-2 rounded text-green-700">
              Data berhasil diambil. Total: {data.total || "Tidak tersedia"}{" "}
              entries
            </div>
          )}
        </div>

        {/* Test submit data */}
        <div>
          <button
            onClick={testSubmitData}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
          >
            {isSubmitting ? "Processing..." : "Test Submit Data Baru"}
          </button>

          <button
            onClick={() => mutate()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 mr-2"
          >
            Refresh Data
          </button>

          <button
            onClick={testDirectConnection}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Cek Status Koneksi
          </button>

          {testResult && (
            <div className="mt-3 p-3 bg-gray-100 rounded overflow-auto max-h-60">
              <h4 className="font-medium mb-1">Test Submit Result:</h4>
              <div>
                <span className="font-medium">Status: </span>
                <span
                  className={testResult.ok ? "text-green-600" : "text-red-600"}
                >
                  {testResult.status} ({testResult.ok ? "SUCCESS" : "FAILED"})
                </span>
              </div>
              <pre className="mt-2 p-2 bg-gray-800 text-white text-sm rounded">
                {JSON.stringify(testResult.data || testResult.error, null, 2)}
              </pre>
            </div>
          )}

          {directFetchResult && (
            <div className="mt-3 p-3 bg-gray-100 rounded overflow-auto max-h-60">
              <h4 className="font-medium mb-1">Database Connection Status:</h4>
              <div>
                <span className="font-medium">Status: </span>
                <span
                  className={
                    directFetchResult.status === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {directFetchResult.status || "UNKNOWN"}
                </span>
              </div>
              <pre className="mt-2 p-2 bg-gray-800 text-white text-sm rounded">
                {JSON.stringify(directFetchResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Data preview */}
        <div>
          <h3 className="font-medium mb-2">Data Preview (5 terakhir)</h3>
          {data?.data && Array.isArray(data.data) ? (
            <div className="overflow-auto max-h-80">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Nama
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      NIK
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Desa
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Tanggal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.data.slice(0, 5).map((item: any) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 whitespace-nowrap">{item.id}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.nama}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.nik}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.desaKelurahan}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.data.length === 0 && (
                <p className="p-4 text-center text-gray-500">Tidak ada data</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Data tidak tersedia</p>
          )}
        </div>
      </div>
    </div>
  );
}
