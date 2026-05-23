const orderStyles: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-800",
  shipped: "bg-indigo-100 text-indigo-800",
  processing: "bg-amber-100 text-amber-800",
  cancelled: "bg-red-100 text-red-800",
  pending: "bg-gray-100 text-gray-800",
};

const quoteStyles: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  reviewing: "bg-amber-100 text-amber-800",
  awaiting_pricing: "bg-orange-100 text-orange-800",
  quoted: "bg-indigo-100 text-indigo-800",
  sent: "bg-violet-100 text-violet-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  closed: "bg-gray-100 text-gray-700",
};

export function StatusBadge({
  status,
  label,
  kind = "order",
}: {
  status: string;
  label?: string;
  kind?: "order" | "quote";
}) {
  const styles = kind === "quote" ? quoteStyles : orderStyles;
  const cls = styles[status] ?? "bg-gray-100 text-gray-800";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${cls}`}>
      {label ?? status.replace(/_/g, " ")}
    </span>
  );
}
