/**
 * Blog posts (content hub). Grounded in the approved category facts
 * (src/data/category-content.ts) — no prices: Print Works work is
 * quote-based by design, so articles route readers to enquire.
 */

export type BlogSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogFaq = {
  q: string;
  a: string;
};

export type BlogRelatedLink = {
  label: string;
  href: string;
};

export type BlogPost = {
  slug: string;
  /** H1 and meta title (bare — the root layout template appends the brand). */
  title: string;
  description: string;
  /** ISO publish date. */
  date: string;
  intro: string;
  sections: BlogSection[];
  faqs: BlogFaq[];
  related: BlogRelatedLink[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "sticker-printing-in-sri-lanka",
    title: "Sticker Printing in Sri Lanka — A Complete Guide",
    description:
      "Sticker printing in Sri Lanka — custom logo stickers, laptop stickers, vinyl decals and labels, die-cut or kiss-cut, printed to order with island-wide delivery.",
    date: "2026-11-11",
    intro:
      "Custom stickers are one of the simplest ways to put a brand on products, packaging, laptops, vehicles and walls. Print Works prints stickers to order at its Biyagama facility — every order is produced from your artwork, cut to your shape and size, and delivered across Sri Lanka.",
    sections: [
      {
        heading: "What kinds of stickers can you order?",
        paragraphs: [
          "**Custom logo stickers** are the starting point for most businesses — your logo printed in full colour for product packaging, sealing boxes and short-run product labels. **Custom laptop stickers** work for personal use, giveaways and brand promotion. **Custom vinyl decals** suit windows, walls and general signage, while **custom floor stickers and decals** are used for in-store promotions and indoor wayfinding. **UV DTF stickers** come as detailed A3 transfer sheets for applying your design to a variety of surfaces, and **printed transparent stickers** are clear stickers for products and packaging that show the surface beneath. For vehicles, **windscreen stickers** carry branding on car windscreens and fleet vehicles. **Domed epoxy stickers** add a raised, glossy dome over the print for a premium badge or label look, and **photoluminescent stickers** glow in the dark for safety signage and novelty uses.",
        ],
      },
      {
        heading: "Die-cut vs kiss-cut — which one do you need?",
        paragraphs: [
          "With **die-cut** stickers, each sticker is cut individually to the exact shape of your design, with no backing left around them. With **kiss-cut** stickers, the sticker itself is cut while the backing sheet stays intact, so stickers peel off easily — handy for sheets of labels or giveaway stickers. If you need a specific shape — a logo outline, a circle or a rounded rectangle — die-cutting follows your design exactly, while kiss-cut sheets keep multiple stickers organised on one backing.",
        ],
      },
      {
        heading: "Materials and finishes",
        paragraphs: [
          "Stickers are printed in full colour from your artwork on quality vinyl stock. White PVC gives bold, opaque colour; transparent stock lets the surface show through; UV DTF transfers handle fine detail across different surfaces. Domed epoxy adds a clear resin dome for a raised, durable finish, and photoluminescent stock absorbs light and glows in the dark. If you need a sticker for a specific setting — a shop floor, a vehicle window, a product label — tell us where it will be used and we will recommend the material that fits.",
        ],
      },
      {
        heading: "How to order",
        paragraphs: [
          "Match the sticker to where it will be used: floor stickers for short-term in-store promotions, logo stickers and kiss-cut sheets for packaging and giveaways, laptop stickers for personal and brand use, windscreen stickers for vehicles, and photoluminescent stickers where visibility in the dark matters. For artwork, vector files are ideal, or supply a high-resolution image of your design; tell us the shape and size you want. We confirm a proof before printing, then produce your stickers and deliver across Sri Lanka, ready to apply. For repeat orders — such as packaging labels you use every month — keep your artwork on file with us and reordering is quick.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the difference between die-cut and kiss-cut stickers?",
        a: "Die-cut stickers are cut individually to the exact shape of your design, with no backing left around them. Kiss-cut stickers are cut through the sticker material only, leaving the backing sheet intact, so they peel off easily — ideal for sheets of labels or promotional stickers.",
      },
      {
        q: "What are photoluminescent stickers used for?",
        a: "Photoluminescent stickers glow in the dark after absorbing light. They are commonly used for safety and emergency signage, such as exit markers and warning labels, as well as for novelty and decorative applications.",
      },
      {
        q: "What are domed epoxy stickers?",
        a: "Domed epoxy stickers have a clear resin dome applied over the printed design, creating a raised, glossy, three-dimensional effect. They give labels and badges a premium look and add an extra layer of protection to the print.",
      },
      {
        q: "How should I prepare my artwork for stickers?",
        a: "Vector files such as AI, EPS or PDF give the sharpest results, especially for die-cut shapes that follow your design's outline. High-resolution images also work. Include the size and shape you want, and we will confirm a proof before printing. If you are unsure about your files, send what you have and we will check them and advise before production.",
      },
    ],
    related: [
      { label: "Sticker Printing & Cutting", href: "/product-category/sticker-printing-cutting" },
      { label: "Custom Logo Stickers", href: "/product/custom-logo-stickers" },
      { label: "Custom Laptop Stickers", href: "/product/custom-laptop-stickers" },
      { label: "Custom Vinyl Decals", href: "/product/custom-vinyl-decals" },
      { label: "UV DTF Printing", href: "/product/uv-dtf-printing" },
      { label: "Printed Transparent Stickers", href: "/product/printed-transparent-stickers" },
      { label: "Custom Floor Stickers & Decals", href: "/product/custom-floor-stickers-and-decals" },
    ],
  },
  {
    slug: "digital-printing-in-sri-lanka",
    title: "Digital Printing in Sri Lanka — A Complete Guide",
    description:
      "Digital printing in Sri Lanka — flex banners, backlit displays, large-format stickers and one-way vision film, printed in full colour with island-wide delivery.",
    date: "2026-11-11",
    intro:
      "Digital printing covers the large-format work that gets a business noticed — shopfront banners, event backdrops, window graphics and durable prints for indoor and outdoor use. Print Works handles digital and large-format printing for businesses of every size, printing your designs in vivid full colour at sizes that get noticed, on materials chosen for indoor or outdoor use.",
    sections: [
      {
        heading: "What does digital printing include?",
        paragraphs: [
          "**Flex banner printing** is the workhorse of outdoor advertising — bold, weather-tough banners for shopfronts, hoardings, events and promotions, printed in vivid full colour at sizes that command attention. **Backlit flex printing** is made for lightboxes and illuminated signage — from shopping mall displays to building facades — so your message glows clearly after dark. **Large format sticker printing** covers everything from product labels and wall graphics to full-surface branding, cut to your required shape and size. **One-way vision sticker printing** turns glass into advertising space: the graphic is visible from outside while visibility is kept from the inside, ideal for vehicle windows and shopfront glass. **Magnet stickers** give you reusable signage — easy to mount, remove and reposition. For prints that must endure handling and the elements, **PP/PET synthetic paper printing** offers a durable alternative to standard paper.",
        ],
      },
      {
        heading: "Flex banners vs backlit flex — which one?",
        paragraphs: [
          "Standard flex banners are printed for normal viewing in daylight and suit outdoor advertising. Backlit flex is printed on translucent material designed for lightboxes, so your graphic stays bright and readable after dark. If your sign sits in a lightbox or needs to be seen at night, backlit is the right choice; for a daytime shopfront or event banner, standard flex does the job.",
        ],
      },
      {
        heading: "Materials and sizes",
        paragraphs: [
          "Every job is printed in full colour from your artwork, at large-format scale and cut to your exact dimensions. Choose flex for outdoor banners, backlit film for illuminated displays, adhesive vinyl for stickers and window graphics, magnetic material for reusable signs, or PP/PET synthetic paper where extra durability is needed. Indoor prints prioritise sharp detail and rich colour; outdoor work uses materials made to stand up to sun and rain. If you are unsure which material suits your job, describe where the print will go and how long it needs to last, and we will recommend the right option. Tell us the viewing distance too — a display viewed up close needs finer detail than a roadside hoarding, and we will set up your artwork scale accordingly. Colours are matched to your brand files so the printed result looks like your design.",
        ],
      },
      {
        heading: "How to order",
        paragraphs: [
          "Match the product to the placement. Outdoor promotions call for flex banners; illuminated signs need backlit flex; glass surfaces suit one-way vision stickers; short-term or movable signage is perfect for magnet stickers; and premium documents or harsh conditions call for PP/PET synthetic paper. Measure the space before you order — a banner that is too small disappears on a big wall, while an oversized one is hard to mount. Send us your artwork or logo, along with the size and quantity you need. We will share a proof for your approval before printing, so colours, text and layout are exactly right. Once approved, your prints go into production and are delivered across Sri Lanka or ready for collection. For recurring promotions, magnet stickers and synthetic paper prints can be stored and reused.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the difference between flex banners and backlit flex?",
        a: "Standard flex banners are printed for normal viewing in daylight and suit outdoor advertising. Backlit flex is printed on translucent material designed for lightboxes, so your graphic stays bright and readable after dark.",
      },
      {
        q: "What is one-way vision sticker printing?",
        a: "It prints your design onto perforated film for glass surfaces. From outside, people see your full graphic; from inside, you can still see out. It is popular for vehicle windows and shopfront glass.",
      },
      {
        q: "Are magnet stickers reusable?",
        a: "Yes. Magnet stickers have a magnetic backing, so they can be mounted, removed and repositioned without adhesive residue. They are a practical choice for temporary promotions and vehicle signage.",
      },
      {
        q: "When should I choose PP/PET synthetic paper?",
        a: "Choose it when your print needs extra toughness — for example, prints handled frequently or exposed to moisture. It is a durable synthetic stock that lasts longer than standard paper in demanding conditions.",
      },
    ],
    related: [
      { label: "Digital Printing", href: "/product-category/digital-printing" },
      { label: "Flex Banner Printing", href: "/product/flex-banner-printing" },
      { label: "Backlit Flex Printing", href: "/product/backlit-flex-printing" },
      { label: "Large Format Sticker Printing", href: "/product/large-format-sticker-printing" },
      { label: "PP/PET Synthetic Paper Printing", href: "/product/pp-pet-synthetic-paper-printing" },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
