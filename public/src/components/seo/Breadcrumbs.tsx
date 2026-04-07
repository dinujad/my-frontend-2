/**
 * Server Component. Renders breadcrumb nav and optional BreadcrumbList JSON-LD.
 * Use for product and category pages for SEO and UX.
 */
import Link from "next/link";
import { SITE_URL } from "@/lib/products-data";

export type BreadcrumbItem = { label: string; href: string };

export function Breadcrumbs({ items, jsonLd = true }: { items: BreadcrumbItem[]; jsonLd?: boolean }) {
  const schema = jsonLd
    ? {
        "@context": "https://schema.org" as const,
        "@type": "BreadcrumbList" as const,
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem" as const,
          position: i + 1,
          name: item.label,
          item: item.href.startsWith("http") ? item.href : `${SITE_URL}${item.href}`,
        })),
      }
    : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-6">
        {items.map((item, i) => (
          <span key={item.href} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === items.length - 1 ? (
              <span className="text-gray-900 font-medium">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-brand-red transition-colors">
                {item.label}
              </Link>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
