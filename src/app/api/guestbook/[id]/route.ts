import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkEnvVars } from "@/lib/validate-env";

// Helper function to set cache control headers
const addCacheControlHeaders = (response: NextResponse) => {
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check environment variables
    const envCheck = checkEnvVars();
    if (!envCheck.valid) {
      console.error(
        `Missing required environment variables: ${envCheck.missing.join(", ")}`
      );
      return addCacheControlHeaders(
        NextResponse.json(
          {
            error: "Konfigurasi server tidak lengkap",
            details:
              "Database tidak terkonfigurasi dengan benar. Hubungi administrator.",
            missing: envCheck.missing,
          },
          { status: 500 }
        )
      );
    }

    const id = parseInt(params.id);
    console.log(`[GET] Fetching guest entry with ID: ${id}`);

    if (isNaN(id)) {
      return addCacheControlHeaders(
        NextResponse.json({ error: "ID tidak valid" }, { status: 400 })
      );
    }

    const guestEntry = await prisma.guestEntry.findUnique({
      where: {
        id,
      },
    });

    if (!guestEntry) {
      return addCacheControlHeaders(
        NextResponse.json(
          { error: "Data tamu tidak ditemukan" },
          { status: 404 }
        )
      );
    }

    return addCacheControlHeaders(NextResponse.json(guestEntry));
  } catch (error: any) {
    console.error("Error fetching guest entry:", error);
    return addCacheControlHeaders(
      NextResponse.json(
        {
          error: "Terjadi kesalahan saat mengambil data",
          details: error.message || "Unknown error",
        },
        { status: 500 }
      )
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check environment variables
    const envCheck = checkEnvVars();
    if (!envCheck.valid) {
      return addCacheControlHeaders(
        NextResponse.json(
          {
            error: "Konfigurasi server tidak lengkap",
            details:
              "Database tidak terkonfigurasi dengan benar. Hubungi administrator.",
            missing: envCheck.missing,
          },
          { status: 500 }
        )
      );
    }

    const id = parseInt(params.id);
    const body = await request.json();
    console.log(`[PUT] Updating guest entry with ID: ${id}`);

    if (isNaN(id)) {
      return addCacheControlHeaders(
        NextResponse.json({ error: "ID tidak valid" }, { status: 400 })
      );
    }

    // Check if the guest entry exists
    const existingEntry = await prisma.guestEntry.findUnique({
      where: {
        id,
      },
    });

    if (!existingEntry) {
      return addCacheControlHeaders(
        NextResponse.json(
          { error: "Data tamu tidak ditemukan" },
          { status: 404 }
        )
      );
    }

    // Update the guest entry
    const updatedEntry = await prisma.guestEntry.update({
      where: {
        id,
      },
      data: body,
    });

    return addCacheControlHeaders(NextResponse.json(updatedEntry));
  } catch (error: any) {
    console.error("Error updating guest entry:", error);
    return addCacheControlHeaders(
      NextResponse.json(
        {
          error: "Terjadi kesalahan saat mengupdate data",
          details: error.message || "Unknown error",
        },
        { status: 500 }
      )
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check environment variables
    const envCheck = checkEnvVars();
    if (!envCheck.valid) {
      return addCacheControlHeaders(
        NextResponse.json(
          {
            error: "Konfigurasi server tidak lengkap",
            details:
              "Database tidak terkonfigurasi dengan benar. Hubungi administrator.",
            missing: envCheck.missing,
          },
          { status: 500 }
        )
      );
    }

    const id = parseInt(params.id);
    console.log(`[DELETE] Deleting guest entry with ID: ${id}`);

    if (isNaN(id)) {
      return addCacheControlHeaders(
        NextResponse.json({ error: "ID tidak valid" }, { status: 400 })
      );
    }

    // Check if the guest entry exists
    const existingEntry = await prisma.guestEntry.findUnique({
      where: {
        id,
      },
    });

    if (!existingEntry) {
      return addCacheControlHeaders(
        NextResponse.json(
          { error: "Data tamu tidak ditemukan" },
          { status: 404 }
        )
      );
    }

    // Delete the guest entry
    await prisma.guestEntry.delete({
      where: {
        id,
      },
    });

    return addCacheControlHeaders(
      NextResponse.json(
        { message: "Data tamu berhasil dihapus" },
        { status: 200 }
      )
    );
  } catch (error: any) {
    console.error("Error deleting guest entry:", error);
    return addCacheControlHeaders(
      NextResponse.json(
        {
          error: "Terjadi kesalahan saat menghapus data",
          details: error.message || "Unknown error",
        },
        { status: 500 }
      )
    );
  }
}
