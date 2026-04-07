import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { PromotionalBanners } from "@/components/sections/PromotionalBanners";
import { BestSellers } from "@/components/sections/BestSellers";
import { getAllProducts } from "@/lib/products-data";

export default async function HomePage() {
  const products = await getAllProducts();

  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <PromotionalBanners />
      <FeaturedProducts products={products} />
      <BestSellers products={products} />
      {/* Temporarily disabled heavy animated/3D sections for safer deploy */}
    </main>
  );
}
