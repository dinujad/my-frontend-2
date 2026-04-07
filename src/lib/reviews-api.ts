/** Same-origin via Next rewrite → Laravel `/api/v1/*` */

const REVIEWS_BASE = "/api/v1/products";

export type ReviewItem = {
  id: number;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type ReviewsResponse = {
  enabled: boolean;
  summary: { average: number; count: number };
  reviews: ReviewItem[];
};

export async function fetchProductReviews(slug: string): Promise<ReviewsResponse> {
  const url = `${REVIEWS_BASE}/${encodeURIComponent(slug)}/reviews`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to load reviews (${res.status})`);
  }
  return res.json() as Promise<ReviewsResponse>;
}

export type SubmitReviewBody = {
  reviewer_name: string;
  reviewer_email?: string;
  rating: number;
  comment: string;
};

export async function submitProductReview(
  slug: string,
  body: SubmitReviewBody
): Promise<{ message: string; review: ReviewItem }> {
  const url = `${REVIEWS_BASE}/${encodeURIComponent(slug)}/reviews`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const msg =
      (typeof data.message === "string" && data.message) ||
      (res.status === 422 && "Please check the form and try again.") ||
      "Could not submit review.";
    throw new Error(msg);
  }
  return data as { message: string; review: ReviewItem };
}
