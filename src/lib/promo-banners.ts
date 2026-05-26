export type PromoBanner = {
  id: number;
  title: string;
  bold_text: string | null;
  post_text: string | null;
  second_line: string | null;
  has_discount: boolean;
  discount_number: string | null;
  action_text: string | null;
  href: string;
  alt: string | null;
  image: string | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const DEFAULT_PROMO_BANNERS: PromoBanner[] = [
  {
    id: 0,
    title: "INDUSTRY-GRADE",
    bold_text: "UV FLATBED",
    post_text: "",
    second_line: "PRINTING",
    has_discount: false,
    discount_number: null,
    action_text: "Shop now",
    href: "/products?category=UV+Flatbed",
    alt: "UV Printing Promo",
    image: "/images/services/services_uv_1771958447138.png",
  },
  {
    id: 1,
    title: "PREMIUM",
    bold_text: "PRODUCTS",
    post_text: "",
    second_line: "ACRYLIC",
    has_discount: true,
    discount_number: "20",
    action_text: "Shop now",
    href: "/products?category=Acrylic",
    alt: "Acrylic Promo",
    image: "/images/services/services_acrylic_1771958315597.png",
  },
  {
    id: 2,
    title: "TAILORED",
    bold_text: "CUSTOM",
    post_text: "",
    second_line: "PRODUCTS",
    has_discount: false,
    discount_number: null,
    action_text: "Shop now",
    href: "/products?category=Custom",
    alt: "Custom Promo",
    image: "/images/services/services_custom_1771958344395.png",
  },
  {
    id: 3,
    title: "ILLUMINATED",
    bold_text: "SIGNAGE",
    post_text: "",
    second_line: "& DISPLAYS",
    has_discount: false,
    discount_number: null,
    action_text: "Shop now",
    href: "/products?category=Signage",
    alt: "Signage Promo",
    image: "/images/services/services_signage_1771958377225.png",
  },
];

export async function getPromoBanners(): Promise<PromoBanner[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/home-promo-banners`, { cache: "no-store" });
    if (!res.ok) return DEFAULT_PROMO_BANNERS;
    const data = (await res.json()) as PromoBanner[];
    return Array.isArray(data) && data.length > 0 ? data : DEFAULT_PROMO_BANNERS;
  } catch {
    return DEFAULT_PROMO_BANNERS;
  }
}
