"use client";

import { useState } from "react";
import { HiChevronDown, HiQuestionMarkCircle } from "react-icons/hi";
import ScrollAnimate from "@/components/ui/scroll-animate";

const faqs = [
  {
    q: "What is Trust Point Mart's Global Fair Pay Charter?",
    a: "The Global Fair Pay Charter is our core ethical operating framework. It legally commits Trust Point Mart and all onboarded multi-vendors to guarantee living wages, safe working environments, equal gender pay, prompt payouts, and dignified treatment for everyone involved in producing and delivering goods.",
  },
  {
    q: "How do we verify that independent vendors pay living wages?",
    a: "Before any merchant catalog goes live, vendors complete an ethical compliance review and submit verifiable payroll benchmarks. Furthermore, our compliance team conducts periodic on-site spot visits and provides workers with an anonymous reporting hotline.",
  },
  {
    q: "Does guaranteeing fair pay make retail prices higher for consumers?",
    a: "Not at all. In traditional retail, multiple layers of brokers and middlemen take substantial cuts while squeezing the actual producer. By facilitating direct trade between primary growers/makers and shoppers, we eliminate middleman markups — allowing workers to earn more while consumers enjoy honest, affordable prices.",
  },
  {
    q: "How does the Charter directly protect rural farmers and cottage artisans?",
    a: "We provide upfront price commitments for agricultural harvests (such as cold-pressed mustard oil, natural honey, and organic grains) and artisanal crafts. Farmers receive prompt payments upon collection, shielding them from predatory middlemen who force distress sales.",
  },
  {
    q: "What happens if a vendor or partner facility violates the charter?",
    a: "We maintain zero tolerance for critical human rights violations including child labor, forced overtime, or withheld wages. Any verified infraction triggers immediate catalog freezing, contract suspension, and potential permanent blacklisting from our platform.",
  },
  {
    q: "How can a cooperative, producer, or seller become Fair Pay Certified?",
    a: "Any registered merchant, farming cooperative, or cottage brand that meets or aspires to meet our baseline ethical standards can apply via our Merchant Onboarding portal. Our compliance specialists assist applicants throughout the verification and certification journey.",
  },
];

export default function CharterFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="w-full bg-[#FAF9F6] py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-stone-200/80">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <ScrollAnimate variant="fade-in-up">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/60 px-3.5 py-1 rounded-full border border-emerald-300/60">
              <HiQuestionMarkCircle className="w-3.5 h-3.5" />
              Frequently Asked Questions
            </span>
          </ScrollAnimate>
          <ScrollAnimate variant="fade-in-up" delay={80}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Understanding the <span className="text-emerald-600">Charter</span>
            </h2>
          </ScrollAnimate>
          <ScrollAnimate variant="fade-in-up" delay={160}>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Clear answers on how we enforce wage standards, audit multi-vendor partners, and safeguard both consumers and producers.
            </p>
          </ScrollAnimate>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <ScrollAnimate key={idx} variant="fade-in-up" delay={idx * 60}>
                <div
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "bg-white border-emerald-300 shadow-md shadow-emerald-950/5 ring-1 ring-emerald-300/40"
                      : "bg-white/80 border-stone-200/80 hover:border-stone-300"
                  }`}
                >
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
                      {faq.q}
                    </span>
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? "bg-emerald-600 text-white rotate-180"
                          : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                      }`}
                    >
                      <HiChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              </ScrollAnimate>
            );
          })}
        </div>
      </div>
    </section>
  );
}
