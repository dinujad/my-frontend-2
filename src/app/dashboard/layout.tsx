"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (role && ["admin", "super_admin", "chat_manager", "chat_agent"].includes(role)) {
      router.replace("/admin/live-chat");
    }
  }, [router]);

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: "bi-grid" },
    { name: "My Orders", href: "/dashboard/orders", icon: "bi-bag" },
    { name: "Invoices", href: "/dashboard/invoices", icon: "bi-receipt" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">My Account</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your orders and preferences.</p>
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          {/* Sidebar */}
          <aside className="w-full shrink-0 md:w-64">
            <nav className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-1 overflow-x-auto pb-2 md:pb-0">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition whitespace-nowrap ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <i className={`bi ${item.icon} text-lg`} aria-hidden />
                    {item.name}
                  </Link>
                );
              })}
              <button
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 mt-4 md:mt-2 w-full text-left whitespace-nowrap"
                onClick={() => {
                  // handle logout
                  window.location.href = "/";
                }}
              >
                <i className="bi bi-box-arrow-right text-lg" aria-hidden />
                Log out
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
