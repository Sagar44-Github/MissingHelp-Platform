import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// List of paths that require authentication
const authRequiredPaths = ["/analytics", "/admin"];

// List of paths that require admin role
const adminRequiredPaths = ["/admin"];

export async function middleware(request) {
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Check if the path requires authentication
  const isAuthRequired = authRequiredPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Check if the path requires admin role
  const isAdminRequired = adminRequiredPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // If auth is required but user is not logged in
  if (isAuthRequired && !session) {
    const url = new URL("/auth/signin", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // If admin role is required but user is not an admin
  if (isAdminRequired && session?.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure middleware to run only on specific paths
export const config = {
  matcher: ["/analytics/:path*", "/admin/:path*", "/api/admin/:path*"],
};
