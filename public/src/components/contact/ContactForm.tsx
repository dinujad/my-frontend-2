"use client";
// Client Component — must stay "use client" because it uses:
//   • useState         — tracks form submission status ("idle" | "sending" | "done" | "error")
//                        and focused field for animated border highlight
//   • onFocus/onBlur   — interactive field highlight, requires event handlers
//   • onSubmit handler — async form submission with loading/success states

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 800));
    setStatus("done");
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2 sm:gap-8">
      <div className="sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-8">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-gray-800">Name</span>
          <input
            type="text"
            name="name"
            required
            onFocus={() => setFocused("name")}
            onBlur={() => setFocused(null)}
            className={`w-full rounded-xl border-2 px-4 py-3.5 text-gray-900 outline-none transition-all duration-300 ${
              focused === "name" ? "border-brand-red bg-white ring-2 ring-brand-red/20" : "border-brand-red/20 bg-[#fdf2f4]/50 hover:border-brand-red/40 hover:bg-[#fdf2f4]/80"
            }`}
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-gray-800">Email</span>
          <input
            type="email"
            name="email"
            required
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
            className={`w-full rounded-xl border-2 px-4 py-3.5 text-gray-900 outline-none transition-all duration-300 ${
              focused === "email" ? "border-brand-red bg-white ring-2 ring-brand-red/20" : "border-brand-red/20 bg-[#fdf2f4]/50 hover:border-brand-red/40 hover:bg-[#fdf2f4]/80"
            }`}
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="block sm:col-span-2">
        <span className="mb-2 block text-sm font-medium text-gray-800">Phone</span>
        <input
          type="tel"
          name="phone"
          onFocus={() => setFocused("phone")}
          onBlur={() => setFocused(null)}
className={`w-full rounded-xl border-2 px-4 py-3.5 text-gray-900 outline-none transition-all duration-300 ${
              focused === "phone" ? "border-brand-red bg-white ring-2 ring-brand-red/20" : "border-brand-red/20 bg-[#fdf2f4]/50 hover:border-brand-red/40 hover:bg-[#fdf2f4]/80"
          }`}
          placeholder="07X XXX XXXX"
        />
      </label>

      <label className="block sm:col-span-2">
        <span className="mb-2 block text-sm font-medium text-gray-800">Subject</span>
        <input
          type="text"
          name="subject"
          required
          onFocus={() => setFocused("subject")}
          onBlur={() => setFocused(null)}
className={`w-full rounded-xl border-2 px-4 py-3.5 text-gray-900 outline-none transition-all duration-300 ${
              focused === "subject" ? "border-brand-red bg-white ring-2 ring-brand-red/20" : "border-brand-red/20 bg-[#fdf2f4]/50 hover:border-brand-red/40 hover:bg-[#fdf2f4]/80"
          }`}
          placeholder="How can we help?"
        />
      </label>

      <label className="block sm:col-span-2">
        <span className="mb-2 block text-sm font-medium text-gray-800">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          onFocus={() => setFocused("message")}
          onBlur={() => setFocused(null)}
          className={`w-full min-h-[140px] resize-y rounded-xl border-2 px-4 py-3.5 text-gray-900 outline-none transition-all duration-300 ${
            focused === "message" ? "border-brand-red bg-white ring-2 ring-brand-red/20" : "border-brand-red/20 bg-[#fdf2f4]/50 hover:border-brand-red/40 hover:bg-[#fdf2f4]/80"
          }`}
          placeholder="Tell us about your project..."
        />
      </label>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center rounded-xl bg-brand-red px-8 py-4 font-semibold text-white shadow-lg shadow-brand-red/25 transition-all duration-300 hover:bg-brand-red-dark hover:shadow-xl hover:shadow-brand-red/30 disabled:opacity-70 disabled:shadow-none"
        >
          {status === "sending" ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Sending...
            </>
          ) : status === "done" ? (
            "Message sent ✓"
          ) : (
            "Send message"
          )}
        </button>
      </div>
    </form>
  );
}
