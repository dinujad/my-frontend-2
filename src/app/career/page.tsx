import type { Metadata } from "next";
import { CareersContent } from "@/components/career/CareersContent";
import { getJobOpenings } from "@/lib/job-openings";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Print Works.LK in Biyagama. View open roles and apply for graphic design, accounts, and more.",
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
