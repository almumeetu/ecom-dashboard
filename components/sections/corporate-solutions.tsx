'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiCheck, FiArrowRight, FiShield, FiFileText, FiTruck, FiUsers } from 'react-icons/fi';
import ScrollAnimate from '@/components/ui/scroll-animate';

export default function CorporateSolutions() {
  const solutions = [
    {
      title: 'Executive Celebration Hampers',
      subtitle: 'Festive, Eid & Annual Gala Gifting',
      desc: 'Bespoke gift boxes filled with cold-pressed natural oils, organic Sundarban honey, artisanal nuts, and premium pantry delicacies in luxury debossed keepsake boxes.',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
      tag: 'Most Popular',
      benefits: ['Custom company ribbon & gift cards', 'Luxury rigid keepsake packaging', 'Tiered bulk corporate pricing'],
    },
    {
      title: 'Seasonal Rajshahi Mango Crates',
      subtitle: 'Fresh Harvest Corporate Gifting',
      desc: 'Direct from Banani, Dhaka and Rajshahi orchards. Chemical-free export quality Khirsapat, Langra, and Amrapali mangoes in branded ventilated gift crates.',
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80',
      tag: 'Seasonal Exclusive',
      benefits: ['100% Zero-carbide guaranteed', 'Custom engraved wooden crates', 'Overnight direct orchard delivery'],
    },
    {
      title: 'Corporate Apparel & Leather Kits',
      subtitle: 'Executive Wear & Onboarding Bundles',
      desc: 'Premium formal panjabis, executive shirts, genuine leather laptop folios, wallets, and custom-branded employee welcome kits for milestones and conferences.',
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80',
      tag: 'Executive Lifestyle',
      benefits: ['Custom logo embroidery & embossing', 'Tailored sizing options', 'Complete new-hire welcome boxes'],
    },
    {
      title: 'Institutional Bulk Wholesale',
      subtitle: 'Pantry, Retail Resellers & Supply',
      desc: 'High-volume supply of verified everyday essentials, beverages, pantry staples, and FMCG products for corporate cafeterias, hotels, and retail store partners.',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
      tag: 'Volume Wholesale',
      benefits: ['Official Mushak-6.3 VAT Challan', 'Flexible corporate credit terms', 'Scheduled recurring deliveries'],
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Discovery & Consultation',
      desc: 'Share your headcount, budget per unit, and desired delivery schedule. Our corporate team responds within 2 hours.',
    },
    {
      num: '02',
      title: 'Curated Sample & Digital Proof',
      desc: 'We prepare sample boxes, packaging prototypes with your logo, and a transparent volume pricing quote.',
    },
    {
      num: '03',
      title: 'Precision Assembly & QC',
      desc: 'Every item is individually inspected and assembled in our central facility with tamper-proof seal and personalized notes.',
    },
    {
      num: '04',
      title: 'Multi-Location Nationwide Dispatch',
      desc: 'Consolidated delivery to your corporate office or direct individual doorstep delivery to employees across all 64 districts.',
    },
  ];

  return (
    <section className="w-full bg-[#FAF9F5] py-16 sm:py-24 border-t border-stone-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        
        {/* Section Header */}
        <ScrollAnimate variant="fade-in-up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider inline-block mb-2">
              Tailored Enterprise Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-zinc-900 font-extrabold tracking-tight mb-4">
              Curated Corporate Solutions
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Whether you are rewarding 50 executives, sending 2,000 Eid gift hampers, or sourcing wholesale inventory, NovaMart delivers uncompromising quality and verified origin.
            </p>
          </div>
        </ScrollAnimate>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {solutions.map((item, idx) => (
            <ScrollAnimate key={idx} variant="fade-in-up">
              <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold uppercase tracking-wider">
                      {item.tag}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                      {item.subtitle}
                    </span>
                    <h3 className="font-['Bembo_Std'] text-2xl sm:text-3xl text-stone-900 font-semibold mb-3">
                      {item.title}
                    </h3>
                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
                      {item.desc}
                    </p>

                    <div className="space-y-2 border-t border-stone-100 pt-4 mb-6">
                      {item.benefits.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2 text-xs text-stone-700 font-medium">
                          <FiCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href="#inquiry-form"
                    className="w-full py-3 rounded-xl bg-stone-50 hover:bg-emerald-50 text-stone-800 hover:text-emerald-700 border border-stone-200 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Request Quotation for {item.title}</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </ScrollAnimate>
          ))}
        </div>

        {/* 4-Step Process Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 md:p-16 border border-stone-200 shadow-sm mb-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">
              Seamless Execution
            </span>
            <h3 className="font-['Bembo_Std'] text-2xl sm:text-3xl md:text-4xl text-stone-900 font-semibold mt-1">
              How Corporate Ordering Works
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm mt-2">
              From initial requirement discovery to nationwide multi-address delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, i) => (
              <div key={i} className="relative p-5 rounded-2xl bg-stone-50/80 border border-stone-200/70">
                <span className="text-3xl font-black text-emerald-600/30 block mb-2 font-mono">
                  {st.num}
                </span>
                <h4 className="text-sm font-bold text-stone-900 mb-2">{st.title}</h4>
                <p className="text-stone-500 text-xs leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* B2B Assurance Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 flex flex-col items-center">
            <FiFileText className="w-6 h-6 text-emerald-600 mb-2" />
            <h4 className="text-sm font-bold text-stone-900">VAT / Mushak 6.3</h4>
            <p className="text-xs text-stone-500 mt-0.5">Compliant tax challans provided</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-stone-200 flex flex-col items-center">
            <FiUsers className="w-6 h-6 text-emerald-600 mb-2" />
            <h4 className="text-sm font-bold text-stone-900">Dedicated Account Exec</h4>
            <p className="text-xs text-stone-500 mt-0.5">Single point of contact 24/7</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-stone-200 flex flex-col items-center">
            <FiTruck className="w-6 h-6 text-emerald-600 mb-2" />
            <h4 className="text-sm font-bold text-stone-900">Multi-Address Dispatch</h4>
            <p className="text-xs text-stone-500 mt-0.5">Direct to employee home doorsteps</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-stone-200 flex flex-col items-center">
            <FiShield className="w-6 h-6 text-emerald-600 mb-2" />
            <h4 className="text-sm font-bold text-stone-900">100% Quality Guaranteed</h4>
            <p className="text-xs text-stone-500 mt-0.5">Direct origin verification</p>
          </div>
        </div>

      </div>
    </section>
  );
}
