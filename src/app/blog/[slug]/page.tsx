import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { blogPosts, getBlogPost, getReadingTime, type BlogPost } from "@/lib/blog-posts";
import { getApiBlogPost, getApiBlogPosts } from "@/lib/blog-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://printworks.lk";
const LOGO_URL = `${SITE_URL}/images/logo.png`;

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

/** API post first, then the code post; code posts get related posts from the rest. */
async function loadPost(slug: string): Promise<BlogPost | null> {
  const apiPost = await getApiBlogPost(slug);
  if (apiPost) return apiPost;
  const codePost = getBlogPost(slug);
  if (!codePost) return null;
  const others = ((await getApiBlogPosts()) ?? blogPosts).filter((p) => p.slug !== slug).slice(0, 3);
  return { ...codePost, relatedPosts: others };
}

function shareImage(post: BlogPost): string {
  return post.ogImage || post.featuredImage || LOGO_URL;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) return {};

  const url = `${SITE_URL}/blog/${post.slug}`;
  const pageTitle = post.seoTitle?.trim() || post.title;
  const pageDescription = post.seoDescription?.trim() || post.description || post.excerpt;
  const image = shareImage(post);
  const keywords = post.metaKeywords
    ?.split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return {
    // Bare title: the root layout template appends " | Print Works.LK".
    title: pageTitle,
    description: pageDescription,
    ...(keywords && keywords.length > 0 ? { keywords } : {}),
    authors: [{ name: post.author || "Print Works.LK" }],
    alternates: {
      canonical: post.canonicalUrl || url,
    },
    robots: post.noindex
      ? { index: false, follow: true }
      : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    openGraph: {
      title: `${pageTitle} | Print Works.LK`,
      description: pageDescription,
      url,
      siteName: "Print Works.LK",
      locale: "en_LK",
      type: "article",
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified ?? post.datePublished,
      ...(post.category ? { section: post.category.name } : {}),
      ...(post.tags && post.tags.length > 0 ? { tags: post.tags } : {}),
      images: [{ url: image, alt: post.featuredImageAlt ?? post.title, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} | Print Works.LK`,
      description: pageDescription,
      images: [image],
    },
  };
}

function buildBlogPostingSchema(post: BlogPost) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.seoDescription || post.description,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    image: [shareImage(post)],
    datePublished: post.datePublished,
    dateModified: post.dateModified ?? post.datePublished,
    inLanguage: "en-LK",
    ...(post.wordCount ? { wordCount: post.wordCount } : {}),
    timeRequired: `PT${getReadingTime(post)}M`,
    ...(post.category ? { articleSection: post.category.name } : {}),
    ...(post.metaKeywords || (post.tags && post.tags.length)
      ? { keywords: [post.metaKeywords, ...(post.tags ?? [])].filter(Boolean).join(", ") }
      : {}),
    author: {
      "@type": "Organization",
      name: "Print Works.LK",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Print Works.LK",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: LOGO_URL },
    },
  };
}

function buildBreadcrumbSchema(post: BlogPost) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const items = [
    { name: "Home", item: SITE_URL },
    { name: "Blog", item: `${SITE_URL}/blog` },
    ...(post.category ? [{ name: post.category.name, item: `${SITE_URL}/blog?category=${post.category.slug}` }] : []),
    { name: post.title, item: url },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, ...it })),
  };
}

function buildFaqSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await loadPost(slug);
  if (!post) notFound();

  const schemas = [
    buildBlogPostingSchema(post),
    buildBreadcrumbSchema(post),
    ...(post.faqs.length > 0 ? [buildFaqSchema(post)] : []),
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Escape "<" so post text can never close the script tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        />
      ))}
      <BlogArticle post={post} />
    </>
  );
}
