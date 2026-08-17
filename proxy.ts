import { NextRequest, NextResponse } from "next/server";

// ─── In-memory rate limiter (per-isolate, ~1 min window) ────────────────────
const RATE_MAP = new Map<string, { count: number; ts: number }>();
const RATE_LIMIT = 60; // requests
const RATE_WINDOW = 60_000; // 1 minute

function rateLimit(key: string): boolean {
  const now = Date.now();
  const entry = RATE_MAP.get(key);
  if (!entry || now - entry.ts > RATE_WINDOW) {
    RATE_MAP.set(key, { count: 1, ts: now });
    return false; // not limited
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

// Evict stale entries every 5 min (triggered lazily)
let lastEvict = 0;
function evict() {
  const now = Date.now();
  if (now - lastEvict < 300_000) return;
  lastEvict = now;
  for (const [k, v] of RATE_MAP) {
    if (now - v.ts > RATE_WINDOW) RATE_MAP.delete(k);
  }
}

// ─── Blocked paths (Payload auto-generated REST that should NOT be public) ──
const BLOCKED_API_PATHS = [
  "/api/products",
  "/api/categories",
  "/api/blog-posts",
  "/api/legal-pages",
  "/api/media",
  "/api/admin-users",
  "/api/inquiries",
  "/api/audit-logs",
  "/api/rate-limits",
  "/api/login-otps",
  "/api/password-resets",
];

// Rate-limited paths
const RATE_LIMITED_PATHS = ["/api/frontend-products"];

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only process /api/* routes
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // ── Block exposed Payload collection REST routes (unauthenticated only) ────
  // Admin panel SPA calls the same /api/* routes with a payload-token cookie.
  // Allow requests that carry a valid-looking payload-token through so the
  // admin panel can function. Payload's own RBAC then controls access.
  const hasToken = req.cookies.get("payload-token")?.value;
  if (!hasToken) {
    for (const blocked of BLOCKED_API_PATHS) {
      if (pathname === blocked || pathname.startsWith(blocked + "/")) {
        return new NextResponse(
          JSON.stringify({ error: "Forbidden" }),
          { status: 403, headers: { "Content-Type": "application/json" } },
        );
      }
    }
  }

  // ── Rate limiting ─────────────────────────────────────────────────────────
  evict();
  const ip = getClientIp(req);

  for (const path of RATE_LIMITED_PATHS) {
    if (pathname === path) {
      const key = `${pathname}:${ip}`;
      if (rateLimit(key)) {
        return new NextResponse(
          JSON.stringify({ error: "Too many requests. Please try again later." }),
          { status: 429, headers: { "Content-Type": "application/json", "Retry-After": "60" } },
        );
      }
    }
  }

  // ── Security headers on all API responses ─────────────────────────────────
  const res = NextResponse.next();
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = {
  matcher: ["/api/:path*"],
};
