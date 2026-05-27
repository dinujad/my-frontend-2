import type { SyntheticEvent } from "react";

function apiMediaBase(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
}

/**
 * Uploaded files live on Laravel (`storage/app/public` → `/storage/*` on API host).
 * Returns full URL on `api.printworks.lk` when NEXT_PUBLIC_API_URL is set.
 * Static storefront assets under `/images/*` stay on the shop domain.
 */
export function catalogImageSrc(path: string | null | undefined): string {
  if (!path?.trim()) return "";
  let p = path.trim().replace(/\\/g, "/");

  if (p.startsWith("//")) {
    p = `https:${p}`;
  }

  const apiBase = apiMediaBase();

  if (p.startsWith("http://") || p.startsWith("https://")) {
    try {
      const u = new URL(p);
      const pathname = u.pathname.startsWith("/") ? u.pathname : `/${u.pathname}`;
      if (pathname.startsWith("/storage/")) {
        if (apiBase && u.origin === new URL(apiBase).origin) {
          return p;
        }
        if (apiBase) {
          return `${apiBase}${pathname}${u.search || ""}`;
        }
        return pathname + (u.search || "");
      }
      if (pathname.startsWith("/images/")) {
        return pathname + (u.search || "");
      }
    } catch {
      /* invalid URL */
    }
    return p;
  }

  const bare = p.replace(/^\/+/, "");
  if (bare.startsWith("storage/")) {
    if (apiBase) {
      return `${apiBase}/${bare}`;
    }
    return `/${bare}`;
  }
  if (bare.startsWith("images/")) {
    return `/${bare}`;
  }

  if (apiBase && !p.startsWith("/")) {
    return `${apiBase}/${bare}`;
  }

  return p.startsWith("/") ? p : `/${p}`;
}

/** Retry once if image failed (wrong host / deploy). */
export function onCatalogImageError(e: SyntheticEvent<HTMLImageElement>): void {
  const el = e.currentTarget;
  if (el.dataset.fallbackTried === "1") return;
  el.dataset.fallbackTried = "1";
  const src = el.getAttribute("src") || "";
  const api = apiMediaBase();
  if (!api) return;
  if (src.startsWith("/storage/")) {
    el.src = `${api}${src}`;
  }
}

/** Canonical / OG URLs */
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
