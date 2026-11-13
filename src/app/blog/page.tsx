import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts, formatBlogDate } from "@/lib/blog-posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://printworks.lk";

export const metadata: Metadata = {
  // Bare title: the root layout template appends " | Print Works.LK".
  title: "Blog",
  description:
    "Printing guides from Print Works.LK: sticker printing, prices and quotes, laptop stickers and more, for customers across Sri Lanka.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Blog | Print Works.LK",
    description:
      "Printing guides from Print Works.LK: sticker printing, prices and quotes, laptop stickers and more, for customers across Sri Lanka.",
    url: `${SITE_URL}/blog`,
    siteName: "Print Works.LK",
    type: "website",
    images: [{ url: `${SITE_URL}/images/logo.png` }],
  },
};

export default function BlogListingPage() {
  const posts = [...blogPosts].sort((a, b) =>
    b.datePublished.localeCompare(a.datePublished),
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fdf2f4] via-white to-gray-50">
      <section className="border-b border-brand-red/10 bg-gradient-to-r from-gray-900 via-nav-dark to-gray-900 text-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
            Print Works.LK
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Blog
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base">
            Printing guides and buying advice from Print Works.LK, for
            customers across Sri Lanka.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="grid gap-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {formatBlogDate(post.datePublished)}
              </p>
              <h2 className="mt-2 text-lg font-bold text-gray-900 sm:text-xl">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-brand-red"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-[15px]">
                {post.excerpt}
              </p>
              <p className="mt-4 text-sm">
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-semibold text-brand-red underline decoration-brand-red/40 underline-offset-2 hover:decoration-brand-red"
                >
                  Read more
                </Link>
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
