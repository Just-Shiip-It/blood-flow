import { NextResponse, NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/profile", "/appointments", "/history", "/card", "/book"];

// Routes that require hospital role
const hospitalRoutes = ["/hospital"];

// Routes that require admin role
const adminRoutes = ["/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if it's a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isHospitalRoute = hospitalRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  if (!isProtectedRoute && !isHospitalRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  // Get session cookie from Better Auth (check both regular and secure versions)
  const sessionToken = request.cookies.get("better-auth.session_token") || request.cookies.get("__Secure-better-auth.session_token");

  if (!sessionToken && (isProtectedRoute || isHospitalRoute || isAdminRoute)) {
    // Redirect to sign-in if no session
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // We rely on Server Components (Layouts/Pages) to enforce specific Role validity
  // to avoid expensive DB calls in Middleware on every request.
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/appointments/:path*",
    "/history/:path*",
    "/card/:path*",
    "/book/:path*",
    "/hospital/:path*",
    "/admin/:path*",
  ],
};
