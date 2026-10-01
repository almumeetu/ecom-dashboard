'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiChevronDown, FiChevronUp, FiPhone, FiMail, FiFileText, FiShield, FiExternalLink } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import ScrollAnimate from '@/components/ui/scroll-animate';

export default function CorporateFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIdx(openIdx === i ? null : i);
  };

  const faqs = [
    {
      q: 'What is the Minimum Order Quantity (MOQ) for corporate orders?',
      a: 'For custom corporate gift hampers and seasonal Rajshahi mango crates, our MOQ starts at just 10 boxes/units. For institutional bulk wholesale procurement (pantry staples, beverages, electronics), volume tiered pricing begins at 20+ units.',
    },
    {
      q: 'Can we customize the gift packaging with our company logo and greeting cards?',
      a: 'Absolutely. We provide full bespoke customization: custom ribbon printing, debossed or engraved company logos on gift boxes or wooden crates, tailored greeting cards, and branded packaging inserts for your employees or clients.',
    },
    {
      q: 'Do you deliver directly to individual employee home addresses across Bangladesh?',
      a: 'Yes! We offer nationwide multi-destination fulfillment. You can provide an Excel sheet of your employees or clients across all 64 districts, and our verified logistics network will deliver directly to each individual doorstep with live SMS tracking.',
    },
    {
      q: 'Do you provide official Mushak-6.3 VAT Challans and Tax Invoices?',
      a: 'Yes. NovaMart operates under complete regulatory compliance in Bangladesh. Every corporate order receives an official VAT Challan (Mushak-6.3) and commercial tax invoice suitable for enterprise accounting and audits.',
    },
    {
      q: 'Can we inspect a sample box before finalizing a large corporate order?',
      a: 'Yes. For orders exceeding 50 units, our corporate desk can prepare and deliver a physical sample hamper to your head office within 24 to 48 hours for executive review and sign-off.',
    },
    {
      q: 'What are the corporate payment terms?',
      a: 'We accept corporate bank transfers (BEFTN / RTGS), corporate cheques, credit cards, and MFS (bKash/Nagad). For verified institutions and recurring contracts, we offer structured 15 to 30-day corporate credit terms.',
    },
  ];

  return (
    <section className="w-full bg-white py-16 sm:py-24 border-t border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        
        <ScrollAnimate variant="fade-in-up">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">
              Corporate Guidelines
            </span>
            <h2 className="font-['Bembo_Std'] text-3xl sm:text-4xl text-stone-900 mt-1">
              Corporate &amp; Wholesale FAQs
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-2">
              Everything you need to know about pricing, customization, sample reviews, and VAT compliance.
            </p>
          </div>
        </ScrollAnimate>

        <div className="space-y-3.5 mb-16">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-stone-200 bg-stone-50/50 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-5 sm:px-6 py-4 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-stone-900 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="shrink-0 text-stone-400">
                    {isOpen ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Direct Corporate Desk Contact Card */}
        <ScrollAnimate variant="fade-in-up">
          <div className="bg-[#FAF9F5] rounded-3xl p-8 sm:p-10 border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                Need Fast Proposal or Custom Budgeting?
              </span>
              <h3 className="font-['Bembo_Std'] text-2xl text-stone-900 font-semibold mb-2">
                Connect Directly with Our Executive Desk
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-lg">
                Our Head of Corporate Partnerships is available to discuss custom specifications, bulk discounts, and urgent delivery timelines.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto">
              <a
                href="tel:01722301927"
                className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2"
              >
                <FiPhone className="w-4 h-4" />
                <span>Call Executive: 01722301927</span>
              </a>
              <a
                href="https://wa.me/8801722301927?text=Hello%2C%20I%20would%20like%20to%20discuss%20a%20corporate%20order%20for%20our%20company."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2"
              >
                <FaWhatsapp className="w-4 h-4" />
                <span>WhatsApp Corporate Desk</span>
              </a>
            </div>
          </div>
        </ScrollAnimate>

      </div>
    </section>
  );
}
