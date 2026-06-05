export type JobOpening = {
  id: number;
  title: string;
  slug: string;
  location: string;
  employment_type: string | null;
  summary: string | null;
  requirements: string[];
};

export type EmploymentRow = {
  employer: string;
  dates: string;
  position: string;
  phone: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const DEFAULT_JOB_OPENINGS: JobOpening[] = [
  {
    id: 1,
    title: "Graphic Designer (Intermediate / Trainee)",
    slug: "graphic-designer-intermediate-trainee",
    location: "Biyagama",
    employment_type: "Full-time",
    summary: "Join our creative team to design print-ready artwork and brand assets.",
    requirements: [
      "Must have valid Graphic Design certification or higher academic qualification.",
      "Portfolio required (for intermediate applicants; optional for trainees).",
      "Minimum 1 year experience for intermediate level.",
      "Must face a practical session during the interview.",
      "English literacy will be considered.",
    ],
  },
  {
    id: 2,
    title: "Accounts & Administrative Assistant",
    slug: "accounts-administrative-assistant",
    location: "Biyagama",
    employment_type: "Full-time",
    summary: "Support finance and office operations with accurate records and administration.",
    requirements: [
      "G.C.E. (A/L) in Commerce Stream required.",
      "Diploma in Accounting / Business Administration is an advantage.",
      "Skilled in MS Office & accounting software.",
      "Good communication (Sinhala & English) & multitasking ability.",
      "Experienced or Trainee candidates may apply.",
    ],
  },
];

export async function getJobOpenings(): Promise<JobOpening[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/job-openings`, { cache: "no-store" });
    if (!res.ok) return DEFAULT_JOB_OPENINGS;
    const data = (await res.json()) as JobOpening[];
    return Array.isArray(data) && data.length > 0 ? data : DEFAULT_JOB_OPENINGS;
  } catch {
    return DEFAULT_JOB_OPENINGS;
  }
}

export async function submitJobApplication(formData: FormData): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/api/v1/job-applications`, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errors = data.errors as Record<string, string[]> | undefined;
    const first = errors ? Object.values(errors).flat()[0] : null;
    throw new Error(first || data.message || "Could not submit application. Please try again.");
  }

  return data as { message: string };
}
