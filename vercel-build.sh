#!/bin/bash

# Vercel deployment build script with enhanced error handling
# This script runs automatically after npm install in the build step

echo "==================== VERCEL BUILD SCRIPT ===================="
echo "Running Vercel build script at $(date)"

# Check if DATABASE_URL is configured
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️ WARNING: DATABASE_URL environment variable is not set!"
  echo "This may cause runtime issues. Please configure DATABASE_URL in Vercel."
else
  echo "✓ DATABASE_URL environment variable is set"
  
  # Check if it contains "supabase" to validate it's likely correct
  if [[ "$DATABASE_URL" != *"supabase"* ]]; then
    echo "⚠️ WARNING: DATABASE_URL may not be correctly formatted. It should contain 'supabase'."
  fi
fi

# Check if DIRECT_URL is configured (required for Prisma with connection pooling)
if [ -z "$DIRECT_URL" ]; then
  echo "⚠️ WARNING: DIRECT_URL environment variable is not set!"
  echo "This may cause issues with Prisma. Please configure DIRECT_URL in Vercel."
else
  echo "✓ DIRECT_URL environment variable is set"
fi

# Check for VERCEL_URL or NEXT_PUBLIC_SITE_URL (required for admin detail page)
if [ -z "$VERCEL_URL" ] && [ -z "$NEXT_PUBLIC_SITE_URL" ]; then
  echo "⚠️ WARNING: Neither VERCEL_URL nor NEXT_PUBLIC_SITE_URL environment variables are set!"
  echo "This may cause admin detail pages to fail. Please configure NEXT_PUBLIC_SITE_URL in Vercel."
  echo "Set NEXT_PUBLIC_SITE_URL to your production URL (e.g., https://bukutamukalipuro.vercel.app)"
elif [ -z "$VERCEL_URL" ]; then
  echo "ℹ️ Note: VERCEL_URL not available, but NEXT_PUBLIC_SITE_URL is set which is fine"
else
  echo "✓ URL environment variables are properly configured"
fi

# Check for Supabase environment variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
  echo "⚠️ WARNING: Supabase environment variables are missing!"
  echo "Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
else
  echo "✓ Supabase environment variables are set"
fi

# Generate Prisma client with enhanced error handling
echo "Generating Prisma Client..."
npx prisma generate
PRISMA_EXIT_CODE=$?

if [ $PRISMA_EXIT_CODE -ne 0 ]; then
  echo "❌ ERROR: Prisma client generation failed with exit code $PRISMA_EXIT_CODE"
  echo "This might cause runtime errors. Check your Prisma schema and database connection."
  
  # Continue the build despite the error to see if it helps diagnose issues
  echo "Continuing build process despite errors..."
else
  echo "✓ Prisma client generated successfully"
fi

# Create an empty .env file if it doesn't exist to prevent errors
if [ ! -f ".env" ]; then
  echo "Creating empty .env file to prevent errors..."
  echo "# This file was created by vercel-build.sh" > .env
fi

# Check if NEXT_PUBLIC_SITE_URL has correct protocol
if [ ! -z "$NEXT_PUBLIC_SITE_URL" ]; then
  if [[ "$NEXT_PUBLIC_SITE_URL" != http* ]]; then
    echo "⚠️ WARNING: NEXT_PUBLIC_SITE_URL does not start with http:// or https://"
    echo "This may cause fetch issues in the admin detail pages."
    echo "Please update to include the protocol (e.g., https://bukutamukalipuro.vercel.app)"
  else
    echo "✓ NEXT_PUBLIC_SITE_URL has correct protocol format"
  fi
fi

echo "====================BUILD SCRIPT COMPLETE===================="
# Exit with success even if there were warnings, as we want to see the deployment
exit 0
