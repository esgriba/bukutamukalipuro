"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/AdminNav";
import ServerDebugInfo from "@/components/ServerDebugInfo";

interface ApiStatus {
  endpoint: string;
  status: "success" | "error" | "loading";
  responseTime: number;
  message?: string;
}

export default function AdminDiagnosticPage() {
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkApiEndpoints() {
      const endpoints = [
        "/api/guestbook",
        "/api/guestbook/debug",
        "/api/guestbook/test-connection",
      ];

      setLoading(true);

      const results = await Promise.all(
        endpoints.map(async (endpoint) => {
          const status: ApiStatus = {
            endpoint,
            status: "loading",
            responseTime: 0,
          };

          try {
            const startTime = performance.now();
            const response = await fetch(endpoint, {
              cache: "no-store",
              headers: {
                "x-requested-with": "AdminDiagnosticPage",
              },
            });
            const endTime = performance.now();

            status.responseTime = Math.round(endTime - startTime);

            if (response.ok) {
              status.status = "success";
              status.message = `OK (${response.status})`;
            } else {
              status.status = "error";
              status.message = `Error: ${response.status} ${response.statusText}`;
            }
          } catch (error) {
            status.status = "error";
            status.message =
              error instanceof Error ? error.message : "Unknown error";
          }

          return status;
        })
      );

      setApiStatuses(results);
      setLoading(false);
    }

    checkApiEndpoints();

    // Set an interval to refresh the API statuses
    const intervalId = setInterval(() => {
      checkApiEndpoints();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">System Diagnostic</h1>

      <AdminNav />

      <div className="mt-8 grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Server Status</h2>
          <ServerDebugInfo showDetails={true} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">API Endpoints Status</h2>

          {loading ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
              <span className="ml-2">Loading API statuses...</span>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Endpoint
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Response Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {apiStatuses.map((status) => (
                  <tr key={status.endpoint}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {status.endpoint}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {status.status === "success" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Success
                        </span>
                      ) : status.status === "error" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Error
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Loading
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {status.responseTime ? `${status.responseTime}ms` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {status.message || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setApiStatuses([])}
              className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Environment Variables Check
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Variable
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { name: "DATABASE_URL", publicName: "DATABASE_URL" },
                  { name: "DIRECT_URL", publicName: "DIRECT_URL" },
                  {
                    name: "NEXT_PUBLIC_SUPABASE_URL",
                    publicName: "NEXT_PUBLIC_SUPABASE_URL",
                  },
                  {
                    name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
                    publicName: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
                  },
                  {
                    name: "NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET",
                    publicName: "NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET",
                  },
                ].map((variable) => (
                  <tr key={variable.name}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {variable.publicName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {variable.name.startsWith("NEXT_PUBLIC_") ? (
                        typeof window !== "undefined" &&
                        (window as any).process?.env?.[variable.name] ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Configured
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Not Configured
                          </span>
                        )
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Server-side only
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Server-side environment variables can only be verified through
                  the Server Debug Info above.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
