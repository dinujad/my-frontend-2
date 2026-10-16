import type { Metadata } from "next";
import { CareersContent } from "@/components/career/CareersContent";
import { getJobOpenings } from "@/lib/job-openings";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://printworks.lk";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Print Works.LK in Biyagama. View open roles and apply for graphic design, accounts, and more.",
  alternates: {
    canonical: `${SITE_URL}/career`,
  },
  openGraph: {
    title: "Careers | Print Works.LK",
    description:
      "Join Print Works.LK in Biyagama. View open roles and apply for graphic design, accounts, and more.",
    url: `${SITE_URL}/career`,
    siteName: "Print Works.LK",
    type: "website",
    images: [{ url: `${SITE_URL}/images/logo.png` }],
  },
};

export const dynamic = "force-dynamic";

export default async function CareerPage() {
  const openings = await getJobOpenings();

  return (
    <main>
      <CareersContent openings={openings} />
    </main>
  );
}
