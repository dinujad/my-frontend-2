import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { blogPosts, getBlogPost } from "@/lib/blog-posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://printworks.lk";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    // Bare title: the root layout template appends " | Print Works.LK".
    title: post.title,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${post.title} | Print Works.LK`,
      description: post.description,
      url,
      siteName: "Print Works.LK",
      type: "article",
      publishedTime: post.datePublished,
      images: [{ url: `${SITE_URL}/images/logo.png` }],
    },
  };
}

function buildBlogPostingSchema(post: NonNullable<ReturnType<typeof getBlogPost>>) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.description,
    mainEntityOfPage: url,
    datePublished: post.datePublished,
    author: {
      "@type": "Organization",
      name: "Print Works.LK",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Print Works.LK",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
      },
    },
  };
}

function buildBreadcrumbSchema(post: NonNullable<ReturnType<typeof getBlogPost>>) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };
}

function buildFaqSchema(post: NonNullable<ReturnType<typeof getBlogPost>>) {
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
  const post = getBlogPost(slug);
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <BlogArticle post={post} />
    </>
  );
}
