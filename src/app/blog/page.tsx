import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts, formatBlogDate, getReadingTime } from "@/lib/blog-posts";
import { getApiBlogPosts } from "@/lib/blog-data";
import { BlogCard } from "@/components/blog/BlogArticle";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://printworks.lk";
const TITLE = "Printing Guides in Sri Lanka";
const DESCRIPTION =
  "Printing guides from Print Works.LK: digital printing, stickers, acrylic badges and name plates, and more, for customers across Sri Lanka.";

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category } = await searchParams;
  return {
    // Bare title: the root layout template appends " | Print Works.LK".
    title: TITLE,
    description: DESCRIPTION,
    // Category views are filters of the same list, so they all point at /blog.
    alternates: { canonical: `${SITE_URL}/blog` },
    ...(category ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: `${TITLE} | Print Works.LK`,
      description: DESCRIPTION,
      url: `${SITE_URL}/blog`,
      siteName: "Print Works.LK",
      locale: "en_LK",
      type: "website",
      images: [{ url: `${SITE_URL}/images/logo.png` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${TITLE} | Print Works.LK`,
      description: DESCRIPTION,
    },
  };
}

export default async function BlogListingPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const apiPosts = await getApiBlogPosts();
  const allPosts = [...(apiPosts ?? blogPosts)].sort((a, b) => b.datePublished.localeCompare(a.datePublished));

  const categories = Array.from(
    new Map(allPosts.filter((p) => p.category).map((p) => [p.category!.slug, p.category!])).values(),
  );
  const activeCategory = categories.find((c) => c.slug === category) ?? null;
  const posts = activeCategory ? allPosts.filter((p) => p.category?.slug === activeCategory.slug) : allPosts;
  const [featured, ...rest] = posts;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "@id": `${SITE_URL}/blog#blog`,
      name: "Print Works.LK Blog",
      description: DESCRIPTION,
      url: `${SITE_URL}/blog`,
      inLanguage: "en-LK",
      publisher: { "@type": "Organization", name: "Print Works.LK", url: SITE_URL },
      blogPost: allPosts.slice(0, 20).map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        url: `${SITE_URL}/blog/${p.slug}`,
        datePublished: p.datePublished,
        ...(p.featuredImage ? { image: p.featuredImage } : {}),
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      ],
    },
  ];

  const chipCls = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-medium transition ${
      active ? "bg-brand-red text-white shadow-sm" : "border border-gray-200 bg-white text-gray-600 hover:border-brand-red hover:text-brand-red"
    }`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fdf2f4] via-white to-gray-50">
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        />
      ))}

      <section className="border-b border-brand-red/10 bg-gradient-to-r from-gray-900 via-nav-dark to-gray-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden="true">/</span> Blog
          </nav>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">Print Works.LK Blog</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {activeCategory ? activeCategory.name : "Printing Guides"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base">
            Printing guides and buying advice from Print Works.LK, for customers across Sri Lanka.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        {categories.length > 0 ? (
          <nav aria-label="Blog categories" className="mb-8 flex flex-wrap gap-2">
            <Link href="/blog" className={chipCls(!activeCategory)}>
              All
            </Link>
            {categories.map((c) => (
              <Link key={c.slug} href={`/blog?category=${c.slug}`} className={chipCls(activeCategory?.slug === c.slug)}>
                {c.name}
              </Link>
            ))}
          </nav>
        ) : null}

        {featured ? (
          <article className="group grid overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg md:grid-cols-2">
            <Link href={`/blog/${featured.slug}`} className="block aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-900 to-nav-dark md:aspect-auto" tabIndex={-1}>
              {featured.featuredImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featured.featuredImage}
                  alt={featured.featuredImageAlt ?? featured.title}
                  width={800}
                  height={500}
                  fetchPriority="high"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full min-h-56 items-center justify-center text-lg font-bold uppercase tracking-[0.25em] text-brand-red">
                  Print Works.LK
                </div>
              )}
            </Link>
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                <span className="rounded-full bg-brand-red/10 px-2.5 py-0.5 font-bold uppercase tracking-wider text-brand-red">Latest</span>
                {featured.category ? <span className="font-semibold uppercase tracking-wider">{featured.category.name}</span> : null}
                <time dateTime={featured.datePublished}>{formatBlogDate(featured.datePublished)}</time>
                <span>{getReadingTime(featured)} min read</span>
              </div>
              <h2 className="mt-3 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                <Link href={`/blog/${featured.slug}`} className="hover:text-brand-red">
                  {featured.title}
                </Link>
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{featured.excerpt}</p>
              <Link
                href={`/blog/${featured.slug}`}
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-brand-red px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                aria-label={`Read: ${featured.title}`}
              >
                Read article <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ) : (
          <p className="py-16 text-center text-gray-500">No posts in this category yet.</p>
        )}

        {rest.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
