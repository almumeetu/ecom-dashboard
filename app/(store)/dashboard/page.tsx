"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAdminToken } from "@/lib/admin-api";
import { getCustomerToken } from "@/lib/storefront-api";
import { LuLayoutDashboard, LuUser, LuLoader } from "react-icons/lu";

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // If admin token exists, take user straight to Admin Dashboard
    const adminToken = getAdminToken();
    if (adminToken) {
      router.replace("/admin/dashboard");
      return;
    }

    // If customer token exists, take user to Customer Account / Orders
    const customerToken = getCustomerToken();
    if (customerToken) {
      router.replace("/profile");
      return;
    }

    // Default to admin dashboard (which will prompt login if needed)
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 bg-white">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <LuLoader className="w-7 h-7 animate-spin" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-zinc-900">Redirecting to Dashboard...</h1>
          <p className="text-xs text-zinc-500 mt-1.5">
            Connecting you to your account panel. If you are not redirected automatically, choose below:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-sm"
          >
            <LuLayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Admin Dashboard</span>
          </Link>

          <Link
            href="/profile"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            <LuUser className="w-4 h-4" />
            <span>Customer Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
