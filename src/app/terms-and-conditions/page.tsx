import type { Metadata } from "next";
import { PolicyPage } from "@/components/policies/PolicyPage";
import { getPolicy } from "@/lib/policies";

const policy = getPolicy("terms-and-conditions");

export const metadata: Metadata = {
  title: `${policy.title} | Print Works.LK`,
  description: policy.description,
};

export default function TermsAndConditionsRoute() {
  return <PolicyPage policy={policy} />;
}
