import type { Metadata } from "next";
import { MaintenanceClient } from "./MaintenanceClient";

export const metadata: Metadata = {
  title: "We'll Be Right Back | Print Works.LK",
  description: "Print Works.LK is updating. We'll be back soon.",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return <MaintenanceClient />;
}
