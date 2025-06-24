"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminNav from "@/components/AdminNav";

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const testApi = async () => {
    setLoading(true);
    setError(null);

    try {
      // Test GET /api/guestbook with cache-busting parameter
      const timestamp = Date.now();
      const response = await fetch(`/api/guestbook?_t=${timestamp}`, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      const data = await response.json();

      // Submit test data
      const testData = {
        nama: `Test User ${new Date().toISOString()}`,
        nik: "1234567890123456",
        desaKelurahan: "Desa Test",
        alamat: "Jl Test RT/RW 01/02",
        noTelepon: "081234567890",
        keperluan: "API Test - " + new Date().toISOString(),
      };

      const postResponse = await fetch("/api/guestbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
        body: JSON.stringify(testData),
      });

      const postResult = await postResponse.json();

      // Fetch the data again to see if our entry was saved
      const responseAfter = await fetch(`/api/guestbook?_t=${Date.now()}`, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      const dataAfter = await responseAfter.json();

      setTestResults({
        initialGet: {
          status: response.status,
          data: data,
        },
        post: {
          status: postResponse.status,
          data: postResult,
        },
        afterGet: {
          status: responseAfter.status,
          data: dataAfter,
        },
      });
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menguji API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              API Test Tool
            </h1>

            <AdminNav />

            <div className="bg-white shadow-md rounded-lg p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Test API Endpoints</h2>
              <p className="mb-4 text-gray-700">
                Klik tombol di bawah untuk melakukan test pada API endpoint.
                Tool ini akan mencoba mengambil data, mengirim data baru, dan
                mengambil data lagi untuk memastikan data tersimpan dengan
                benar.
              </p>

              <div className="flex gap-2 mb-8">
                <button
                  onClick={testApi}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {loading ? "Testing..." : "Test API Endpoints"}
                </button>

                <button
                  onClick={() => router.refresh()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Refresh Page
                </button>
              </div>

              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                  <p className="font-bold">Error</p>
                  <p>{error}</p>
                </div>
              )}

              {loading && (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}

              {testResults && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Initial GET Result
                    </h3>
                    <div className="bg-gray-100 p-4 rounded-md">
                      <p>Status: {testResults.initialGet.status}</p>
                      <p>
                        Total Entries:{" "}
                        {testResults.initialGet.data.data?.length || 0}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">POST Result</h3>
                    <div className="bg-gray-100 p-4 rounded-md">
                      <p>Status: {testResults.post.status}</p>
                      <p>
                        Success:{" "}
                        {testResults.post.status === 201 ? "✅ Yes" : "❌ No"}
                      </p>
                      {testResults.post.data?.id && (
                        <p>Created Entry ID: {testResults.post.data.id}</p>
                      )}
                      {testResults.post.data?.error && (
                        <p className="text-red-600">
                          Error: {testResults.post.data.error}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      After POST GET Result
                    </h3>
                    <div className="bg-gray-100 p-4 rounded-md">
                      <p>Status: {testResults.afterGet.status}</p>
                      <p>
                        Total Entries:{" "}
                        {testResults.afterGet.data.data?.length || 0}
                      </p>
                      <p>
                        New Entry Found:{" "}
                        {testResults.post.data?.id &&
                        testResults.afterGet.data.data?.some(
                          (entry: any) => entry.id === testResults.post.data.id
                        )
                          ? "✅ Yes"
                          : "❌ No"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Analysis</h3>
                    {testResults.post.status === 201 &&
                    testResults.afterGet.data.data?.some(
                      (entry: any) => entry.id === testResults.post.data.id
                    ) ? (
                      <div className="bg-green-100 text-green-800 p-4 rounded-md">
                        <p className="font-bold">✅ Test Passed Successfully</p>
                        <p>
                          Data berhasil disimpan ke database dan terbaca kembali
                          dengan benar.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-red-100 text-red-800 p-4 rounded-md">
                        <p className="font-bold">❌ Test Failed</p>
                        <p>
                          {testResults.post.status !== 201
                            ? "Data gagal disimpan ke database. Periksa log error di Vercel."
                            : "Data tidak terbaca setelah disimpan. Kemungkinan masalah caching atau database."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
