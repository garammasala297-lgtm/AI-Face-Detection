// ============================================================================
// Middleware — Route protection & role-based access control
// ============================================================================
// Uses NextAuth JWT to check session. Redirects unauthenticated users to
// /auth and enforces role-based access to dashboards.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that require authentication and their allowed roles
const protectedRoutes: Record<string, string[]> = {
  "/participant-dashboard": ["participant"],
  "/judge-dashboard": ["judge"],
  "/organizer-dashboard": ["organizer"],
  "/admin-dashboard": ["admin"],
};

// Routes accessible to everyone (no auth needed)
const publicRoutes = ["/auth", "/api/auth"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes and API routes through
  if (
    publicRoutes.some((route) => pathname.startsWith(route)) ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Get JWT token from NextAuth
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // No token → redirect to auth page
  if (!token) {
    const signInUrl = new URL("/auth", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  const userRole = token.role as string;

  // Check role-based access for protected routes
  for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      if (!allowedRoles.includes(userRole)) {
        // User has wrong role → redirect to their correct dashboard
        const redirectMap: Record<string, string> = {
          participant: "/participant-dashboard",
          judge: "/judge-dashboard",
          organizer: "/organizer-dashboard",
          admin: "/admin-dashboard",
        };

        const correctDashboard = redirectMap[userRole] || "/auth";
        return NextResponse.redirect(new URL(correctDashboard, request.url));
      }
    }
  }

  // If authenticated user visits /auth, redirect to their dashboard
  // Exception: participants may need to complete onboarding on /auth
  if (pathname === "/auth" && token) {
    // Participants stay on /auth to complete post-OAuth onboarding form
    if (userRole === "participant") {
      return NextResponse.next();
    }

    const redirectMap: Record<string, string> = {
      judge: "/judge-dashboard",
      organizer: "/organizer-dashboard",
      admin: "/admin-dashboard",
    };

    const dashboard = redirectMap[userRole];
    if (dashboard) {
      return NextResponse.redirect(new URL(dashboard, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
