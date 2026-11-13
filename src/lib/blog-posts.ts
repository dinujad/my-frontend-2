// Blog posts for printworks.lk. Content lives here as data and is rendered by
// the blog listing page (src/app/blog/page.tsx) and the article page
// (src/app/blog/[slug]/page.tsx) via src/components/blog/BlogArticle.tsx.
//
// Content rules: human buying-guide tone, no em dashes anywhere, no prices
// of any kind (no figures, no ranges, no starting-price claims, no example
// prices). The store is quote-based, so posts say "request a quote" and
// never state a price. No invented specs, stock or warranty claims.
// Internal links use markdown-style [label](/path) inside paragraph text
// and are verified live (HTTP 200) before being added here.

export type BlogLink = {
  label: string;
  href: string;
};

export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  /** Meta description, 120-155 characters. */
  description: string;
  datePublished: string;
  excerpt: string;
  sections: BlogSection[];
  faqs: BlogFaq[];
  relatedLinks: BlogLink[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "sticker-printing-sri-lanka",
    title: "Sticker Printing in Sri Lanka",
    description:
      "Sticker printing in Sri Lanka: vinyl, transparent and UV DTF stickers for indoor and outdoor use. How to choose the right type and order custom stickers.",
    datePublished: "2026-11-13",
    excerpt:
      "From vinyl and transparent stickers to UV DTF, here is how to choose the right sticker for your brand, product or event, and how to order it in Sri Lanka.",
    sections: [
      {
        heading: "What sticker printing covers",
        paragraphs: [
          "Sticker printing covers a wide range of products, from small logo stickers for packaging to large decals for shop windows and vehicles. The right choice depends on where the sticker will be used, what it will be stuck to, and how long it needs to last.",
          "At Print Works, stickers are printed to order. You choose the material, size, shape and quantity, send your artwork, and [request a quote](/quote) for your job. This guide explains the main types so you can ask for the right one.",
        ],
      },
      {
        heading: "Vinyl stickers",
        paragraphs: [
          "Vinyl stickers are the most common choice for everyday use. They are printed on durable vinyl, which handles handling, moisture and sunlight better than paper, and they work well on laptops, bottles, packaging, shop displays and vehicles.",
          "Vinyl suits logos, product labels, promotional stickers and branding. It can be cut to almost any shape, from simple circles and rectangles to custom die-cut outlines that follow your design. See [custom vinyl decals](/product/custom-vinyl-decals) and [printed PVC stickers](/product/printed-pvc-stickers) for the vinyl range.",
        ],
      },
      {
        heading: "Transparent stickers",
        paragraphs: [
          "Transparent stickers are printed on clear material, so only your design shows and the surface behind it stays visible. They are a good choice for glass doors and windows, jars and bottles, and packaging where you want the product itself to show through.",
          "Because the background is clear, design matters more here than with vinyl. Bold shapes, strong contrast and simple layouts read best, while fine pale details can disappear against a busy background. See [printed transparent stickers](/product/printed-transparent-stickers).",
        ],
      },
      {
        heading: "UV DTF stickers",
        paragraphs: [
          "UV DTF stickers are printed on a transfer film and applied to hard surfaces such as bottles, tumblers, mugs, boxes and panels. They give a clean, printed-on look without a visible sticker edge, and they suit designs with fine detail or many colours.",
          "UV DTF is a good option when you want a premium finish on a rigid product, for example branded merchandise, gift items or product packaging. See [UV DTF printing](/product/uv-dtf-printing).",
        ],
      },
      {
        heading: "Indoor or outdoor: choosing the right sticker",
        paragraphs: [
          "Where the sticker will live decides the material. Indoor stickers sit on laptops, notebooks, packaging and shop displays, where they are handled often but sheltered from weather. Outdoor stickers face sun, rain and dust, so they need a tougher material and a finish that protects the print.",
          "Tell us where the sticker will be used when you request a quote. A sticker for a shop window, a vehicle or a product that is handled daily needs a different build from a sticker for a gift box or a notebook.",
        ],
        bullets: [
          "Indoor use: laptops, packaging, notebooks, shop displays, event giveaways.",
          "Outdoor use: shop windows, vehicles, sign boards, products stored or used outside.",
          "Wet or handled surfaces: bottles, jars and containers need a material that resists moisture.",
        ],
      },
      {
        heading: "Sizes, shapes and finishes",
        paragraphs: [
          "Stickers can be made in almost any size, from small product labels to [large format sticker printing](/product/large-format-sticker-printing) for windows and displays. Custom shapes are cut to follow your artwork, so a logo sticker can be the exact outline of your logo rather than a plain square.",
          "Finishes change how a sticker looks and feels. A gloss finish makes colours look brighter, while a matte finish gives a softer, premium look and reduces glare on glass and screens. If you are unsure which finish suits your design, mention it in your quote request and we can advise.",
        ],
      },
      {
        heading: "How to order custom stickers",
        paragraphs: [
          "Ordering is simple. Decide the size, quantity and material, prepare your artwork, and [request a quote](/quote) with those details. If you need help with the design, say so in your request and we can talk through the options.",
          "For inspiration, browse the [sticker printing category](/product-category/sticker-printing-cutting), which includes [custom logo stickers](/product/custom-logo-stickers), [floor stickers](/product/custom-floor-stickers-and-decals) and [one-way vision stickers](/product/one-way-vision-sticker-printing) for glass. If you have questions before ordering, [contact us](/contact).",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the difference between vinyl and transparent stickers?",
        answer:
          "Vinyl stickers are printed on solid white or coloured vinyl, so the whole sticker area is covered. Transparent stickers are printed on clear material, so only the design shows and the surface behind it stays visible. Vinyl suits most everyday uses, while transparent stickers suit glass, bottles and packaging where you want the product to show through.",
      },
      {
        question: "Can stickers be used outdoors?",
        answer:
          "Yes, outdoor stickers are made with tougher materials and a protective finish so they handle sun, rain and dust. Tell us the sticker will be used outdoors when you request a quote, so the right material is used.",
      },
      {
        question: "What artwork file should I send?",
        answer:
          "Send your artwork as a high-resolution file. Vector files work best for logos and text, while high-resolution images suit photos and detailed designs. If you are unsure whether your file is good enough, mention it in your quote request and we can check it for you.",
      },
      {
        question: "Can I order stickers in a custom shape and size?",
        answer:
          "Yes. Stickers can be cut to follow your artwork, from simple circles and rectangles to custom outlines of a logo or illustration. Tell us the size and shape you need when you request a quote.",
      },
      {
        question: "How do I place an order for custom stickers?",
        answer:
          "Send a quote request with the size, quantity, material and where the sticker will be used, plus your artwork file. We will confirm the details and prepare your order. You can request a quote from the quote page or contact us with any questions first.",
      },
    ],
    relatedLinks: [
      { label: "Sticker Printing and Cutting", href: "/product-category/sticker-printing-cutting" },
      { label: "Custom Logo Stickers", href: "/product/custom-logo-stickers" },
      { label: "UV DTF Printing", href: "/product/uv-dtf-printing" },
      { label: "Printed Transparent Stickers", href: "/product/printed-transparent-stickers" },
      { label: "Request a Quote", href: "/quote" },
    ],
  },
  {
    slug: "sticker-printing-price-sri-lanka",
    title: "Sticker Printing Price in Sri Lanka",
    description:
      "Sticker printing prices in Sri Lanka depend on size, quantity, material and finish. Learn what affects your quote and how to request one.",
    datePublished: "2026-11-13",
    excerpt:
      "There is no single sticker price, because every job is different. Here is what goes into a quote and what to include when you ask for one.",
    sections: [
      {
        heading: "Why sticker printing is quoted per job",
        paragraphs: [
          "Sticker printing has no fixed price list, because no two jobs are the same. A small batch of simple logo stickers and a large run of custom-shaped outdoor stickers are very different jobs, even if both are stickers.",
          "That is why Print Works quotes each job separately. A quote is based on the details of your job, so you pay for what you actually need rather than a one-size-fits-all rate. This guide explains what goes into a quote, so you can ask for one with confidence.",
        ],
      },
      {
        heading: "Size and quantity",
        paragraphs: [
          "Size and quantity are the first things that shape a quote. Larger stickers use more material, and larger quantities take more print and cutting time. The two work together: a small sticker in a large quantity and a large sticker in a small quantity can end up quite different.",
          "If you are still deciding on quantity, think about how the stickers will be used. Product labels and packaging usually need a steady supply, while event stickers or giveaways are often a single batch. Ordering the right quantity from the start avoids reprints later.",
        ],
      },
      {
        heading: "Material: vinyl, transparent, paper and DTF",
        paragraphs: [
          "The material is the next big factor. Vinyl is the standard choice for durable everyday stickers, transparent material suits glass and packaging, paper suits short-term uses such as event labels, and UV DTF suits hard surfaces such as bottles and gift items.",
          "Each material prints and finishes differently, and each suits a different use. If you are unsure which material fits your job, describe where the sticker will be used and we can recommend one. See the [sticker printing category](/product-category/sticker-printing-cutting) for the full range.",
        ],
      },
      {
        heading: "Finish and cutting",
        paragraphs: [
          "Finish and cutting also affect a quote. A gloss or matte finish protects the print and changes the look, while custom cutting follows the outline of your design instead of a plain rectangle. Simple shapes are quicker to cut than detailed outlines with many curves.",
          "Think about the finish your design needs. A bright promotional sticker often suits gloss, while a premium product label often suits matte. If the sticker will be handled a lot or used outdoors, a protective finish is worth asking about.",
        ],
      },
      {
        heading: "Artwork and design",
        paragraphs: [
          "Print-ready artwork keeps a job simple. A clean, high-resolution file with the right size and shape is quicker to set up than a low-resolution image that needs fixing. Vector files are best for logos and text.",
          "If you do not have print-ready artwork, say so in your quote request. We can talk through what is needed and what can be prepared from the files you have.",
        ],
      },
      {
        heading: "How to request a quote",
        paragraphs: [
          "A quote request is quick. Include the size, quantity, material, where the sticker will be used, and your artwork file if you have one. The more detail you give, the faster the quote comes back, because there is less back and forth.",
          "You can [request a quote](/quote) from the quote page, or [contact us](/contact) if you have questions first. If you want to see the options before asking, browse [custom logo stickers](/product/custom-logo-stickers), [UV DTF printing](/product/uv-dtf-printing) and [printed transparent stickers](/product/printed-transparent-stickers).",
        ],
        bullets: [
          "Size and shape of the sticker.",
          "Quantity you need.",
          "Material: vinyl, transparent, paper or DTF.",
          "Where the sticker will be used: indoor, outdoor, on glass, on packaging.",
          "Your artwork file, if you have one.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why is there no fixed price list for stickers?",
        answer:
          "Every sticker job is different. Size, quantity, material, finish and cutting all change what a job involves, so a single price list would not reflect real jobs. Quoting per job means you get a figure based on what you actually need.",
      },
      {
        question: "What details should I include in a quote request?",
        answer:
          "Include the size and shape, the quantity, the material you want, and where the sticker will be used. Add your artwork file if you have one. With those details, a quote can be prepared without extra questions.",
      },
      {
        question: "Does ordering more stickers change the quote?",
        answer:
          "Yes, quantity is one of the main factors in a quote. Larger quantities usually work out better per sticker than very small batches, because the setup is shared across more stickers. If you are unsure how many you need, ask for a quote for the quantity you expect to use.",
      },
      {
        question: "Can I get a quote before I send artwork?",
        answer:
          "Yes. A quote can be prepared from the size, quantity, material and use, even before artwork is ready. The artwork is needed before printing starts, not before quoting.",
      },
      {
        question: "How long does it take to get a quote?",
        answer:
          "A quote is prepared once your details are received. Including the size, quantity, material and intended use in your first request avoids back and forth and gets you an answer sooner.",
      },
    ],
    relatedLinks: [
      { label: "Sticker Printing and Cutting", href: "/product-category/sticker-printing-cutting" },
      { label: "Custom Logo Stickers", href: "/product/custom-logo-stickers" },
      { label: "UV DTF Printing", href: "/product/uv-dtf-printing" },
      { label: "Printed Transparent Stickers", href: "/product/printed-transparent-stickers" },
      { label: "Request a Quote", href: "/quote" },
    ],
  },
  {
    slug: "laptop-stickers-sri-lanka",
    title: "Laptop Stickers in Sri Lanka",
    description:
      "Custom laptop stickers in Sri Lanka: vinyl and UV DTF options, design tips and bulk orders for teams and events. Request a quote today.",
    datePublished: "2026-11-13",
    excerpt:
      "Custom laptop stickers are an easy way to brand a laptop, a team or an event. Here is how to choose the material, design and quantity.",
    sections: [
      {
        heading: "Why laptop stickers",
        paragraphs: [
          "A laptop lid is one of the most visible surfaces you own. It travels with you to lectures, meetings, cafes and events, so a sticker on it is seen far more often than a sticker kept in a drawer.",
          "Businesses use laptop stickers for team branding, event giveaways and product launches. Students and creators use them to show a brand, a community or a personal style. Whatever the reason, a good laptop sticker starts with the right material and design.",
        ],
      },
      {
        heading: "Vinyl laptop stickers",
        paragraphs: [
          "Vinyl is the most popular choice for laptop stickers. It is durable, resists everyday handling, and peels off cleanly from a smooth laptop lid when you want to remove it. Vinyl suits logos, illustrations, text and full-colour designs.",
          "Vinyl stickers can be cut to any shape, so your sticker can follow the outline of your logo instead of sitting in a plain square. See [custom laptop stickers](/product/custom-laptop-stickers) and [custom vinyl decals](/product/custom-vinyl-decals).",
        ],
      },
      {
        heading: "UV DTF laptop stickers",
        paragraphs: [
          "UV DTF stickers are printed on a transfer film and applied to hard surfaces, giving a clean printed-on look with no visible sticker edge. They suit detailed designs and small text, and they work well when you want a premium finish on a laptop lid.",
          "If your design has fine lines, many colours or a detailed illustration, UV DTF is worth considering. See [UV DTF printing](/product/uv-dtf-printing).",
        ],
      },
      {
        heading: "Design tips for laptop stickers",
        paragraphs: [
          "A laptop sticker is small, so keep the design simple. One clear idea reads better than a crowded design, and strong contrast helps it stand out against the laptop lid. Test your design at the size it will be printed, not just on a large screen.",
          "Think about where the sticker will sit. A single bold sticker works well in the centre of a lid, while a set of small stickers suits the corners and edges. If the sticker carries a logo, keep enough clear space around it so the logo stays readable.",
        ],
        bullets: [
          "Keep the design simple: one idea, strong contrast, readable at small size.",
          "Use bold shapes and colours that stand out on a laptop lid.",
          "Measure the space on the lid before choosing the size.",
          "Send high-resolution artwork so fine details print cleanly.",
        ],
      },
      {
        heading: "How long do laptop stickers last?",
        paragraphs: [
          "How long a laptop sticker lasts depends on the material, how the laptop is handled, and how often the sticker is touched or rubbed. Vinyl stickers are made for everyday use and hold up well on a laptop that travels in a bag and is used daily.",
          "A few habits help. Apply the sticker to a clean, dry, smooth surface, press it down firmly, and avoid peeling at the corners. If a sticker starts to lift, it is usually because the surface was dusty or oily when it was applied.",
        ],
      },
      {
        heading: "Bulk orders for teams and events",
        paragraphs: [
          "Laptop stickers work well as team merchandise and event giveaways. A matching set for a team, a batch for a conference, or a limited design for a product launch all start the same way: one design, printed in the quantity you need.",
          "For bulk orders, decide the design, size and quantity first, then [request a quote](/quote). If the stickers are for an event, mention the date in your request so the timing can be planned. You can also browse [custom logo stickers](/product/custom-logo-stickers) and [domed epoxy stickers](/product/domed-epoxy-stickers) for related options, or [contact us](/contact) with questions.",
        ],
      },
    ],
    faqs: [
      {
        question: "Will a sticker damage my laptop?",
        answer:
          "A vinyl sticker on a smooth laptop lid generally peels off cleanly without damage. Apply it to a clean, dry surface, and if you ever remove it, peel slowly from a corner. Avoid sticking over vents or ports, and test on a small area first if the lid has a special coating.",
      },
      {
        question: "Are laptop stickers waterproof?",
        answer:
          "Vinyl laptop stickers resist water and everyday handling, such as light rain or a wipedown with a damp cloth. They are not made to be soaked or washed, so keep them away from heavy water exposure.",
      },
      {
        question: "Can I order one custom design in bulk?",
        answer:
          "Yes. Bulk orders use one design printed in the quantity you need, which suits teams, events, giveaways and product launches. Tell us the design, size and quantity when you request a quote.",
      },
      {
        question: "What size should a laptop sticker be?",
        answer:
          "It depends on your laptop and your design. Measure the space on the lid where the sticker will sit, and think about whether it is a single bold sticker or one of several small ones. If you are unsure, mention your laptop size in your quote request and we can advise.",
      },
      {
        question: "Can I use my own logo or photo?",
        answer:
          "Yes, you can use your own logo, illustration or photo. Send it as a high-resolution file: vector files work best for logos and text, while high-resolution images suit photos. If your file is low resolution, mention it in your quote request and we can check what is possible.",
      },
    ],
    relatedLinks: [
      { label: "Custom Laptop Stickers", href: "/product/custom-laptop-stickers" },
      { label: "Custom Logo Stickers", href: "/product/custom-logo-stickers" },
      { label: "UV DTF Printing", href: "/product/uv-dtf-printing" },
      { label: "Custom Vinyl Decals", href: "/product/custom-vinyl-decals" },
      { label: "Request a Quote", href: "/quote" },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function formatBlogDate(datePublished: string): string {
  const date = new Date(`${datePublished}T00:00:00+05:30`);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Colombo",
  });
}
