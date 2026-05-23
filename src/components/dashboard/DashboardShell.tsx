"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: "bi-grid" },
  { name: "My Orders", href: "/dashboard/orders", icon: "bi-bag" },
  { name: "My Quotes", href: "/dashboard/quotes", icon: "bi-file-earmark-text" },
  { name: "Invoices", href: "/dashboard/invoices", icon: "bi-receipt" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (role && ["admin", "super_admin", "chat_manager", "chat_agent"].includes(role)) {
      router.replace("/admin/live-chat");
    }
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login?redirect=/dashboard");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_role");
    logout();
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">My Account</h1>
            <p className="mt-1 text-sm text-gray-500">
              {user?.name ? `Welcome back, ${user.name}` : "Manage your orders, quotes, and account."}
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-xl bg-brand-red px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-red-dark"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-64">
            <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-gray-100 bg-white p-2 shadow-sm lg:flex-col lg:gap-1 lg:overflow-visible lg:p-2">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-brand-red/10 text-brand-red"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <i className={`bi ${item.icon} text-lg`} aria-hidden />
                    {item.name}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 lg:mt-2"
              >
                <i className="bi bi-box-arrow-right text-lg" aria-hidden />
                Log out
              </button>
            </nav>
          </aside>

          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </main>
  );
}
