"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminNav from "@/components/AdminNav";

export default function NetworkMonitorPage() {
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  const testApiEndpoint = async () => {
    setLoading(true);

    try {
      // Make a request and track how long it takes
      const startTime = performance.now();
      const timestamp = Date.now();

      const response = await fetch(`/api/guestbook?_t=${timestamp}`, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      const endTime = performance.now();
      const responseTime = endTime - startTime;

      const data = await response.json();
      const headers: Record<string, string> = {};

      // Convert headers to an object for easy display
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      setResponses((prev) => [
        {
          timestamp: new Date().toISOString(),
          status: response.status,
          statusText: response.statusText,
          responseTime: responseTime.toFixed(2) + "ms",
          dataCount: data.data?.length || 0,
          hasData: !!data.data,
          headers,
          url: response.url,
          ok: response.ok,
          type: response.type,
        },
        ...prev.slice(0, 9), // Keep only the last 10 entries
      ]);
    } catch (err: any) {
      setResponses((prev) => [
        {
          timestamp: new Date().toISOString(),
          error: err.message,
          type: "Error",
        },
        ...prev.slice(0, 9),
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle auto-refresh
  useEffect(() => {
    if (autoRefresh && !refreshInterval) {
      const interval = window.setInterval(() => {
        testApiEndpoint();
      }, 5000); // Every 5 seconds

      setRefreshInterval(interval);
    } else if (!autoRefresh && refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }

    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [autoRefresh, refreshInterval]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Network Monitor
            </h1>

            <AdminNav />

            <div className="bg-white shadow-md rounded-lg p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">
                API Response Monitor
              </h2>
              <p className="mb-4 text-gray-700">
                Tool ini membantu memeriksa respons dari endpoint API dan
                mengidentifikasi masalah caching atau koneksi database.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                <button
                  onClick={testApiEndpoint}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {loading ? "Testing..." : "Test Endpoint Now"}
                </button>

                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`px-4 py-2 ${
                    autoRefresh
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white rounded-md transition-colors`}
                >
                  {autoRefresh
                    ? "Stop Auto Refresh"
                    : "Start Auto Refresh (5s)"}
                </button>
              </div>

              {/* Results table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Response Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data Count
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cache Headers
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {responses.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-4 text-center text-gray-500"
                        >
                          No responses recorded yet. Click Test Endpoint to
                          start.
                        </td>
                      </tr>
                    ) : (
                      responses.map((resp, index) => (
                        <tr
                          key={index}
                          className={resp.error ? "bg-red-50" : ""}
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {resp.timestamp}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {resp.error ? (
                              <span className="text-red-600">
                                Error: {resp.error}
                              </span>
                            ) : (
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  resp.status >= 200 && resp.status < 300
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {resp.status} {resp.statusText}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {resp.responseTime}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {resp.dataCount !== undefined ? (
                              <span
                                className={`font-semibold ${
                                  resp.dataCount > 0
                                    ? "text-green-600"
                                    : "text-yellow-600"
                                }`}
                              >
                                {resp.dataCount}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {resp.headers && resp.headers["cache-control"] ? (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                {resp.headers["cache-control"]}
                              </span>
                            ) : (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                No Cache-Control
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Detailed information for the latest response */}
              {responses.length > 0 && (
                <div className="mt-8 border-t pt-4">
                  <h3 className="text-lg font-medium mb-2">
                    Latest Response Details
                  </h3>
                  <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                    <pre className="text-sm">
                      {JSON.stringify(responses[0], null, 2)}
                    </pre>
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
