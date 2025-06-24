import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// API endpoint untuk debugging koneksi database
export async function GET() {
  try {
    // Cek koneksi database dengan query sederhana
    const count = await prisma.guestEntry.count();

    // Dapatkan informasi environment (jangan tampilkan nilai sensitif)
    const envInfo = {
      DATABASE_URL: process.env.DATABASE_URL
        ? "Terkonfigurasi"
        : "Tidak terkonfigurasi",
      DIRECT_URL: process.env.DIRECT_URL
        ? "Terkonfigurasi"
        : "Tidak terkonfigurasi",
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET:
        process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET,
      NODE_ENV: process.env.NODE_ENV,
    };

    // Test mencoba membuat data dummy (tidak disimpan)
    const testData = {
      nama: "Test User",
      nik: "1234567890123456",
      desaKelurahan: "Test Desa",
      alamat: "Test Alamat",
      noTelepon: "081234567890",
      keperluan: "Test Keperluan",
    };

    return NextResponse.json({
      status: "success",
      message: "Koneksi database berhasil",
      databaseInfo: {
        entryCount: count,
      },
      envInfo,
      testData,
    });
  } catch (error: any) {
    console.error("Error testing database connection:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Gagal menghubungi database",
        error: error.message,
        stack:
          process.env.NODE_ENV === "development"
            ? error.stack
            : "Hidden in production",
      },
      { status: 500 }
    );
  }
}
