import type { Metadata } from "next";
import CartPageClient from "./CartPageClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://printworks.lk";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review your Print Works.LK cart and proceed to checkout.",
  alternates: {
    canonical: `${SITE_URL}/cart`,
  },
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartPageClient />;
}
