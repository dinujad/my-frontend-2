import Link from "next/link";
import { clsx } from "clsx";
import type { ProductItem } from "@/lib/products-data";
import { catalogImageSrc } from "@/lib/media-url";

type Props = {
  products: ProductItem[];
  /** "default" | "footer" = full-width page section; "inline" = compact block in product summary column */
  variant?: "default" | "inline" | "footer";
  className?: string;
};

function discountLabel(p: ProductItem): string | null {
  if (!p.oldPrice || p.numericPrice <= 0) return null;
  const old = parseFloat(String(p.oldPrice).replace(/[^\d.]/g, ""));
  if (!old || old <= p.numericPrice) return null;
  const pct = Math.round(((old - p.numericPrice) / old) * 100);
  return pct > 0 ? `-${pct}%` : null;
}

export function RelatedProductsSection({ products, variant = "default", className }: Props) {
  if (products.length === 0) return null;

  const inline = variant === "inline";
  const footer = variant === "footer";

  return (
    <section
      className={clsx(
        inline ? "mt-6 border-t border-gray-100 pt-6" : footer ? "mt-0" : "mt-14 sm:mt-16",
        className
      )}
      aria-labelledby="related-products-heading"
    >
      <div
        className={clsx(
          "flex flex-wrap items-end justify-between gap-4",
          inline ? "pb-3" : "border-b border-gray-200/80 pb-5"
        )}
      >
        <div>
          {!inline ? (
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">Discover more</p>
          ) : null}
          <h2
            id="related-products-heading"
            className={clsx(
              "font-bold tracking-tight text-gray-900",
              inline ? "text-lg" : "mt-1 text-2xl sm:text-3xl"
            )}
          >
            Related products
          </h2>
        </div>
        {!inline ? (
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 transition hover:text-brand-red"
          >
            View all products
            <i className="bi bi-arrow-right" aria-hidden />
          </Link>
        ) : null}
      </div>

      <ul
        className={clsx(
          "grid gap-3 sm:gap-4",
          inline ? "mt-4 grid-cols-2" : "mt-8 grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
        )}
      >
        {products.map((p) => {
          const discount = discountLabel(p);
          return (
            <li key={p.id}>
              <Link
                href={`/product/${p.slug}`}
                className={clsx(
                  "group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_8px_30px_-16px_rgba(15,23,42,0.12)] transition duration-300 hover:-translate-y-1 hover:border-gray-300/80 hover:shadow-[0_20px_50px_-20px_rgba(15,23,42,0.18)]",
                  inline && "rounded-xl shadow-sm hover:shadow-md"
                )}
              >
                <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-gray-50 to-white">
                  {discount ? (
                    <span className="absolute left-2.5 top-2.5 z-[2] rounded-md bg-brand-red px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                      {discount}
                    </span>
                  ) : null}
                  {p.image?.trim() ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={catalogImageSrc(p.image)}
                      alt={p.title}
                      className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-[1.04]"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-400">No image</div>
                  )}
                </div>
                <div className={clsx("flex flex-1 flex-col p-4 pt-3", inline && "p-2.5 pt-2")}>
                  {p.category && !inline ? (
                    <span className="truncate text-[11px] font-medium uppercase tracking-wide text-gray-400">
                      {p.category}
                    </span>
                  ) : null}
                  <h3
                    className={clsx(
                      "line-clamp-2 font-bold leading-snug text-gray-900 transition group-hover:text-brand-red",
                      inline ? "mt-0 text-xs sm:text-sm" : "mt-1 text-sm sm:text-[15px]"
                    )}
                  >
                    {p.title}
                  </h3>
                  <div className={clsx("mt-auto flex items-baseline gap-2 pt-3", inline && "pt-2")}>
                    <span className={clsx("font-extrabold tabular-nums text-gray-900", inline ? "text-sm" : "text-base")}>
                      {p.price}
                    </span>
                    {p.oldPrice ? (
                      <span className="text-xs font-medium text-gray-400 line-through">{p.oldPrice}</span>
                    ) : null}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
