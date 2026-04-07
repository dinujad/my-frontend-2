// robots.txt: allow public pages, block cart/checkout/account and internal search.
// Sitemap URL is included for crawlers.

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/products-data";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/cart",
          "/wishlist",
          "/checkout",
          "/account",
          "/account/",
          "/search",
          "/api/",
          "/admin",
          "/admin/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
