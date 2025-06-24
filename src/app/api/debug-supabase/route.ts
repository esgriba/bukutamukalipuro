import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  // Don't include sensitive information, just check environment and connection
  const info = {
    environment: {
      // Partial URL for security but enough to verify it's configured
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 12)}...`
        : "Not configured",
      // Just indicate if the key exists
      supabaseKeyConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
      storageBucket:
        process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
        "dokumentasi (default)",
    },
    timestamp: new Date().toISOString(),
  };
  // Check if we can connect to Supabase
  let connectionTest: {
    success: boolean;
    error: string | null;
    buckets?: any[];
  } = {
    success: false,
    error: null,
  };

  try {
    // Check if storage API is working
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      connectionTest.error = error.message;
    } else {
      connectionTest.success = true;
      // List buckets (safe to share for debugging)
      const bucketList = buckets.map((bucket) => ({
        name: bucket.name,
        public: bucket.public,
        created_at: bucket.created_at,
      }));

      connectionTest.buckets = bucketList;
    }
  } catch (err: any) {
    connectionTest.error = err.message;
  }

  return NextResponse.json({
    info,
    connectionTest,
    // Include library version info
    versions: {
      supabaseJs: "@supabase/supabase-js v2.x", // Hardcoded since we can't easily get it dynamically
    },
  });
}
