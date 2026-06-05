"use client";

import Link from "next/link";
import type { JobOpening } from "@/lib/job-openings";
import { CareerApplicationForm, scrollToApply } from "@/components/career/CareerApplicationForm";

const FAQ = [
  {
    q: "What does the application process look like?",
    a: "Submit the form below with your details and resume. Our HR team reviews every application. Shortlisted candidates will be invited for an interview—and for design roles, a practical session.",
  },
  {
    q: "Is remote work available?",
    a: "Yes—role dependent. Most production and workshop roles are based at our Biyagama location. Check the job description for specifics.",
  },
  {
    q: "Do you offer internships?",
    a: "We do run internship cohorts when capacity allows. Openings will be listed here when available.",
  },
];

type Props = {
  openings: JobOpening[];
};

export function CareersContent({ openings }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf2f4] via-white to-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-16 sm:py-20 md:py-24">
        <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-brand-red/10 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-brand-red/5 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-brand-red">Careers</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Build Your Future With Us
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
            Ship meaningful work with a product-obsessed, kind, and high-ownership team. We keep things simple, move
            fast, and invest in your growth.
          </p>
          <a
            href="#open-roles"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-red px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-red/25 transition hover:bg-brand-red-dark"
          >
            View Open Roles
            <i className="bi bi-arrow-down" aria-hidden />
          </a>
        </div>
      </section>

      {/* Hiring banner */}
      <section className="mx-auto max-w-5xl px-4 pb-10">
        <div className="rounded-2xl border border-brand-red/20 bg-gradient-to-r from-brand-red/10 via-white to-brand-red/5 px-6 py-5 text-center shadow-sm sm:px-8">
          <p className="text-lg font-bold text-gray-900 md:text-xl">
            <span aria-hidden>🎨👩‍💼</span> We&apos;re Hiring! Join the PrintWorks.lk Team – Biyagama
          </p>
        </div>
      </section>

      {/* Open roles */}
      <section id="open-roles" className="mx-auto max-w-5xl px-4 pb-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Current Openings</h2>
          <p className="mt-2 text-gray-600">Open roles — apply using the form below.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {openings.map((job) => (
            <article key={job.id} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex items-start gap-2">
                <span className="text-brand-red" aria-hidden>🔹</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                  {job.location ? (
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">{job.location}{job.employment_type ? ` · ${job.employment_type}` : ""}</p>
                  ) : null}
                </div>
              </div>
              {job.summary ? <p className="mt-3 text-sm text-gray-600">{job.summary}</p> : null}
              {job.requirements.length > 0 ? (
                <ul className="mt-4 flex-1 space-y-2">
                  {job.requirements.map((req) => (
                    <li key={req} className="flex gap-2 text-sm text-gray-700">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <button
                type="button"
                onClick={() => scrollToApply(job.id)}
                className="mt-6 w-full rounded-xl border-2 border-brand-red bg-red-50 py-2.5 text-sm font-bold text-brand-red transition hover:bg-brand-red hover:text-white"
              >
                Apply now
              </button>
            </article>
          ))}
        </div>

        {openings.length === 0 ? (
          <p className="text-center text-gray-500">No open roles at the moment. Check back soon.</p>
        ) : null}
      </section>

      {/* Application form */}
      <section className="mx-auto max-w-3xl px-4 pb-16">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Apply now</h2>
          <p className="mt-2 text-gray-600">Use the form below to submit your application. We review every submission.</p>
        </div>
        <CareerApplicationForm openings={openings} />
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 pb-16">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-red">FAQ</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">Good to know</h2>
        </div>
        <div className="space-y-4">
          {FAQ.map((item) => (
            <details key={item.q} className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm open:shadow-md">
              <summary className="cursor-pointer list-none font-semibold text-gray-900 marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-3">
                  {item.q}
                  <i className="bi bi-chevron-down text-gray-400 transition group-open:rotate-180" aria-hidden />
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Ready to build with us?</h2>
        <p className="mt-3 text-gray-600">
          We&apos;re excited to meet you. Tell us how you like to work and what you want to learn next.
        </p>
        <a
          href="#apply"
          className="mt-6 inline-flex items-center rounded-xl bg-gray-900 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-black"
        >
          Start your application
        </a>
        <p className="mt-6 text-sm text-gray-500">
          Questions? <Link href="/contact" className="font-semibold text-brand-red hover:underline">Contact us</Link>
        </p>
      </section>
    </div>
  );
}
