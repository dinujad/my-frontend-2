export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No Header / Footer / LiveChat on maintenance page
  return <>{children}</>;
}
