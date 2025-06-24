#!/bin/bash

# Vercel deployment needs to generate prisma client
# This script runs automatically after npm install in the build step

# Generate Prisma client
echo "Generating Prisma Client..."
npx prisma generate

# Exit with success
exit 0
