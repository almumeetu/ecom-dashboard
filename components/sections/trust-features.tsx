'use client';

import React from 'react';
import { LuTruck, LuShieldCheck, LuStore, LuCreditCard } from 'react-icons/lu';

export default function TrustFeatures() {
  const features = [
    {
      title: 'Fast Doorstep Delivery',
      desc: 'Same-day grocery deliveries & rapid shipping for fashion, footwear and electronics.',
      icon: LuTruck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: '100% Authentic Quality',
      desc: 'All products sourced directly from verified manufacturers and official brand partners.',
      icon: LuShieldCheck,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      title: 'Certified Multi-Vendors',
      desc: 'Strict seller compliance, background verification, and continuous rating audits.',
      icon: LuStore,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      title: 'Secure Payments & Easy Return',
      desc: 'Encrypted checkout, cash-on-delivery options, and a hassle-free 7-day return policy.',
      icon: LuCreditCard,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
  ];

  return (
    <section className="w-full bg-[#FAF9F5] py-16 sm:py-20 border-t border-stone-200/70 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 w-full flex flex-col items-center">
        {/* Title */}
        <div className="text-center max-w-2xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200/80 text-stone-800 text-[11px] font-bold uppercase tracking-wider mb-3">
            <span>Marketplace Promise</span>
          </div>
          <h2 className="text-zinc-900 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight font-['Bembo_Std'] mb-3">
            Why Shop On Our Marketplace
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
            We connect you with authentic brands and verified sellers with end-to-end buyer protection and reliable customer support.
          </p>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="flex flex-col items-center text-center p-6 sm:p-7 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border ${feature.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-zinc-900 font-semibold text-base sm:text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
