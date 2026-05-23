/**
 * Shared product and category data for SEO pages: /product/[slug], /category/[slug], sitemap.
 * Now fetching live data from the Laravel backend API.
 */
export type CategoryItem = {
  id?: number;
  slug: string;
  name: string;
  description?: string;
  image_url?: string;
};

export type TierPrice = {
  min_qty: number;
  max_qty: number | null;
  unit_price: number;
};

export type ProductVariationItem = {
  id: number;
  sku: string;
  price: number;
  sale_price: number | null;
  stock_quantity: number | null;
  image: string | null;
  image_alt?: string | null;
  priceTiers: TierPrice[];
  attributes: Record<string, string>;
};

export type ProductGalleryItem = {
  src: string;
  alt?: string | null;
};

export type ProductCustomizationField = {
  id: number;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'file' | 'number';
  is_required: boolean;
  options: string[] | null;
  accepted_extensions: string | null;
};

export type ReviewSummary = {
  average: number;
  count: number;
};

export type ProductAttributeConfig = {
  name?: string;
  valuesStr?: string;
  used_for_variations?: boolean;
};

export type ProductAdditionalService = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  pricing_type?: "per_item" | "per_order";
};

export type ProductItem = {
  id: number;
  slug: string;
  title: string;
  category: string;
  categorySlug?: string;
  /** Full / long description */
  description: string;
  /** Quick summary from API (snake_case JSON) */
  short_description?: string;
  price: string;
  priceRange?: boolean;
  numericPrice: number;
  oldPrice: string | null;
  image: string;
  image_alt?: string | null;
  gallery?: string[];
  gallery_items?: ProductGalleryItem[];
  badge: string | null;
  sku: string;
  material?: string | null;
  variantsNote?: string;
  priceTiers?: TierPrice[];
  variations?: ProductVariationItem[];
  /** Admin attribute order / labels for variation dimensions */
  attributes_config?: ProductAttributeConfig[] | null;
  additional_services?: ProductAdditionalService[];
  page_settings?: Record<string, any>;
  customization_settings?: Record<string, any>;
  customization_fields?: ProductCustomizationField[];
  enable_reviews?: boolean;
  manage_stock?: boolean;
  stock_quantity?: number | null;
  stock_status?: string;
  allow_backorders?: boolean;
  review_summary?: ReviewSummary;
};

/** Public site URL (canonical, sitemap, OG). Set in production: NEXT_PUBLIC_SITE_URL */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://printworks.lk";
/** Laravel API origin. Production: point at your API host, e.g. https://api.printworks.lk */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * Fallback when the API omits `image` or returns a bad URL.
 * (Avoid `/images/placeholder.jpg` — that file is not in the repo.)
 */
export const PRODUCT_IMAGE_PLACEHOLDER = "/images/logo.png";

/**
 * Map API media URLs to same-origin `/storage/*` and `/images/*` paths (Next rewrites → Laravel).
 * Unknown external hosts fall back to placeholder so the UI never breaks on bad URLs.
 */
function normalizeProductImageSrc(url: string | null | undefined): string {
  if (!url?.trim()) return PRODUCT_IMAGE_PLACEHOLDER;
  let raw = url.trim().replace(/\\/g, "/");
  // Protocol-relative URLs: new URL("//host/...") throws without a base
  if (raw.startsWith("//")) {
    raw = `https:${raw}`;
  }

  const bare = raw.replace(/^\/+/, "");
  if (bare.startsWith("storage/") || bare.startsWith("images/")) {
    return `/${bare}`;
  }

  if (raw.startsWith("/")) return raw;

  const base = API_BASE_URL.replace(/\/$/, "");
  if (raw.startsWith(`${base}/`)) {
    return raw.slice(base.length);
  }

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return PRODUCT_IMAGE_PLACEHOLDER;
  }

  let api: URL;
  try {
    api = new URL(API_BASE_URL);
  } catch {
    return PRODUCT_IMAGE_PLACEHOLDER;
  }

  const path = `${parsed.pathname}${parsed.search}`;
  const isMediaPath =
    parsed.pathname.startsWith("/storage/") || parsed.pathname.startsWith("/images/");

  if (isMediaPath) return path;
  if (parsed.origin === api.origin) return path;

  const host = parsed.hostname.toLowerCase();
  if (host === "images.unsplash.com") return raw;

  if (parsed.protocol === "http:" || parsed.protocol === "https:") {
    return PRODUCT_IMAGE_PLACEHOLDER;
  }

  return PRODUCT_IMAGE_PLACEHOLDER;
}

function normalizeProduct(p: ProductItem): ProductItem {
  const normalizedGalleryItems = p.gallery_items?.map((g) => ({
    ...g,
    src: normalizeProductImageSrc(g.src),
  }));

  return {
    ...p,
    image: normalizeProductImageSrc(p.image),
    gallery: normalizedGalleryItems?.map((g) => g.src) ?? p.gallery?.map((g) => normalizeProductImageSrc(g)),
    gallery_items: normalizedGalleryItems,
    variations: p.variations?.map((v) => ({
      ...v,
      image: v.image != null ? normalizeProductImageSrc(v.image) : null,
    })),
  };
}

// Disable fetch caching so category/product pages reflect admin changes immediately.
const fetchOptions = { cache: "no-store" } as const;

function apiUrl(endpoint: string): string {
  return `${API_BASE_URL}/api/v1${endpoint}`;
}

/** Next.js throws this during static prerender when no-store fetch is used — must rethrow, not treat as network failure */
function isNextDynamicServerError(e: unknown): boolean {
  if (!e || typeof e !== "object") return false;
  const err = e as Error & { digest?: string };
  const msg = err.message ?? "";
  return msg.includes("Dynamic server usage") || err.digest === "DYNAMIC_SERVER_USAGE";
}

/**
 * JSON array endpoints (categories list, products list, by-category).
 */
async function apiFetchList<T>(endpoint: string): Promise<T[]> {
  try {
    const res = await fetch(apiUrl(endpoint), fetchOptions);
    // 404 is normal (empty list / missing category) — never log (Next.js dev overlay treats console.error as fatal-looking)
    if (res.status === 404) {
      return [];
    }
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.warn(`[products-data] ${endpoint} → ${res.status}`, detail.slice(0, 300));
      return [];
    }
    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as T[]) : [];
  } catch (e) {
    if (isNextDynamicServerError(e)) throw e;
    // ECONNREFUSED / DNS / TLS when API is down or wrong NEXT_PUBLIC_API_URL — do not crash SSR
    const code = e && typeof e === "object" && "cause" in e ? (e as { cause?: { code?: string } }).cause?.code : undefined;
    console.warn(`[products-data] ${endpoint} fetch failed`, code ?? e);
    return [];
  }
}

/**
 * Single resource (product or category by slug). Never returns [] on error — that broke callers that treated truthy [] as a product.
 */
async function apiFetchOne<T extends object>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(apiUrl(endpoint), fetchOptions);
    if (res.status === 404) {
      return null;
    }
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.warn(`[products-data] ${endpoint} → ${res.status}`, detail.slice(0, 300));
      return null;
    }
    const data: unknown = await res.json();
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return null;
    }
    return data as T;
  } catch (e) {
    if (isNextDynamicServerError(e)) throw e;
    const code = e && typeof e === "object" && "cause" in e ? (e as { cause?: { code?: string } }).cause?.code : undefined;
    console.warn(`[products-data] ${endpoint} fetch failed`, code ?? e);
    return null;
  }
}

export async function getAllCategories(): Promise<CategoryItem[]> {
  return apiFetchList<CategoryItem>("/categories");
}

export async function getCategoryBySlug(slug: string): Promise<CategoryItem | undefined> {
  if (!slug?.trim()) return undefined;
  const cat = await apiFetchOne<CategoryItem>(`/categories/${encodeURIComponent(slug)}`);
  return cat ?? undefined;
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const cats = await getAllCategories();
  return cats.map((c) => c.slug);
}

export async function getAllProducts(): Promise<ProductItem[]> {
  const list = await apiFetchList<ProductItem>("/products");
  return list.map(normalizeProduct);
}

export async function getProductBySlug(slug: string): Promise<ProductItem | undefined> {
  if (!slug?.trim()) return undefined;
  const prod = await apiFetchOne<ProductItem>(`/products/${encodeURIComponent(slug)}`);
  return prod ? normalizeProduct(prod) : undefined;
}

export async function getAllProductSlugs(): Promise<string[]> {
  const prods = await getAllProducts();
  return prods.map((p) => p.slug);
}

export async function getProductsByCategorySlug(categorySlug: string): Promise<ProductItem[]> {
  if (!categorySlug?.trim()) return [];
  const list = await apiFetchList<ProductItem>(
    `/products/by-category/${encodeURIComponent(categorySlug)}`
  );
  return list.map(normalizeProduct);
}

/**
 * Related products: same category when slug exists; otherwise any other products from the catalog.
 */
export async function getRelatedProducts(product: ProductItem, limit: number = 4): Promise<ProductItem[]> {
  const slug = product.categorySlug?.trim();
  let pool: ProductItem[] = slug
    ? await getProductsByCategorySlug(slug)
    : await getAllProducts();

  pool = pool.filter((p) => p.id !== product.id);
  if (pool.length >= limit) {
    return pool.slice(0, limit);
  }

  if (slug) {
    const all = await getAllProducts();
    const seen = new Set<number>([product.id, ...pool.map((p) => p.id)]);
    for (const p of all) {
      if (seen.has(p.id)) continue;
      pool.push(p);
      seen.add(p.id);
      if (pool.length >= limit) break;
    }
  }

  return pool.slice(0, limit);
}
