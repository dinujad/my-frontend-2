import type { NextConfig } from "next";

const apiOrigin = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/** Allow next/image for product media served from the configured API host (Coolify sslip.io, api subdomain, etc.) */
function remotePatternsForApi(origin: string) {
  const patterns: NonNullable<NextConfig["images"]> extends { remotePatterns?: infer P } ? P : never> = [];
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
