import { createClient } from "@supabase/supabase-js";

// For debugging purposes
console.log("Initializing Supabase client with:");
console.log(
  `- URL: ${
    process.env.NEXT_PUBLIC_SUPABASE_URL
      ? process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 12) + "..."
      : "undefined"
  }`
);
console.log(
  `- ANON KEY: ${
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? "Key exists (length: " +
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length +
        ")"
      : "undefined"
  }`
);
console.log(
  `- BUCKET: ${
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "dokumentasi"
  }`
);

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        "X-Client-Info": "buku-tamu-nextjs",
      },
      // Increase timeout for slow connections
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          // 30 second timeout
          signal: AbortSignal.timeout(30000),
        });
      },
    },
  }
);
