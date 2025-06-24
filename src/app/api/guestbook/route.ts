import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
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

    return NextResponse.json(newGuestEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating guest entry:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan data" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    // Build search conditions
    const where = search
      ? {
          OR: [
            { nama: { contains: search, mode: "insensitive" } },
            { nik: { contains: search, mode: "insensitive" } },
            { desaKelurahan: { contains: search, mode: "insensitive" } },
            { keperluan: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    // Get guests with pagination
    const guests = await prisma.guestEntry.findMany({
      where,
      take: limit,
      skip,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get total count for pagination
    const totalGuests = await prisma.guestEntry.count({ where });
    const totalPages = Math.ceil(totalGuests / limit);
    return NextResponse.json({
      data: guests,
      total: totalGuests,
      meta: {
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching guest entries:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data" },
      { status: 500 }
    );
  }
}
