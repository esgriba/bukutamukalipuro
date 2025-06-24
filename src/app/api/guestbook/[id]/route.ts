import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const guestEntry = await prisma.guestEntry.findUnique({
      where: {
        id,
      },
    });

    if (!guestEntry) {
      return NextResponse.json(
        { error: "Data tamu tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(guestEntry);
  } catch (error) {
    console.error("Error fetching guest entry:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    // Check if the guest entry exists
    const existingEntry = await prisma.guestEntry.findUnique({
      where: {
        id,
      },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: "Data tamu tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update the guest entry
    const updatedEntry = await prisma.guestEntry.update({
      where: {
        id,
      },
      data: body,
    });

    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error("Error updating guest entry:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengupdate data" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    // Check if the guest entry exists
    const existingEntry = await prisma.guestEntry.findUnique({
      where: {
        id,
      },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: "Data tamu tidak ditemukan" },
        { status: 404 }
      );
    }

    // Delete the guest entry
    await prisma.guestEntry.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      { message: "Data tamu berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting guest entry:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghapus data" },
      { status: 500 }
    );
  }
}
