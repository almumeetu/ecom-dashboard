"use client";

import Link from "next/link";
import {
  HiShieldCheck,
  HiOutlineDocumentDownload,
  HiArrowRight,
  HiOutlineSparkles,
  HiPhone,
} from "react-icons/hi";
import ScrollAnimate from "@/components/ui/scroll-animate";

export default function CharterCTA() {
  return (
    <section className="relative w-full bg-stone-900 text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center flex flex-col items-center space-y-8">
        <ScrollAnimate variant="fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wider uppercase backdrop-blur-md">
            <HiOutlineSparkles className="w-4 h-4 text-emerald-400" />
            Join the Fair Trade Movement
          </div>
        </ScrollAnimate>

        <ScrollAnimate variant="fade-in-up" delay={80}>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl">
            Stand With Us for{" "}
            <span className="bg-linear-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
              Dignified Work & Fair Pay
            </span>
          </h2>
        </ScrollAnimate>

        <ScrollAnimate variant="fade-in-up" delay={160}>
          <p className="text-stone-300 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed text-balance">
            Whether you are an independent manufacturer, rural farming cooperative, or a conscious consumer — together we create an economy where honest effort earns real prosperity.
          </p>
        </ScrollAnimate>

        {/* Buttons */}
        <ScrollAnimate variant="fade-in-up" delay={240}>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-lg shadow-emerald-950/30 active:scale-95"
            >
              <span>Become a Verified Vendor</span>
              <HiArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 hover:text-white border border-white/15 font-bold text-xs sm:text-sm uppercase tracking-wider backdrop-blur-md transition-all duration-200 active:scale-95"
            >
              <HiPhone className="w-4 h-4 text-emerald-400" />
              <span>Contact Compliance Desk</span>
            </Link>

            <a
              href="/global-fair-pay-charter.pdf"
              download="trust-point-fair-pay-charter.pdf"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-transparent hover:bg-white/5 text-stone-400 hover:text-stone-200 font-semibold text-xs sm:text-sm transition-colors"
            >
              <HiOutlineDocumentDownload className="w-4 h-4 text-stone-400" />
              <span>Charter PDF</span>
            </a>
          </div>
        </ScrollAnimate>

        {/* Footer Trust Markers */}
        <ScrollAnimate variant="fade-in-up" delay={320}>
          <div className="pt-8 border-t border-white/10 w-full flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-stone-400 font-medium">
            <span className="flex items-center gap-2">
              <HiShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Genuine Marketplace Sourcing
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Certified Living Wages
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Zero Child Labor Tolerance
            </span>
          </div>
        </ScrollAnimate>
      </div>
    </section>
  );
}
