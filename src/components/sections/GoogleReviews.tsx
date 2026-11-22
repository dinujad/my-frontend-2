"use client";

import { useEffect, useRef, useState } from "react";
import type { GoogleReview } from "@/lib/google-reviews";

const googleReviewsUrl =
  "https://www.google.com/search?q=Print+Works.LK#lrd=0x3ae2578a53db59ef:0x25d59acb8be4e3df,1";

function slide(list: HTMLUListElement, direction: -1 | 1) {
  const first = list.querySelector("li");
  const second = first?.nextElementSibling;
  if (!first || !(second instanceof HTMLElement)) return;

  const end = list.scrollWidth - list.clientWidth;
  if (end <= 1) return;

  const step = second.offsetLeft - first.offsetLeft;
  let left = list.scrollLeft + direction * step;
  if (direction === 1 && list.scrollLeft >= end - 1) left = 0;
  if (direction === -1 && list.scrollLeft <= 1) left = end;
  list.scrollTo({ left });
}

export function GoogleReviews({ reviews }: { reviews: readonly GoogleReview[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);
  const fiveStarReviews = reviews.filter(
    ({ rating, author, text }) => rating === 5 && author.trim() && text.trim(),
  );
  const canSlide = fiveStarReviews.length > 1;

  useEffect(() => {
    const list = track.current;
    if (!list || !canSlide || paused) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const interval = window.setInterval(() => {
      if (document.hidden || reducedMotion.matches || list.matches(":hover, :focus-within")) return;
      slide(list, 1);
    }, 5000);
    return () => window.clearInterval(interval);
  }, [canSlide, paused]);

  return (
    <section aria-labelledby="google-reviews-heading" className="border-t border-rose-100 bg-gradient-to-b from-rose-50/70 to-white py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <h2 id="google-reviews-heading" className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Google Reviews for Print Works.LK
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
              See what customers say about our custom printing and signage in Biyagama, Sri Lanka.
            </p>
          </div>
          <a href={googleReviewsUrl} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:border-brand-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-red">
            Read reviews on Google <i className="bi bi-arrow-up-right" aria-hidden="true" />
          </a>
        </div>

        {fiveStarReviews.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-gray-700">Selected 5-star reviews</h3>
              {canSlide && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPaused((current) => !current)}
                    aria-label={paused ? "Resume automatic sliding" : "Pause automatic sliding"}
                    className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-gray-900 hover:border-brand-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-red motion-reduce:hidden"
                  >
                    <i className={paused ? "bi bi-play-fill" : "bi bi-pause-fill"} aria-hidden="true" />
                  </button>
                  {([-1, 1] as const).map((direction) => (
                    <button
                      type="button"
                      key={direction}
                      onClick={() => {
                        if (track.current) slide(track.current, direction);
                      }}
                      aria-controls="google-review-cards"
                      aria-label={direction === -1 ? "Previous review" : "Next review"}
                      className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-gray-900 hover:border-brand-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-red"
                    >
                      <i className={direction === -1 ? "bi bi-chevron-left" : "bi bi-chevron-right"} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <ul ref={track} id="google-review-cards" aria-label="Selected 5-star Google reviews" tabIndex={0} className="relative flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto pb-3 motion-safe:scroll-smooth">
              {fiveStarReviews.map(({ author, text, authorUrl }) => (
                <li key={JSON.stringify([author, text])} className="flex w-[85%] max-w-sm shrink-0 snap-start flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:w-[45%] lg:w-[36%]">
                  <span role="img" aria-label="5 out of 5 stars" className="tracking-wider text-amber-600">★★★★★</span>
                  <blockquote className="mt-3 flex-1 whitespace-pre-line break-words text-sm leading-relaxed text-gray-700">{text}</blockquote>
                  <p className="mt-4 break-words border-t border-gray-100 pt-3 text-sm font-semibold text-gray-900">
                    {authorUrl ? <a href={authorUrl} className="hover:underline">{author}</a> : author}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
