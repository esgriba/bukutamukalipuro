// This file is used to initialize Prisma Client for production builds
// It's necessary because Prisma Client can't be bundled by Next.js

import { PrismaClient } from "@prisma/client";

// TypeScript trick for type-safe global state
declare global {
  var prisma: PrismaClient | undefined;
}

// Prevent multiple instances of Prisma Client in development
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
