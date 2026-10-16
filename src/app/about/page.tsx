import type { Metadata } from "next";
import { AboutGSAPScroll } from "@/components/about/AboutGSAPScroll";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://printworks.lk";

export const metadata: Metadata = {
  // Bare title: the root layout template appends " | Print Works.LK".
  title: "About Us",
  description:
    "Our story, mission, and why brands choose us. Sri Lanka's trusted online printing platform.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About Us | Print Works.LK",
    description:
      "Our story, mission, and why brands choose us. Sri Lanka's trusted online printing platform.",
    url: `${SITE_URL}/about`,
    siteName: "Print Works.LK",
    type: "website",
    images: [{ url: `${SITE_URL}/images/logo.png` }],
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <AboutGSAPScroll />
    </main>
  );
}
