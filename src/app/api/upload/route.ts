import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ensureStorageBucketExists } from "@/lib/supabase-helpers";

export async function POST(request: Request) {
  try {
    // Log environment for debugging
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log(
      "Storage Bucket:",
      process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET
    );

    const formData = await request.formData();
    const file = formData.get("file") as File;

    // Get bucket name from environment variable
    const bucketName =
      process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "dokumentasi";

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

    let shouldSkipBucketCheck = false;
    // Try bucket check but don't fail if it errors (this is the key change)
    try {
      // Make sure the bucket exists
      const bucketCheck = await ensureStorageBucketExists(bucketName);
      if (!bucketCheck.success) {
        console.error("Bucket check failed:", bucketCheck.error);

        // If this is an RLS policy error, log it but continue with the upload
        if (bucketCheck.isRlsError) {
          console.log(
            "RLS error detected, but continuing with direct upload attempt"
          );
          shouldSkipBucketCheck = true;
        }
      }
    } catch (bucketError) {
      console.error("Error checking bucket:", bucketError);
      // Continue with the upload anyway - bucket may already exist
      shouldSkipBucketCheck = true;
    }

    // Format filename with more unique identifier
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split(".").pop();
    const fileName = `dokumentasi_${timestamp}_${randomString}.${fileExtension}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    console.log(
      `Attempting to upload file ${fileName} to bucket '${bucketName}'`
    );

    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, arrayBuffer, {
          contentType: fileType,
          upsert: true,
        });

      if (error) {
        console.error("Error uploading to Supabase:", error);
        return NextResponse.json(
          {
            error: `Gagal mengupload file: ${error.message || "Unknown error"}`,
            details: JSON.stringify(error),
            message: error.message,
            // Add more helpful instructions if it's an RLS issue
            isRlsError:
              error.message?.includes("violates row-level") ||
              error.message?.includes("403"),
            helpSteps: shouldSkipBucketCheck
              ? [
                  "Pastikan policy RLS untuk bucket 'dokumentasi' sudah dibuat di Supabase Dashboard",
                  "Policy harus mengizinkan INSERT untuk upload file",
                  "Lihat dokumentasi di /docs/supabase-storage-setup.md untuk detail lengkap",
                ]
              : null,
          },
          { status: error.message?.includes("403") ? 403 : 500 }
        );
      }

      if (!data || !data.path) {
        console.error("Upload succeeded but no data or path returned");
        return NextResponse.json(
          { error: "Upload succeeded but no file path returned" },
          { status: 500 }
        );
      }

      console.log("File uploaded successfully:", data.path);

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        console.error("Failed to generate public URL");
        return NextResponse.json(
          { error: "Failed to generate public URL for uploaded file" },
          { status: 500 }
        );
      }

      console.log("Public URL generated:", publicUrlData.publicUrl);

      return NextResponse.json({
        url: publicUrlData.publicUrl,
        path: data.path,
        success: true,
      });
    } catch (uploadError: any) {
      console.error("Exception during upload:", uploadError);
      return NextResponse.json(
        {
          error: "Exception during upload",
          details: uploadError.message || "Unknown error",
          stack: uploadError.stack || "No stack trace available",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("General error in upload handler:", error);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat mengupload file",
        details: error.message || "Unknown error",
        stack: error.stack || "No stack trace available",
      },
      { status: 500 }
    );
  }
}
