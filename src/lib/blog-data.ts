// Blog posts from the admin API, normalised to the BlogPost type used by the
// blog pages. A null result means the API was unavailable, so callers fall
// back to the code posts in src/lib/blog-posts.ts.
import type { BlogPost } from "./blog-posts";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const fetchOptions = { cache: "no-store" } as const;

function apiUrl(endpoint: string): string {
  return `${API_BASE_URL}/api/v1${endpoint}`;
}

/** Make API media paths absolute (e.g. "/storage/blog/x.jpg" → API host). */
function absoluteMediaUrl(url?: string | null): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_BASE_URL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
}

export type ApiBlogPost = {
  slug: string;
  title: string;
  description: string | null;
  excerpt: string | null;
  content?: string;
  featured_image?: string | null;
  featured_image_alt?: string | null;
  datePublished: string;
  dateModified?: string | null;
  readingTime?: number;
  wordCount?: number;
  seo_title?: string | null;
  seo_description?: string | null;
  focus_keyword?: string | null;
  meta_keywords?: string | null;
  canonical_url?: string | null;
  og_image?: string | null;
  noindex?: boolean;
  tags?: string[];
  author?: string | null;
  faqs?: { question: string; answer: string }[];
  relatedLinks?: { label: string; href: string }[];
  category?: { name: string; slug: string } | null;
  relatedPosts?: ApiBlogPost[];
};

/** Kept for callers that still import it; BlogPost now carries the SEO fields itself. */
export type ApiBlogPostWithSeo = BlogPost & {
  seo_title?: string | null;
  seo_description?: string | null;
};

function normalizeApiBlogPost(post: ApiBlogPost): ApiBlogPostWithSeo {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description ?? post.excerpt ?? "",
    datePublished: post.datePublished,
    dateModified: post.dateModified ?? null,
    excerpt: post.excerpt ?? "",
    sections: [],
    faqs: post.faqs ?? [],
    relatedLinks: post.relatedLinks ?? [],
    contentHtml: post.content ?? null,
    featuredImage: absoluteMediaUrl(post.featured_image),
    featuredImageAlt: post.featured_image_alt ?? post.title,
    readingTime: post.readingTime,
    wordCount: post.wordCount,
    category: post.category ?? null,
    tags: post.tags ?? [],
    author: post.author ?? null,
    seoTitle: post.seo_title ?? null,
    seoDescription: post.seo_description ?? null,
    metaKeywords: post.meta_keywords ?? null,
    canonicalUrl: post.canonical_url ?? null,
    ogImage: absoluteMediaUrl(post.og_image),
    noindex: Boolean(post.noindex),
    relatedPosts: (post.relatedPosts ?? []).map(normalizeApiBlogPost),
    seo_title: post.seo_title ?? null,
    seo_description: post.seo_description ?? null,
  };
}

export async function getApiBlogPosts(): Promise<BlogPost[] | null> {
  try {
    const response = await fetch(apiUrl("/blog/posts"), {
      ...fetchOptions,
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    // An empty API list means no posts are in the admin yet — fall back to the code posts so the blog never goes blank.
    if (!Array.isArray(data) || data.length === 0) return null;
    return (data as ApiBlogPost[]).map(normalizeApiBlogPost);
  } catch {
    return null;
  }
}

export async function getApiBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(apiUrl(`/blog/posts/${encodeURIComponent(slug)}`), {
      ...fetchOptions,
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || Array.isArray(data)) return null;
    return normalizeApiBlogPost(data as ApiBlogPost);
  } catch {
    return null;
  }
}
