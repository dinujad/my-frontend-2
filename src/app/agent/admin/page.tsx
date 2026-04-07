import { redirect } from "next/navigation";

export default function AgentAdminPage() {
  // Page eka render wenne na, kelinma /admin/login ekata redirect wenawa
  redirect("/admin/login");
}
