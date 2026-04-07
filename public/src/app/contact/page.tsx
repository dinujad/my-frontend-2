import type { Metadata } from "next";
import { ContactGSAP } from "@/components/contact/ContactGSAP";

export const metadata: Metadata = {
  title: "Contact Us | Print Works.LK",
  description:
    "Get in touch for quotes, orders, or support. Sri Lanka's trusted online printing platform.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactGSAP />
    </main>
  );
}
