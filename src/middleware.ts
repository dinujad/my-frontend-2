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
