"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { catalogImageSrc, onCatalogImageError } from "@/lib/media-url";
import type { HeroSlide } from "@/lib/hero-slides";

type Props = {
  slides: HeroSlide[];
};

const AUTO_MS = 6000;

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
      className="relative overflow-hidden bg-[#f4f5f9] lg:min-h-[var(--home-hero-height)]"
      aria-label="Hero"
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute right-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-white/60 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl lg:justify-end">
        <div className="flex h-full w-full items-center px-5 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:w-[calc(100%-280px)] lg:pl-10 lg:pr-8 lg:pt-12">
          <div className="grid w-full gap-7 sm:gap-8 lg:grid-cols-2 lg:items-center">
            <div className="mx-auto flex w-full max-w-[22rem] flex-col justify-center text-center sm:max-w-[28rem] lg:mx-0 lg:max-w-none lg:text-left">
              <div key={`eyebrow-${slide.id}-${index}`} className="mb-4 sm:mb-5 animate-fade-in-up">
                {slide.eyebrow && (
                  <span className="text-sm sm:text-base font-bold uppercase tracking-widest text-brand-red">
                    {slide.eyebrow}
                  </span>
                )}
              </div>

              <h1
                key={`title-${slide.id}-${index}`}
                className="animate-fade-in-up text-[1.9rem] font-light leading-[1.06] tracking-tight text-gray-800 sm:text-5xl lg:text-[4rem]"
              >
                <span className="block">{slide.title_line1}</span>
                {slide.title_line2 && (
                  <span className="block font-normal text-gray-900">{slide.title_line2}</span>
                )}
                {slide.highlight_text && (
                  <span className="mt-2 block text-[2.15rem] font-bold text-gray-900 sm:text-4xl lg:text-[3.5rem]">
                    {slide.highlight_text.includes("OFF") || slide.highlight_text.includes("%") ? (
                      slide.highlight_text
                    ) : (
                      <span className="font-black text-gray-800">{slide.highlight_text}</span>
                    )}
                  </span>
                )}
              </h1>

              {slide.description && (
                <p
                  key={`desc-${slide.id}-${index}`}
                  className="animate-fade-in-up mx-auto mt-4 max-w-[32ch] text-[14px] leading-relaxed text-gray-600 sm:mt-6 sm:text-lg lg:mx-0"
                >
                  {slide.description}
                </p>
              )}

              <div className="animate-fade-in-up mt-7 flex w-full items-center justify-center gap-4 sm:mt-9 sm:w-auto sm:gap-6 lg:justify-start">
                <Link
                  href={slide.cta_url || "/products"}
                  className="group relative inline-flex min-h-[48px] w-full max-w-[210px] items-center justify-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-base font-bold text-white shadow-sm transition-all duration-300 hover:bg-brand-red-dark hover:-translate-y-1 hover:shadow-md sm:min-h-[52px] sm:max-w-none sm:px-10 sm:py-4"
                >
                  {slide.cta_label || "Start Buying"}
                </Link>
              </div>

              {list.length > 1 && (
                <div className="animate-fade-in-up mt-6 flex items-center justify-center gap-2.5 sm:mt-12 lg:justify-start">
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
              className="relative order-last animate-slide-left-fade pt-1 sm:pt-2 lg:order-none lg:mt-0 lg:pt-0"
            >
              <div className="relative mx-auto flex w-full max-w-sm justify-center mix-blend-multiply sm:max-w-md lg:max-w-none lg:justify-end">
                {imageSrc ? (
                  slide.image?.startsWith("http") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageSrc}
                      alt={slide.title_line1}
                      className="h-[220px] w-full rounded-bl-[2.2rem] rounded-tr-[2.2rem] object-cover object-center drop-shadow-2xl sm:h-[340px] sm:rounded-bl-[2.8rem] sm:rounded-tr-[2.8rem] lg:h-[420px] lg:w-[90%] lg:rounded-bl-[4rem] lg:rounded-tr-[4rem] lg:object-right"
                      onError={onCatalogImageError}
                    />
                  ) : (
                    <Image
                      src={imageSrc}
                      alt={slide.title_line1}
                      width={500}
                      height={500}
                      className="h-[220px] w-full rounded-bl-[2.2rem] rounded-tr-[2.2rem] object-cover object-center drop-shadow-2xl sm:h-[340px] sm:rounded-bl-[2.8rem] sm:rounded-tr-[2.8rem] lg:h-[420px] lg:w-[90%] lg:rounded-bl-[4rem] lg:rounded-tr-[4rem] lg:object-right"
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
