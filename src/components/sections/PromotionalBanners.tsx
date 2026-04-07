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
        <section className="bg-white py-12 border-t border-gray-100 overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[2px] bg-white">
                    {banners.map((banner, index) => (
                        <Link
                            key={index}
                            href={banner.href}
                            className="group relative flex items-center bg-[#f5f6f8] h-[150px] px-4 py-4 overflow-hidden transition-all hover:shadow-md"
                        >
                            {/* Product Image on Left */}
                            <div className="relative z-10 w-[45%] h-full flex items-center justify-center -ml-2 transition-transform duration-300 group-hover:scale-105">
                                <Image
                                    src={banner.image}
                                    alt={banner.alt}
                                    width={150}
                                    height={150}
                                    className="object-contain w-full max-h-[100px] drop-shadow-md mix-blend-multiply"
                                />
                            </div>

                            {/* Text Content on Right */}
                            <div className="relative z-20 w-[55%] flex flex-col justify-center pl-2">
                                <h3 className="text-[12px] sm:text-[13px] text-gray-500 tracking-wide leading-[1.3] font-medium uppercase">
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

                                <div className="mt-3 flex items-center h-8">
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
