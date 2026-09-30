"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LuShieldCheck,
  LuArrowRight,
  LuBadgeCheck,
  LuMapPin,
  LuSparkles,
  LuTag,
  LuPhoneCall,
} from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa6";
import { fetchShopSettings, parseContactEntries, type ShopSettings } from "@/lib/shop-api";

export default function FounderCta() {
  const [settings, setSettings] = useState<ShopSettings | null>(null);

  useEffect(() => {
    fetchShopSettings().then((res) => {
      if (res) setSettings(res);
    });
  }, []);

  const shopName = settings?.shopName?.trim() || "NovaMart";
  const contactEntries = parseContactEntries(settings?.contactNumber);
  const primaryPhone = contactEntries[0]?.value || "01712345678";
  const cleanPhone = primaryPhone.replace(/[^\d+]/g, "") || "01712345678";
  const rawWhatsapp = settings?.socialContact?.whatsapp || primaryPhone;
  const whatsappNumber = rawWhatsapp.replace(/[^\d]/g, "") || "8801712345678";
  const fullWhatsapp = whatsappNumber.startsWith("88")
    ? whatsappNumber
    : `88${whatsappNumber.replace(/^0+/, "")}`;
  const address =
    settings?.branchAddress?.trim() || "Banani, Dhaka • Rajshahi Division, Bangladesh";

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 bg-gradient-to-b from-[#0A0D12] via-[#0F141C] to-[#141A23] overflow-hidden relative">
      {/* Background decorative glow elements */}
      <div className="absolute -top-32 -left-32 w-80 sm:w-96 h-80 sm:h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 sm:w-96 h-80 sm:h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(16,185,129,0.06),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-3.5 sm:px-6 md:px-10 lg:px-16">
        {/* Main Card Container */}
        <div className="relative bg-gradient-to-b from-[#18202A]/95 via-[#131922]/95 to-[#0E131A]/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* ══════════ Left: Founder Image ══════════ */}
            <div className="lg:col-span-5 relative h-[320px] sm:h-[400px] md:h-[460px] lg:h-auto lg:min-h-[540px]">
              <Image
                src="/images/team/Abdullah.jpg"
                alt={`NovaMart Team — Founder & CEO of ${shopName}`}
                fill
                priority
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />

              {/* Gradient Overlays for smooth blend on mobile and desktop */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#131922] via-[#131922]/50 via-55% to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#131922]/25 lg:to-[#131922]" />

              {/* Top floating badge on photo */}
              <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/15 text-white shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-semibold tracking-wide">Direct Leadership</span>
                </div>
              </div>

              {/* Mobile bottom info pill overlay on photo */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 sm:bottom-5 sm:left-5 sm:right-5 z-20 lg:hidden">
                <div className="flex items-center justify-between gap-3 bg-black/70 backdrop-blur-md border border-white/15 rounded-2xl p-2.5 sm:p-3 shadow-xl">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-400/60 shrink-0">
                      <Image
                        src="/images/team/abdullah-2.jpg"
                        alt="NovaMart Team"
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white text-xs sm:text-sm font-bold truncate">NovaMart Team</span>
                        <LuBadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      </div>
                      <p className="text-zinc-300 text-[11px] truncate">Founder & CEO, {shopName}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-500/35 px-2.5 py-1 rounded-full shrink-0">
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* ══════════ Right: Founder's Story & CTAs ══════════ */}
            <div className="lg:col-span-7 p-5 sm:p-8 md:p-10 lg:p-12 xl:p-14 flex flex-col justify-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-bold uppercase tracking-wider w-fit mb-3.5 sm:mb-4 shadow-[0_0_15px_rgba(16,185,129,0.12)]">
                <LuShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Founder&apos;s Personal Promise</span>
              </div>

              {/* Heading */}
              <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight font-['Bembo_Std'] mb-3 sm:mb-4 leading-tight sm:leading-snug">
                Built on Trust,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-300">
                  Delivered with Care
                </span>
              </h2>

              {/* Quote Card */}
              <div className="relative mb-5 sm:mb-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-3.5 sm:p-5 backdrop-blur-xs">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <span className="text-3xl sm:text-4xl text-emerald-400/50 font-serif leading-none select-none shrink-0 -mt-1 sm:-mt-2">
                    “
                  </span>
                  <blockquote className="text-zinc-200 text-xs sm:text-sm md:text-[15px] leading-relaxed italic">
                    I founded {shopName} with a simple belief — every Bangladeshi family deserves access to authentic, high-quality products at fair prices. From farm-fresh groceries to genuine designer fashion, we source directly and deliver with care. Your trust is our greatest asset.
                  </blockquote>
                </div>
              </div>

              {/* Founder Profile Details (Full on Tablet & Desktop) */}
              <div className="hidden lg:flex items-center gap-4 mb-6">
                <div className="relative w-13 h-13 rounded-full overflow-hidden border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/20 shrink-0 ring-4 ring-emerald-500/10">
                  <Image
                    src="/images/team/abdullah-2.jpg"
                    alt="NovaMart Team — Founder & CEO"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-white font-bold text-base">NovaMart Team</span>
                    <LuBadgeCheck className="w-4.5 h-4.5 text-blue-400 shrink-0" />
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/25">
                      Verified Founder
                    </span>
                  </div>
                  <p className="text-zinc-300 text-xs font-medium mt-0.5">
                    Founder & CEO, {shopName}
                  </p>
                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs mt-0.5">
                    <LuMapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{address}</span>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8">
                {/* Feature 1 */}
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1.5 sm:gap-2.5 p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-colors text-center sm:text-left">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
                    <LuShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white text-[11px] sm:text-xs font-semibold leading-tight truncate">
                      100% Authentic
                    </div>
                    <div className="text-zinc-400 text-[10px] hidden sm:block truncate">
                      Original Guarantee
                    </div>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1.5 sm:gap-2.5 p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-colors text-center sm:text-left">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
                    <LuSparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white text-[11px] sm:text-xs font-semibold leading-tight truncate">
                      Direct Sourcing
                    </div>
                    <div className="text-zinc-400 text-[10px] hidden sm:block truncate">
                      Farms & Brand Hubs
                    </div>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1.5 sm:gap-2.5 p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-colors text-center sm:text-left">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
                    <LuTag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white text-[11px] sm:text-xs font-semibold leading-tight truncate">
                      Fair Pricing
                    </div>
                    <div className="text-zinc-400 text-[10px] hidden sm:block truncate">
                      Transparent Rates
                    </div>
                  </div>
                </div>
              </div>

              {/* ══════════ CTA Buttons ══════════ */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                {/* Primary Button */}
                <Link
                  href="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:via-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm tracking-wide uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_25px_rgba(16,185,129,0.5)] active:scale-[0.98] cursor-pointer group"
                >
                  <span>Shop With Confidence</span>
                  <LuArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>

                {/* WhatsApp Button */}
                <a
                  href={`https://wa.me/${fullWhatsapp}?text=Hello%20Mohammad%20Abdullah%2C%20I%20am%20visiting%20${encodeURIComponent(shopName)}%20and%20would%20like%20to%20know%20more.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 hover:border-[#25D366]/70 text-white font-semibold text-xs sm:text-sm transition-all duration-300 shadow-md shadow-black/20 hover:shadow-[#25D366]/20 active:scale-[0.98] cursor-pointer group"
                >
                  <FaWhatsapp className="w-4.5 h-4.5 text-[#25D366] shrink-0 group-hover:scale-110 transition-transform duration-200" />
                  <span>Talk to Abdullah</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366] font-bold border border-[#25D366]/30 hidden xs:inline-block sm:inline-block">
                    WhatsApp
                  </span>
                </a>
              </div>

              {/* Direct Support & Hotline Under-Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-4 mt-4 border-t border-white/[0.08] text-[11px] text-zinc-400">
                <div className="flex items-center gap-2 text-center sm:text-left">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Direct founder assistance • Fast reply within minutes</span>
                </div>
                <a
                  href={`tel:${cleanPhone}`}
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer"
                >
                  <LuPhoneCall className="w-3.5 h-3.5" />
                  <span>Helpline: {primaryPhone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
