"use client";

import { useEffect } from "react";
import AdminNav from "@/components/AdminNav";

export default function AdminRefreshHead() {
  // Add a refresh meta tag dynamically
  useEffect(() => {
    // Create a meta tag to refresh the page every 30 seconds
    const metaRefresh = document.createElement("meta");
    metaRefresh.httpEquiv = "refresh";
    metaRefresh.content = "30"; // Refresh every 30 seconds
    document.head.appendChild(metaRefresh);

    // Clean up
    return () => {
      document.head.removeChild(metaRefresh);
    };
  }, []);

  return (
    <div className="bg-yellow-50 p-3 rounded-md mb-4 border border-yellow-300">
      <p className="text-yellow-800 text-sm">
        Halaman ini akan menyegarkan data secara otomatis setiap 30 detik untuk
        memastikan data terbaru.
        <button
          onClick={() => window.location.reload()}
          className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
        >
          Refresh Sekarang
        </button>
      </p>
    </div>
  );
}
