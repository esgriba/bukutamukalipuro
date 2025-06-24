"use client";

import { useState, useEffect } from "react";

export default function AdminDataStatus() {
  const [status, setStatus] = useState<{
    lastCheck: Date | null;
    dataCount: number | null;
    hasError: boolean;
    message: string;
  }>({
    lastCheck: null,
    dataCount: null,
    hasError: false,
    message: "Memeriksa status data...",
  });

  useEffect(() => {
    checkDataStatus();

    // Check status every 1 minute
    const interval = setInterval(checkDataStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  const checkDataStatus = async () => {
    try {
      const timestamp = Date.now();
      const response = await fetch(`/api/guestbook?limit=1&_t=${timestamp}`, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();

      setStatus({
        lastCheck: new Date(),
        dataCount: data.total || 0,
        hasError: false,
        message: `Koneksi database aktif. Total data: ${data.total || 0}.`,
      });
    } catch (err: any) {
      setStatus({
        lastCheck: new Date(),
        dataCount: null,
        hasError: true,
        message: `Error: ${err.message}`,
      });
    }
  };

  return (
    <div
      className={`text-sm p-2 rounded ${
        status.hasError
          ? "bg-red-50 text-red-700"
          : "bg-green-50 text-green-700"
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            status.hasError ? "bg-red-500" : "bg-green-500"
          }`}
        ></div>
        <p>{status.message}</p>
      </div>
      {status.lastCheck && (
        <p className="text-xs mt-1 opacity-75">
          Last checked: {status.lastCheck.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
