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

export function middleware(request: NextRequest) {
  // Permanent http -> https upgrade (308 — treated by Google like a 301).
  // Coolify's "Force Https" toggle redirects at the Traefik layer with a
  // temporary 302/307, so that toggle must stay OFF; Traefik then passes
  // plain-HTTP requests through with X-Forwarded-Proto: http and this
  // middleware upgrades them permanently instead.
  const proto =
    request.headers.get("x-forwarded-proto") ??
    request.nextUrl.protocol.replace(":", "");
  if (proto === "http") {
    const url = request.nextUrl.clone();
    url.protocol = "https";
    return NextResponse.redirect(url, 308);
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
    "/((?!_next/static|_next/image|favicon.ico|images/|icons/).*)",
  ],
};
