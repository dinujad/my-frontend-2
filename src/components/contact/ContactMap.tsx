// Server Component — no "use client" directive.
// An <iframe> embed is pure HTML — it requires no React state, no event handlers,
// and no browser APIs. Rendering it on the server means the iframe src appears
// in the initial HTML, which avoids a layout-shift flash on load.

/** Print Works.lk — 6.9438293, 79.9907818 (Google Maps place) */
export const PRINTWORKS_MAP_EMBED =
  "https://www.google.com/maps?q=6.9438293,79.9907818&hl=en&z=17&output=embed";

export const PRINTWORKS_MAP_LINK =
  "https://www.google.com/maps/place/Print+Works.lk/@6.9438346,79.9882069,17z/data=!3m1!4b1!4m6!3m5!1s0x3ae2578a53db59ef:0x25d59acb8be4e3df!8m2!3d6.9438293!4d79.9907818!16s%2Fg%2F11hgy_3fmn?entry=ttu";

export const PRINTWORKS_ADDRESS = "1st Floor No.215, 10 New Kandy Rd, 11650";

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
        title="Print Works.LK location"
        className="absolute inset-0 h-full w-full"
      />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#fdf2f4]/95 to-transparent" />
    </div>
  );
}
