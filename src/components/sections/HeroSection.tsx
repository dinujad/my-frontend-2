// Server Component — no "use client" directive.
// The hero section is entirely static markup (text, image, links).
// There is no state or browser API needed here, so it renders on the server.
// Benefits: the h1 headline and CTA are in the initial HTML — great for SEO and
// Core Web Vitals (LCP is a server-rendered image, not JS-dependent).
//
// The only interactive piece (scroll-to-top button) has been extracted to
// ScrollToTopButton, which is a Client Component loaded separately.

import Link from "next/link";
import Image from "next/image";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-[#f4f5f9] lg:min-h-[580px]"
      aria-label="Hero"
    >
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute right-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-white/60 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl lg:justify-end">
        <div className="flex h-full w-full items-center px-5 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:w-[calc(100%-280px)] lg:pl-10 lg:pr-8 lg:pt-12">
          <div className="grid w-full gap-7 sm:gap-8 lg:grid-cols-2 lg:items-center">

            {/* Left Content Column */}
            <div className="mx-auto flex w-full max-w-[22rem] flex-col justify-center text-center sm:max-w-[28rem] lg:mx-0 lg:max-w-none lg:text-left">
              <div className="animate-slide-up-fade mb-4 sm:mb-5">
                <span className="text-sm sm:text-base font-bold uppercase tracking-widest text-brand-red">
                  Premium Quality Printing
                </span>
              </div>

              <h1
                className="animate-slide-up-fade text-[1.9rem] font-light leading-[1.06] tracking-tight text-gray-800 sm:text-5xl lg:text-[4rem]"
                style={{ animationDelay: "0.15s" }}
              >
                <span className="block">Make Every Detail</span>
                <span className="block font-normal text-gray-900">Stand Out</span>
                <span className="mt-2 block text-[2.15rem] font-bold text-gray-900 sm:text-4xl lg:text-[3.5rem]">
                  UP TO <span className="font-black text-gray-800">40% OFF</span>
                </span>
              </h1>

              <p
                className="animate-slide-up-fade mx-auto mt-4 max-w-[32ch] text-[14px] leading-relaxed text-gray-600 sm:mt-6 sm:text-lg lg:mx-0"
                style={{ animationDelay: "0.25s" }}
              >
                Sri Lanka&apos;s leading digital and offset printing solution. Quality that speaks
                for itself.
              </p>

              <div
                className="animate-slide-up-fade mt-7 flex w-full items-center justify-center gap-4 sm:mt-9 sm:w-auto sm:gap-6 lg:justify-start"
                style={{ animationDelay: "0.35s" }}
              >
                <Link
                  href="/products"
                  className="group relative inline-flex min-h-[48px] w-full max-w-[210px] items-center justify-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-base font-bold text-white shadow-sm transition-all duration-300 hover:bg-brand-red-dark hover:-translate-y-1 hover:shadow-md sm:min-h-[52px] sm:max-w-none sm:px-10 sm:py-4"
                >
                  Start Buying
                </Link>
              </div>

              {/* Slider Dots */}
              <div
                className="animate-slide-up-fade mt-6 flex items-center justify-center gap-2.5 sm:mt-12 lg:justify-start"
                style={{ animationDelay: "0.45s" }}
              >
                <button
                  type="button"
                  aria-label="Slide 1"
                  className="h-2 w-2 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors"
                />
                <button
                  type="button"
                  aria-label="Slide 2"
                  className="h-2 w-8 rounded-full bg-brand-red"
                />
                <button
                  type="button"
                  aria-label="Slide 3"
                  className="h-2 w-2 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors"
                />
              </div>
            </div>

            {/* Right Image Column */}
            <div className="relative order-last animate-slide-left-fade pt-1 sm:pt-2 lg:order-none lg:mt-0 lg:pt-0" style={{ animationDelay: "0.3s" }}>
              <div className="relative mx-auto flex w-full max-w-sm justify-center mix-blend-multiply sm:max-w-md lg:max-w-none lg:justify-end">
                <Image
                  src="https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop"
                  alt="Creative Printing Output"
                  width={500}
                  height={500}
                  className="h-[220px] w-full rounded-bl-[2.2rem] rounded-tr-[2.2rem] object-cover object-center drop-shadow-2xl sm:h-[340px] sm:rounded-bl-[2.8rem] sm:rounded-tr-[2.8rem] lg:h-[420px] lg:w-[90%] lg:rounded-bl-[4rem] lg:rounded-tr-[4rem] lg:object-right"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Scroll-to-top is a Client Component — isolated so only it ships JS for scroll detection */}
      <ScrollToTopButton />
    </section>
  );
}
