// Shared article renderer for the Printworks blog. Renders a post's sections
// (headings, paragraphs, bullet lists), its FAQ block and its related-links
// block, following the PolicyPage content styling (dark hero band, white
// card, gray-600 body text).

import Link from "next/link";
import type { BlogPost } from "@/lib/blog-posts";
import { formatBlogDate } from "@/lib/blog-posts";

/** Render paragraph text, turning [label](/path) markdown links into Links. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/\[([^\]]+)\]\(([^)]+)\)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (i % 3 === 2) {
          const label = parts[i - 1];
          return (
            <Link
              key={i}
              href={part}
              className="font-semibold text-brand-red underline decoration-brand-red/40 underline-offset-2 hover:decoration-brand-red"
            >
              {label}
            </Link>
          );
        }
        if (i % 3 === 1) return null;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function BlogArticle({ post }: { post: BlogPost }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fdf2f4] via-white to-gray-50">
      <section className="border-b border-brand-red/10 bg-gradient-to-r from-gray-900 via-nav-dark to-gray-900 text-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
            <Link href="/blog" className="hover:underline">
              Blog
            </Link>
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base">
            {post.excerpt}
          </p>
          <p className="mt-4 text-xs text-gray-400">
            Published: {formatBlogDate(post.datePublished)}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="space-y-8">
            {post.sections.map((section) => (
              <section key={section.heading} className="scroll-mt-28">
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                  {section.heading}
                </h2>
                {section.paragraphs.map((p) => (
                  <p
                    key={p.slice(0, 40)}
                    className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-[15px]"
                  >
                    <RichText text={p} />
                  </p>
                ))}
                {section.bullets && section.bullets.length > 0 ? (
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-600 sm:text-[15px]">
                    {section.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          {post.faqs.length > 0 ? (
            <section className="mt-12 border-t border-gray-100 pt-8">
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                Frequently asked questions
              </h2>
              <div className="mt-4 space-y-6">
                {post.faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="text-sm font-bold text-gray-900 sm:text-[15px]">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-[15px]">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {post.relatedLinks.length > 0 ? (
            <section className="mt-12 rounded-2xl bg-gray-50 p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-red">
                Related products and pages
              </h2>
              <ul className="mt-4 space-y-2">
                {post.relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-semibold text-gray-900 underline decoration-brand-red/40 underline-offset-2 hover:text-brand-red hover:decoration-brand-red"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                Ready to order?{" "}
                <Link
                  href="/quote"
                  className="font-semibold text-brand-red underline decoration-brand-red/40 underline-offset-2 hover:decoration-brand-red"
                >
                  Request a quote
                </Link>{" "}
                or{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-brand-red underline decoration-brand-red/40 underline-offset-2 hover:decoration-brand-red"
                >
                  contact us
                </Link>{" "}
                with any questions.
              </p>
            </section>
          ) : null}
        </article>

        <p className="mt-8 text-center text-sm">
          <Link
            href="/blog"
            className="font-semibold text-brand-red underline decoration-brand-red/40 underline-offset-2 hover:decoration-brand-red"
          >
            Back to all blog posts
          </Link>
        </p>
      </div>
    </main>
  );
}
