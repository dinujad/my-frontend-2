import { HeroSlider } from "@/components/sections/HeroSlider";
import { getHeroSlides } from "@/lib/hero-slides";
import { OurClientsSection } from "@/components/sections/OurClientsSection";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { PromotionalBanners } from "@/components/sections/PromotionalBanners";
import { BestSellers } from "@/components/sections/BestSellers";
import { HomeStaticSections } from "@/components/sections/HomeStaticSections";
import { getClientLogos } from "@/lib/client-logos";
import { getAllProducts } from "@/lib/products-data";

export default async function HomePage() {
  const [products, clientLogos, heroSlides] = await Promise.all([
    getAllProducts(),
    Promise.resolve(getClientLogos()),
    getHeroSlides(),
  ]);

  return (
    <main className="min-h-screen bg-white">
      <HeroSlider slides={heroSlides} />
      <PromotionalBanners />
      <FeaturedProducts products={products} />
      <BestSellers products={products} />
      <HomeStaticSections />
      <OurClientsSection logos={clientLogos} />
    </main>
  );
}
