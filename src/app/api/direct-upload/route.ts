import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// A simplified version of the upload API to help diagnose issues
export async function POST(request: Request) {
  try {
    console.log("--- DIRECT UPLOAD TEST ---");

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Log information about the environment
    console.log({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      bucketName:
        process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "dokumentasi",
      fileType: file.type,
      fileName: file.name,
      fileSize: file.size,
    });

    // Create a unique file name
    const timestamp = new Date().getTime();
    const fileExtension = file.name.split(".").pop();
    const fileName = `test_${timestamp}.${fileExtension}`;

    // Convert to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();

    // Simple direct upload to the bucket without any checks
    console.log(`Uploading directly to bucket 'dokumentasi'...`);

    const { data, error } = await supabase.storage
      .from("dokumentasi") // Using the bucket name directly
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("Upload failed:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: JSON.stringify(error),
        },
        { status: 500 }
      );
    }

    console.log("Upload succeeded:", data);

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from("dokumentasi")
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    });
  } catch (err: any) {
    console.error("Error in direct upload:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Unknown error",
        stack: err.stack,
      },
      { status: 500 }
    );
  }
}
