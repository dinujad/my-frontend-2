import type { Metadata } from "next";
import { AboutGSAPScroll } from "@/components/about/AboutGSAPScroll";

export const metadata: Metadata = {
  title: "About Us | Print Works.LK",
  description:
    "Our story, mission, and why brands choose us. Sri Lanka's trusted online printing platform.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fdf2f4] overflow-x-hidden">
      <AboutGSAPScroll />
    </main>
  );
}
