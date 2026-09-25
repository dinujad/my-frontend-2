import type { Metadata } from "next";
import { PolicyPage } from "@/components/policies/PolicyPage";
import { getPolicy } from "@/lib/policies";

const policy = getPolicy("privacy-policy");

export const metadata: Metadata = {
  title: `${policy.title} | Print Works.LK`,
  description: policy.description,
};

export default function PrivacyPolicyRoute() {
  return <PolicyPage policy={policy} />;
}
