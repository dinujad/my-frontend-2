// Blog posts from the admin API, normalised to the BlogPost type used by the
// blog pages. A null result means the API was unavailable, so callers fall
// back to the code posts in src/lib/blog-posts.ts.
import type { BlogPost } from "./blog-posts";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const fetchOptions = { cache: "no-store" } as const;

function apiUrl(endpoint: string): string {
  return `${API_BASE_URL}/api/v1${endpoint}`;
}

export type ApiBlogPost = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  content: string;
  featured_image?: string | null;
  datePublished: string;
  seo_title?: string | null;
  seo_description?: string | null;
  faqs?: { question: string; answer: string }[];
  relatedLinks?: { label: string; href: string }[];
  category?: { name: string; slug: string } | null;
};

/** An API post normalised to a BlogPost, carrying its SEO fields with it. */
export type ApiBlogPostWithSeo = BlogPost & {
  seo_title?: string | null;
  seo_description?: string | null;
};

function normalizeApiBlogPost(post: ApiBlogPost): ApiBlogPostWithSeo {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    datePublished: post.datePublished,
    excerpt: post.excerpt,
    sections: [],
    faqs: post.faqs ?? [],
    relatedLinks: post.relatedLinks ?? [],
    contentHtml: post.content,
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
