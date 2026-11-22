import type { Metadata } from "next";
import WishlistPageClient from "./WishlistPageClient";
import { getPriceOnRequestProductIds } from "@/lib/products-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://printworks.lk";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved products at Print Works.LK.",
  alternates: {
    canonical: `${SITE_URL}/wishlist`,
  },
  robots: { index: false, follow: false },
};

export default async function WishlistPage() {
  const priceOnRequestIds = await getPriceOnRequestProductIds();
  return <WishlistPageClient priceOnRequestIds={priceOnRequestIds} />;
}
