import type { Metadata } from "next";
import { PolicyPage } from "@/components/policies/PolicyPage";
import { getPolicy } from "@/lib/policies";

const policy = getPolicy("terms-and-conditions");

export const metadata: Metadata = {
  // Bare title: the root layout template appends " | Print Works.LK".
  title: policy.title,
  description: policy.description,
};

export default function TermsAndConditionsRoute() {
  return <PolicyPage policy={policy} />;
}
