"use client";

import { useState } from "react";
import {
  HiShieldCheck,
  HiOutlineDocumentDownload,
  HiCheckCircle,
  HiScale,
  HiUserGroup,
  HiHeart,
  HiGlobeAlt,
  HiCash,
  HiOfficeBuilding,
} from "react-icons/hi";
import ScrollAnimate from "@/components/ui/scroll-animate";

const articles = [
  {
    roman: "I",
    title: "Fair Compensation & Living Wage Mandate",
    category: "Wage Equity",
    icon: HiCash,
    desc: "Every worker in our direct operations and partner supply chains is entitled to compensation exceeding statutory minimums. Living wages must cover wholesome nutrition, secure housing, clean water, healthcare, education, transport, and emergency contingency savings.",
  },
  {
    roman: "II",
    title: "Gender Pay Equity & Non-Discrimination",
    category: "Diversity & Inclusion",
    icon: HiScale,
    desc: "Strict equal pay for equal value of work regardless of gender, religion, background, marital status, or disability. All individuals must enjoy unobstructed, equitable pathways to skill development, supervisory promotion, and leadership roles.",
  },
  {
    roman: "III",
    title: "Safe, Hygienic & Dignified Workspaces",
    category: "Health & Safety",
    icon: HiOfficeBuilding,
    desc: "Operating facilities, packaging stations, and delivery hubs must maintain certified occupational health standards. This includes clean drinking water, adequate ventilation, regular fire drills, ergonomic setups, and certified personal protective equipment.",
  },
  {
    roman: "IV",
    title: "Prompt & Transparent Vendor Disbursements",
    category: "Merchant Rights",
    icon: HiShieldCheck,
    desc: "Independent merchants, cottage businesses, and smallholder farmers are guaranteed prompt settlement cycles with clear, unpadded accounting and zero arbitrary commission clawbacks, protecting small-business liquidity.",
  },
  {
    roman: "V",
    title: "Absolute Prohibition of Child & Forced Labor",
    category: "Human Rights",
    icon: HiCheckCircle,
    desc: "Uncompromising zero-tolerance prohibition against underage employment, bonded labor, involuntary servitude, or retention of identification documents, in full alignment with International Labour Organization (ILO) Conventions 138 and 182.",
  },
  {
    roman: "VI",
    title: "Direct Producer Value & Fair Farmgate Pricing",
    category: "Direct Sourcing",
    icon: HiUserGroup,
    desc: "By removing predatory multi-tier brokerage cartels, we ensure agricultural growers, honey harvesters, and handicraft artisans receive premium, pre-agreed farmgate prices that reflect true production costs and reward quality craftsmanship.",
  },
  {
    roman: "VII",
    title: "Worker Welfare, Rest Periods & Social Security",
    category: "Welfare & Health",
    icon: HiHeart,
    desc: "Work schedules are restricted to standard working hours with mandatory rest days, transparent overtime premiums, maternity protections, and emergency health assistance for fulfillment and logistics personnel.",
  },
  {
    roman: "VIII",
    title: "Environmental Responsibility & Green Logistics",
    category: "Sustainability",
    icon: HiGlobeAlt,
    desc: "All signatories commit to responsible packaging, minimizing single-use non-recyclable plastics, reducing carbon footprints in dispatch routes, and supporting organic, regenerative agricultural methods.",
  },
];

export default function CharterPrinciples() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Wage Equity", "Merchant Rights", "Human Rights", "Health & Safety", "Direct Sourcing", "Sustainability"];

  const filteredArticles = selectedCategory === "All"
    ? articles
    : articles.filter(a => a.category === selectedCategory || (selectedCategory === "Wage Equity" && (a.category === "Diversity & Inclusion" || a.category === "Welfare & Health")));

  return (
    <section id="eight-articles" className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 scroll-mt-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <ScrollAnimate variant="fade-in-up">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
              The Code of Ethics
            </span>
          </ScrollAnimate>
          <ScrollAnimate variant="fade-in-up" delay={80}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
              Eight Articles, <span className="text-emerald-600">One Standard</span>
            </h2>
          </ScrollAnimate>
          <ScrollAnimate variant="fade-in-up" delay={160}>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Every merchant, supplier, partner warehouse, and delivery affiliate in the Trust Point Mart network operates under these eight binding principles.
            </p>
          </ScrollAnimate>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 2-Column Responsive Grid of Article Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((art, idx) => {
            const Icon = art.icon;
            return (
              <ScrollAnimate key={art.roman} variant="fade-in-up" delay={(idx % 4) * 80}>
                <div className="h-full bg-stone-50/80 hover:bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/80 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-950/5 transition-all duration-200 flex flex-col justify-between group">
                  <div className="space-y-4">
                    {/* Header Row: Roman Numeral + Category Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold text-base flex items-center justify-center shadow-xs">
                          {art.roman}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-md">
                          {art.category}
                        </span>
                      </div>
                      <Icon className="w-5 h-5 text-stone-400 group-hover:text-emerald-600 transition-colors" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-stone-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {art.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {art.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-stone-200/60 flex items-center gap-2 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    <HiCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Mandatory Marketplace Benchmark</span>
                  </div>
                </div>
              </ScrollAnimate>
            );
          })}
        </div>

        {/* Download Callout Card */}
        <ScrollAnimate variant="fade-in-up" delay={200}>
          <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-stone-800">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-base sm:text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                <HiOutlineDocumentDownload className="w-5 h-5 text-emerald-400" />
                Download the Complete Charter PDF
              </h4>
              <p className="text-xs sm:text-sm text-stone-400 max-w-xl">
                Read the exhaustive legal guidelines, audit methodologies, wage calculations, and compliance thresholds.
              </p>
            </div>
            <a
              href="/global-fair-pay-charter.pdf"
              download="trust-point-fair-pay-charter.pdf"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors shadow-md shadow-emerald-950/20"
            >
              <HiOutlineDocumentDownload className="w-4 h-4" />
              <span>Download PDF (Official)</span>
            </a>
          </div>
        </ScrollAnimate>
      </div>
    </section>
  );
}
