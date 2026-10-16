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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://printworks.lk";

// Organization + WebSite structured data (SEO). Address matches the
// business details registered in Google Merchant Center.
const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Print Works.LK",
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo.png`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "1st Floor, No. 210/15, New Kandy Road",
        addressLocality: "Biyagama",
        postalCode: "11650",
        addressCountry: "LK",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Print Works.LK",
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default async function HomePage() {
  const [products, clientLogos, heroSlides, promoBanners] = await Promise.all([
    getAllProducts(),
    Promise.resolve(getClientLogos()),
    getHeroSlides(),
    getPromoBanners(),
  ]);

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      <HeroSlider slides={heroSlides} />
      <PromotionalBanners banners={promoBanners} />
      <FeaturedProducts products={products} />
      <BestSellers products={products} />
      <HomeStaticSections />
      <OurClientsSection logos={clientLogos} />
    </main>
  );
}
