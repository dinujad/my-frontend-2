"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import StarRating from "./StarRating";
import StarRatingInput from "./StarRatingInput";
import { fetchProductReviews, submitProductReview, type ReviewItem } from "@/lib/reviews-api";
import { useToast } from "@/components/ui/ToastProvider";

type TabId = "description" | "reviews";

type Props = {
  slug: string;
  longDescription: string;
  enableReviews: boolean;
  /** From product API for initial display before client fetch */
  initialSummary?: { average: number; count: number };
};

function formatReviewDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function ProductDetailsTabs({
  slug,
  longDescription,
  enableReviews,
  initialSummary = { average: 0, count: 0 },
}: Props) {
  const [tab, setTab] = useState<TabId>("description");
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [summary, setSummary] = useState(initialSummary);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const loadReviews = useCallback(async () => {
    if (!enableReviews) return;
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchProductReviews(slug);
      setReviews(data.reviews);
      setSummary(data.summary);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Could not load reviews.");
    } finally {
      setLoading(false);
    }
  }, [slug, enableReviews]);

  useEffect(() => {
    if (tab === "reviews" && enableReviews) {
      void loadReviews();
    }
  }, [tab, enableReviews, loadReviews]);

  const validateForm = () => {
    const err: Record<string, string> = {};
    if (!name.trim()) err.name = "Please enter your name.";
    if (rating < 1 || rating > 5) err.rating = "Please choose a star rating.";
    if (comment.trim().length < 10) err.comment = "Review must be at least 10 characters.";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      err.email = "Please enter a valid email.";
    }
    setFieldErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enableReviews) return;
    if (!validateForm()) {
      showToast("Please fix the highlighted fields.", "error");
      return;
    }
    setSubmitting(true);
    try {
      await submitProductReview(slug, {
        reviewer_name: name.trim(),
        reviewer_email: email.trim() || undefined,
        rating,
        comment: comment.trim(),
      });
      showToast("Thank you! Your review was posted.", "success");
      setName("");
      setEmail("");
      setRating(0);
      setComment("");
      setFieldErrors({});
      await loadReviews();
    } catch (er) {
      showToast(er instanceof Error ? er.message : "Submission failed.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: "description", label: "Description" },
    ...(enableReviews ? [{ id: "reviews" as const, label: "Reviews" }] : []),
  ];

  // No reviews feature: single long description card
  if (!enableReviews) {
    return (
      <section
        className="mt-12 rounded-3xl border border-gray-200/80 bg-white/80 p-8 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.15)] backdrop-blur-sm sm:p-10"
        aria-labelledby="pdp-desc-heading"
        suppressHydrationWarning
      >
        <h2 id="pdp-desc-heading" className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
          Product description
        </h2>
        <div className="mt-6 border-t border-gray-100 pt-6">
          {longDescription?.trim() ? (
            <div className="max-w-none text-[15px] leading-relaxed text-gray-600">
              <p className="whitespace-pre-wrap">{longDescription}</p>
            </div>
          ) : (
            <p className="text-gray-500">No detailed description available for this product.</p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      className="mt-12 rounded-3xl border border-gray-200/80 bg-white/90 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.2)] backdrop-blur-md overflow-hidden"
      aria-label="Product details and reviews"
      suppressHydrationWarning
    >
      <div
        role="tablist"
        className="flex flex-wrap gap-2 border-b border-gray-100 bg-gradient-to-r from-slate-50/90 to-white px-4 py-4 sm:px-8"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={clsx(
              "relative rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200",
              tab === t.id
                ? "bg-gray-900 text-white shadow-lg shadow-gray-900/25"
                : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 hover:text-gray-900 hover:ring-gray-300"
            )}
          >
            {t.label}
            {t.id === "reviews" && summary.count > 0 ? (
              <span
                className={clsx(
                  "ml-2 inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
                  tab === t.id ? "bg-white/20 text-white" : "bg-brand-red/10 text-brand-red"
                )}
              >
                {summary.count}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="px-4 py-8 sm:px-8 sm:py-10">
        <AnimatePresence mode="wait">
          {tab === "description" && (
            <motion.div
              key="desc"
              role="tabpanel"
              id="panel-description"
              aria-labelledby="tab-description"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="sr-only">Full description</h2>
              {longDescription?.trim() ? (
                <div className="max-w-none text-[15px] leading-relaxed text-gray-600">
                  <p className="whitespace-pre-wrap">{longDescription}</p>
                </div>
              ) : (
                <p className="text-gray-500">No detailed description available for this product.</p>
              )}
            </motion.div>
          )}

          {tab === "reviews" && enableReviews && (
            <motion.div
              key="reviews"
              role="tabpanel"
              id="panel-reviews"
              aria-labelledby="tab-reviews"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-10"
            >
              {/* Summary */}
              <div className="flex flex-col gap-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white p-6 ring-1 ring-gray-100 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-wider text-gray-500">Customer rating</p>
                  <div className="mt-2 flex flex-wrap items-end gap-3">
                    <span className="text-4xl font-bold tabular-nums text-gray-900">
                      {summary.count > 0 ? summary.average.toFixed(1) : "—"}
                    </span>
                    <div className="pb-1">
                      <StarRating rating={summary.average} size="lg" />
                      <p className="mt-1 text-sm text-gray-500">
                        Based on {summary.count} review{summary.count === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* List */}
              {loading ? (
                <p className="text-center text-gray-500">Loading reviews…</p>
              ) : loadError ? (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</p>
              ) : reviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-6 py-12 text-center">
                  <p className="text-lg font-medium text-gray-800">No reviews yet.</p>
                  <p className="mt-2 text-gray-600">Be the first to review this product.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {reviews.map((r) => (
                    <li
                      key={r.id}
                      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-gray-900">{r.reviewer_name}</p>
                          <time className="text-xs text-gray-500" dateTime={r.created_at}>
                            {formatReviewDate(r.created_at)}
                          </time>
                        </div>
                        <StarRating rating={r.rating} size="sm" />
                      </div>
                      <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{r.comment}</p>
                    </li>
                  ))}
                </ul>
              )}

              {/* Review form — set NEXT_PUBLIC_REVIEWS_REQUIRE_AUTH=1 to gate (no session yet = message only) */}
              <div className="rounded-2xl border border-gray-200 bg-slate-50/40 p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-gray-900">Write a review</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Share your experience with this product. Your name will appear publicly.
                </p>
                {process.env.NEXT_PUBLIC_REVIEWS_REQUIRE_AUTH === "1" ? (
                  <div
                    className="mt-6 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-4 text-sm text-amber-950"
                    role="status"
                  >
                    <p className="font-medium">You must be logged in to leave a review.</p>
                    <p className="mt-1 text-amber-900/90">
                      Sign in to your account, then return to this page to submit feedback.
                    </p>
                  </div>
                ) : null}
                <form
                  className={clsx("mt-6 space-y-5", process.env.NEXT_PUBLIC_REVIEWS_REQUIRE_AUTH === "1" && "hidden")}
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div>
                    <label htmlFor="review-name" className="block text-sm font-medium text-gray-700">
                      Name <span className="text-brand-red">*</span>
                    </label>
                    <input
                      id="review-name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                      placeholder="Your name"
                    />
                    {fieldErrors.name ? <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p> : null}
                  </div>
                  <div>
                    <label htmlFor="review-email" className="block text-sm font-medium text-gray-700">
                      Email <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      id="review-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                      placeholder="you@example.com"
                    />
                    {fieldErrors.email ? <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p> : null}
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700">
                      Rating <span className="text-brand-red">*</span>
                    </span>
                    <div className="mt-2">
                      <StarRatingInput value={rating} onChange={setRating} disabled={submitting} />
                    </div>
                    {fieldErrors.rating ? <p className="mt-1 text-xs text-red-600">{fieldErrors.rating}</p> : null}
                  </div>
                  <div>
                    <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700">
                      Your review <span className="text-brand-red">*</span>
                    </label>
                    <textarea
                      id="review-comment"
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                      placeholder="What did you like? How was quality and delivery?"
                    />
                    {fieldErrors.comment ? <p className="mt-1 text-xs text-red-600">{fieldErrors.comment}</p> : null}
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-gray-900/20 transition hover:bg-black disabled:opacity-60 sm:w-auto"
                  >
                    {submitting ? "Submitting…" : "Submit review"}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
