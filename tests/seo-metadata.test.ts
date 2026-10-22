import assert from "node:assert/strict";
import http from "node:http";
import test from "node:test";
import { normalizeProduct, type ProductItem } from "../src/lib/products-data.ts";
import {
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_TITLE,
  applyPublicSiteSeo,
  fetchPublicSiteSeo,
  hasTrailingBrand,
  htmlTitle,
  resolveProductSeo,
  socialTitle,
} from "../src/lib/seo-metadata.ts";

const LONG_COPY = "A".repeat(180);
const CUSTOM_DESCRIPTION = `Custom acrylic bookmarks. ${"Complete admin description. ".repeat(8)}`.trim();

function product(overrides: Partial<ProductItem> = {}): ProductItem {
  return {
    id: 1,
    slug: "acrylic-bookmarks",
    title: "Acrylic Bookmarks",
    category: "Acrylic",
    description: LONG_COPY,
    short_description: "Short acrylic bookmark summary for cards.",
    price: "Rs. 1.00",
    numericPrice: 1,
    oldPrice: null,
    image: "/images/logo.png",
    badge: null,
    sku: "AB-1",
    ...overrides,
  };
}

test("admin SEO fields outrank curated copy and product copy, independently", () => {
  const both = resolveProductSeo(
    product({
      seo_title: "Custom Acrylic Bookmarks in Sri Lanka",
      seo_description: CUSTOM_DESCRIPTION,
    }),
    { title: "Curated title", description: "Curated description" }
  );
  assert.equal(both.title, "Custom Acrylic Bookmarks in Sri Lanka");
  assert.equal(both.description, CUSTOM_DESCRIPTION);
  assert.ok(both.description.length > 155);

  const titleOnly = resolveProductSeo(
    product({ seo_title: "Admin title only", seo_description: "   " }),
    { description: "Curated description" }
  );
  assert.equal(titleOnly.title, "Admin title only");
  assert.equal(titleOnly.description, "Curated description");

  const descriptionOnly = resolveProductSeo(
    product({ seo_title: null, seo_description: CUSTOM_DESCRIPTION }),
    { title: "Curated title" }
  );
  assert.equal(descriptionOnly.title, "Curated title");
  assert.equal(descriptionOnly.description, CUSTOM_DESCRIPTION);
});

test("blank admin fields fall through curated override, then product copy", () => {
  const curated = resolveProductSeo(product({ seo_title: "", seo_description: "\n" }), {
    title: " Curated bookmark title ",
    description: " Curated bookmark description ",
  });
  assert.equal(curated.title, "Curated bookmark title");
  assert.equal(curated.description, "Curated bookmark description");

  const copy = resolveProductSeo(product({ seo_title: null, seo_description: undefined }));
  assert.equal(copy.title, "Acrylic Bookmarks");
  assert.equal(copy.description, "Short acrylic bookmark summary for cards.");

  const longFallback = resolveProductSeo(
    product({ short_description: "  ", seo_description: null })
  );
  assert.equal(longFallback.description, `${"A".repeat(155)}…`);
});

test("brand suffix is recognized once for both spellings", () => {
  assert.equal(hasTrailingBrand("Custom Acrylic Bookmarks | Printworks.lk"), true);
  assert.equal(hasTrailingBrand("Custom Acrylic Bookmarks | Print Works.LK"), true);
  assert.equal(hasTrailingBrand("Custom Acrylic Bookmarks |  print   works.lk  "), true);
  assert.equal(hasTrailingBrand("Custom Acrylic Bookmarks"), false);
  assert.equal(hasTrailingBrand("Print Works.LK bookmarks"), false);

  const plain = "Custom Acrylic Bookmarks in Sri Lanka";
  assert.equal(htmlTitle(plain), plain);
  assert.equal(socialTitle(plain), `${plain} | Print Works.LK`);

  for (const branded of [
    "Custom Acrylic Bookmarks | Printworks.lk",
    "Custom Acrylic Bookmarks | Print Works.LK",
  ]) {
    assert.deepEqual(htmlTitle(branded), { absolute: branded });
    assert.equal(socialTitle(branded), branded);
    assert.equal(socialTitle(`  ${branded}  `), branded);
  }
});

test("site settings keep only nonblank public fields and survive bad responses", async () => {
  assert.deepEqual(
    applyPublicSiteSeo({
      site_title: "  Shop title  ",
      site_description: "   ",
      google_analytics_id: "G-SECRET",
      robots_txt: "User-agent: *",
    }),
    { title: "Shop title", description: DEFAULT_SITE_DESCRIPTION }
  );

  assert.deepEqual(applyPublicSiteSeo(["not", "an", "object"]), {
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
  });
  assert.deepEqual(applyPublicSiteSeo(null), {
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
  });

  const calls: Array<{ url: string; cache?: RequestCache }> = [];
  const ok = await fetchPublicSiteSeo(
    async (url, init) => {
      calls.push({ url: String(url), cache: init?.cache });
      return new Response(
        JSON.stringify({
          site_title: "Live title",
          site_description: "Live description",
          google_analytics_id: "G-SECRET",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    },
    { apiBase: "http://127.0.0.1:9", timeoutMs: 200 }
  );
  assert.deepEqual(ok, { title: "Live title", description: "Live description" });
  assert.equal(calls[0]?.url, "http://127.0.0.1:9/api/v1/seo-settings");
  assert.equal(calls[0]?.cache, "no-store");

  const down = await fetchPublicSiteSeo(async () => new Response("nope", { status: 500 }), {
    timeoutMs: 200,
  });
  assert.equal(down.title, DEFAULT_SITE_TITLE);

  const malformed = await fetchPublicSiteSeo(
    async () => new Response("not-json", { status: 200, headers: { "Content-Type": "text/plain" } }),
    { timeoutMs: 200 }
  );
  assert.equal(malformed.description, DEFAULT_SITE_DESCRIPTION);

  const stalled = http.createServer(() => {
    /* leave the request open so the client timeout must win */
  });
  await new Promise<void>((resolve) => stalled.listen(0, "127.0.0.1", () => resolve()));
  const address = stalled.address();
  const port = typeof address === "object" && address ? address.port : 0;
  try {
    const timedOut = await fetchPublicSiteSeo(fetch, {
      apiBase: `http://127.0.0.1:${port}`,
      timeoutMs: 50,
    });
    assert.equal(timedOut.title, DEFAULT_SITE_TITLE);
    assert.equal(timedOut.description, DEFAULT_SITE_DESCRIPTION);
  } finally {
    await new Promise<void>((resolve) => stalled.close(() => resolve()));
  }
});

test("normalization keeps admin SEO fields, including blanks, and drops non-strings", () => {
  const kept = normalizeProduct(
    product({
      seo_title: "  Custom Acrylic Bookmarks in Sri Lanka  ",
      seo_description: " ",
    })
  );
  assert.equal(kept.seo_title, "  Custom Acrylic Bookmarks in Sri Lanka  ");
  assert.equal(kept.seo_description, " ");
  assert.equal(kept.title, "Acrylic Bookmarks");

  const missing = normalizeProduct(product());
  assert.equal(missing.seo_title, null);
  assert.equal(missing.seo_description, null);
});
