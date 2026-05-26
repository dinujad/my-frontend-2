import Image from "next/image";
import Link from "next/link";
import { catalogImageSrc } from "@/lib/media-url";
import type { PromoBanner } from "@/lib/promo-banners";

type Props = {
  banners: PromoBanner[];
};

export function PromotionalBanners({ banners }: Props) {
  const list = banners.length > 0 ? banners : [];

  if (list.length === 0) return null;

  return (
    <section className="overflow-hidden border-t border-gray-100 bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-[2px] lg:grid-cols-4">
          {list.map((banner) => {
            const imageSrc = banner.image
              ? banner.image.startsWith("http")
                ? banner.image
                : catalogImageSrc(banner.image) || banner.image
              : null;

            return (
              <Link
                key={banner.id}
                href={banner.href || "/products"}
                className="group relative flex min-h-[148px] items-center overflow-hidden rounded-xl bg-[#f5f6f8] px-3.5 py-3.5 transition-all hover:shadow-md sm:h-[150px] sm:rounded-none sm:px-4 sm:py-4"
              >
                <div className="relative z-10 -ml-1 flex h-full w-[42%] items-center justify-center transition-transform duration-300 group-hover:scale-105 sm:-ml-2 sm:w-[45%]">
                  {imageSrc ? (
                    banner.image?.startsWith("http") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageSrc}
                        alt={banner.alt || banner.title}
                        className="max-h-[88px] w-full object-contain drop-shadow-md mix-blend-multiply sm:max-h-[100px]"
                      />
                    ) : (
                      <Image
                        src={imageSrc}
                        alt={banner.alt || banner.title}
                        width={150}
                        height={150}
                        className="max-h-[88px] w-full object-contain drop-shadow-md mix-blend-multiply sm:max-h-[100px]"
                      />
                    )
                  ) : (
                    <div className="h-20 w-20 rounded-lg bg-gray-200" />
                  )}
                </div>

                <div className="relative z-20 flex w-[58%] flex-col justify-center pl-2 sm:w-[55%]">
                  <h3 className="text-[11px] font-medium uppercase leading-[1.25] tracking-wide text-gray-500 sm:text-[13px]">
                    {banner.title}

                    {!banner.has_discount && banner.bold_text && (
                      <>
                        <br />
                        <span className="font-bold text-gray-900">{banner.bold_text}</span>
                        {banner.post_text}
                      </>
                    )}
                    {banner.second_line && (
                      <>
                        <br />
                        {banner.second_line}
                      </>
                    )}

                    {banner.has_discount && banner.bold_text && (
                      <>
                        <br />
                        <span className="font-bold text-gray-900">{banner.bold_text}</span>
                        {banner.post_text}
                      </>
                    )}
                  </h3>

                  <div className="mt-2.5 flex h-8 items-center sm:mt-3">
                    {banner.has_discount && banner.discount_number ? (
                      <div className="flex items-start text-brand-red">
                        <div className="mr-1 flex h-full flex-col justify-end pb-1">
                          <span className="text-[9px] font-bold leading-[0.9] text-gray-500">UP</span>
                          <span className="text-[9px] font-bold leading-[0.9] text-gray-500">TO</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-[32px] font-black leading-[0.8] tracking-tighter text-gray-900">
                            {banner.discount_number}
                          </span>
                          <span className="mt-0.5 text-[14px] font-bold leading-none text-gray-900">%</span>
                        </div>
                        <div className="ml-2 flex h-[18px] w-[18px] items-center justify-center self-center rounded-full bg-brand-red text-white shadow-sm transition-transform group-hover:translate-x-1">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="ml-0.5 h-[10px] w-[10px]">
                            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[12px] font-bold text-gray-900">
                        {banner.action_text || "Shop now"}
                        <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-brand-red text-white shadow-sm transition-transform group-hover:translate-x-1">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="ml-0.5 h-[10px] w-[10px]">
                            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
