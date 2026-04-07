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
