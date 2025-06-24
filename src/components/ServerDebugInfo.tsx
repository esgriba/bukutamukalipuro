"use client";

import { useState, useEffect } from "react";

interface ServerDebugInfoProps {
  showDetails?: boolean;
}

interface DebugInfo {
  environment: string;
  nodeEnv: string;
  databaseUrl: string;
  databaseConnected: boolean;
  supabaseUrl: string;
  supabaseConnected: boolean;
  serverTime: string;
  lastChecked: string;
  error?: string;
}

export default function ServerDebugInfo({
  showDetails = false,
}: ServerDebugInfoProps) {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchDebugInfo = async () => {
    setLoading(true);
    setFetchError(null);

    try {
      const response = await fetch("/api/guestbook/debug", {
        cache: "no-store",
        headers: {
          "x-requested-with": "ServerDebugInfo",
        },
      });

      if (!response.ok) {
        throw new Error(
          `API returned status ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      setDebugInfo({
        ...data,
        lastChecked: new Date().toLocaleString(),
      });
    } catch (error) {
      console.error("Error fetching debug info:", error);
      setFetchError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebugInfo();

    // Set up an interval to refresh the data every 30 seconds
    const intervalId = setInterval(() => {
      fetchDebugInfo();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading && !debugInfo) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <p className="text-yellow-800">
            Loading server diagnostic information...
          </p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Failed to load server diagnostics: {fetchError}
            </p>
            <button
              onClick={fetchDebugInfo}
              className="mt-2 px-4 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!debugInfo) {
    return null;
  }

  const statusIndicator = (isConnected: boolean) =>
    isConnected ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Connected
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Disconnected
      </span>
    );

  return (
    <div className="bg-gray-50 border rounded-md p-4 my-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-gray-900">
          Server Diagnostic Info
        </h3>
        <span className="text-xs text-gray-500">
          Last checked: {debugInfo.lastChecked}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <p className="text-sm font-medium text-gray-700">Environment:</p>
          <p className="text-sm text-gray-600">
            {debugInfo.environment || "Unknown"}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Server Time:</p>
          <p className="text-sm text-gray-600">{debugInfo.serverTime}</p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">Database Status:</p>
          {statusIndicator(debugInfo.databaseConnected)}
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm font-medium text-gray-700">Supabase Status:</p>
          {statusIndicator(debugInfo.supabaseConnected)}
        </div>
      </div>

      {showDetails && (
        <div className="border-t border-gray-200 pt-3 mt-2">
          <p className="text-sm font-medium text-gray-700">
            Connection Details:
          </p>
          <div className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
            <pre className="text-xs text-gray-600">
              NODE_ENV: {debugInfo.nodeEnv || "Not set"}
              {"\n"}
              Database URL:{" "}
              {debugInfo.databaseUrl
                ? "******" + debugInfo.databaseUrl.slice(-15)
                : "Not set"}
              {"\n"}
              Supabase URL: {debugInfo.supabaseUrl || "Not set"}
              {debugInfo.error && `\nError: ${debugInfo.error}`}
            </pre>
          </div>
        </div>
      )}

      <div className="mt-3 flex justify-end">
        <button
          onClick={fetchDebugInfo}
          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
