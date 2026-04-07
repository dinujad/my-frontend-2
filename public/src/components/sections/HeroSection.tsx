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

      <div className="relative z-10 mx-auto w-full max-w-7xl h-full flex lg:justify-end">
        <div className="w-full lg:w-[calc(100%-280px)] lg:pl-10 h-full flex items-center pr-4 sm:pr-6 lg:pr-8 pt-8 lg:pt-12 pb-12">
          <div className="grid gap-8 lg:grid-cols-2 items-center w-full">

            {/* Left Content Column */}
            <div className="flex flex-col justify-center">
              <div className="animate-slide-up-fade mb-5">
                <span className="text-sm sm:text-base font-bold uppercase tracking-widest text-brand-red">
                  Premium Quality Printing
                </span>
              </div>

              <h1
                className="text-balance text-[2.5rem] font-light tracking-tight text-gray-800 sm:text-6xl lg:text-[4rem] leading-[1.1] animate-slide-up-fade"
                style={{ animationDelay: "0.15s" }}
              >
                Make Every Detail <br />
                <span className="font-normal text-gray-900">Stand Out</span>
                <br />
                <span className="font-bold text-gray-900 text-[2rem] sm:text-5xl lg:text-[3.5rem] mt-2 block">
                  UP TO <span className="font-black text-gray-800">40% OFF</span>
                </span>
              </h1>

              <p
                className="mt-6 max-w-xl text-base text-gray-600 sm:text-lg animate-slide-up-fade"
                style={{ animationDelay: "0.25s" }}
              >
                Sri Lanka&apos;s leading digital and offset printing solution. Quality that speaks
                for itself.
              </p>

              <div
                className="mt-10 flex items-center gap-6 animate-slide-up-fade"
                style={{ animationDelay: "0.35s" }}
              >
                <Link
                  href="/products"
                  className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-brand-red px-10 py-4 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:bg-brand-red-dark hover:-translate-y-1 hover:shadow-md"
                >
                  Start Buying
                </Link>
              </div>

              {/* Slider Dots */}
              <div
                className="mt-12 flex items-center gap-2.5 animate-slide-up-fade"
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
            <div
              className="relative lg:mt-0 animate-slide-left-fade"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="relative mx-auto w-full max-w-md lg:max-w-none flex justify-end mix-blend-multiply">
                <Image
                  src="https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop"
                  alt="Creative Printing Output"
                  width={500}
                  height={500}
                  className="object-cover w-[90%] h-[420px] object-right drop-shadow-2xl rounded-tr-[4rem] rounded-bl-[4rem]"
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
