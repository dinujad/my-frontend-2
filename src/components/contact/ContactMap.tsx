// Server Component — no "use client" directive.
// An <iframe> embed is pure HTML — it requires no React state, no event handlers,
// and no browser APIs. Rendering it on the server means the iframe src appears
// in the initial HTML, which avoids a layout-shift flash on load.

const COLOMBO_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.963417399755!2d79.861982!3d6.927079!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2593a2c759d2b%3A0x6522d339b2b8b0f!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1708700000000";

export function ContactMap() {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-brand-red/30 bg-gray-100 shadow-xl shadow-brand-red/10 ring-2 ring-brand-red/10 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-red/15 hover:border-brand-red/50">
      <div className="aspect-[16/10] w-full min-h-[280px] sm:min-h-[320px] md:aspect-[21/9]">
        <iframe
          src={COLOMBO_EMBED}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Print Works.LK location"
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#fdf2f4]/95 to-transparent pointer-events-none" />
    </div>
  );
}
