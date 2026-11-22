// Shared article renderer for the Printworks blog. Admin posts render their
// HTML body (with a generated table of contents); code posts render their
// sections. Both get FAQs, related links, share buttons and related posts.

import Link from "next/link";
import type { BlogPost } from "@/lib/blog-posts";
import { formatBlogDate, getReadingTime } from "@/lib/blog-posts";
import { prepareBlogHtml, type TocItem } from "@/lib/blog-html";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://printworks.lk";

const linkCls =
  "font-semibold text-brand-red underline decoration-brand-red/40 underline-offset-2 hover:decoration-brand-red";

/** Typography for admin HTML content. */
const proseCls = [
  "text-[15px] leading-[1.8] text-gray-700 sm:text-base",
  "[&>*:first-child]:mt-0",
  "[&_h2]:mt-10 [&_h2]:scroll-mt-28 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:leading-snug [&_h2]:text-gray-900 sm:[&_h2]:text-2xl",
  "[&_h3]:mt-8 [&_h3]:scroll-mt-28 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-gray-900",
  "[&_h4]:mt-6 [&_h4]:font-bold [&_h4]:text-gray-900",
  "[&_p]:mt-4",
  "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_li]:pl-1 [&_li::marker]:text-brand-red",
  "[&_a]:font-semibold [&_a]:text-brand-red [&_a]:underline [&_a]:decoration-brand-red/40 [&_a]:underline-offset-2 hover:[&_a]:decoration-brand-red",
  "[&_strong]:font-semibold [&_strong]:text-gray-900",
  "[&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl [&_img]:shadow-sm",
  "[&_figure]:my-8 [&_figure_img]:my-0 [&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:text-gray-500",
  "[&_blockquote]:my-6 [&_blockquote]:rounded-r-xl [&_blockquote]:border-l-4 [&_blockquote]:border-brand-red [&_blockquote]:bg-[#fdf2f4] [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:italic [&_blockquote]:text-gray-800",
  "[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_td]:border [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-2",
  "[&_hr]:my-10 [&_hr]:border-gray-200",
  "[&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.9em]",
  "[&_iframe]:my-6 [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:rounded-xl",
].join(" ");

/** Render paragraph text, turning [label](/path) markdown links into Links. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/\[([^\]]+)\]\(([^)]+)\)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (i % 3 === 2) {
          return (
            <Link key={i} href={part} className={linkCls}>
              {parts[i - 1]}
            </Link>
          );
        }
        if (i % 3 === 1) return null;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function sectionId(heading: string): string {
  return heading.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/[\s-]+/g, "-");
}

function TableOfContents({ toc }: { toc: TocItem[] }) {
  if (toc.length < 2) return null;
  return (
    <nav aria-label="Table of contents" className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-brand-red">In this guide</p>
      <ol className="mt-3 space-y-2 text-sm">
        {toc.map((item) => (
          <li key={item.id} className={item.level === 3 ? "pl-4" : ""}>
            <a href={`#${item.id}`} className="text-gray-600 hover:text-brand-red">
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function ShareButtons({ url, title }: { url: string; title: string }) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const items = [
    { label: "WhatsApp", icon: "bi-whatsapp", href: `https://wa.me/?text=${t}%20${u}` },
    { label: "Facebook", icon: "bi-facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { label: "LinkedIn", icon: "bi-linkedin", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: "X", icon: "bi-twitter-x", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
  ];
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Share</span>
      {items.map((i) => (
        <a
          key={i.label}
          href={i.href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          aria-label={`Share on ${i.label}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-brand-red hover:text-brand-red"
        >
          <i className={`bi ${i.icon}`} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="block aspect-[16/9] overflow-hidden bg-gradient-to-br from-gray-900 to-nav-dark" tabIndex={-1}>
        {post.featuredImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.featuredImage}
            alt={post.featuredImageAlt ?? post.title}
            loading="lazy"
            decoding="async"
            width={640}
            height={360}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center text-sm font-bold uppercase tracking-[0.2em] text-brand-red">
            Print Works.LK
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
          {post.category ? (
            <span className="font-semibold uppercase tracking-wider text-brand-red">{post.category.name}</span>
          ) : null}
          <time dateTime={post.datePublished}>{formatBlogDate(post.datePublished)}</time>
          <span>{getReadingTime(post)} min read</span>
        </div>
        <h3 className="mt-2 text-lg font-bold leading-snug text-gray-900">
          <Link href={`/blog/${post.slug}`} className="hover:text-brand-red">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>
        <Link href={`/blog/${post.slug}`} className="mt-4 text-sm font-semibold text-brand-red" aria-label={`Read: ${post.title}`}>
          Read more <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export function BlogArticle({ post }: { post: BlogPost }) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const hasHtml = Boolean(post.contentHtml && post.contentHtml.trim() !== "");
  const prepared = hasHtml ? prepareBlogHtml(post.contentHtml as string, new URL(SITE_URL).host) : null;
  const toc: TocItem[] = prepared
    ? prepared.toc.filter((t) => t.level === 2)
    : post.sections.map((s) => ({ id: sectionId(s.heading), text: s.heading, level: 2 as const }));
  const readingTime = getReadingTime(post);
  const modified =
    post.dateModified && post.dateModified.slice(0, 10) > post.datePublished.slice(0, 10) ? post.dateModified : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fdf2f4] via-white to-gray-50">
      <section className="border-b border-brand-red/10 bg-gradient-to-r from-gray-900 via-nav-dark to-gray-900 text-white">
        <div className={`mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10 ${post.featuredImage ? "pb-28 sm:pb-36" : "pb-12 sm:pb-16"}`}>
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              {post.category ? (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link href={`/blog?category=${post.category.slug}`} className="hover:text-white">
                      {post.category.name}
                    </Link>
                  </li>
                </>
              ) : null}
            </ol>
          </nav>
          <div className="mt-6 max-w-3xl">
            {post.category ? (
              <Link
                href={`/blog?category=${post.category.slug}`}
                className="inline-block rounded-full bg-brand-red/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-red hover:bg-brand-red/25"
              >
                {post.category.name}
              </Link>
            ) : null}
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{post.title}</h1>
            {post.excerpt ? (
              <p className="mt-4 text-base leading-relaxed text-gray-300 sm:text-lg">{post.excerpt}</p>
            ) : null}
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
              <span>By {post.author || "Print Works.LK"}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.datePublished}>{formatBlogDate(post.datePublished)}</time>
              {modified ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Updated <time dateTime={modified}>{formatBlogDate(modified)}</time></span>
                </>
              ) : null}
              <span aria-hidden="true">·</span>
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        {post.featuredImage ? (
          <div className="-mt-20 overflow-hidden rounded-2xl border border-white/10 bg-gray-100 shadow-xl sm:-mt-28">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featuredImage}
              alt={post.featuredImageAlt ?? post.title}
              width={1200}
              height={675}
              fetchPriority="high"
              className="aspect-[16/9] h-auto w-full object-cover"
            />
          </div>
        ) : null}

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 lg:p-12">
              {toc.length >= 2 ? (
                <div className="mb-8 lg:hidden">
                  <TableOfContents toc={toc} />
                </div>
              ) : null}

              {prepared ? (
                <div className={proseCls} dangerouslySetInnerHTML={{ __html: prepared.html }} />
              ) : (
                <div className="space-y-10">
                  {post.sections.map((section) => (
                    <section key={section.heading} id={sectionId(section.heading)} className="scroll-mt-28">
                      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{section.heading}</h2>
                      {section.paragraphs.map((p) => (
                        <p key={p.slice(0, 40)} className="mt-4 text-[15px] leading-[1.8] text-gray-700 sm:text-base">
                          <RichText text={p} />
                        </p>
                      ))}
                      {section.bullets && section.bullets.length > 0 ? (
                        <ul className="mt-4 list-disc space-y-2 pl-6 text-[15px] leading-[1.8] text-gray-700 marker:text-brand-red sm:text-base">
                          {section.bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      ) : null}
                    </section>
                  ))}
                </div>
              )}

              {post.tags && post.tags.length > 0 ? (
                <div className="mt-10 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}

              {post.faqs.length > 0 ? (
                <section className="mt-12 border-t border-gray-100 pt-8" aria-labelledby="faq-heading">
                  <h2 id="faq-heading" className="text-xl font-bold text-gray-900 sm:text-2xl">
                    Frequently asked questions
                  </h2>
                  <div className="mt-5 divide-y divide-gray-100 rounded-xl border border-gray-200">
                    {post.faqs.map((faq, i) => (
                      <details key={faq.question} className="group p-4 sm:p-5" open={i === 0}>
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-gray-900 [&::-webkit-details-marker]:hidden">
                          <h3>{faq.question}</h3>
                          <i className="bi bi-chevron-down shrink-0 text-gray-400 transition group-open:rotate-180" aria-hidden="true" />
                        </summary>
                        <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </section>
              ) : null}

              {post.relatedLinks.length > 0 ? (
                <section className="mt-12 rounded-2xl bg-gray-50 p-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-brand-red">Related products and pages</h2>
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
                </section>
              ) : null}

              <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6">
                <ShareButtons url={url} title={post.title} />
                <Link href="/blog" className={`text-sm ${linkCls}`}>
                  ← All blog posts
                </Link>
              </div>
            </article>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-5">
              <TableOfContents toc={toc} />
              <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-nav-dark p-6 text-white shadow-sm">
                <p className="text-lg font-bold leading-snug">Ready to print?</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">
                  Send us your artwork and requirements for a fast, free quote.
                </p>
                <Link
                  href="/quote"
                  className="mt-4 block rounded-lg bg-brand-red px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Request a quote
                </Link>
                <Link href="/contact" className="mt-2 block text-center text-xs text-gray-300 hover:text-white">
                  or contact us
                </Link>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-8 rounded-2xl bg-gradient-to-r from-gray-900 via-nav-dark to-gray-900 p-6 text-white sm:p-8 lg:hidden">
          <p className="text-lg font-bold">Ready to print?</p>
          <p className="mt-1 text-sm text-gray-300">Send us your artwork and requirements for a fast, free quote.</p>
          <Link href="/quote" className="mt-4 inline-block rounded-lg bg-brand-red px-5 py-2.5 text-sm font-semibold">
            Request a quote
          </Link>
        </div>

        {post.relatedPosts && post.relatedPosts.length > 0 ? (
          <section className="mt-14" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-2xl font-bold text-gray-900">
              You might also like
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {post.relatedPosts.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
