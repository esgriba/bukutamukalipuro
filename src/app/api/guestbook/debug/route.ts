import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import os from "os";

/**
 * Enhanced API endpoint for comprehensive server-side diagnostics
 * Useful for troubleshooting server-side exceptions and deployment issues
 */
export async function GET() {
  const requestId = uuidv4(); // Get headers safely
  let userAgent = "Unknown";
  let requestedWith = "Unknown";
  try {
    const headersList = headers();
    userAgent = headersList.get("user-agent") || "Unknown";
    requestedWith = headersList.get("x-requested-with") || "Unknown";
  } catch (error) {
    console.error("[DEBUG API] Error accessing request headers:", error);
  }

  console.log(
    `[DEBUG API] Request ID: ${requestId} | Requested by: ${requestedWith} | UserAgent: ${userAgent}`
  );

  // Variables to store connection statuses
  let databaseConnected = false;
  let supabaseConnected = false;
  let databaseError = null;
  let supabaseError = null;
  let entryCount = 0;

  // Check database connection
  try {
    console.log(`[DEBUG API] Testing Prisma database connection...`);
    // Try to perform a simple database query
    entryCount = await prisma.guestEntry.count();
    databaseConnected = true;
    console.log(
      `[DEBUG API] Database connection successful, found ${entryCount} entries`
    );
  } catch (error: any) {
    databaseError = error.message;
    console.error(`[DEBUG API] Database connection error: ${error.message}`);
    // Don't return early, continue with other checks
  }

  // Check Supabase connection
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      throw new Error("Missing Supabase configuration");
    }

    console.log(`[DEBUG API] Testing Supabase connection...`);
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Try to perform a simple Supabase operation (ping)
    const { data, error } = await supabase
      .from("_pgrst_reserved_id")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    supabaseConnected = true;
    console.log(`[DEBUG API] Supabase connection successful`);
  } catch (error: any) {
    supabaseError = error.message;
    console.error(`[DEBUG API] Supabase connection error: ${error.message}`);
    // Continue with the response
  }

  // Collect environment information (sanitize sensitive data)
  const environment = process.env.NODE_ENV || "unknown";
  const databaseUrl = process.env.DATABASE_URL
    ? `${process.env.DATABASE_URL.split("://")[0]}://*****:****@${
        process.env.DATABASE_URL.split("@")[1]
      }`
    : "Not configured";

  // Server information
  const serverInfo = {
    platform: os.platform(),
    architecture: os.arch(),
    hostname: os.hostname(),
    uptime: Math.floor(os.uptime() / 60), // minutes
    memory: {
      total: Math.round((os.totalmem() / (1024 * 1024 * 1024)) * 100) / 100, // GB
      free: Math.round((os.freemem() / (1024 * 1024 * 1024)) * 100) / 100, // GB
    },
  };

  // Return comprehensive diagnostic information
  return NextResponse.json(
    {
      requestId,
      status: databaseConnected && supabaseConnected ? "healthy" : "degraded",
      environment,
      nodeEnv: process.env.NODE_ENV,
      databaseUrl,
      databaseConnected,
      databaseError,
      entryCount,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseConnected,
      supabaseError,
      supabaseStorageBucket:
        process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "not configured",
      serverTime: new Date().toISOString(),
      serverInfo:
        process.env.NODE_ENV === "production"
          ? "Hidden in production"
          : serverInfo,
    },
    {
      status: databaseConnected && supabaseConnected ? 200 : 207,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
      },
    }
  );
}
