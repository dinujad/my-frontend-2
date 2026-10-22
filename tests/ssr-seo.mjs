/**
 * Local SSR check. Talks only to 127.0.0.1 and sends x-forwarded-proto: https
 * so the app middleware does not redirect the request to https://printworks.lk.
 */
import http from "node:http";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const API_PORT = 4199;
const WEB_PORT = 4188;
const CUSTOM_DESCRIPTION = `Custom acrylic bookmarks. ${"Complete admin description. ".repeat(8)}`.trim();

const products = {
  "acrylic-bookmarks": {
    id: 1,
    slug: "acrylic-bookmarks",
    title: "Acrylic Bookmarks",
    description: "Visible long description that must stay off the meta description.",
    short_description: "Short acrylic bookmark summary.",
    price: "Rs. 250.00",
    numericPrice: 250,
    oldPrice: null,
    image: "/images/logo.png",
    image_alt: "Acrylic bookmark photo",
    badge: null,
    sku: "AB-1",
    category: "Acrylic",
    categorySlug: "acrylic",
    seo_title: "Custom Acrylic Bookmarks in Sri Lanka",
    seo_description: CUSTOM_DESCRIPTION,
    page_settings: { hide_related: 1 },
    variations: [],
    gallery: [],
    enable_reviews: false,
  },
  "plain-bookmarks": {
    id: 2,
    slug: "plain-bookmarks",
    title: "Plain Bookmarks",
    description: "B".repeat(180),
    short_description: "   ",
    price: "Rs. 100.00",
    numericPrice: 100,
    oldPrice: null,
    image: "/images/logo.png",
    badge: null,
    sku: "PB-1",
    category: "Acrylic",
    categorySlug: "acrylic",
    seo_title: " ",
    seo_description: null,
    page_settings: { hide_related: 1 },
    variations: [],
    gallery: [],
    enable_reviews: false,
  },
  "branded-bookmarks": {
    id: 3,
    slug: "branded-bookmarks",
    title: "Branded Bookmarks",
    description: "Visible description",
    short_description: "Short branded summary.",
    price: "Rs. 100.00",
    numericPrice: 100,
    oldPrice: null,
    image: "/images/logo.png",
    badge: null,
    sku: "BB-1",
    category: "Acrylic",
    categorySlug: "acrylic",
    seo_title: "Branded Bookmarks | Printworks.lk",
    seo_description: "Description that already belongs to the branded title.",
    page_settings: { hide_related: 1 },
    variations: [],
    gallery: [],
    enable_reviews: false,
  },
};

const apiHits = [];
const api = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://127.0.0.1:${API_PORT}`);
  apiHits.push(url.pathname);
  res.setHeader("Content-Type", "application/json");
  if (url.pathname === "/api/v1/seo-settings" || url.pathname === "/api/seo-settings") {
    res.end(JSON.stringify({
      site_title: "Print Works Sri Lanka Custom Printing",
      site_description: "Island-wide custom printing from the admin site description.",
      google_analytics_id: "G-SECRET",
      robots_txt: "User-agent: *",
    }));
    return;
  }
  const productMatch = url.pathname.match(/^\/api\/v1\/products\/([^/]+)$/);
  if (productMatch) {
    const product = products[decodeURIComponent(productMatch[1])];
    if (!product) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: "Not found" }));
      return;
    }
    res.end(JSON.stringify(product));
    return;
  }
  if (url.pathname === "/api/v1/categories/acrylic") {
    res.end(JSON.stringify({ slug: "acrylic", name: "Acrylic" }));
    return;
  }
  if (url.pathname === "/api/v1/products" || url.pathname.startsWith("/api/v1/products/by-category/")) {
    res.end("[]");
    return;
  }
  res.statusCode = 404;
  res.end(JSON.stringify({ message: "Not found" }));
});

function metaContent(html, key) {
  const patterns = [
    new RegExp(`<meta[^>]*\\b(?:name|property)=["']${key}["'][^>]*\\bcontent=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]*\\bcontent=["']([^"']*)["'][^>]*\\b(?:name|property)=["']${key}["']`, "i"),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function titleText(html) {
  return html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? null;
}

async function fetchLocal(pathname) {
  const response = await fetch(`http://127.0.0.1:${WEB_PORT}${pathname}`, {
    redirect: "manual",
    headers: {
      "x-forwarded-proto": "https",
      accept: "text/html",
    },
  });
  const location = response.headers.get("location") ?? "";
  if (location.includes("printworks.lk")) {
    throw new Error(`Redirected to production: ${location}`);
  }
  if (response.status !== 200) {
    throw new Error(`${pathname} returned ${response.status} ${location}`);
  }
  return response.text();
}

function assertIncludes(label, actual, expected) {
  if (actual !== expected) {
    throw new Error(`${label}\n  actual:   ${actual}\n  expected: ${expected}`);
  }
}

await new Promise((resolve) => api.listen(API_PORT, "127.0.0.1", resolve));

const next = spawn("npx", ["next", "dev", "-p", String(WEB_PORT), "-H", "127.0.0.1"], {
  cwd: fileURLToPath(new URL("..", import.meta.url)),
  env: {
    ...process.env,
    NEXT_PUBLIC_API_URL: `http://127.0.0.1:${API_PORT}`,
    NEXT_PUBLIC_SITE_URL: `http://127.0.0.1:${WEB_PORT}`,
    NEXT_PUBLIC_MAINTENANCE_MODE: "false",
  },
  shell: true,
  stdio: ["ignore", "pipe", "pipe"],
});

let nextLog = "";
next.stdout.on("data", (chunk) => {
  nextLog += chunk.toString();
});
next.stderr.on("data", (chunk) => {
  nextLog += chunk.toString();
});

function stop() {
  api.close();
  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", String(next.pid), "/t", "/f"], { shell: true, stdio: "ignore" });
  } else {
    next.kill();
  }
}

try {
  const readyDeadline = Date.now() + 120000;
  while (!/Ready|started server|Local:/i.test(nextLog)) {
    if (Date.now() > readyDeadline) {
      throw new Error(`Next dev did not start\n${nextLog.slice(-2000)}`);
    }
    if (next.exitCode != null) {
      throw new Error(`Next dev exited ${next.exitCode}\n${nextLog.slice(-2000)}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  const home = await fetchLocal("/");
  assertIncludes("home title", titleText(home), "Print Works Sri Lanka Custom Printing");
  assertIncludes(
    "home description",
    metaContent(home, "description"),
    "Island-wide custom printing from the admin site description."
  );
  assertIncludes("home og:title", metaContent(home, "og:title"), "Print Works Sri Lanka Custom Printing");
  assertIncludes(
    "home og:description",
    metaContent(home, "og:description"),
    "Island-wide custom printing from the admin site description."
  );
  assertIncludes("home twitter:title", metaContent(home, "twitter:title"), "Print Works Sri Lanka Custom Printing");
  assertIncludes(
    "home twitter:description",
    metaContent(home, "twitter:description"),
    "Island-wide custom printing from the admin site description."
  );
  if (home.includes("G-SECRET")) throw new Error("Homepage HTML exposed a private SEO setting");

  const acrylic = await fetchLocal("/product/acrylic-bookmarks");
  const acrylicTitle = "Custom Acrylic Bookmarks in Sri Lanka | Print Works.LK";
  assertIncludes("product title", titleText(acrylic), acrylicTitle);
  assertIncludes("product og:title", metaContent(acrylic, "og:title"), acrylicTitle);
  assertIncludes("product twitter:title", metaContent(acrylic, "twitter:title"), acrylicTitle);
  assertIncludes("product description", metaContent(acrylic, "description"), CUSTOM_DESCRIPTION);
  assertIncludes("product og:description", metaContent(acrylic, "og:description"), CUSTOM_DESCRIPTION);
  assertIncludes("product twitter:description", metaContent(acrylic, "twitter:description"), CUSTOM_DESCRIPTION);
  if (!acrylic.includes(">Acrylic Bookmarks<")) {
    throw new Error("Visible product heading changed");
  }
  if (acrylic.includes("Acrylic Bookmarks | Print Works.LK | Print Works.LK")) {
    throw new Error("Brand suffix was added twice");
  }

  const plain = await fetchLocal("/product/plain-bookmarks");
  const plainTitle = "Plain Bookmarks | Print Works.LK";
  assertIncludes("plain title", titleText(plain), plainTitle);
  assertIncludes("plain og:title", metaContent(plain, "og:title"), plainTitle);
  assertIncludes("plain description", metaContent(plain, "description"), `${"B".repeat(155)}…`);

  const branded = await fetchLocal("/product/branded-bookmarks");
  const brandedTitle = "Branded Bookmarks | Printworks.lk";
  assertIncludes("branded title", titleText(branded), brandedTitle);
  assertIncludes("branded og:title", metaContent(branded, "og:title"), brandedTitle);
  assertIncludes("branded twitter:title", metaContent(branded, "twitter:title"), brandedTitle);
  if (branded.includes("Printworks.lk | Print Works.LK")) {
    throw new Error("Existing brand suffix was suffixed again");
  }

  const offHost = apiHits.filter((path) => path.startsWith("http") || path.includes("printworks.lk"));
  if (offHost.length) throw new Error(`API mock saw a non-local path: ${offHost.join(", ")}`);
  if (!apiHits.includes("/api/v1/seo-settings")) throw new Error("Site settings endpoint was not requested");
  if (!apiHits.includes("/api/v1/products/acrylic-bookmarks")) throw new Error("Product endpoint was not requested");

  console.log("SSR SEO checks passed");
  console.log(`Local API requests: ${[...new Set(apiHits)].join(", ")}`);
} finally {
  stop();
}
