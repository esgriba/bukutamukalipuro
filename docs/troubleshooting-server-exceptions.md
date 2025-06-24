# Troubleshooting Server-Side Exceptions

This guide provides steps to diagnose and fix server-side exceptions that may occur in the Buku Tamu Digital application, especially in the admin detail page.

## Common Error: "Application error: a server-side exception has occurred"

This error typically appears when there's a problem with data fetching, database connectivity, or environment configuration on the server side.

### Possible Causes

1. **Invalid Environment Variables**

   - Missing DATABASE_URL
   - Missing DIRECT_URL (for Prisma connection pooling)
   - Missing or incorrect Supabase credentials
   - Incorrect URL format

2. **Database Connection Issues**

   - Database is unreachable
   - Connection timeout
   - Invalid credentials in connection string
   - Database permission issues

3. **Vercel Deployment Issues**

   - Failed Prisma generation during build
   - Edge function timeouts
   - Region-specific connectivity issues

4. **Code-Related Issues**
   - Missing error handling for edge cases
   - Type errors in server components
   - Invalid data handling

## Diagnostic Steps

### 1. Check Environment Variables

First, verify that all required environment variables are correctly set in the Vercel dashboard:

- `DATABASE_URL` - Should point to your Supabase PostgreSQL database
- `DIRECT_URL` - Should be identical to DATABASE_URL for direct Prisma connections
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` - Your Supabase storage bucket name

### 2. Analyze Vercel Logs

Go to your Vercel dashboard > Project > Deployments > Select the latest deployment > Runtime Logs.

Look for errors related to:

- Database connection failures
- Prisma client errors
- Environment variable warnings
- Timeout exceptions

### 3. Test Database Connectivity

Use the diagnostic page at `/admin/diagnostic` to check:

- If the database is connected
- If Supabase services are accessible
- Server environment information

### 4. Check Digest Error Code

The error message includes a "Digest" code (e.g., `Digest: 1901562704`), which can help identify the specific error in Vercel logs.

### 5. Review Detail Page Implementation

Common issues in the detail page include:

- Invalid ID parameter handling
- Fetch URL construction issues
- Missing error boundaries
- Invalid data parsing

## Specific Solutions

### For Detail Page Errors:

1. **Add a custom error boundary**

   A custom error page has been added at `src/app/admin/detail/[id]/error.tsx` to provide more useful error information.

2. **Improve URL construction**

   ```typescript
   // Enhanced URL construction with protocol handling
   const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
   const domain =
     process.env.VERCEL_URL ||
     process.env.NEXT_PUBLIC_SITE_URL ||
     "localhost:3000";
   const baseUrl = domain.includes("://") ? domain : `${protocol}://${domain}`;
   ```

3. **Implement fallback mechanisms**

   ```typescript
   try {
     // Attempt API fetch first
     // If it fails, fall back to direct Prisma query
     if (!successFromApi) {
       guest = await prisma.guestEntry.findUnique({
         where: { id: guestId },
       });
     }
   } catch (error) {
     // Enhanced error handling
   }
   ```

4. **Add comprehensive logging**

   Debug logs have been added throughout the detail page implementation to help diagnose issues.

### For Database Connection Issues:

1. **Check your Supabase project status**

   Verify your Supabase project is active and not paused due to billing issues.

2. **Test connection directly**

   Use the `/admin/debug` page to test direct database connectivity.

3. **Verify Prisma schema**

   Ensure your Prisma schema matches your database schema.

### For Vercel Build Issues:

1. **Check build logs**

   The enhanced `vercel-build.sh` script validates environment variables and provides clear error messages during build.

2. **Manually trigger Prisma generation**

   You can run the following command to generate Prisma client locally before deploying:

   ```bash
   npx prisma generate
   ```

3. **Clean deployment cache**

   Try clearing the deployment cache and redeploying.

## Improved Error Tracking

A new diagnostic system has been implemented:

- `/admin/diagnostic` - System-wide diagnostic information
- `/api/guestbook/debug` - Enhanced API debugging endpoint
- Better error logging with detailed contextual information
- Error boundaries with meaningful messages

## Next Steps If Issues Persist

1. Use `console.error` logs in the error.tsx components to capture detailed error information
2. Consider implementing an error monitoring service
3. Check database performance metrics in Supabase dashboard
4. Review all API routes for proper error handling

Remember to check the Vercel logs with the specific error digest for the most accurate diagnosis of server-side exceptions.
