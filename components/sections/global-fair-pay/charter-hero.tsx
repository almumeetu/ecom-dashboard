"use client";

import Link from "next/link";
import {
  HiShieldCheck,
  HiOutlineDocumentDownload,
  HiCheckCircle,
  HiScale,
  HiUserGroup,
  HiCurrencyDollar,
  HiArrowDown,
} from "react-icons/hi";
import ScrollAnimate from "@/components/ui/scroll-animate";

export default function CharterHero() {
  const highlights = [
    {
      icon: HiShieldCheck,
      text: "100% Living Wage Benchmarked",
    },
    {
      icon: HiCurrencyDollar,
      text: "Prompt 48h Vendor Settlements",
    },
    {
      icon: HiUserGroup,
      text: "Direct Farmer & Artisan Sourcing",
    },
    {
      icon: HiScale,
      text: "Zero Child & Forced Labor Tolerance",
    },
  ];

  return (
    <section className="relative w-full bg-linear-to-b from-stone-900 via-zinc-900 to-stone-950 text-white pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Subtle Grid & Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:24px_24px]" />
      
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 right-10 w-[400px] h-[300px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 text-center flex flex-col items-center">
        {/* Top Badge */}
        <ScrollAnimate variant="fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            NovaMart Ethical Standards
          </div>
        </ScrollAnimate>

        {/* Main Headline */}
        <ScrollAnimate variant="fade-in-up" delay={100}>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.15] mb-6">
            Global Fair Pay &{" "}
            <span className="bg-linear-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
              Ethical Sourcing Charter
            </span>
          </h1>
        </ScrollAnimate>

        {/* Subtitle / Mission */}
        <ScrollAnimate variant="fade-in-up" delay={200}>
          <p className="max-w-3xl text-stone-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed mb-10 text-balance">
            Ensuring guaranteed living wages, safe and dignified workplaces, prompt payouts, and direct economic empowerment for every farmer, artisan, warehouse specialist, and delivery courier behind our multi-vendor marketplace.
          </p>
        </ScrollAnimate>

        {/* Action Buttons */}
        <ScrollAnimate variant="fade-in-up" delay={300}>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <a
              href="#eight-articles"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base transition-all duration-200 shadow-lg shadow-emerald-900/30 hover:shadow-emerald-700/40 active:scale-95"
            >
              <span>Explore The 8 Charter Articles</span>
              <HiArrowDown className="w-4 h-4" />
            </a>

            <a
              href="/global-fair-pay-charter.pdf"
              download="trust-point-fair-pay-charter.pdf"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 hover:text-white border border-white/15 font-semibold text-sm sm:text-base backdrop-blur-md transition-all duration-200 active:scale-95"
            >
              <HiOutlineDocumentDownload className="w-5 h-5 text-emerald-400" />
              <span>Download Official Charter (PDF)</span>
            </a>
          </div>
        </ScrollAnimate>

        {/* 4 Pillars Pill Bar */}
        <ScrollAnimate variant="fade-in-up" delay={400} className="w-full">
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-white/10">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-center gap-2 sm:gap-2.5 px-3 py-3 rounded-lg bg-white/5 border border-white/10 text-stone-300 text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                  <span className="truncate">{item.text}</span>
                </div>
              );
            })}
          </div>
        </ScrollAnimate>
      </div>
    </section>
  );
}
