import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { PromotionalBanners } from "@/components/sections/PromotionalBanners";
import { BestSellers } from "@/components/sections/BestSellers";
import { AnimatedShowcase } from "@/components/sections/AnimatedShowcase";
import { AnimatedCategories } from "@/components/sections/AnimatedCategories";
import { getAllProducts } from "@/lib/products-data";

export default async function HomePage() {
  const products = await getAllProducts();

  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <PromotionalBanners />
      <FeaturedProducts products={products} />
      <BestSellers products={products} />
      <AnimatedShowcase />
      <AnimatedCategories />
    </main>
  );
}
