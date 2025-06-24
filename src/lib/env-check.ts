// This module checks and validates critical environment variables
// and provides helpful diagnostics on server startup

// Required environment variables for the application
const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "DIRECT_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET",
];

// Check all required environment variables on server startup
function checkEnvironmentVariables() {
  console.log("🔍 Checking required environment variables...");

  const missing: string[] = [];
  const available: string[] = [];

  REQUIRED_ENV_VARS.forEach((envVar) => {
    if (!process.env[envVar]) {
      missing.push(envVar);
    } else {
      available.push(envVar);
    }
  });

  if (missing.length > 0) {
    console.warn(
      `⚠️ WARNING: Missing required environment variables: ${missing.join(
        ", "
      )}`
    );
    console.warn(
      "This may cause application errors. Please check your configuration."
    );
  } else {
    console.log("✅ All required environment variables are set!");
  }

  // Check database URL format
  if (process.env.DATABASE_URL) {
    if (!process.env.DATABASE_URL.includes("supabase")) {
      console.warn(
        '⚠️ WARNING: DATABASE_URL does not contain "supabase". Please verify it\'s correct.'
      );
    } else {
      console.log("✅ DATABASE_URL format appears correct");
    }
  }

  // Check if DIRECT_URL is different from DATABASE_URL (should be for pgBouncer setup)
  if (process.env.DATABASE_URL && process.env.DIRECT_URL) {
    if (process.env.DATABASE_URL === process.env.DIRECT_URL) {
      console.warn(
        "⚠️ WARNING: DATABASE_URL and DIRECT_URL are identical. For Supabase, they should be different (one for connection pooling, one direct)."
      );
    } else {
      console.log("✅ DATABASE_URL and DIRECT_URL are correctly different");
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    available,
  };
}

// Run the check immediately on import
const envCheckResult = checkEnvironmentVariables();

// Export the validation result
export const environmentValid = envCheckResult.valid;

// Export the check function for use elsewhere
export const validateEnvironmentVariables = checkEnvironmentVariables;
