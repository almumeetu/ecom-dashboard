"use client";

import {
  HiShieldCheck,
  HiSearch,
  HiPhoneIncoming,
  HiBan,
  HiCheckCircle,
} from "react-icons/hi";
import ScrollAnimate from "@/components/ui/scroll-animate";

export default function CharterVerification() {
  const steps = [
    {
      step: "01",
      title: "Pre-Listing Supplier Audit",
      desc: "Before any merchant, manufacturer, or farming cooperative lists products on Trust Point Mart, they submit verified payroll documentation and agree to our Fair Wage Protocol.",
      icon: HiSearch,
    },
    {
      step: "02",
      title: "Unannounced Spot Inspections",
      desc: "Our quality & compliance officers conduct surprise visits to packaging centers, cottage workshops, and storage facilities to verify working conditions firsthand.",
      icon: HiShieldCheck,
    },
    {
      step: "03",
      title: "Anonymous Worker Hotline",
      desc: "Every partner facility must display our confidential whistleblower hotline poster, giving warehouse staff and farmhands a direct channel to report wage theft or abuse without fear.",
      icon: HiPhoneIncoming,
    },
    {
      step: "04",
      title: "Enforcement & Immediate Delisting",
      desc: "Zero tolerance for bad faith operators. A proven breach of fair wage or anti-child-labor mandates results in immediate catalog freeze and permanent vendor blacklist.",
      icon: HiBan,
    },
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-stone-200/80">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <ScrollAnimate variant="fade-in-up">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
              Rigorous Accountability
            </span>
          </ScrollAnimate>
          <ScrollAnimate variant="fade-in-up" delay={80}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
              How We Verify <span className="text-emerald-600">& Enforce Compliance</span>
            </h2>
          </ScrollAnimate>
          <ScrollAnimate variant="fade-in-up" delay={160}>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Ethical pledges mean nothing without rigorous enforcement. Our four-stage compliance system ensures fair pay is practiced daily, not just displayed on paper.
            </p>
          </ScrollAnimate>
        </div>

        {/* 4 Steps Process */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <ScrollAnimate key={idx} variant="fade-in-up" delay={idx * 80}>
                <div className="h-full bg-stone-50 rounded-2xl p-6 border border-stone-200/80 hover:border-emerald-300 hover:bg-white hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-md tracking-wider">
                        STEP {item.step}
                      </span>
                      <Icon className="w-5 h-5 text-stone-400 group-hover:text-emerald-600 transition-colors" />
                    </div>

                    <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-stone-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                    <HiCheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Audited Standard</span>
                  </div>
                </div>
              </ScrollAnimate>
            );
          })}
        </div>
      </div>
    </section>
  );
}
