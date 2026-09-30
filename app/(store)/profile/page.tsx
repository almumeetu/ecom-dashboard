"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiUser,
  FiShoppingBag,
  FiMapPin,
  FiHeart,
  FiSearch,
  FiLogOut,
  FiLoader,
  FiShield,
  FiPhone,
  FiTruck,
  FiLock,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import { toast } from "sonner";

import { useAuth } from "@/app/_providers/auth-provider";
import { getCustomerToken } from "@/lib/storefront-api";

import AccountDetailsView from "./_components/account-details";
import OrdersView from "./_components/orders-view";
import AddressBookView from "./_components/address-book";
import WishlistView from "./_components/wishlist-view";
import TrackOrderView from "./_components/track-order";
import PageBanner from "@/components/ui/page-banner";
import { fetchShopSettings, parseContactEntries, type ShopSettings } from "@/lib/shop-api";

type ProfileTab = "details" | "orders" | "address" | "wishlist" | "track";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5010/api/v1";

function ProfilePageContent() {
  const { user, isAuthenticated, loading, logout, refreshUser, setShowAuthModal } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab") as ProfileTab | null;

  const [activeTab, setActiveTab] = useState<ProfileTab>("details");
  const [hasOrders, setHasOrders] = useState(false);
  const [settings, setSettings] = useState<ShopSettings | null>(null);

  useEffect(() => {
    fetchShopSettings().then((s) => {
      if (s) setSettings(s);
    });
  }, []);

  useEffect(() => {
    if (tabParam && ["details", "orders", "address", "wishlist", "track"].includes(tabParam)) {
      setActiveTab(tabParam);
    } else {
      setActiveTab("details");
    }
  }, [tabParam]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshUser();

      const token = getCustomerToken();
      if (token) {
        fetch(`${BASE_URL}/orders/my-orders`, { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => (res.ok ? res.json() : []))
          .then((data) => setHasOrders(Array.isArray(data) ? data.length > 0 : (data?.data?.length ?? 0) > 0))
          .catch(() => {});
      }
    }
  }, [isAuthenticated, refreshUser]);

  return (
    <div className="relative min-h-[calc(100vh-140px)] bg-[#FAFAFA] flex flex-col justify-between font-sans">
      {!isAuthenticated && activeTab === "track" ? (
        /* ── Public / Guest Order Tracking ── */
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-zinc-200/80 mb-6">
            <TrackOrderView />
          </div>
          <div className="flex items-center justify-between p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-xs">
            <span className="text-zinc-600 font-medium">Already have an account with NovaMart?</span>
            <button
              onClick={() => {
                setActiveTab("details");
                setShowAuthModal(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Sign In to View All Orders
            </button>
          </div>
        </main>
      ) : !isAuthenticated ? (
        /* ── Unauthenticated State ── */
        <main className="min-h-[75vh] flex items-center justify-center px-4 py-16">
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <FiLoader className="w-8 h-8 text-emerald-600 animate-spin" />
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Verifying Session...
              </span>
            </div>
          ) : (
            <div className="w-full max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-zinc-200/80 text-center animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-xs border border-emerald-100">
                <FiUser className="w-8 h-8" />
              </div>

              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {settings?.shopName ? `${settings.shopName} Account` : "Verified Customer Portal"}
              </span>

              <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-3">
                Customer Account Portal
              </h1>

              <p className="mt-2 text-xs sm:text-sm text-zinc-500 leading-relaxed max-w-md mx-auto">
                Sign in to view real-time delivery tracking across Dhaka & nationwide, access saved addresses, and manage your orders.
              </p>

              {/* Action buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold uppercase tracking-wider py-4 px-8 rounded-full shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("track")}
                  className="w-full sm:w-auto bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 text-xs font-bold uppercase tracking-wider py-4 px-8 rounded-full transition-all text-center cursor-pointer flex items-center justify-center gap-2"
                >
                  <FiSearch className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Track Order as Guest</span>
                </button>

                <Link
                  href="/signup"
                  className="w-full sm:w-auto bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold uppercase tracking-wider py-4 px-8 rounded-full transition-all text-center cursor-pointer"
                >
                  Create Account
                </Link>
              </div>

              {/* Feature pills */}
              <div className="mt-10 pt-6 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                <div className="p-3 rounded-xl bg-zinc-50 flex items-start gap-2.5">
                  <FiTruck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[11px] font-bold text-zinc-800">
                      {settings?.branchName || "Dhaka & Nationwide Hub"}
                    </h5>
                    <p className="text-[10px] text-zinc-400">Next-day live delivery status</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 flex items-start gap-2.5">
                  <FiShield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[11px] font-bold text-zinc-800">100% Genuine</h5>
                    <p className="text-[10px] text-zinc-400">Verified products & vendors</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 flex items-start gap-2.5">
                  <FiLock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[11px] font-bold text-zinc-800">Bank-Grade Safety</h5>
                    <p className="text-[10px] text-zinc-400">Encrypted checkout & data</p>
                  </div>
                </div>
              </div>

              {/* Direct Help */}
              <div className="mt-6 text-xs text-zinc-500 flex items-center justify-center gap-2">
                <FiPhone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Need assistance? Call Support:</span>
                <a href="tel:01712345678" className="font-bold text-zinc-900 hover:underline">
                  01712345678
                </a>
              </div>
            </div>
          )}
        </main>
      ) : (
        /* ── Authenticated Customer Dashboard ── */
        <div className="relative w-full flex-1 flex flex-col bg-white min-h-[calc(100vh-140px)]">
          <PageBanner
            title={user?.name ? `Welcome back, ${user.name}` : "My Account"}
            subtitle="Manage your profile details, track recent marketplace shipments, and access saved addresses."
            breadcrumbs={[
              { label: "My Account" },
              ...(activeTab !== "details" ? [{ label: activeTab.toUpperCase() }] : []),
            ]}
          />

          <div className="relative max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-16 z-10 flex-1 flex flex-col py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Profile Sidebar (3 cols) */}
              <aside className="lg:col-span-3 bg-zinc-50/80 border border-zinc-200 rounded-3xl p-6 space-y-6 sticky top-24">
                {/* User Info Capsule */}
                <div className="flex items-center gap-3.5 pb-5 border-b border-zinc-200">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0 overflow-hidden">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name || "User"} className="w-full h-full object-cover" />
                    ) : (
                      <span>{user?.name ? user.name[0].toUpperCase() : "U"}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-extrabold text-zinc-900 truncate">
                      {user?.name || "Customer Account"}
                    </h3>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">
                      {user?.email || ""}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      Verified Member
                    </span>
                  </div>
                </div>

                {/* Nav Links */}
                <nav className="space-y-1" aria-label="Profile navigation">
                  {[
                    { key: "details", label: "Account Details", icon: <FiUser /> },
                    { key: "orders", label: "My Orders & History", icon: <FiShoppingBag />, badge: hasOrders },
                    { key: "address", label: "Saved Addresses", icon: <FiMapPin /> },
                    { key: "wishlist", label: "Saved Wishlist", icon: <FiHeart /> },
                    { key: "track", label: "Track Shipment", icon: <FiSearch /> },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        setActiveTab(item.key as ProfileTab);
                        window.history.pushState(null, "", `/profile?tab=${item.key}`);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all text-xs font-bold cursor-pointer ${
                        activeTab === item.key
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                          : "text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-950"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && activeTab !== item.key && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </button>
                  ))}
                </nav>

                {/* Support Box in Sidebar */}
                <div className="pt-4 border-t border-zinc-200 text-xs text-zinc-500 space-y-2">
                  <div className="flex items-center gap-2 text-zinc-700 font-semibold">
                    <FiPhone className="w-4 h-4 text-emerald-600" />
                    {(() => {
                      const contacts = parseContactEntries(settings?.contactNumber);
                      const phone = contacts[0]?.value || "01712345678";
                      return (
                        <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="hover:underline">
                          {phone}
                        </a>
                      );
                    })()}
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    {settings?.branchAddress || (settings?.branchName ? `${settings.branchName}, Dhaka` : "Central Hub, Dhaka")}
                  </p>
                </div>

                {/* Logout Button */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      logout();
                      toast.success("Logged out successfully.");
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </aside>

              {/* Right Content Area (9 cols) */}
              <section className="lg:col-span-9 bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200/80 shadow-sm min-h-[600px]">
                {activeTab === "details" && <AccountDetailsView />}
                {activeTab === "orders" && <OrdersView />}
                {activeTab === "address" && <AddressBookView />}
                {activeTab === "wishlist" && <WishlistView />}
                {activeTab === "track" && <TrackOrderView />}
              </section>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
          <div className="flex flex-col items-center gap-3">
            <FiLoader className="w-8 h-8 text-emerald-600 animate-spin" />
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Loading Profile...
            </span>
          </div>
        </div>
      }
    >
      <ProfilePageContent />
    </Suspense>
  );
}
