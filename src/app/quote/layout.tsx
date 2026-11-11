import type { Metadata } from "next";

// The quote page itself is a client component, so its metadata lives here.
// Bare title: the root layout template appends " | Print Works.LK".
export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Request a custom printing quote in Sri Lanka — stickers, signage, acrylic products, PVC cards and more from Print Works. Island-wide delivery.",
};

export default function QuoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
