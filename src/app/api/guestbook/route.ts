import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkEnvVars } from "@/lib/validate-env";

export async function POST(request: Request) {
  try {
    // Check if environment variables are configured correctly
    const envCheck = checkEnvVars();
    if (!envCheck.valid) {
      console.error(
        `Missing required environment variables: ${envCheck.missing.join(", ")}`
      );
      return NextResponse.json(
        {
          error: "Konfigurasi server tidak lengkap",
          details:
            "Database tidak terkonfigurasi dengan benar. Hubungi administrator.",
          missing: envCheck.missing,
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      nama,
      nik,
      desaKelurahan,
      alamat,
      noTelepon,
      keperluan,
      dokumentasiPelayanan,
    } = body;

    // Log request body for debugging
    console.log("Received form submission:", {
      nama,
      nik: nik ? `${nik.substring(0, 4)}...` : undefined, // Log partially for privacy
      desaKelurahan,
      alamat: alamat ? `${alamat.substring(0, 10)}...` : undefined, // Log partially for privacy
      noTelepon: noTelepon ? `${noTelepon.substring(0, 4)}...` : undefined, // Log partially for privacy
      keperluan: keperluan ? `${keperluan.substring(0, 10)}...` : undefined, // Log partially
      hasDokumentasi: !!dokumentasiPelayanan,
    });

    // Validate required fields
    if (
      !nama ||
      !nik ||
      !desaKelurahan ||
      !alamat ||
      !noTelepon ||
      !keperluan
    ) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    try {
      // Create new guest entry
      const newGuestEntry = await prisma.guestEntry.create({
        data: {
          nama,
          nik,
          desaKelurahan,
          alamat,
          noTelepon,
          keperluan,
          dokumentasiPelayanan,
        },
      });

      console.log("Guest entry created successfully:", newGuestEntry.id);
      return NextResponse.json(newGuestEntry, { status: 201 });
    } catch (dbError: any) {
      console.error("Database error creating guest entry:", dbError);
      return NextResponse.json(
        {
          error: "Gagal menyimpan ke database",
          details: dbError.message || "Unknown database error",
          code: dbError.code,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error creating guest entry:", error);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat menyimpan data",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Check environment variables first
    const envCheck = checkEnvVars();
    if (!envCheck.valid) {
      console.error(
        `Missing required environment variables: ${envCheck.missing.join(", ")}`
      );
      return NextResponse.json(
        {
          error: "Konfigurasi server tidak lengkap",
          details:
            "Database tidak terkonfigurasi dengan benar. Hubungi administrator.",
          missing: envCheck.missing,
          data: [],
          total: 0,
        },
        {
          status: 500,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    console.log(
      `[GET] Fetching guests - page: ${page}, limit: ${limit}, search: ${
        search || "none"
      }`
    );

    // Build search conditions for Prisma
    const where = search
      ? {
          OR: [
            { nama: { contains: search } },
            { nik: { contains: search } },
            { desaKelurahan: { contains: search } },
            { keperluan: { contains: search } },
          ],
        }
      : {};

    try {
      // Get guests with pagination
      const guests = await prisma.guestEntry.findMany({
        where,
        take: limit,
        skip,
        orderBy: {
          createdAt: "desc",
        },
      });

      console.log(`[GET] Found ${guests.length} guests`);

      // Get total count for pagination
      const totalGuests = await prisma.guestEntry.count({ where });
      const totalPages = Math.ceil(totalGuests / limit);

      // Set cache-control headers to prevent caching
      return NextResponse.json(
        {
          data: guests,
          total: totalGuests,
          meta: {
            page,
            limit,
            totalPages,
          },
        },
        {
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    } catch (dbError: any) {
      console.error("Database error fetching guest entries:", dbError);
      return NextResponse.json(
        {
          error: "Gagal mengambil data dari database",
          details: dbError.message || "Unknown database error",
          code: dbError.code,
          data: [],
          total: 0,
        },
        {
          status: 500,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    }
  } catch (error: any) {
    console.error("Error fetching guest entries:", error);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat mengambil data",
        details: error.message || "Unknown error",
        data: [],
        total: 0,
      },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }
}
