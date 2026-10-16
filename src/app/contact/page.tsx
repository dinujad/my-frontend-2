import type { Metadata } from "next";
import { ContactGSAP } from "@/components/contact/ContactGSAP";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://printworks.lk";

export const metadata: Metadata = {
  // Bare title: the root layout template appends " | Print Works.LK".
  title: "Contact Us",
  description:
    "Get in touch for quotes, orders, or support. Sri Lanka's trusted online printing platform.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: "Contact Us | Print Works.LK",
    description:
      "Get in touch for quotes, orders, or support. Sri Lanka's trusted online printing platform.",
    url: `${SITE_URL}/contact`,
    siteName: "Print Works.LK",
    type: "website",
    images: [{ url: `${SITE_URL}/images/logo.png` }],
  },
};

export default function ContactPage() {
  return (
    <main>
      <ContactGSAP />
    </main>
  );
}
