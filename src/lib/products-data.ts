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
  seo_title?: string | null;
  seo_description?: string | null;
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
  priceMin?: number;
  priceMax?: number;
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
  /** Minimum quantity customer can order (from admin). */
  min_purchase?: number;
  /** Optional maximum quantity customer can order. */
  max_purchase?: number | null;
  review_summary?: ReviewSummary;
  /** Admin SEO fields. Null, empty, and whitespace are treated as unset by metadata resolution. */
  seo_title?: string | null;
  seo_description?: string | null;
  is_featured?: boolean;
  is_special_offer?: boolean;
  is_on_sale?: boolean;
  is_top_rated?: boolean;
  offer_price?: number | null;
  sort_order?: number;
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

/** Uploaded media → API host; static /images → shop host. */
function normalizeProductImageSrc(url: string | null | undefined): string {
  if (!url?.trim()) return PRODUCT_IMAGE_PLACEHOLDER;
  const apiBase = API_BASE_URL.replace(/\/$/, "");
  let raw = url.trim().replace(/\\/g, "/");
  if (raw.startsWith("//")) {
    raw = `https:${raw}`;
  }

  const bare = raw.replace(/^\/+/, "");
  if (bare.startsWith("storage/")) {
    return apiBase ? `${apiBase}/${bare}` : `/${bare}`;
  }
  if (bare.startsWith("images/")) {
    return `/${bare}`;
  }

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    try {
      const parsed = new URL(raw);
      if (parsed.pathname.startsWith("/storage/")) {
        // Legacy: re-root storage paths to the API host
        if (apiBase) {
          return `${apiBase}${parsed.pathname}${parsed.search}`;
        }
        return `${parsed.pathname}${parsed.search}`;
      }
      if (parsed.pathname.startsWith("/images/")) {
        return `${parsed.pathname}${parsed.search}`;
      }
      // Any other absolute URL (R2, S3, B2, CDN, Unsplash…) — use as-is
      return raw;
    } catch {
      return PRODUCT_IMAGE_PLACEHOLDER;
    }
  }

  if (raw.startsWith("/storage/") && apiBase) {
    return `${apiBase}${raw}`;
  }
  if (raw.startsWith("/")) return raw;

  return PRODUCT_IMAGE_PLACEHOLDER;
}

function formatLkr(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** When parent price is 0, derive card price from variation prices. */
function applyVariationListingPrice(p: ProductItem): ProductItem {
  if (p.numericPrice > 0 && !p.priceRange) {
    return p;
  }

  const prices = (p.variations ?? [])
    .map((v) => (v.sale_price && v.sale_price > 0 ? v.sale_price : v.price))
    .filter((n) => n > 0);

  if (prices.length === 0) {
    return p;
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const price = min === max ? formatLkr(min) : `${formatLkr(min)} – ${formatLkr(max)}`;

  return {
    ...p,
    price: p.numericPrice <= 0 ? price : p.price,
    numericPrice: p.numericPrice <= 0 ? min : p.numericPrice,
    priceRange: min !== max,
    priceMin: min,
    priceMax: max,
  };
}

export function normalizeProduct(p: ProductItem): ProductItem {
  const normalizedGalleryItems = p.gallery_items?.map((g) => ({
    ...g,
    src: normalizeProductImageSrc(g.src),
  }));

  const normalized: ProductItem = {
    ...p,
    seo_title: typeof p.seo_title === "string" ? p.seo_title : null,
    seo_description: typeof p.seo_description === "string" ? p.seo_description : null,
    image: normalizeProductImageSrc(p.image),
    gallery: normalizedGalleryItems?.map((g) => g.src) ?? p.gallery?.map((g) => normalizeProductImageSrc(g)),
    gallery_items: normalizedGalleryItems,
    variations: p.variations?.map((v) => ({
      ...v,
      image: v.image != null ? normalizeProductImageSrc(v.image) : null,
    })),
  };

  return applyVariationListingPrice(normalized);
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
async function apiFetchList<T>(endpoint: string, strict = false): Promise<T[]> {
  try {
    const res = await fetch(apiUrl(endpoint), { ...fetchOptions, signal: AbortSignal.timeout(10000) });
    // 404 is normal (empty list / missing category) — never log (Next.js dev overlay treats console.error as fatal-looking)
    if (res.status === 404 && !strict) {
      return [];
    }
    if (!res.ok) {
      if (strict) throw new Error(`Catalogue API ${endpoint} returned ${res.status}`);
      const detail = await res.text().catch(() => "");
      console.warn(`[products-data] ${endpoint} → ${res.status}`, detail.slice(0, 300));
      return [];
    }
    const data: unknown = await res.json();
    if (strict && !Array.isArray(data)) throw new Error(`Invalid catalogue response: ${endpoint}`);
    return Array.isArray(data) ? (data as T[]) : [];
  } catch (e) {
    if (strict || isNextDynamicServerError(e)) throw e;
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
  const res = await fetch(apiUrl(endpoint), { ...fetchOptions, signal: AbortSignal.timeout(10000) });
  // Only an explicit 404 means the resource is gone. Outages must not deindex it.
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Catalogue API ${endpoint} returned ${res.status}`);
  const data: unknown = await res.json();
  if (!data || typeof data !== "object" || Array.isArray(data) ||
      !("slug" in data) || typeof data.slug !== "string" || !data.slug.trim()) {
    throw new Error(`Invalid catalogue response: ${endpoint}`);
  }
  return data as T;
}

/** Fail the sitemap request during an outage instead of publishing a truncated URL list. */
export async function getSitemapCatalog() {
  const [categories, products] = await Promise.all([
    apiFetchList<CategoryItem>("/categories", true),
    apiFetchList<ProductItem>("/products", true),
  ]);
  if ([...categories, ...products].some((item) => !item || typeof item.slug !== "string" || !item.slug.trim())) {
    throw new Error("Invalid sitemap catalogue slug");
  }
  return { categories, products };
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
