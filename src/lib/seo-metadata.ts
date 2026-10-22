/**
 * Public SEO resolution.
 * Product title and description are chosen independently:
 * nonblank admin field → curated override (src/data/product-seo.ts) → product-copy fallback.
 */

export const DEFAULT_SITE_TITLE = "Print Works.LK – Premium Custom Printing in Sri Lanka";

export const DEFAULT_SITE_DESCRIPTION =
  "Sri Lanka's leading custom printing service. UV printing, laser cutting, acrylic products, signage, PVC cards & more. Island-wide delivery.";

export const SITE_SEO_FETCH_TIMEOUT_MS = 2500;

const BRAND_LABEL = "Print Works.LK";

/** Trailing "| Print Works.LK" or "| Printworks.lk", any spacing and case. */
const TRAILING_BRAND = /\|\s*print\s*works\.lk\s*$/i;

export type CuratedProductSeo = {
  title?: string | null;
  description?: string | null;
};

export type ProductSeoSource = {
  slug?: string;
  title: string;
  description?: string | null;
  short_description?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
};

export type ResolvedSiteSeo = {
  title: string;
  description: string;
};

export function nonblank(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function hasTrailingBrand(title: string): boolean {
  return TRAILING_BRAND.test(title.trim());
}

/** Parent layout template adds the brand. An existing suffix must stay absolute so it is not added twice. */
export function htmlTitle(title: string): string | { absolute: string } {
  const trimmed = title.trim();
  if (hasTrailingBrand(trimmed)) return { absolute: trimmed };
  return trimmed;
}

export function socialTitle(title: string): string {
  const trimmed = title.trim();
  if (hasTrailingBrand(trimmed)) return trimmed;
  return `${trimmed} | ${BRAND_LABEL}`;
}

/** Existing product-copy description: short text, then long text, then the product name. Truncated. */
export function productCopyDescription(product: ProductSeoSource): string {
  const short = product.short_description?.trim() ?? "";
  const long = product.description?.trim() ?? "";
  const base = short || long || product.title;
  return base.slice(0, 155) + (base.length > 155 ? "…" : "");
}

export function resolveProductSeo(
  product: ProductSeoSource,
  curated?: CuratedProductSeo | null
): { title: string; description: string } {
  const title =
    nonblank(product.seo_title) ??
    nonblank(curated?.title) ??
    nonblank(product.title) ??
    "";

  const description =
    nonblank(product.seo_description) ??
    nonblank(curated?.description) ??
    productCopyDescription(product);

  return { title, description };
}

export function applyPublicSiteSeo(raw: unknown, defaults: ResolvedSiteSeo = {
  title: DEFAULT_SITE_TITLE,
  description: DEFAULT_SITE_DESCRIPTION,
}): ResolvedSiteSeo {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return defaults;
  const record = raw as Record<string, unknown>;
  return {
    title: nonblank(record.site_title) ?? defaults.title,
    description: nonblank(record.site_description) ?? defaults.description,
  };
}

export async function fetchPublicSiteSeo(
  fetchImpl: typeof fetch = fetch,
  options?: { timeoutMs?: number; apiBase?: string }
): Promise<ResolvedSiteSeo> {
  const defaults: ResolvedSiteSeo = {
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
  };
  const apiBase = (options?.apiBase ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "");
  const timeoutMs = options?.timeoutMs ?? SITE_SEO_FETCH_TIMEOUT_MS;

  try {
    const response = await fetchImpl(`${apiBase}/api/v1/seo-settings`, {
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) return defaults;
    const payload: unknown = await response.json();
    return applyPublicSiteSeo(payload, defaults);
  } catch {
    return defaults;
  }
}
