import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Log requests to specific paths for debugging
  if (request.nextUrl.pathname.startsWith("/api/")) {
    console.log(
      `[Middleware] API Request: ${request.method} ${request.nextUrl.pathname}`
    );
  }

  // Add cache prevention headers to API responses
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const response = NextResponse.next();

    // Add cache control headers
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  }

  // For all other requests, continue without modification
  return NextResponse.next();
}

// Configure the paths the middleware runs on
export const config = {
  matcher: [
    // Apply to all API routes
    "/api/:path*",
    // Apply to all admin pages
    "/admin/:path*",
  ],
};
