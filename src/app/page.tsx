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
import { HomePopup } from "@/components/home/HomePopup";

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
      {/* Keyword subline (P1 SEO): the hero H1 is a design headline, so the
          homepage's keyword heading sits directly under the hero. */}
      <section
        className="border-b border-gray-100 bg-white px-4 py-10 text-center sm:py-12"
        aria-label="Custom printing services in Sri Lanka"
      >
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Custom Printing Services in Sri Lanka
        </h2>
        <p className="mx-auto mt-3 max-w-3xl leading-relaxed text-gray-600">
          Print Works is a full-service print shop in Biyagama offering{" "}
          <a href="/product-category/uv-flatbed-printing" className="font-medium text-gray-900 underline decoration-gray-300 underline-offset-2 hover:decoration-gray-900">
            UV flatbed printing
          </a>
          ,{" "}
          <a href="/product-category/signage-boards" className="font-medium text-gray-900 underline decoration-gray-300 underline-offset-2 hover:decoration-gray-900">
            signage boards
          </a>
          ,{" "}
          <a href="/product-category/pvc-card-printing" className="font-medium text-gray-900 underline decoration-gray-300 underline-offset-2 hover:decoration-gray-900">
            PVC ID cards
          </a>
          ,{" "}
          <a href="/product-category/sticker-printing-cutting" className="font-medium text-gray-900 underline decoration-gray-300 underline-offset-2 hover:decoration-gray-900">
            sticker printing
          </a>{" "}
          and{" "}
          <a href="/product-category/laser-cutting-engraving" className="font-medium text-gray-900 underline decoration-gray-300 underline-offset-2 hover:decoration-gray-900">
            laser cutting &amp; engraving
          </a>{" "}
          — produced to order and delivered across Sri Lanka.
        </p>
      </section>
      <PromotionalBanners banners={promoBanners} />
      <FeaturedProducts products={products} />
      <BestSellers products={products} />
      <HomeStaticSections />
      <OurClientsSection logos={clientLogos} />
      <HomePopup />
    </main>
  );
}
