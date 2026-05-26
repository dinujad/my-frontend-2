import { HeroSlider } from "@/components/sections/HeroSlider";
import { getHeroSlides } from "@/lib/hero-slides";
import { OurClientsSection } from "@/components/sections/OurClientsSection";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { PromotionalBanners } from "@/components/sections/PromotionalBanners";
import { getPromoBanners } from "@/lib/promo-banners";
import { BestSellers } from "@/components/sections/BestSellers";
import { HomeStaticSections } from "@/components/sections/HomeStaticSections";
import { getClientLogos } from "@/lib/client-logos";
import { getAllProducts } from "@/lib/products-data";

export default async function HomePage() {
  const [products, clientLogos, heroSlides, promoBanners] = await Promise.all([
    getAllProducts(),
    Promise.resolve(getClientLogos()),
    getHeroSlides(),
    getPromoBanners(),
  ]);

  return (
    <main className="min-h-screen bg-white">
      <HeroSlider slides={heroSlides} />
      <PromotionalBanners banners={promoBanners} />
      <FeaturedProducts products={products} />
      <BestSellers products={products} />
      <HomeStaticSections />
      <OurClientsSection logos={clientLogos} />
    </main>
  );
}
