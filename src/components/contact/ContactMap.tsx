// Server Component — no "use client" directive.
// An <iframe> embed is pure HTML — it requires no React state, no event handlers,
// and no browser APIs. Rendering it on the server means the iframe src appears
// in the initial HTML, which avoids a layout-shift flash on load.

/** Canonical store address (shown on contact + footer). */
export const PRINTWORKS_ADDRESS =
  "1st Floor, No.215, 10 New Kandy Rd, Biyagama, Sri Lanka.11650";

/** Google Maps place short link (Open in Maps). */
export const PRINTWORKS_MAP_LINK = "https://maps.app.goo.gl/9eYPFUkwyqFyJGok6";

/** Embed iframe — address query pins the Biyagama location. */
export const PRINTWORKS_MAP_EMBED =
  "https://www.google.com/maps?q=" +
  encodeURIComponent(
    "1st Floor, No.215, 10 New Kandy Rd, Biyagama, Sri Lanka 11650"
  ) +
  "&hl=en&z=17&output=embed";

export function ContactMap() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border-2 border-brand-red/30 bg-gray-100 shadow-xl shadow-brand-red/10 ring-2 ring-brand-red/10 transition-all duration-300 hover:border-brand-red/50 hover:shadow-2xl hover:shadow-brand-red/15">
      <iframe
        src={PRINTWORKS_MAP_EMBED}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Print Works.LK location — Biyagama"
        className="absolute inset-0 h-full w-full"
      />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#fdf2f4]/95 to-transparent" />
    </div>
  );
}
