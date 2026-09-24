'use client';

import React from 'react';
import { FiTruck, FiMapPin, FiInfo, FiClock, FiPhone } from 'react-icons/fi';
import ScrollAnimate from '@/components/ui/scroll-animate';
import PageBanner from '@/components/ui/page-banner';

export default function DeliveryPage() {
  return (
    <div className="w-full">
      <PageBanner
        title="Shipping & Delivery Information"
        subtitle="Prompt, secure, and nationwide delivery for all marketplace categories — fresh groceries, apparel, footwear & lifestyle."
        badge="NATIONWIDE DISPATCH"
        breadcrumbs={[
          { label: "Delivery Information" },
        ]}
      />
      <main className="relative w-full bg-[#4A4C48] py-16 px-4 sm:px-6 md:px-8 lg:py-24 overflow-hidden">
        {/* Repeating Luxury Pattern Image */}
        <div 
          className="absolute inset-0 z-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: "url('/images/pattern/pattern.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "150px 150px",
          }}
        ></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <ScrollAnimate variant="fade-in-up">
            <div className="bg-white rounded-xl shadow-2xl border border-white/50 overflow-hidden p-8 sm:p-12 md:p-16">
              
              {/* Header */}
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="font-['Bembo_Std'] text-4xl sm:text-5xl text-[#C6B485] font-normal tracking-wide">
                  Fast & Secure <span className="font-['Snell_Roundhand_LT_Std'] italic text-stone-850 lowercase text-5xl sm:text-6xl -ml-1">Delivery</span>
                </h2>
                <p className="font-['Bembo_Std'] text-stone-400 text-xs sm:text-sm tracking-wide mt-4 font-light max-w-xl mx-auto">
                  Prompt, temperature-aware, and nationwide doorstep delivery for all verified orders.
                </p>
              </div>

              {/* Introduction */}
              <div className="text-center mb-12">
                <p className="font-['Bembo_Std'] text-stone-700 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
                  NovaMart offers nationwide delivery across all 64 districts in Bangladesh, ensuring that fresh groceries, fashion, footwear, and consumer goods reach your home safely.
                </p>
              </div>

              {/* Estimates Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                
                {/* Inside Dhaka */}
                <div className="border border-stone-200 hover:border-emerald-600 transition-all duration-300 rounded-lg p-8 flex flex-col items-center text-center bg-stone-50 group">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    <FiMapPin className="w-8 h-8" />
                  </div>
                  <h3 className="font-['Bembo_Std'] text-2xl text-neutral-800 font-medium mb-3">Within Dhaka</h3>
                  <p className="font-['Gotham'] text-emerald-600 text-lg font-semibold mb-4">Same Day / 24 – 48 Hours</p>
                  <p className="font-['Bembo_Std'] text-stone-500 text-base leading-relaxed">
                    Express courier and grocery temperature-controlled transport across greater Dhaka.
                  </p>
                </div>

                {/* Outside Dhaka */}
                <div className="border border-stone-200 hover:border-emerald-600 transition-all duration-300 rounded-lg p-8 flex flex-col items-center text-center bg-stone-50 group">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    <FiTruck className="w-8 h-8" />
                  </div>
                  <h3 className="font-['Bembo_Std'] text-2xl text-neutral-800 font-medium mb-3">All Over Bangladesh</h3>
                  <p className="font-['Gotham'] text-emerald-600 text-lg font-semibold mb-4">2 – 4 Business Days</p>
                  <p className="font-['Bembo_Std'] text-stone-500 text-base leading-relaxed">
                    Reliable door-to-door delivery across all divisions via verified partner logistics.
                  </p>
                </div>

              </div>

              {/* Additional Details */}
              <div className="space-y-6 text-stone-600 font-['Bembo_Std'] text-lg border-t border-stone-200 pt-10">
                <div className="flex items-start gap-4">
                  <FiClock className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
                  <p>
                    <strong className="text-neutral-800">Processing Time:</strong> Orders received before 2:00 PM are processed the same business day.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <FiInfo className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
                  <p>
                    <strong className="text-neutral-800">Live Tracking:</strong> Real-time tracking links with SMS updates are dispatched upon shipment departure.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <FiPhone className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
                  <p>
                    <strong className="text-neutral-800">Delivery Assistance:</strong> If you require urgent delivery or changes to your delivery address, please reach our helpline at +880 13 3987 9494.
                  </p>
                </div>
              </div>

            </div>
          </ScrollAnimate>
        </div>
      </main>
    </div>
  );
}
