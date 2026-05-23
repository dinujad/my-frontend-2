export type HeroSlide = {
  id: number;
  eyebrow: string | null;
  title_line1: string;
  title_line2: string | null;
  highlight_text: string | null;
  description: string | null;
  cta_label: string;
  cta_url: string;
  image: string | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 0,
    eyebrow: "Premium Quality Printing",
    title_line1: "Make Every Detail",
    title_line2: "Stand Out",
    highlight_text: "UP TO 40% OFF",
    description:
      "Sri Lanka's leading digital and offset printing solution. Quality that speaks for itself.",
    cta_label: "Start Buying",
    cta_url: "/products",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop",
  },
];

export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/home-hero-slides`, { cache: "no-store" });
    if (!res.ok) return DEFAULT_HERO_SLIDES;
    const data = (await res.json()) as HeroSlide[];
    return Array.isArray(data) && data.length > 0 ? data : DEFAULT_HERO_SLIDES;
  } catch {
    return DEFAULT_HERO_SLIDES;
  }
}
