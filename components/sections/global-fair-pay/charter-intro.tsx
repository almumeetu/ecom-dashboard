"use client";

import {
  HiShieldCheck,
  HiBadgeCheck,
  HiCurrencyDollar,
  HiUserGroup,
  HiClock,
  HiSparkles,
} from "react-icons/hi";
import ScrollAnimate from "@/components/ui/scroll-animate";

export default function CharterIntro() {
  const metrics = [
    {
      stat: "100%",
      label: "Living Wage Benchmark",
      detail: "All fulfillment staff and certified tier-1 partners are compensated above regional living costs.",
      icon: HiShieldCheck,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      stat: "0%",
      label: "Exploitation Tolerance",
      detail: "Zero tolerance for underage labor, involuntary servitude, uncompensated overtime, or withheld wages.",
      icon: HiBadgeCheck,
      color: "text-teal-600 bg-teal-50 border-teal-200",
    },
    {
      stat: "500+",
      label: "Direct Producers & Artisans",
      detail: "Rural growers, organic farmers, and cottage workshops connected directly to buyers with zero broker cuts.",
      icon: HiUserGroup,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      stat: "48h",
      label: "Fast Vendor Settlements",
      detail: "Predictable, automated payout cycles giving independent sellers reliable working capital to thrive.",
      icon: HiClock,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
  ];

  return (
    <section className="w-full bg-[#FAF9F6] py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-stone-200/80">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Heading */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-7 space-y-3">
            <ScrollAnimate variant="fade-in-up">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full border border-emerald-300/60">
                <HiSparkles className="w-3.5 h-3.5" />
                Measurable Impact & Integrity
              </span>
            </ScrollAnimate>
            <ScrollAnimate variant="fade-in-up" delay={80}>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
                Why Ethical Pay Powers <br className="hidden sm:block" />
                <span className="text-emerald-600">Sustainable Commerce</span>
              </h2>
            </ScrollAnimate>
          </div>

          <div className="lg:col-span-5">
            <ScrollAnimate variant="fade-in-up" delay={120}>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Behind every order fulfilled on NovaMart is a network of hardworking individuals. Our charter converts ethical values into contractual guarantees — protecting livelihoods from farmgate to final doorstep.
              </p>
            </ScrollAnimate>
          </div>
        </div>

        {/* 4 Impact Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <ScrollAnimate key={idx} variant="fade-in-up" delay={idx * 80}>
                <div className="h-full bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all duration-200 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.color} group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                        {item.stat}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-stone-900 mb-2 group-hover:text-emerald-700 transition-colors">
                      {item.label}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-500 leading-relaxed mt-2 pt-3 border-t border-stone-100">
                    {item.detail}
                  </p>
                </div>
              </ScrollAnimate>
            );
          })}
        </div>

        {/* Accountability Banner */}
        <ScrollAnimate variant="fade-in-up" delay={320}>
          <div className="bg-emerald-900/90 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800 shadow-sm">
            <div className="space-y-1.5 text-center md:text-left">
              <h4 className="text-lg font-bold text-emerald-100 flex items-center justify-center md:justify-start gap-2">
                <HiShieldCheck className="w-5 h-5 text-emerald-400" />
                Verified Compliance & Public Accountability
              </h4>
              <p className="text-xs sm:text-sm text-emerald-200/80 max-w-2xl leading-relaxed">
                All vendors and partner facilities undergo baseline audits prior to catalog listing. Any violation of fair wage mandates or worker safety triggers an immediate 14-day compliance review or instant contract termination.
              </p>
            </div>
            <a
              href="#eight-articles"
              className="shrink-0 px-6 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
            >
              Review Charter Code
            </a>
          </div>
        </ScrollAnimate>
      </div>
    </section>
  );
}
