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
      <h2 className="text-lg font-semibold mb-4">Admin Tools</h2>{" "}
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
        <Link
          href="/admin/supabase-test"
          className={`${linkClasses(
            "/admin/supabase-test"
          )} bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-300`}
        >
          Test Supabase
        </Link>{" "}
        <Link
          href="/admin/api-test"
          className={`${linkClasses(
            "/admin/api-test"
          )} bg-green-100 hover:bg-green-200 text-green-800 border border-green-300`}
        >
          API Test
        </Link>{" "}
        <Link
          href="/admin/network-monitor"
          className={`${linkClasses(
            "/admin/network-monitor"
          )} bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-300`}
        >
          Network Monitor
        </Link>
        <Link
          href="/admin/diagnostic"
          className={`${linkClasses(
            "/admin/diagnostic"
          )} bg-red-100 hover:bg-red-200 text-red-800 border border-red-300`}
        >
          System Diagnostic
        </Link>
      </nav>
    </div>
  );
}
