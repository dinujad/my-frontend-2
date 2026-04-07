import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://printworks.lk";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Print Works.LK order — delivery across Sri Lanka.",
  alternates: {
    canonical: `${SITE_URL}/checkout`,
  },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
