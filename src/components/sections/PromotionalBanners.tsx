import Image from "next/image";
import Link from "next/link";

export function PromotionalBanners() {
    const banners = [
        {
            title: "INDUSTRY-GRADE",
            boldText: "UV FLATBED",
            postText: "",
            secondLine: "PRINTING",
            image: "/images/services/services_uv_1771958447138.png",
            href: "/products?category=UV+Flatbed",
            alt: "UV Printing Promo",
            actionText: "Shop now",
            hasDiscount: false,
        },
        {
            title: "PREMIUM",
            secondLine: "ACRYLIC",
            boldText: "PRODUCTS",
            hasDiscount: true,
            discountNumber: "20",
            image: "/images/services/services_acrylic_1771958315597.png",
            href: "/products?category=Acrylic",
            alt: "Acrylic Promo",
            actionText: "Shop now",
        },
        {
            title: "TAILORED",
            boldText: "CUSTOM",
            postText: "",
            secondLine: "PRODUCTS",
            image: "/images/services/services_custom_1771958344395.png",
            href: "/products?category=Custom",
            alt: "Custom Promo",
            actionText: "Shop now",
            hasDiscount: false,
        },
        {
            title: "ILLUMINATED",
            boldText: "SIGNAGE",
            postText: "",
            secondLine: "& DISPLAYS",
            image: "/images/services/services_signage_1771958377225.png",
            href: "/products?category=Signage",
            alt: "Signage Promo",
            actionText: "Shop now",
            hasDiscount: false,
        },
    ];

    return (
        <section className="overflow-hidden border-t border-gray-100 bg-white py-10 sm:py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-[2px] lg:grid-cols-4">
                    {banners.map((banner, index) => (
                        <Link
                            key={index}
                            href={banner.href}
                            className="group relative flex min-h-[148px] items-center overflow-hidden rounded-xl bg-[#f5f6f8] px-3.5 py-3.5 transition-all hover:shadow-md sm:h-[150px] sm:rounded-none sm:px-4 sm:py-4"
                        >
                            {/* Product Image on Left */}
                            <div className="relative z-10 -ml-1 flex h-full w-[42%] items-center justify-center transition-transform duration-300 group-hover:scale-105 sm:-ml-2 sm:w-[45%]">
                                <Image
                                    src={banner.image}
                                    alt={banner.alt}
                                    width={150}
                                    height={150}
                                    className="max-h-[88px] w-full object-contain drop-shadow-md mix-blend-multiply sm:max-h-[100px]"
                                />
                            </div>

                            {/* Text Content on Right */}
                            <div className="relative z-20 flex w-[58%] flex-col justify-center pl-2 sm:w-[55%]">
                                <h3 className="text-[11px] font-medium uppercase leading-[1.25] tracking-wide text-gray-500 sm:text-[13px]">
                                    {banner.title}

                                    {!banner.hasDiscount && banner.boldText && (
                                        <>
                                            <br />
                                            <span className="font-bold text-gray-900">{banner.boldText}</span>{banner.postText}
                                        </>
                                    )}
                                    <br />
                                    {banner.secondLine}

                                    {banner.hasDiscount && banner.boldText && (
                                        <>
                                            <br />
                                            <span className="font-bold text-gray-900">{banner.boldText}</span>{banner.postText}
                                        </>
                                    )}
                                </h3>

                                <div className="mt-2.5 flex h-8 items-center sm:mt-3">
                                    {banner.hasDiscount ? (
                                        <div className="flex items-start text-brand-red">
                                            <div className="flex flex-col justify-end h-full pb-1 mr-1">
                                                <span className="text-[9px] leading-[0.9] font-bold text-gray-500">UP</span>
                                                <span className="text-[9px] leading-[0.9] font-bold text-gray-500">TO</span>
                                            </div>
                                            <div className="flex items-start">
                                                <span className="text-[32px] font-black leading-[0.8] tracking-tighter text-gray-900">{banner.discountNumber}</span>
                                                <span className="text-[14px] font-bold leading-none mt-0.5 text-gray-900">%</span>
                                            </div>
                                            <div className="ml-2 flex items-center justify-center w-[18px] h-[18px] rounded-full bg-brand-red text-white shadow-sm transition-transform group-hover:translate-x-1 self-center">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-[10px] h-[10px] ml-0.5">
                                                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-[12px] font-bold text-gray-900">
                                            {banner.actionText || "Shop now"}
                                            <div className="flex items-center justify-center w-[18px] h-[18px] rounded-full bg-brand-red text-white shadow-sm transition-transform group-hover:translate-x-1 shrink-0">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-[10px] h-[10px] ml-0.5">
                                                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
