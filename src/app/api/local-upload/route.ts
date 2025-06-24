import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";
import "../ensure-uploads-dir";

// Note: This is a fallback approach for development only
// In production, use proper storage like Supabase

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    // Validate file type
    const fileType = file.type;
    if (!fileType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Hanya dapat mengupload file gambar" },
        { status: 400 }
      );
    }

    // Format filename and prepare path
    const timestamp = new Date().getTime();
    const fileExtension = file.name.split(".").pop();
    const fileName = `dokumentasi_${timestamp}.${fileExtension}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public/uploads");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, fileName);

    // Convert file to buffer and save
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    console.log("File saved locally:", filePath);

    // Generate URL
    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      url: publicUrl,
      path: publicUrl,
    });
  } catch (error: any) {
    console.error("Error uploading file locally:", error);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat mengupload file secara lokal",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
