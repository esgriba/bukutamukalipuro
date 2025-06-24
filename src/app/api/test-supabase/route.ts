import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Check Supabase connection
    let testData = null;
    let testError = null;
    try {
      const response = await supabase
        .from("_supabase_test")
        .select("*")
        .limit(1);
      testData = response.data;
      testError = response.error;
    } catch (err: any) {
      testError = { message: err.message || "Supabase query failed" };
    }

    if (testError) {
      console.log("Supabase connection test error:", testError);
    } else {
      console.log("Supabase connection test success");
    }

    // Get bucket name from environment variable
    const bucketName =
      process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "dokumentasi";

    // Test bucket existence
    let bucketExists = false;
    let bucketError = null;

    try {
      const { data: bucketData, error: getBucketError } =
        await supabase.storage.getBucket(bucketName);

      if (getBucketError) {
        bucketError = getBucketError;
      } else {
        bucketExists = true;
      }
    } catch (err: any) {
      bucketError = { message: err.message || "Unknown error" };
    }

    // Test bucket permissions
    let canUpload = false;
    let uploadError = null;

    if (bucketExists) {
      try {
        // Try to upload a tiny test file
        const testBuffer = new ArrayBuffer(1);
        const { data: uploadData, error: uploadTestError } =
          await supabase.storage
            .from(bucketName)
            .upload("test-upload-" + Date.now() + ".txt", testBuffer, {
              contentType: "text/plain",
              upsert: true,
            });

        if (uploadTestError) {
          uploadError = uploadTestError;
        } else {
          canUpload = true;
          // Clean up the test file
          await supabase.storage
            .from(bucketName)
            .remove([uploadData?.path || ""]);
        }
      } catch (err: any) {
        uploadError = { message: err.message || "Unknown error" };
      }
    }

    return NextResponse.json({
      status: "success",
      supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        connectionOk: !testError,
        connectionError: testError ? testError.message : null,
      },
      storage: {
        bucket: bucketName,
        bucketExists,
        bucketError: bucketError ? bucketError.message : null,
        canUpload,
        uploadError: uploadError ? uploadError.message : null,
      },
    });
  } catch (error: any) {
    console.error("Error testing Supabase:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to test Supabase connection",
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
