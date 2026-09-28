"use client";

import Image from "next/image";
import {
  HiUserGroup,
  HiCheck,
  HiOutlineSparkles,
} from "react-icons/hi";
import ScrollAnimate from "@/components/ui/scroll-animate";

export default function CharterBeneficiaries() {
  const beneficiaries = [
    {
      title: "Smallholder Farmers & Growers",
      category: "Primary Agriculture",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80",
      description:
        "Guaranteed farmgate procurement for pure mustard oil seeds, natural Sundarbans honey, organic grains, and seasonal produce at rates that reward sustainable farming.",
      benefits: [
        "Elimination of predatory middlemen markups",
        "Direct pre-harvest price commitments",
        "Prompt payment on harvest handover",
      ],
    },
    {
      title: "Artisans & Handicraft Makers",
      category: "Cottage & Apparel Industry",
      image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
      description:
        "Protecting indigenous textile craftsmanship, handloom weavers, leather artisans, and rural workshops with fair remuneration and national market reach.",
      benefits: [
        "Fair cost-plus pricing for skilled craft",
        "Preservation of traditional cultural heritage",
        "Zero arbitrary discount burden shifted to creators",
      ],
    },
    {
      title: "Fulfillment & Warehouse Crew",
      category: "Logistics Operations",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80",
      description:
        "Our fulfillment center staff, packers, and quality assurance personnel work in safe, climate-managed facilities under regulated shift hours.",
      benefits: [
        "Certified living wage benchmarks with performance incentives",
        "Ergonomic work environments and mandatory rest breaks",
        "Occupational safety gear and medical first-response",
      ],
    },
    {
      title: "Delivery Fleets & Couriers",
      category: "Last-Mile Distribution",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
      description:
        "The courageous couriers navigating nationwide roads across 64 districts are recognized as vital partners, not disposable gig hands.",
      benefits: [
        "Equitable per-parcel base rates plus on-time bonuses",
        "Safety gear, wet-weather protection, and phone allowances",
        "Accidental emergency coverage during active runs",
      ],
    },
  ];

  return (
    <section className="w-full bg-[#FAF9F6] py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-stone-200/80">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <ScrollAnimate variant="fade-in-up">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/60 px-3.5 py-1 rounded-full border border-emerald-300/60">
              <HiOutlineSparkles className="w-3.5 h-3.5" />
              Human-Centered Commerce
            </span>
          </ScrollAnimate>
          <ScrollAnimate variant="fade-in-up" delay={80}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
              Who the Charter <span className="text-emerald-600">Protects</span>
            </h2>
          </ScrollAnimate>
          <ScrollAnimate variant="fade-in-up" delay={160}>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Every stage of the retail journey involves real people. Here is how our fair pay mandates directly improve life for workers across Bangladesh and beyond.
            </p>
          </ScrollAnimate>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {beneficiaries.map((group, idx) => (
            <ScrollAnimate key={idx} variant="fade-in-up" delay={(idx % 2) * 100}>
              <div className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all duration-300 flex flex-col h-full group">
                {/* Image */}
                <div className="relative w-full h-52 sm:h-60 overflow-hidden bg-stone-100">
                  <Image
                    src={group.image}
                    alt={group.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider">
                      {group.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                      {group.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-2">
                      {group.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 space-y-2">
                    {group.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2.5 text-xs font-medium text-stone-700">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <HiCheck className="w-3 h-3 stroke-2" />
                        </span>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollAnimate>
          ))}
        </div>
      </div>
    </section>
  );
}
