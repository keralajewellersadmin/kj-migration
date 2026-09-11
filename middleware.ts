import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MAINTENANCE_MODE = false;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always block /admin as 404
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return NextResponse.rewrite(new URL("/not-found", request.url), { status: 404 });
  }

  // Maintenance mode: serve maintenance page for all routes (including admin)
  if (MAINTENANCE_MODE) {
    // Allow only Next internals, assets, and the maintenance page itself
    // Admin (/kj-portal-0d7cfad1) is also paused per request
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/maintenance") ||
      pathname.startsWith("/assets") ||
      pathname === "/favicon.ico" ||
      pathname === "/robots.txt" ||
      pathname === "/sitemap.xml"
    ) {
      return NextResponse.next();
    }
    // Rewrite everything else to /maintenance with 503
    const res = NextResponse.rewrite(new URL("/maintenance", request.url), {
      status: 503,
    });
    res.headers.set("Retry-After", "3600");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
