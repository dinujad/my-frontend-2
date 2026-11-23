"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { catalogImageSrc, onCatalogImageError } from "@/lib/media-url";
import type { HeroSlide } from "@/lib/hero-slides";
import headerStyles from "@/components/layout/Header.module.css";
import styles from "./HeroSlider.module.css";

type Props = {
  slides: HeroSlide[];
};

const AUTO_MS = 6000;
const imageClassName =
  "h-[220px] w-full rounded-bl-[2.2rem] rounded-tr-[2.2rem] object-cover object-center drop-shadow-2xl sm:h-[340px] sm:rounded-bl-[2.8rem] sm:rounded-tr-[2.8rem] lg:h-[420px] lg:w-[90%] lg:rounded-bl-[4rem] lg:rounded-tr-[4rem] lg:object-right";

export function HeroSlider({ slides }: Props) {
  const list = slides.length > 0 ? slides : [];
  const [index, setIndex] = useState(0);

  const goTo = useCallback(
    (i: number) => {
      if (list.length === 0) return;
      setIndex(((i % list.length) + list.length) % list.length);
    },
    [list.length]
  );

  useEffect(() => {
    if (list.length <= 1) return;
    const t = setInterval(() => goTo(index + 1), AUTO_MS);
    return () => clearInterval(t);
  }, [index, list.length, goTo]);

  const slide = list[index];
  if (!slide) return null;

  const imageSrc = slide.image
    ? slide.image.startsWith("http")
      ? slide.image
      : catalogImageSrc(slide.image)
    : null;

  return (
    <section
      id="home-hero"
      className={`${styles.hero} flex overflow-hidden lg:min-h-[var(--home-hero-height)]`}
      aria-label="Hero"
    >
      <div className="mx-auto flex w-full max-w-7xl lg:justify-end">
        <div className="flex w-full items-center px-5 py-10 sm:px-8 sm:py-12 lg:w-[calc(100%-280px)] lg:px-8 xl:px-10">
          <div className="grid w-full min-w-0 gap-9 lg:grid-cols-2 lg:items-center xl:gap-12">
            <div className="mx-auto flex w-full max-w-[22rem] flex-col justify-center text-center sm:max-w-[28rem] lg:mx-0 lg:max-w-none lg:text-left">
              <div key={`eyebrow-${slide.id}-${index}`} className={`mb-4 empty:hidden ${styles.reveal}`}>
                {slide.eyebrow && (
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.17em] text-brand-red-dark before:h-0.5 before:w-5 before:bg-current sm:text-sm">
                    {slide.eyebrow}
                  </span>
                )}
              </div>

              <h1
                key={`title-${slide.id}-${index}`}
                className={`${styles.reveal} ${styles.title} text-balance break-words text-4xl font-extrabold leading-[1.02] tracking-tight text-gray-950 sm:text-5xl lg:text-[clamp(2.4rem,3.8vw,3.65rem)]`}
              >
                <span className="block">{slide.title_line1}</span>
                {slide.title_line2 && (
                  <span className="block text-brand-red-dark">{slide.title_line2}</span>
                )}
                {slide.highlight_text && (
                  <span className="mt-5 inline-block rounded-lg border border-red-100 bg-white/80 px-3 py-2 text-base font-bold leading-tight tracking-normal text-brand-red-dark sm:text-lg">
                    {slide.highlight_text}
                  </span>
                )}
              </h1>

              {slide.description && (
                <p
                  key={`desc-${slide.id}-${index}`}
                  className={`${styles.reveal} ${styles.description} mx-auto mt-4 max-w-[32ch] text-base leading-relaxed text-gray-600 sm:mt-5 lg:mx-0`}
                >
                  {slide.description}
                </p>
              )}

              <div className="mt-7 flex justify-center lg:justify-start">
                <Link
                  href={slide.cta_url || "/products"}
                  className="group relative isolate inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/15 transition-colors hover:bg-brand-red-dark"
                >
                  <span aria-hidden="true" className={`hidden motion-safe:block ${headerStyles.snow}`} />
                  {slide.cta_label || "Start Buying"}
                  <span aria-hidden className="text-lg leading-none motion-safe:transition-transform motion-safe:group-hover:translate-x-1">&rarr;</span>
                </Link>
              </div>

              {list.length > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2.5 sm:mt-12 lg:justify-start">
                  {list.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Go to slide ${i + 1}`}
                      aria-current={i === index ? "true" : undefined}
                      onClick={() => goTo(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === index ? "w-8 bg-brand-red" : "w-2 bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div
              key={`img-${slide.id}-${index}`}
              className={`${styles.image} relative order-last pt-1 sm:pt-2 lg:order-none lg:pt-0`}
            >
              <div className="relative mx-auto flex w-full max-w-sm justify-center mix-blend-multiply sm:max-w-md lg:max-w-none lg:justify-end">
                {imageSrc ? (
                  slide.image?.startsWith("http") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageSrc}
                      alt={slide.title_line1}
                      className={imageClassName}
                      onError={onCatalogImageError}
                    />
                  ) : (
                    <Image
                      src={imageSrc}
                      alt={slide.title_line1}
                      width={500}
                      height={500}
                      className={imageClassName}
                      priority={index === 0}
                    />
                  )
                ) : (
                  <div className="flex h-[220px] w-full items-center justify-center rounded-bl-[2.2rem] rounded-tr-[2.2rem] bg-gray-200 sm:h-[340px] lg:h-[420px]">
                    <span className="text-gray-400 text-sm">No image</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollToTopButton />
    </section>
  );
}
