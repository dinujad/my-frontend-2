import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/data/blog-posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://printworks.lk";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Blog Post Not Found" };

  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    // Bare title: the root layout template appends " | Print Works.LK".
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${post.title} | Print Works.LK`,
      description: post.description,
      url,
      siteName: "Print Works.LK",
      type: "article",
      publishedTime: post.date,
      images: [{ url: `${SITE_URL}/images/logo.png` }],
    },
  };
}

/** Renders **bold** markers inside a paragraph; everything else is plain text. */
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-gray-900">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            author: { "@type": "Organization", name: "Print Works.LK", url: SITE_URL },
            publisher: { "@type": "Organization", name: "Print Works.LK", url: SITE_URL },
            mainEntityOfPage: url,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: post.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-10">
        <nav className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-gray-900 transition-colors">
            Blog
          </Link>
          <span>/</span>
          <span className="text-brand-red">Guide</span>
        </nav>

        <p className="text-sm font-medium text-gray-400 mb-3">
          {formatDate(post.date)}
        </p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">
          {post.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-gray-600">{post.intro}</p>

        {post.sections.map((s) => (
          <section key={s.heading} className="mt-10">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              {s.heading}
            </h2>
            {s.paragraphs.map((p, i) => (
              <p key={i} className="mt-4 leading-relaxed text-gray-600">
                {renderInline(p)}
              </p>
            ))}
          </section>
        ))}

        <section className="mt-12 border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Frequently Asked Questions
          </h2>
          {post.faqs.map((f) => (
            <div key={f.q} className="mt-6">
              <h3 className="font-semibold text-gray-900">{f.q}</h3>
              <p className="mt-2 leading-relaxed text-gray-600">{f.a}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Related pages
          </h2>
          <ul className="mt-4 space-y-2">
            {post.related.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-brand-red font-medium hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 text-center">
            <p className="font-bold text-gray-900">
              Ready to order? Tell us what you need.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Send your artwork and sizes — we confirm a proof before printing
              and deliver across Sri Lanka.
            </p>
            <Link
              href="/quote"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-red px-6 py-3 text-sm font-bold text-white shadow-md shadow-brand-red/20 hover:bg-brand-red-dark transition-colors"
            >
              Request a Quote
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
