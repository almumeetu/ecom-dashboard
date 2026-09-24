"use client";

import Link from "next/link";
import Logo from "@/components/ui/logo";
import { HiPhone, HiMail, HiLocationMarker } from "react-icons/hi";
import { LuSend, LuCheck } from "react-icons/lu";
import { useState } from "react";
import { toast } from "sonner";

export default function Mainfooter() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    toast.success("Welcome! You've successfully subscribed to NovaMart updates.");
    setNewsletterEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  const categoryLinks = [
    { label: "Fresh Groceries & Produce", href: "/products?search=grocery" },
    { label: "Women's Fashion & Apparel", href: "/products?category=Women's+Fashion" },
    { label: "Men's Streetwear & Casuals", href: "/products?category=Men's+Fashion" },
    { label: "Shoes & Footwear Drops", href: "/products?category=Footwear" },
    { label: "Bags, Watches & Accessories", href: "/products?category=Accessories" },
    { label: "Artisan Food & Bakery", href: "/products?search=food" },
  ];

  const customerLinks = [
    { label: "Track Your Order", href: "/profile?tab=orders" },
    { label: "Delivery & Shipping Rates", href: "/delivery" },
    { label: "7-Day Return & Exchange", href: "/delivery" },
    { label: "Buyer Protection Policy", href: "/about" },
    { label: "Customer Help & FAQ", href: "/contact" },
    { label: "Wishlist & Saved Items", href: "/wishlist" },
  ];

  const vendorLinks = [
    { label: "Become a Verified Vendor", href: "/admin/login" },
    { label: "Seller Dashboard Login", href: "/admin/login" },
    { label: "Bulk & Corporate Inquiries", href: "/corporate-order" },
    { label: "Multi-Vendor Standards", href: "/global-fair-pay-charter" },
    { label: "Brand Partnerships", href: "/contact" },
    { label: "About NovaMart", href: "/about" },
  ];

  return (
    <footer className="w-full bg-[#111317] text-zinc-300 border-t border-white/10 font-sans">
      {/* 1. Clean, Minimalist Newsletter Bar */}
      <div className="border-b border-white/10 py-10 sm:py-12 px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Stay in the Loop
            </h3>
            <p className="text-zinc-400 text-sm sm:text-base mt-1.5 leading-relaxed">
              Subscribe for exclusive member vouchers, curated product drops, and weekly marketplace specials.
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto min-w-[300px] sm:min-w-[440px]"
          >
            <div className="relative flex-grow">
              <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-white hover:bg-zinc-100 active:scale-[0.99] text-zinc-900 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-xs"
            >
              {subscribed ? (
                <>
                  <span>Subscribed</span>
                  <LuCheck className="w-4 h-4 text-emerald-600" />
                </>
              ) : (
                <>
                  <span>Subscribe</span>
                  <LuSend className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* 2. Main 4-Column Directory */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Col 1: Brand & Direct Contact (4.5 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-6">
            <Logo variant="light" size="md" />

            <p className="text-zinc-400 text-sm leading-relaxed mt-4 mb-6">
              NovaMart is Bangladesh&apos;s leading curated multi-vendor marketplace connecting shoppers with certified local merchants, authentic lifestyle brands, and fresh essentials.
            </p>

            {/* Clean Contact Details */}
            <div className="space-y-3 text-sm text-zinc-300 w-full">
              <div className="flex items-center gap-3">
                <HiPhone className="w-4 h-4 text-zinc-400 shrink-0" />
                <div>
                  <span className="text-zinc-400 text-xs block">Customer Hotline (24/7)</span>
                  <a
                    href="tel:+8801339879494"
                    className="text-white font-medium hover:text-amber-200 transition-colors"
                  >
                    +880 13 3987 9494
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <HiMail className="w-4 h-4 text-zinc-400 shrink-0" />
                <div>
                  <span className="text-zinc-400 text-xs block">Email Support</span>
                  <a
                    href="mailto:support@novamart.com"
                    className="text-white font-medium hover:text-amber-200 transition-colors"
                  >
                    support@novamart.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <HiLocationMarker className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-zinc-400 text-xs block">Headquarters</span>
                  <span className="text-zinc-300 font-normal">House 42, Road 11, Banani, Dhaka</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Shop Departments (2.5 cols on lg) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-5">
              Shop Departments
            </h4>
            <ul className="space-y-3">
              {categoryLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="text-zinc-400 hover:text-white text-sm transition-colors block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Care (2.5 cols on lg) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-5">
              Customer Care
            </h4>
            <ul className="space-y-3">
              {customerLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="text-zinc-400 hover:text-white text-sm transition-colors block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Vendors & Business (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-5">
              Partners & Policies
            </h4>
            <ul className="space-y-3">
              {vendorLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="text-zinc-400 hover:text-white text-sm transition-colors block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
