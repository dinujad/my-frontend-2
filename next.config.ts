import type { NextConfig } from "next";

const apiOrigin = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/** Allow next/image for product media served from the configured API host (Coolify sslip.io, api subdomain, etc.) */
function remotePatternsForApi(origin: string) {
  type RemotePatternOrUrl =
    NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];
  const patterns: RemotePatternOrUrl[] = [];
  try {
    const u = new URL(origin);
    const protocol = u.protocol.replace(":", "") as "http" | "https";
    patterns.push({
      protocol,
      hostname: u.hostname,
      ...(u.port ? { port: u.port } : {}),
      pathname: "/**",
    });
  } catch {
    /* ignore invalid NEXT_PUBLIC_API_URL at build time */
  }
  return patterns;
}

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    // Prefer AVIF (smaller than WebP) for the image optimiser — improves LCP.
    formats: ["image/avif", "image/webp"],
    // Keep optimised variants cached for 30 days (default is 60s), so the
    // optimiser is not re-encoding the same images on every cold request.
    minimumCacheTTL: 2592000,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/**" },
      { protocol: "https", hostname: "printworks.lk", pathname: "/**" },
      { protocol: "https", hostname: "**.printworks.lk", pathname: "/**" },
      { protocol: "http", hostname: "**.printworks.lk", pathname: "/**" },
      { protocol: "http", hostname: "**.sslip.io", pathname: "/**" },
      { protocol: "https", hostname: "**.sslip.io", pathname: "/**" },
      ...remotePatternsForApi(apiOrigin),
    ],
  },
  async headers() {
    return [
      {
        // Site images (logos, banners, category art) change rarely — let
        // browsers and the CDN hold them for 30 days instead of the API's
        // current max-age=0, which forces a re-download on every visit.
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // P1 SEO 2026-10-17: recover verified-dead old WordPress URLs.
      // permanent: true emits 308 — treated as permanent by Google, same as 301.
      {
        source: "/product/acrylic-donations-and-tip-boxes-in-sri-lanka",
        destination: "/product/acrylic-donation-box-built-in-lock-series",
        permanent: true,
      },
      {
        source: "/business-stationery/pvc-id-cards-office-id-printing",
        destination: "/product-category/pvc-card-printing",
        permanent: true,
      },
      {
        source: "/business-stationery/pvc-id-cards-office-id-printing/",
        destination: "/product-category/pvc-card-printing",
        permanent: true,
      },
      // WooCommerce leftovers, live-checked dead (404) on 2026-10-17.
      // /cart and /checkout return 200 on the current site — not touched.
      { source: "/shop", destination: "/products", permanent: true },
      { source: "/shop/:path*", destination: "/products", permanent: true },
      { source: "/my-account", destination: "/products", permanent: true },
      { source: "/my-account/:path*", destination: "/products", permanent: true },
      // P1 SEO 2026-10-18: full Search Console 404 export (253 URLs, 2026-10-18).
      // Every source below was live-checked 404; every destination is a live page.
      // Skipped on purpose: /images/* and wp-* asset paths, /feed URLs, junk slugs.
      // — Old product slugs → closest live product (or category / catalogue) (33)
      {
        source: "/product/acrylic-brochure-holders-in-sri-lanka",
        destination: "/product/acrylic-l-shape-stands",
        permanent: true,
      },
      {
        source: "/product/acrylic-coasters-printing-sri-lanka",
        destination: "/product/acrylic-coasters",
        permanent: true,
      },
      {
        source: "/product/acrylic-cutting-and-engraving",
        destination: "/product/acrylic-laser-cutting-and-engraving",
        permanent: true,
      },
      {
        source: "/product/acrylic-desktop-name-plate-holders-tabletops-name-tag-holders-in-sri-lanka",
        destination: "/product/acrylic-desk-sign-holders",
        permanent: true,
      },
      {
        source: "/product/acrylic-display-shelves-racks-in-sri-lanka",
        destination: "/product/acrylic-product-display-stands",
        permanent: true,
      },
      {
        source: "/product/acrylic-flyer-holders-in-sri-lanka",
        destination: "/product/acrylic-l-shape-stands",
        permanent: true,
      },
      {
        source: "/product/acrylic-plastic-table-numbers-in-sri-lanka",
        destination: "/product/table-top-notice-holder",
        permanent: true,
      },
      {
        source: "/product/acrylic-price-tag-holders-buffet-tags-in-sri-lanka",
        destination: "/product/acrylic-price-tag-holders",
        permanent: true,
      },
      {
        source: "/product/acrylic-suggestions-box-complaint-and-kaizen-boxes-in-sri-lanka",
        destination: "/product/acrylic-suggestions-box-slim-series",
        permanent: true,
      },
      {
        source: "/product/car-sticker-printing-in-sri-lanka",
        destination: "/product/custom-vehicle-windscreen-stickers",
        permanent: true,
      },
      {
        source: "/product/cctv-camera-signs-in-srilanka",
        destination: "/product-category/signage-boards",
        permanent: true,
      },
      {
        source: "/product/custom-sticker-printing-in-colombo-sri-lanka",
        destination: "/product-category/sticker-printing-cutting",
        permanent: true,
      },
      {
        source: "/product/customized-acrylic-name-plates-office-door-name-boards-in-sri-lanka",
        destination: "/product/changeable-door-name-plates",
        permanent: true,
      },
      {
        source: "/product/customized-stainless-steel-engraved-house-number-plates-in-sri-lanka",
        destination: "/product/stainless-steel-house-number-plates",
        permanent: true,
      },
      {
        source: "/product/doom-stickers-printing-in-sri-lanka",
        destination: "/product/domed-epoxy-stickers",
        permanent: true,
      },
      {
        source: "/product/flex-banner-printing-digital-printing-service-in-colombo",
        destination: "/product/flex-banner-printing",
        permanent: true,
      },
      {
        source: "/product/l-shape-leaflet-holders-acrylic-brochure-holders-in-sri-lanka",
        destination: "/product/acrylic-l-shape-stands",
        permanent: true,
      },
      {
        source: "/product/no-parking-signs-in-srilanka",
        destination: "/product-category/signage-boards",
        permanent: true,
      },
      {
        source: "/product/open-and-closed-door-sign-in-sri-lanka",
        destination: "/product/vacant-and-occupied-door-signs",
        permanent: true,
      },
      {
        source: "/product/paper-sticker-printing-in-sri-lanka",
        destination: "/product/printed-paper-sticker-sheets",
        permanent: true,
      },
      {
        source: "/product/photo-luminescent-exit-sign-boards-in-sri-lanka",
        destination: "/product/photoluminescent-stickers-printing",
        permanent: true,
      },
      {
        source: "/product/plastic-name-tags-and-badges-in-sri-lanka",
        destination: "/product-category/badges-tags",
        permanent: true,
      },
      {
        source: "/product/printed-pvc-id-card-plastic-office-id-card-printing-sri-lanka",
        destination: "/product/corporate-and-student-id-cards",
        permanent: true,
      },
      {
        source: "/product/push-and-pull-door-signs-in-sri-lanka",
        destination: "/product/vacant-and-occupied-door-signs",
        permanent: true,
      },
      {
        source: "/product/pvc-sticker-printing-in-sri-lanka",
        destination: "/product/printed-pvc-stickers",
        permanent: true,
      },
      {
        source: "/product/stainless-steel-name-plates-in-sri-lanka",
        destination: "/product/stainless-steel-engraved-name-plate",
        permanent: true,
      },
      {
        source: "/product/tabletop-qr-codes-in-sri-lanka",
        destination: "/product/qr-code-stands",
        permanent: true,
      },
      {
        source: "/product/uv-dtf-printing-in-sri-lanka",
        destination: "/product/uv-dtf-printing",
        permanent: true,
      },
      {
        source: "/product/uv-printing",
        destination: "/product-category/uv-flatbed-printing",
        permanent: true,
      },
      {
        source: "/product/wall-stickers-decals-in-sri-lanka",
        destination: "/product/custom-vinyl-decals",
        permanent: true,
      },
      {
        source: "/product/washroom-sign-boards-in-sri-lanka",
        destination: "/product-category/signage-boards",
        permanent: true,
      },
      {
        source: "/product/x-banner-stands",
        destination: "/product/pull-up-banner-stands",
        permanent: true,
      },
      {
        source: "/product/x-banners-stands-in-colombo-sri-lanka",
        destination: "/product/pull-up-banner-stands",
        permanent: true,
      },
      // — Old WooCommerce categories → live categories (9)
      {
        source: "/product-category/badges-and-tags",
        destination: "/product-category/badges-tags",
        permanent: true,
      },
      {
        source: "/product-category/business-cards",
        destination: "/product/pvc-translucent-business-cards",
        permanent: true,
      },
      {
        source: "/product-category/custom-acrylic-products-creations",
        destination: "/product-category/custom-acrylic-products",
        permanent: true,
      },
      {
        source: "/product-category/digital-printing-service-in-colombo",
        destination: "/product-category/digital-printing",
        permanent: true,
      },
      {
        source: "/product-category/laser-cutting-and-engraving",
        destination: "/product-category/laser-cutting-engraving",
        permanent: true,
      },
      {
        source: "/product-category/promotional-and-gift-items",
        destination: "/product-category/promotional-gift-items",
        permanent: true,
      },
      {
        source: "/product-category/signage-boards-in-sri-lanka/page/2",
        destination: "/product-category/signage-boards",
        permanent: true,
      },
      {
        source: "/product-category/stainless-steel-and-brass-engraving",
        destination: "/product-category/stainless-steel-brass-engraving",
        permanent: true,
      },
      {
        source: "/product-category/sticker-printing-and-cutting",
        destination: "/product-category/sticker-printing-cutting",
        permanent: true,
      },
      // — Old product tags with a confident match (rest: wildcard below) (68)
      {
        source: "/product-tag/acrylic-donation-box",
        destination: "/product/acrylic-donation-box-built-in-lock-series",
        permanent: true,
      },
      {
        source: "/product-tag/acrylic-key-tags",
        destination: "/product/acrylic-key-tags",
        permanent: true,
      },
      {
        source: "/product-tag/acrylic-name-plate-holder",
        destination: "/product/acrylic-name-plate-holder-removable-type",
        permanent: true,
      },
      {
        source: "/product-tag/acrylic-tag-printing-sri-lanka",
        destination: "/product-category/custom-acrylic-products",
        permanent: true,
      },
      {
        source: "/product-tag/acrylic-tags",
        destination: "/product/acrylic-key-tags",
        permanent: true,
      },
      {
        source: "/product-tag/adhesive-stickers",
        destination: "/product-category/sticker-printing-cutting",
        permanent: true,
      },
      {
        source: "/product-tag/barcode-acrylic-tags",
        destination: "/product/acrylic-key-tags",
        permanent: true,
      },
      {
        source: "/product-tag/branded-coasters",
        destination: "/product/wooden-coasters",
        permanent: true,
      },
      {
        source: "/product-tag/branded-key-tags",
        destination: "/product/wooden-key-tags",
        permanent: true,
      },
      {
        source: "/product-tag/branding-stickers",
        destination: "/product-category/sticker-printing-cutting",
        permanent: true,
      },
      {
        source: "/product-tag/brass-engraved-house-name-plates",
        destination: "/product/brass-house-number-plates",
        permanent: true,
      },
      {
        source: "/product-tag/brass-house-number-plates",
        destination: "/product/brass-house-number-plates",
        permanent: true,
      },
      {
        source: "/product-tag/brass-name-board",
        destination: "/product/brass-engraved-name-plate",
        permanent: true,
      },
      {
        source: "/product-tag/clear-acrylic-tokens",
        destination: "/product/printed-acrylic-tokens-and-tags",
        permanent: true,
      },
      {
        source: "/product-tag/custom-acrylic-tags",
        destination: "/product-category/custom-acrylic-products",
        permanent: true,
      },
      {
        source: "/product-tag/custom-coasters",
        destination: "/product/wooden-coasters",
        permanent: true,
      },
      {
        source: "/product-tag/custom-floor-stickers",
        destination: "/product/custom-floor-stickers-and-decals",
        permanent: true,
      },
      {
        source: "/product-tag/custom-key-tags",
        destination: "/product/wooden-key-tags",
        permanent: true,
      },
      {
        source: "/product-tag/custom-paper-stickers",
        destination: "/product/printed-paper-sticker-sheets",
        permanent: true,
      },
      {
        source: "/product-tag/custom-size-metal-badges",
        destination: "/product/engraved-metal-pin-badges-sri-lanka",
        permanent: true,
      },
      {
        source: "/product-tag/directional-floor-stickers",
        destination: "/product/custom-floor-stickers-and-decals",
        permanent: true,
      },
      {
        source: "/product-tag/donation-box",
        destination: "/product/acrylic-donation-box-built-in-lock-series",
        permanent: true,
      },
      {
        source: "/product-tag/donation-box-sri-lanka",
        destination: "/product/acrylic-donation-box-built-in-lock-series",
        permanent: true,
      },
      {
        source: "/product-tag/engraved-door-plate",
        destination: "/product/brass-engraved-name-plate",
        permanent: true,
      },
      {
        source: "/product-tag/engraved-house-name-plate",
        destination: "/product/brass-engraved-name-plate",
        permanent: true,
      },
      {
        source: "/product-tag/engraved-key-tags",
        destination: "/product/wooden-key-tags",
        permanent: true,
      },
      {
        source: "/product-tag/engraved-ss-badges",
        destination: "/product/engraved-metal-pin-badges-sri-lanka",
        permanent: true,
      },
      {
        source: "/product-tag/engraved-wooden-coasters",
        destination: "/product/wooden-coasters",
        permanent: true,
      },
      {
        source: "/product-tag/flex-banner",
        destination: "/product/flex-banner-printing",
        permanent: true,
      },
      {
        source: "/product-tag/floor-marking-stickers",
        destination: "/product/custom-floor-stickers-and-decals",
        permanent: true,
      },
      {
        source: "/product-tag/glass-stickers",
        destination: "/product/printed-transparent-stickers",
        permanent: true,
      },
      {
        source: "/product-tag/gloss-stickers",
        destination: "/product-category/sticker-printing-cutting",
        permanent: true,
      },
      {
        source: "/product-tag/instruction-stickers",
        destination: "/product-category/sticker-printing-cutting",
        permanent: true,
      },
      {
        source: "/product-tag/key-tag-printing",
        destination: "/product/acrylic-key-tags",
        permanent: true,
      },
      {
        source: "/product-tag/key-tags-acrylic",
        destination: "/product/acrylic-key-tags",
        permanent: true,
      },
      {
        source: "/product-tag/l-shape-brochure-holder",
        destination: "/product/acrylic-l-shape-stands",
        permanent: true,
      },
      {
        source: "/product-tag/laminated-sticker-sheets",
        destination: "/product/printed-paper-sticker-sheets",
        permanent: true,
      },
      {
        source: "/product-tag/locker-key-tags",
        destination: "/product/wooden-key-tags",
        permanent: true,
      },
      {
        source: "/product-tag/logo-acrylic-tags",
        destination: "/product/acrylic-key-tags",
        permanent: true,
      },
      {
        source: "/product-tag/logo-acrylic-tokens",
        destination: "/product/printed-acrylic-tokens-and-tags",
        permanent: true,
      },
      {
        source: "/product-tag/logo-coasters",
        destination: "/product/wooden-coasters",
        permanent: true,
      },
      {
        source: "/product-tag/luggage-tags-acrylic",
        destination: "/product/acrylic-key-tags",
        permanent: true,
      },
      {
        source: "/product-tag/marketing-banner-printing-sri-lanka",
        destination: "/product/flex-banner-printing",
        permanent: true,
      },
      {
        source: "/product-tag/matt-stickers",
        destination: "/product-category/sticker-printing-cutting",
        permanent: true,
      },
      {
        source: "/product-tag/membership-card-printing",
        destination: "/product/membership-cards-printing",
        permanent: true,
      },
      {
        source: "/product-tag/name-tags-acrylic",
        destination: "/product/acrylic-name-badge",
        permanent: true,
      },
      {
        source: "/product-tag/numbered-acrylic-tokens",
        destination: "/product/printed-acrylic-tokens-and-tags",
        permanent: true,
      },
      {
        source: "/product-tag/outdoor-floor-stickers",
        destination: "/product/custom-floor-stickers-and-decals",
        permanent: true,
      },
      {
        source: "/product-tag/photoluminescent-stickers",
        destination: "/product/photoluminescent-stickers-printing",
        permanent: true,
      },
      {
        source: "/product-tag/printed-acrylic-tokens",
        destination: "/product/printed-acrylic-tokens-and-tags",
        permanent: true,
      },
      {
        source: "/product-tag/pvc-stickers",
        destination: "/product/printed-pvc-stickers",
        permanent: true,
      },
      {
        source: "/product-tag/qr-code-acrylic-tags",
        destination: "/product/qr-code-stands",
        permanent: true,
      },
      {
        source: "/product-tag/qr-code-stand",
        destination: "/product/qr-code-stands",
        permanent: true,
      },
      {
        source: "/product-tag/radium-stickers",
        destination: "/product/photoluminescent-stickers-printing",
        permanent: true,
      },
      {
        source: "/product-tag/safety-floor-decals",
        destination: "/product/custom-floor-stickers-and-decals",
        permanent: true,
      },
      {
        source: "/product-tag/social-distancing-floor-stickers",
        destination: "/product/custom-floor-stickers-and-decals",
        permanent: true,
      },
      {
        source: "/product-tag/ss-house-number-plate",
        destination: "/product/stainless-steel-house-number-plates",
        permanent: true,
      },
      {
        source: "/product-tag/stainless-steel-signage",
        destination: "/product-category/stainless-steel-brass-engraving",
        permanent: true,
      },
      {
        source: "/product-tag/sticker-printing-sri-lanka",
        destination: "/product-category/sticker-printing-cutting",
        permanent: true,
      },
      {
        source: "/product-tag/table-top-name-tag-holder",
        destination: "/product/table-top-notice-holder",
        permanent: true,
      },
      {
        source: "/product-tag/token-printing-sri-lanka",
        destination: "/product/printed-acrylic-tokens-and-tags",
        permanent: true,
      },
      {
        source: "/product-tag/transparent-acrylic-box",
        destination: "/product/custom-acrylic-boxes",
        permanent: true,
      },
      {
        source: "/product-tag/transparent-acrylic-tags",
        destination: "/product/acrylic-key-tags",
        permanent: true,
      },
      {
        source: "/product-tag/uv-printed-acrylic-tokens",
        destination: "/product/printed-acrylic-tokens-and-tags",
        permanent: true,
      },
      {
        source: "/product-tag/uv-printed-key-tags",
        destination: "/product/acrylic-key-tags",
        permanent: true,
      },
      {
        source: "/product-tag/uv-printing-sri-lanka",
        destination: "/product-category/uv-flatbed-printing",
        permanent: true,
      },
      {
        source: "/product-tag/wooden-coasters",
        destination: "/product/wooden-coasters",
        permanent: true,
      },
      {
        source: "/product-tag/x-banner-stands",
        destination: "/product/pull-up-banner-stands",
        permanent: true,
      },
      // — Old service / landing / misc pages (28)
      {
        source: "/badges-tags-printing-engraving-in-srilanka",
        destination: "/product-category/badges-tags",
        permanent: true,
      },
      {
        source: "/blog-full-width",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog-v1",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog-v3",
        destination: "/",
        permanent: true,
      },
      {
        source: "/business-cards/customize-business-cards",
        destination: "/product/pvc-translucent-business-cards",
        permanent: true,
      },
      {
        source: "/careers",
        destination: "/career",
        permanent: true,
      },
      {
        source: "/consultation",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/custom-acrylic-products-and-creations-in-srilanka",
        destination: "/product-category/custom-acrylic-products",
        permanent: true,
      },
      {
        source: "/faq",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/home-3",
        destination: "/",
        permanent: true,
      },
      {
        source: "/laser-cutting-engraving-service-in-sri-lanka",
        destination: "/product-category/laser-cutting-engraving",
        permanent: true,
      },
      {
        source: "/my-account-2",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/paper-type/art-paper-150-gsm",
        destination: "/product-category/paper-material-printing",
        permanent: true,
      },
      {
        source: "/plastic-card-printing-in-srilanka",
        destination: "/product-category/pvc-card-printing",
        permanent: true,
      },
      {
        source: "/privacy",
        destination: "/terms-and-conditions",
        permanent: true,
      },
      {
        source: "/product-category",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/request-quote",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/sample-page-2",
        destination: "/",
        permanent: true,
      },
      {
        source: "/screen-printing-in-sri-lanka",
        destination: "/product-category/digital-printing",
        permanent: true,
      },
      {
        source: "/signage-boards/cctv-camera-sign-in-srilanka",
        destination: "/product-category/signage-boards",
        permanent: true,
      },
      {
        source: "/site",
        destination: "/",
        permanent: true,
      },
      {
        source: "/stainless-steel-brass-engraving-etching-in-srilanka",
        destination: "/product-category/stainless-steel-brass-engraving",
        permanent: true,
      },
      {
        source: "/sticker-printing-cutting-service-in-colombo-sri-lanka",
        destination: "/product-category/sticker-printing-cutting",
        permanent: true,
      },
      {
        source: "/store-digital-printing-uv-printing-laser-cutting-in-sri-lanka",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/store-directory",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/terms-and-conditions",
        permanent: true,
      },
      {
        source: "/track-your-order",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/uv-printing-in-srilanka",
        destination: "/product-category/uv-flatbed-printing",
        permanent: true,
      },
      // — Remaining old product tags → catalogue (1)
      {
        source: "/product-tag/:path*",
        destination: "/products",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${apiOrigin}/api/:path*` },
      { source: "/graphql", destination: `${apiOrigin}/graphql` },
      // Product images live on Laravel public disk / static files — Next (3000) must proxy these for next/image + <img>
      { source: "/storage/:path*", destination: `${apiOrigin}/storage/:path*` },
      { source: "/images/:path*", destination: `${apiOrigin}/images/:path*` },
    ];
  },
};

export default nextConfig;
