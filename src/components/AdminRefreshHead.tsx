"use client";

import { useState, useEffect } from "react";

export default function AdminRefreshHead() {
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [nextRefresh, setNextRefresh] = useState<number>(30);
  const [countDown, setCountDown] = useState<number>(30);

  // Set up timer to count down to next refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          // Refresh the page without using meta refresh
          window.location.reload();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    setLastRefresh(new Date());

    // Clean up
    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleManualRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="bg-yellow-50 p-3 rounded-md mb-4 border border-yellow-300">
      <div className="flex flex-wrap justify-between items-center">
        <p className="text-yellow-800 text-sm">
          Data akan disegarkan otomatis setiap 30 detik.
          <span className="font-semibold ml-1">
            Refresh berikutnya dalam: {countDown} detik
          </span>
        </p>
        <div>
          <button
            onClick={handleManualRefresh}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
          >
            Refresh Sekarang
          </button>
        </div>
      </div>

      {lastRefresh && (
        <p className="text-xs text-yellow-600 mt-1">
          Terakhir disegarkan: {lastRefresh.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
