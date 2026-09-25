export type PolicySlug =
  | "privacy-policy"
  | "return-policy"
  | "shipping-policy"
  | "terms-and-conditions";

export type PolicySection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type PolicyDoc = {
  slug: PolicySlug;
  title: string;
  shortTitle: string;
  description: string;
  lastUpdated: string;
  sections: PolicySection[];
};

export const POLICY_LINKS: { href: string; label: string; slug: PolicySlug }[] = [
  { href: "/privacy-policy", label: "Privacy Policy", slug: "privacy-policy" },
  { href: "/return-policy", label: "Return Policy", slug: "return-policy" },
  { href: "/shipping-policy", label: "Shipping Policy", slug: "shipping-policy" },
  {
    href: "/terms-and-conditions",
    label: "Terms and Conditions",
    slug: "terms-and-conditions",
  },
];

export const POLICIES: Record<PolicySlug, PolicyDoc> = {
  "privacy-policy": {
    slug: "privacy-policy",
    title: "Privacy Policy",
    shortTitle: "Privacy Policy",
    description:
      "How Print Works.LK collects, uses, and protects your personal information.",
    lastUpdated: "25 September 2026",
    sections: [
      {
        heading: "1. Who we are",
        paragraphs: [
          "Print Works.LK (“we”, “us”, “our”) operates an online printing and product ordering platform serving customers across Sri Lanka. This Privacy Policy explains what information we collect when you use our website, place orders, request quotes, or contact our support team.",
          "By using printworks.lk you agree to the practices described in this policy.",
        ],
      },
      {
        heading: "2. Information we collect",
        paragraphs: [
          "We collect information you provide directly and information generated when you use our services:",
        ],
        bullets: [
          "Account details such as name, email address, phone / WhatsApp number, and login credentials",
          "Order and quote details including delivery address, product selections, artwork files, and payment references",
          "Messages you send through contact forms, live chat, WhatsApp, or email",
          "Technical data such as IP address, browser type, device information, and pages visited (for security and analytics)",
        ],
      },
      {
        heading: "3. How we use your information",
        paragraphs: ["We use your information to:"],
        bullets: [
          "Process orders, quotes, invoices, and deliveries",
          "Communicate order updates, support replies, and service-related notices",
          "Improve our website, products, and customer experience",
          "Prevent fraud, abuse, and unauthorized access",
          "Comply with legal and accounting requirements",
        ],
      },
      {
        heading: "4. Sharing your information",
        paragraphs: [
          "We do not sell your personal data. We may share limited information with trusted partners only when needed to fulfil your order or operate our platform — for example payment gateways, courier / shipping partners, and IT service providers. These partners are required to handle your data securely and only for the agreed purpose.",
          "We may also disclose information if required by law or to protect our rights, customers, or safety.",
        ],
      },
      {
        heading: "5. Cookies and tracking",
        paragraphs: [
          "Our website may use cookies and similar technologies to keep you signed in, remember cart / wishlist preferences, and understand how the site is used. You can control cookies through your browser settings; disabling some cookies may affect site features.",
        ],
      },
      {
        heading: "6. Data retention and security",
        paragraphs: [
          "We keep order and account records for as long as needed for business, warranty, and legal purposes. We apply reasonable technical and organisational measures to protect your data, but no online transmission is completely risk-free.",
        ],
      },
      {
        heading: "7. Your rights",
        paragraphs: [
          "You may request access to, correction of, or deletion of your personal information (subject to legal retention needs). To make a request, contact us using the details below.",
        ],
      },
      {
        heading: "8. Contact",
        paragraphs: [
          "Questions about this Privacy Policy: info@printworks.lk or WhatsApp / phone 070 666 8885.",
        ],
      },
    ],
  },

  "return-policy": {
    slug: "return-policy",
    title: "Return Policy",
    shortTitle: "Return Policy",
    description:
      "Returns, reprints, and refunds for Print Works.LK custom print products.",
    lastUpdated: "25 September 2026",
    sections: [
      {
        heading: "1. Custom print products",
        paragraphs: [
          "Most Print Works.LK products are made to order using your artwork, specifications, and materials. Because of this, standard “change of mind” returns are generally not available once production has started or the order has been completed.",
        ],
      },
      {
        heading: "2. When we will make it right",
        paragraphs: [
          "We stand behind our work. Please contact us within 7 days of delivery if:",
        ],
        bullets: [
          "The order has a clear production or print quality defect caused by us",
          "You received the wrong product, size, quantity, or colour versus your approved order",
          "The package arrived damaged due to packing issues on our side (please share clear photos)",
        ],
      },
      {
        heading: "3. What is not covered",
        bullets: [
          "Errors in customer-supplied artwork (low resolution, wrong colours, spelling mistakes, missing bleed, etc.) after you approved the design / proof",
          "Colour variation within normal print tolerance across different materials or batches",
          "Products that have been used, cut, installed, or altered after delivery",
          "Change of mind, wrong size selected by the customer, or delay requests after production has begun",
        ],
      },
      {
        heading: "4. How to request a return / reprint",
        paragraphs: [
          "Message us on WhatsApp 070 666 8885 or email info@printworks.lk with your order number, a short description of the issue, and photos of the product and packaging. Our team will review and confirm whether a reprint, partial refund, or other remedy applies.",
        ],
      },
      {
        heading: "5. Refunds",
        paragraphs: [
          "Where a refund is approved, it will be processed to the original payment method or another agreed method within a reasonable timeframe after the claim is verified. Shipping charges may be non-refundable unless the fault is ours.",
        ],
      },
    ],
  },

  "shipping-policy": {
    slug: "shipping-policy",
    title: "Shipping Policy",
    shortTitle: "Shipping Policy",
    description:
      "Delivery options, timelines, and charges for Print Works.LK orders in Sri Lanka.",
    lastUpdated: "25 September 2026",
    sections: [
      {
        heading: "1. Where we deliver",
        paragraphs: [
          "We deliver custom print and related products island-wide across Sri Lanka through our courier partners and, where available, local pickup / shop collection arrangements.",
        ],
      },
      {
        heading: "2. Production before shipping",
        paragraphs: [
          "Orders are manufactured after payment confirmation (and design approval where required). Estimated production time depends on the product, quantity, finishing, and current queue. Delivery timing starts after production is complete — not from the moment the order is placed.",
        ],
      },
      {
        heading: "3. Delivery timelines",
        paragraphs: [
          "Once your order is ready to ship, typical courier transit within Sri Lanka is usually a few working days, depending on your district and courier capacity. Public holidays, weather, remote locations, or courier disruptions may extend delivery time.",
        ],
        bullets: [
          "Colombo and nearby areas: often faster transit once dispatched",
          "Other districts: allow additional working days for last-mile delivery",
          "Express options may be available for selected products — ask our team when ordering",
        ],
      },
      {
        heading: "4. Shipping charges",
        paragraphs: [
          "Shipping fees are calculated based on weight, package size, destination, and selected delivery method. Charges are shown at checkout or confirmed on your quotation / invoice. Free or promotional shipping may apply to selected campaigns or order values when advertised.",
        ],
      },
      {
        heading: "5. Tracking and delivery attempts",
        paragraphs: [
          "Where tracking is available, we will share tracking details once the parcel is handed to the courier. Please ensure your phone number and address are accurate. Failed delivery attempts due to unreachable contacts or incorrect addresses may result in return-to-sender fees or re-delivery charges.",
        ],
      },
      {
        heading: "6. Damaged or missing parcels",
        paragraphs: [
          "If a package arrives damaged or incomplete, contact us within 48 hours with photos of the outer packaging and the product. We will coordinate with the courier and arrange a suitable solution under our Return Policy.",
        ],
      },
      {
        heading: "7. Questions",
        paragraphs: [
          "For shipping help: WhatsApp / phone 070 666 8885 or info@printworks.lk.",
        ],
      },
    ],
  },

  "terms-and-conditions": {
    slug: "terms-and-conditions",
    title: "Terms and Conditions",
    shortTitle: "Terms & Conditions",
    description:
      "The rules that apply when you shop, request quotes, or use Print Works.LK.",
    lastUpdated: "25 September 2026",
    sections: [
      {
        heading: "1. Agreement",
        paragraphs: [
          "These Terms and Conditions govern your use of the Print Works.LK website and services. By browsing the site, creating an account, submitting a quote request, or placing an order, you agree to these terms and our related policies (Privacy, Shipping, and Return).",
        ],
      },
      {
        heading: "2. Products and custom work",
        paragraphs: [
          "Product images, colours, and descriptions on the website are for guidance. Actual printed colours and finishes can vary depending on material, lighting, and print process. Custom jobs rely on the artwork and instructions you provide; you are responsible for checking spelling, layout, and approvals before production.",
        ],
      },
      {
        heading: "3. Quotes, prices, and payment",
        paragraphs: [
          "Quoted prices are based on the details you provide (quantity, size, material, finishing, delivery). Prices may change if specifications change. Orders typically proceed after payment confirmation or an agreed deposit. Unpaid or incomplete orders may be paused or cancelled.",
        ],
      },
      {
        heading: "4. Artwork and intellectual property",
        paragraphs: [
          "You confirm that you own or have permission to use all logos, images, and text you submit. You remain responsible for any copyright, trademark, or content disputes arising from your artwork. We may refuse jobs that appear illegal, harmful, or infringing.",
        ],
      },
      {
        heading: "5. Order changes and cancellations",
        paragraphs: [
          "Changes or cancellations are only possible before production begins and may not be available once materials are cut or printing has started. Contact us immediately if you need to change an order.",
        ],
      },
      {
        heading: "6. Limitation of liability",
        paragraphs: [
          "To the fullest extent permitted by law, Print Works.LK is not liable for indirect or consequential losses (such as lost profits or business interruption). Our liability for any claim related to an order is limited to the amount you paid for that order.",
        ],
      },
      {
        heading: "7. Website use",
        paragraphs: [
          "You agree not to misuse the site, attempt unauthorised access, upload malware, scrape content in an abusive way, or interfere with other users. We may suspend accounts that violate these terms.",
        ],
      },
      {
        heading: "8. Governing law",
        paragraphs: [
          "These terms are governed by the laws of Sri Lanka. Disputes will first be addressed in good faith through our support team.",
        ],
      },
      {
        heading: "9. Contact",
        paragraphs: [
          "Print Works.LK — info@printworks.lk — WhatsApp / phone 070 666 8885.",
        ],
      },
    ],
  },
};

export function getPolicy(slug: PolicySlug): PolicyDoc {
  return POLICIES[slug];
}
