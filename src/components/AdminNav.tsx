"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const linkClasses = (path: string) => {
    return `px-4 py-2 rounded-md ${
      isActive(path)
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Admin Tools</h2>

      <nav className="flex flex-wrap gap-2">
        <Link href="/admin" className={linkClasses("/admin")}>
          Dashboard
        </Link>
        <Link
          href="/admin/upload-test"
          className={linkClasses("/admin/upload-test")}
        >
          Upload Test
        </Link>
        <Link
          href="/admin/storage-test"
          className={linkClasses("/admin/storage-test")}
        >
          Storage Test
        </Link>
        <Link
          href="/admin/debug"
          className={`${linkClasses(
            "/admin/debug"
          )} bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border border-yellow-300`}
        >
          Diagnosa Database
        </Link>
      </nav>
    </div>
  );
}
