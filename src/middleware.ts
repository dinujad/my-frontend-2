import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MAINTENANCE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

// Routes that bypass maintenance mode
const BYPASS_PREFIXES = [
  "/admin",
  "/api",
  "/maintenance",
  "/_next",
  "/favicon",
  "/images",
  "/icons",
  "/robots",
  "/sitemap",
];

// The app runs behind Coolify/Traefik on an internal localhost:3000
// origin, so request.nextUrl's host is NOT the public host. Redirects
// must be built on the canonical public origin, never on nextUrl.
const PUBLIC_ORIGIN = "https://printworks.lk";

export function middleware(request: NextRequest) {
  // Permanent http -> https upgrade (308 — treated by Google like a 301).
  // Coolify's "Force Https" toggle redirects at the Traefik layer with a
  // temporary 302/307, so that toggle must stay OFF; Traefik then passes
  // plain-HTTP requests through with X-Forwarded-Proto: http and this
  // middleware upgrades them permanently instead.
  const proto =
    request.headers.get("x-forwarded-proto") ??
    request.nextUrl.protocol.replace(":", "");
  const path = request.nextUrl.pathname + request.nextUrl.search;
  // Requests reach the app via the public host, or via www when its DNS
  // record exists (Cloudflare) — both are canonicalised the same way.
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (proto === "http" || host === "www.printworks.lk") {
    return NextResponse.redirect(new URL(path, PUBLIC_ORIGIN), 308);
  }

  // Long-lived caching for site images. They are rewritten to the Laravel
  // API, whose own Cache-Control (max-age=0) passes through untouched by
  // next.config headers() — middleware response headers do apply.
  if (request.nextUrl.pathname.startsWith("/images/")) {
    const res = NextResponse.next();
    res.headers.set(
      "Cache-Control",
      "public, max-age=2592000, stale-while-revalidate=86400"
    );
    return res;
  }

  if (!MAINTENANCE) return NextResponse.next();

  const { pathname } = request.nextUrl;

  const isBypassed = BYPASS_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isBypassed) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/maintenance";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // images/ is matched so the cache-header branch above can run; the
    // maintenance gate below bypasses /images itself.
    "/((?!_next/static|_next/image|favicon.ico|icons/).*)",
  ],
};
