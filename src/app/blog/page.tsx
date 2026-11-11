import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/data/blog-posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://printworks.lk";

export const metadata: Metadata = {
  // Bare title: the root layout template appends " | Print Works.LK".
  title: "Blog",
  description:
    "Printing guides from Print Works — sticker printing, digital printing and more, made in Sri Lanka. Island-wide delivery.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Blog | Print Works.LK",
    description:
      "Printing guides from Print Works — sticker printing, digital printing and more, made in Sri Lanka. Island-wide delivery.",
    url: `${SITE_URL}/blog`,
    siteName: "Print Works.LK",
    type: "website",
    images: [{ url: `${SITE_URL}/images/logo.png` }],
  },
};

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="relative bg-nav-dark py-16 lg:py-20 overflow-hidden">
        <div className="relative mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Print Works <span className="text-brand-red">Blog</span>
          </h1>
          <p className="text-gray-300 max-w-2xl text-lg">
            Printing guides and ideas — sticker printing, digital printing and
            more, made in Sri Lanka.
          </p>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-400 mt-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-brand-red">Blog</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-[0_0_20px_rgba(0,0,0,0.08)] transition-shadow"
            >
              <p className="text-xs font-medium text-gray-400 mb-3">
                {formatDate(post.date)}
              </p>
              <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-3">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-brand-red transition-colors"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {post.description}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-auto inline-flex w-fit items-center gap-2 text-sm font-bold text-brand-red hover:underline"
              >
                Read the guide
                <span aria-hidden>→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
