import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

// Endpoint untuk menguji koneksi database dengan kredensial yang diberikan secara manual
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      DATABASE_URL,
      DIRECT_URL,
      SUPABASE_URL,
      SUPABASE_KEY,
      BUCKET_NAME,
    } = body;

    // Validasi input
    if (!DATABASE_URL || !DIRECT_URL || !SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json(
        {
          error: "Parameter tidak lengkap",
        },
        { status: 400 }
      );
    }

    // Log untuk debugging (hilangkan password dari log)
    console.log("Testing connection with:", {
      DATABASE_URL: DATABASE_URL.replace(/:[^:@]+@/, ":***@"),
      DIRECT_URL: DIRECT_URL.replace(/:[^:@]+@/, ":***@"),
      SUPABASE_URL,
      SUPABASE_KEY: SUPABASE_KEY.substring(0, 10) + "...",
      BUCKET_NAME,
    });

    // 1. Test koneksi Prisma
    let prismaResult = "Failed";
    try {
      const prisma = new PrismaClient({
        datasources: {
          db: {
            url: DATABASE_URL,
          },
        },
      });

      // Coba query sederhana
      const count = await prisma.guestEntry.count();
      prismaResult = `Success - ${count} entries found`;

      // Disconnect prisma
      await prisma.$disconnect();
    } catch (prismaError: any) {
      console.error("Prisma connection error:", prismaError);
      return NextResponse.json(
        {
          error: "Koneksi Prisma gagal",
          details: prismaError.message,
        },
        { status: 500 }
      );
    }

    // 2. Test koneksi Supabase
    let supabaseResult = "Failed";
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

      // Coba query bucket
      const bucketName = BUCKET_NAME || "dokumentasi";
      const { data, error } = await supabase.storage.getBucket(bucketName);

      if (error) throw error;
      supabaseResult = `Success - Bucket ${data.name} found`;
    } catch (supabaseError: any) {
      console.error("Supabase connection error:", supabaseError);
      return NextResponse.json(
        {
          error: "Koneksi Supabase gagal",
          details: supabaseError.message,
        },
        { status: 500 }
      );
    }

    // Jika sampai di sini, berarti kedua koneksi berhasil
    return NextResponse.json({
      message: "Koneksi berhasil!",
      details: {
        prisma: prismaResult,
        supabase: supabaseResult,
      },
    });
  } catch (error: any) {
    console.error("Test connection error:", error);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan pada server",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
