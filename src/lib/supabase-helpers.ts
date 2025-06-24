import { supabase } from "@/lib/supabase";

/**
 * Ensures that the specified storage bucket exists in Supabase
 * Will create the bucket if it doesn't exist
 *
 * Note: This function requires admin-level permissions.
 * If used with a client-side token, it may fail with RLS policy errors.
 */
export async function ensureStorageBucketExists(bucketName: string): Promise<{
  success: boolean;
  error: string | null;
  isRlsError?: boolean;
  helpUrl?: string;
  bucketExists?: boolean;
}> {
  try {
    console.log(`Checking if bucket '${bucketName}' exists...`);

    // Try to get the bucket
    const { data, error } = await supabase.storage.getBucket(bucketName);

    // If bucket exists, return success
    if (data) {
      console.log(`Bucket '${bucketName}' already exists`);
      return { success: true, error: null, bucketExists: true };
    }

    if (error) {
      // Check if this is an RLS policy error
      if (
        error.message?.includes("row-level security") ||
        error.message?.includes("violates row-level") ||
        error.message?.includes("403")
      ) {
        console.log(`RLS policy error checking bucket: ${error.message}`);

        // When we get an RLS error, we can try a different approach to check if the bucket exists
        // Instead of getBucket, try listFiles which might have different permissions
        const { data: filesData, error: filesError } = await supabase.storage
          .from(bucketName)
          .list("", { limit: 1 });

        if (!filesError) {
          console.log(
            `Bucket '${bucketName}' appears to exist (could list files)`
          );
          return {
            success: true,
            error: null,
            bucketExists: true,
            isRlsError: false, // We had an RLS error but worked around it
          };
        }

        return {
          success: false,
          error: `RLS policy prevents bucket operations: ${error.message}`,
          isRlsError: true,
          helpUrl: "/docs/supabase-storage-setup.md",
          bucketExists: undefined, // We don't know for sure
        };
      }

      console.log(`Bucket '${bucketName}' not found, creating...`);

      // Create the bucket
      const { error: createError } = await supabase.storage.createBucket(
        bucketName,
        {
          public: true, // Make the bucket public so uploaded files can be accessed
        }
      );
      if (createError) {
        console.error(`Failed to create bucket '${bucketName}':`, createError);

        // Check for RLS policy error
        if (
          createError.message?.includes("row-level security") ||
          createError.message?.includes("violates row-level") ||
          createError.message?.includes("403")
        ) {
          return {
            success: false,
            error: `Failed to create bucket: ${createError.message}. RLS policy issue detected - please configure Storage policies in your Supabase dashboard.`,
            isRlsError: true,
            helpUrl: "/docs/supabase-storage-setup.md",
            bucketExists: false,
          };
        }

        return {
          success: false,
          error: `Failed to create bucket: ${createError.message}`,
          bucketExists: false,
        };
      }

      console.log(`Successfully created bucket '${bucketName}'`);
      return { success: true, error: null, bucketExists: true };
    }

    return { success: true, error: null, bucketExists: true };
  } catch (err: any) {
    console.error(`Error ensuring bucket '${bucketName}' exists:`, err);
    return {
      success: false,
      error: `Error ensuring bucket exists: ${err.message}`,
      bucketExists: undefined, // We don't know
    };
  }
}
