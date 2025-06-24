import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ensureStorageBucketExists } from "@/lib/supabase-helpers";

export async function GET(request: Request) {
  // This endpoint is for admin testing only
  // In production, this should be protected

  try {
    // Get bucket name from environment variable
    const bucketName =
      process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "dokumentasi";

    // First ensure bucket exists
    const bucketCheck = await ensureStorageBucketExists(bucketName);
    // Create a test file for uploading
    const testContent =
      "This is a test file created at " + new Date().toISOString();
    const testBuffer = new TextEncoder().encode(testContent);

    // Try to upload a test file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(`test-file-${Date.now()}.txt`, testBuffer, {
        contentType: "text/plain",
        upsert: true,
      });
    if (uploadError) {
      return NextResponse.json(
        {
          success: false,
          message: "Bucket exists but upload failed",
          bucketCheck,
          uploadError,
          permissions: "Row-Level Security (RLS) policy violation detected",
          solution: {
            step1: "Go to Supabase Dashboard > Storage > Policies",
            step2:
              "For your 'dokumentasi' bucket, add policies to allow uploads/downloads",
            step3:
              "Create policy with: CREATE POLICY \"Allow public uploads\" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'dokumentasi')",
            step4:
              "Also create policy: CREATE POLICY \"Allow public downloads\" ON storage.objects FOR SELECT TO public USING (bucket_id = 'dokumentasi')",
            details:
              "See steps below in the response for exact instructions with screenshots",
          },
        },
        { status: 500 }
      );
    }

    // Get the URL of the uploaded file
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(uploadData.path);

    return NextResponse.json({
      success: true,
      message: "Test upload successful",
      bucketCheck,
      uploadInfo: {
        path: uploadData.path,
        url: urlData.publicUrl,
      },
      note: "The test file was successfully uploaded and retrieved. You can access it at the URL above.",
    });
  } catch (error: any) {
    console.error("Error testing bucket:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error testing bucket",
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
