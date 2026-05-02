/** Must match `PRODUCT_IMAGE_PLACEHOLDER` in `products-data.ts` (avoid importing that module here). */
const PRODUCT_IMAGE_PLACEHOLDER_PATH = "/images/logo.png";

/**
 * Product images from the API are often absolute URLs (Laravel `asset()`).
 * Using **same-origin** `/storage/*` and `/images/*` paths lets Next.js rewrites
 * proxy to Laravel (`next.config.ts`), fixing broken galleries when APP_URL ≠ how you open the site.
 *
 * Set `NEXT_PUBLIC_MEDIA_ABSOLUTE=1` + `NEXT_PUBLIC_API_URL` to force API-origin URLs (no rewrite).
 */
export function catalogImageSrc(path: string | null | undefined): string {
  if (!path?.trim()) return "";
  let p = path.trim();

  if (process.env.NEXT_PUBLIC_MEDIA_ABSOLUTE === "1") {
    if (!p.startsWith("http://") && !p.startsWith("https://")) {
      const relative = p.startsWith("/") ? p : `/${p}`;
      const base = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
      if (base) return `${base}${relative}`;
    }
    return p.startsWith("http://") || p.startsWith("https://") ? p : p.startsWith("/") ? p : `/${p}`;
  }

  // Absolute URL → use pathname if it's our uploaded/static paths (proxy via Next)
  if (p.startsWith("http://") || p.startsWith("https://")) {
    try {
      const u = new URL(p);
      const pathname = u.pathname.startsWith("/") ? u.pathname : `/${u.pathname}`;
      if (pathname.startsWith("/storage/") || pathname.startsWith("/images/")) {
        return pathname + (u.search || "");
      }
    } catch {
      /* invalid URL — fall through */
    }
    return p;
  }

  return p.startsWith("/") ? p : `/${p}`;
}

/** Canonical / OG URLs when the site serves (or proxies) media under the same host */
export function absolutePublicMediaUrl(
  path: string | null | undefined,
  siteBaseUrl: string
): string {
  const rel = catalogImageSrc(path);
  if (!rel) return "";
  if (rel.startsWith("http://") || rel.startsWith("https://")) return rel;
  const base = siteBaseUrl.replace(/\/$/, "");
  return `${base}${rel}`;
}

/**
 * Product **grid** cards (e.g. /products) run in the browser; loading `/storage/*` only through
 * Next (rewrites or `/_next/image`) can 404 in some setups while the home page `next/image` path
 * still works. Pointing at `NEXT_PUBLIC_API_URL` + path makes the browser request Laravel directly,
 * matching how the admin panel and direct file URLs behave.
 */
export function productGridImageSrc(path: string | null | undefined): string {
  const rel = catalogImageSrc(path);
  if (!rel?.trim()) {
    return PRODUCT_IMAGE_PLACEHOLDER_PATH;
  }
  if (rel.startsWith("http://") || rel.startsWith("https://")) {
    return rel;
  }
  // Frontend-only fallback asset (served by Next `public/`, not Laravel).
  if (rel === PRODUCT_IMAGE_PLACEHOLDER_PATH) {
    return rel;
  }

  const withSlash = rel.startsWith("/") ? rel : `/${rel}`;
  const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(
    /\/$/,
    ""
  );
  if (withSlash.startsWith("/storage/") || withSlash.startsWith("/images/")) {
    return `${apiBase}${withSlash}`;
  }

  return withSlash;
}
