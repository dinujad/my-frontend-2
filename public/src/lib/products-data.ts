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
  priceTiers: TierPrice[];
  attributes: Record<string, string>;
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
  gallery?: string[];
  badge: string | null;
  sku: string;
  material?: string | null;
  variantsNote?: string;
  priceTiers?: TierPrice[];
  variations?: ProductVariationItem[];
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

// Disable fetch caching so category/product pages reflect admin changes immediately.
const fetchOptions = { cache: "no-store" } as const;

function apiUrl(endpoint: string): string {
  return `${API_BASE_URL}/api/v1${endpoint}`;
}

/**
 * JSON array endpoints (categories list, products list, by-category).
 */
async function apiFetchList<T>(endpoint: string): Promise<T[]> {
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
}

/**
 * Single resource (product or category by slug). Never returns [] on error — that broke callers that treated truthy [] as a product.
 */
async function apiFetchOne<T extends object>(endpoint: string): Promise<T | null> {
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
  return apiFetchList<ProductItem>("/products");
}

export async function getProductBySlug(slug: string): Promise<ProductItem | undefined> {
  if (!slug?.trim()) return undefined;
  const prod = await apiFetchOne<ProductItem>(`/products/${encodeURIComponent(slug)}`);
  return prod ?? undefined;
}

export async function getAllProductSlugs(): Promise<string[]> {
  const prods = await getAllProducts();
  return prods.map((p) => p.slug);
}

export async function getProductsByCategorySlug(categorySlug: string): Promise<ProductItem[]> {
  if (!categorySlug?.trim()) return [];
  return apiFetchList<ProductItem>(`/products/by-category/${encodeURIComponent(categorySlug)}`);
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
