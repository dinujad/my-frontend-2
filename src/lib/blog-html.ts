// Server-side post-processing of admin blog HTML:
// - gives every <h2>/<h3> a stable id so the table of contents can link to it
// - lazy-loads content images and makes sure each has an alt attribute
// - opens external links in a new tab with rel="noopener"

export type TocItem = { id: string; text: string; level: 2 | 3 };

function slugifyHeading(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/&[a-z]+;/g, " ")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/[\s-]+/g, "-")
      .slice(0, 60) || "section"
  );
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function prepareBlogHtml(html: string, siteHost = "printworks.lk"): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Set<string>();

  let out = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level: string, attrs: string, inner: string) => {
    const text = stripTags(inner);
    if (!text) return match;
    const existing = /\sid=["']([^"']+)["']/i.exec(attrs)?.[1];
    let id = existing ?? slugifyHeading(text);
    if (!existing) {
      let n = 2;
      const base = id;
      while (used.has(id)) id = `${base}-${n++}`;
    }
    used.add(id);
    toc.push({ id, text, level: Number(level) as 2 | 3 });
    return existing ? match : `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });

  out = out.replace(/<img\b([^>]*?)\/?>/gi, (_m, attrs: string) => {
    let a = attrs;
    if (!/\sloading=/i.test(a)) a += ' loading="lazy"';
    if (!/\sdecoding=/i.test(a)) a += ' decoding="async"';
    if (!/\salt=/i.test(a)) a += ' alt=""';
    return `<img${a}>`;
  });

  out = out.replace(/<a\b([^>]*?)href=["'](https?:\/\/[^"']+)["']([^>]*)>/gi, (m, pre: string, href: string, post: string) => {
    if (href.includes(siteHost)) return m;
    const attrs = pre + post;
    const target = /\starget=/i.test(attrs) ? "" : ' target="_blank"';
    const rel = /\srel=/i.test(attrs) ? "" : ' rel="noopener"';
    return `<a${pre}href="${href}"${post}${target}${rel}>`;
  });

  return { html: out, toc };
}
