"use client";

import { useMemo, useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import type { EmploymentRow, JobOpening } from "@/lib/job-openings";
import { submitJobApplication } from "@/lib/job-openings";

type Props = {
  openings: JobOpening[];
  preselectedId?: number | null;
};

const emptyRow = (): EmploymentRow => ({ employer: "", dates: "", position: "", phone: "" });

export function CareerApplicationForm({ openings, preselectedId = null }: Props) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [jobOpeningId, setJobOpeningId] = useState<number | "">(
    preselectedId && openings.some((o) => o.id === preselectedId) ? preselectedId : openings[0]?.id ?? ""
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [employment, setEmployment] = useState<EmploymentRow[]>([emptyRow()]);
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState<File | null>(null);

  const selectedOpening = useMemo(
    () => openings.find((o) => o.id === jobOpeningId),
    [openings, jobOpeningId]
  );

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ jobId: number }>).detail;
      if (detail?.jobId && openings.some((o) => o.id === detail.jobId)) {
        setJobOpeningId(detail.jobId);
        setStep(1);
      }
    };
    window.addEventListener("career-select-job", handler);
    return () => window.removeEventListener("career-select-job", handler);
  }, [openings]);

  useEffect(() => {
    if (preselectedId && openings.some((o) => o.id === preselectedId)) {
      setJobOpeningId(preselectedId);
    }
  }, [preselectedId, openings]);

  const progress = step === 1 ? 50 : 100;

  const updateEmployment = (index: number, field: keyof EmploymentRow, value: string) => {
    setEmployment((rows) => rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const validateStep1 = () => {
    if (!firstName.trim() || !lastName.trim()) return "Please enter your full name.";
    if (!email.trim()) return "Please enter your email address.";
    if (!phone.trim()) return "Please enter your phone number.";
    if (!street.trim()) return "Please enter your street address.";
    if (!jobOpeningId) return "Please select a position.";
    return null;
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const err = validateStep1();
    if (err) {
      setError(err);
      setStep(1);
      setSubmitting(false);
      return;
    }

    const fd = new FormData();
    fd.append("job_opening_id", String(jobOpeningId));
    fd.append("first_name", firstName.trim());
    fd.append("last_name", lastName.trim());
    fd.append("email", email.trim());
    fd.append("phone", phone.trim());
    fd.append("street_address", street.trim());
    if (addressLine2.trim()) fd.append("address_line_2", addressLine2.trim());
    fd.append("position_applied", selectedOpening?.title ?? "General application");
    if (coverLetter.trim()) fd.append("cover_letter", coverLetter.trim());

    employment.forEach((row, i) => {
      if (!row.employer.trim()) return;
      fd.append(`employment_history[${i}][employer]`, row.employer.trim());
      fd.append(`employment_history[${i}][dates]`, row.dates.trim());
      fd.append(`employment_history[${i}][position]`, row.position.trim());
      fd.append(`employment_history[${i}][phone]`, row.phone.trim());
    });

    if (resume) fd.append("resume", resume);

    try {
      const result = await submitJobApplication(fd);
      setSuccessMessage(result.message);
      setSuccessOpen(true);
      setStep(1);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setStreet("");
      setAddressLine2("");
      setEmployment([emptyRow()]);
      setCoverLetter("");
      setResume(null);
    } catch (er) {
      setError(er instanceof Error ? er.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8" id="apply">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-red">Career</p>
            <h2 className="text-xl font-bold text-gray-900">Step {step} of 2</h2>
          </div>
          <div className="min-w-[120px] text-right">
            <p className="text-sm font-semibold text-gray-600">{progress}%</p>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-brand-red transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-gray-900">Your Personal Information</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">First name <span className="text-brand-red">*</span></label>
                <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Last name <span className="text-brand-red">*</span></label>
                <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email address <span className="text-brand-red">*</span></label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Street address <span className="text-brand-red">*</span></label>
              <input required value={street} onChange={(e) => setStreet(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Address line 2</label>
              <input value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Phone <span className="text-brand-red">*</span></label>
              <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Position you&apos;re applying for <span className="text-brand-red">*</span></label>
              <select
                required
                value={jobOpeningId}
                onChange={(e) => setJobOpeningId(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20"
              >
                {openings.map((o) => (
                  <option key={o.id} value={o.id}>{o.title}</option>
                ))}
              </select>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">Previous employment</h4>
              <p className="mt-1 text-sm text-gray-500">List previous employers, dates worked, and positions held.</p>
              <div className="mt-4 space-y-4">
                {employment.map((row, index) => (
                  <div key={index} className="grid gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:grid-cols-2">
                    <input placeholder="Employer" value={row.employer} onChange={(e) => updateEmployment(index, "employer", e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                    <input placeholder="Dates" value={row.dates} onChange={(e) => updateEmployment(index, "dates", e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                    <input placeholder="Position" value={row.position} onChange={(e) => updateEmployment(index, "position", e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                    <input placeholder="Phone" value={row.phone} onChange={(e) => updateEmployment(index, "phone", e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setEmployment((rows) => [...rows, emptyRow()])}
                className="mt-3 text-sm font-semibold text-brand-red hover:underline"
              >
                + Add employer
              </button>
            </div>

            <button type="button" onClick={handleNext} className="w-full rounded-xl bg-gray-900 py-3.5 text-sm font-bold text-white transition hover:bg-black sm:w-auto sm:px-10">
              Next
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-gray-900">Final details</h3>
            <p className="text-sm text-gray-600">Tell us a little more about yourself and attach your resume if you have one.</p>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Cover letter (optional)</label>
              <textarea rows={5} value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20" placeholder="Why do you want to join PrintWorks.lk?" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Resume / CV (PDF or Word, max 5MB)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setResume(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-red file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => setStep(1)} className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                Back
              </button>
              <button type="submit" disabled={submitting} className="rounded-xl bg-brand-red px-8 py-3 text-sm font-bold text-white shadow-md shadow-brand-red/25 hover:bg-brand-red-dark disabled:opacity-60">
                {submitting ? "Submitting…" : "Submit application"}
              </button>
            </div>
          </div>
        )}
      </form>

      <Dialog.Root open={successOpen} onOpenChange={setSuccessOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[301] w-[calc(100vw-1.5rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <i className="bi bi-check-lg text-3xl" aria-hidden />
            </div>
            <Dialog.Title className="mt-5 text-center text-xl font-bold text-gray-900">Application submitted</Dialog.Title>
            <Dialog.Description className="mt-2 text-center text-sm leading-relaxed text-gray-600">
              {successMessage || "Thank you! Our HR team will review your application and contact you if you are shortlisted."}
            </Dialog.Description>
            <Dialog.Close asChild>
              <button type="button" className="mt-6 w-full rounded-xl bg-brand-red py-3 text-sm font-bold text-white hover:bg-brand-red-dark">
                Close
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

/** Scroll to apply form and pre-select a job */
export function scrollToApply(jobId?: number) {
  const el = document.getElementById("apply");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (jobId) {
    window.dispatchEvent(new CustomEvent("career-select-job", { detail: { jobId } }));
  }
}
