'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiRefreshCw,
  FiCheckCircle,
  FiShield,
  FiClock,
  FiPhone,
  FiAlertCircle,
  FiTruck,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import ScrollAnimate from '@/components/ui/scroll-animate';
import PageBanner from '@/components/ui/page-banner';
import PolicyNav from '@/components/sections/policy/policy-nav';
import {
  fetchShopSettings,
  parseContactEntries,
  type ShopSettings,
} from '@/lib/shop-api';

export default function ReturnsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [settings, setSettings] = useState<ShopSettings | null>(null);

  useEffect(() => {
    fetchShopSettings().then((s) => {
      if (s) setSettings(s);
    });
  }, []);

  const contactEntries = parseContactEntries(settings?.contactNumber);
  const primaryPhone = contactEntries[0]?.value || '+880 1712-345678';
  const cleanPhone = primaryPhone.replace(/[^\d+]/g, '') || '01712345678';
  const rawWhatsapp = settings?.socialContact?.whatsapp || primaryPhone;
  const whatsappNumber = rawWhatsapp.replace(/[^\d]/g, '') || '8801712345678';
  const fullWhatsapp = whatsappNumber.startsWith('88')
    ? whatsappNumber
    : `88${whatsappNumber.replace(/^0+/, '')}`;

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const returnFaqs = [
    {
      q: 'How many days do I have to return an item?',
      a: 'NovaMart provides a 7-Day Return and Replacement Window starting from the date you receive your parcel. If you notice any defect, damage, or discrepancy, contact our helpline or WhatsApp within 7 calendar days.',
    },
    {
      q: 'Will I be charged for return courier shipping?',
      a: 'No! If the return is due to a damaged item, expired batch, wrong item sent, or manufacturer defect, NovaMart covers 100% of the reverse shipping charges. For change of mind on sealed items, standard delivery charge may apply.',
    },
    {
      q: 'Can skin care, perfumes, and cosmetics be returned after opening?',
      a: 'For hygiene and safety reasons, skin care products, cosmetics, and perfumes can only be returned if they arrive damaged, leaked, or with an intact, unopened manufacturer seal. If an item arrives broken or leaked during transit, we replace it immediately upon receiving photo/video proof.',
    },
    {
      q: 'How fast will my refund be processed?',
      a: 'Once the returned item is verified at our hub, refunds via mobile financial services (bKash, Nagad, Rocket) are sent within 24 to 48 business hours. For credit or debit card transactions, the refund is reflected within 3 to 7 banking days.',
    },
    {
      q: 'Can I exchange for a different size in fashion or footwear?',
      a: 'Yes! We offer size exchanges for clothing and footwear within 7 days, provided the items are unwashed, unworn, and retain all original tags and packaging.',
    },
  ];

  return (
    <div className="w-full bg-[#FAF9F5] text-zinc-900 font-sans min-h-screen">
      {/* ── Page Banner ── */}
      <PageBanner
        title="Returns & Refunds Policy"
        subtitle="7-Day Hassle-Free Returns, Free Doorstep Pickups for Defective Items, and Rapid bKash/Bank Refunds."
        breadcrumbs={[
          { label: 'Customer Care', href: '/contact' },
          { label: 'Returns & Refunds' },
        ]}
        showTrustChips={true}
      />

      {/* ── Sticky Policy Navigation ── */}
      <PolicyNav currentKey="returns" />

      {/* ── 1. Hero Summary Card ── */}
      <section className="py-10 sm:py-14 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <ScrollAnimate variant="fade-in-up">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200/80 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-indigo-200/80 text-[#4F46E5] text-xs font-bold uppercase tracking-wider">
                  <FiRefreshCw className="w-3.5 h-3.5 text-[#4F46E5]" />
                  <span>Buyer Protection Guarantee</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0B132B] tracking-tight leading-tight">
                  7-Day Hassle-Free Return &amp; Replacement
                </h1>

                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-3xl">
                  At NovaMart, your satisfaction and peace of mind come first. If any product arrives damaged in transit, with an expired batch code, or fails to meet your ordered specifications, we will replace it immediately or issue a 100% full refund with zero reverse shipping fees.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Free Doorstep Pickup in Dhaka</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
                    <FiCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Courier Pickup Across 64 Districts</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-50 border border-orange-200 text-[#EA580C] text-xs font-bold">
                    <FiCheck className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>Refund in 24–48h via bKash / Bank</span>
                  </span>
                </div>
              </div>

              {/* Support Quick Box */}
              <div className="lg:col-span-4 bg-zinc-50 rounded-2xl p-5 border border-zinc-200/80 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Initiate a Return or Exchange
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Send a photo or short video of the parcel and defective item to our dedicated return desk.
                </p>
                <div className="space-y-2 pt-1">
                  <a
                    href={`https://wa.me/${fullWhatsapp}?text=Hello%20NovaMart%2C%20I%20would%20like%20to%20request%20a%20return%2Fexchange%20for%20my%20order.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <FaWhatsapp className="w-4 h-4 text-white" />
                    <span>WhatsApp Return Desk</span>
                  </a>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-bold text-center border border-zinc-300 transition-all flex items-center justify-center gap-2"
                  >
                    <FiPhone className="w-3.5 h-3.5 text-[#4F46E5]" />
                    <span>Call Hotline: {primaryPhone}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimate>
      </section>

      {/* ── 2. 4-Step Simple Return Process ── */}
      <section className="py-8 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5]">
            Simple &amp; Smooth
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] mt-1">
            How The Return Process Works
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            4 easy steps from reporting the issue to receiving your replacement or refund.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-2xl font-black text-[#4F46E5]/30 block mb-2 font-mono">01</span>
              <h3 className="text-sm font-bold text-zinc-900 mb-1.5">Notify Support</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Contact our helpline or WhatsApp within 7 days. Share your Order ID and 1–2 photos of the issue.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-bold text-[#4F46E5]">
              <FiCheckCircle className="w-3.5 h-3.5" />
              <span>Response in &lt; 30 Minutes</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-2xl font-black text-[#4F46E5]/30 block mb-2 font-mono">02</span>
              <h3 className="text-sm font-bold text-zinc-900 mb-1.5">Reverse Courier Scheduled</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Our logistics partner schedules a doorstep pickup at your address with zero return fee for defective goods.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-bold text-[#4F46E5]">
              <FiTruck className="w-3.5 h-3.5" />
              <span>Doorstep Pickup</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-2xl font-black text-[#4F46E5]/30 block mb-2 font-mono">03</span>
              <h3 className="text-sm font-bold text-zinc-900 mb-1.5">Hub Verification</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                The parcel is checked by our QC team in Banani, Dhaka to verify the condition and manufacturer seal.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-bold text-[#4F46E5]">
              <FiShield className="w-3.5 h-3.5" />
              <span>Verified Same Day</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-2xl font-black text-[#4F46E5]/30 block mb-2 font-mono">04</span>
              <h3 className="text-sm font-bold text-zinc-900 mb-1.5">Refund or Replacement</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Receive an immediate replacement dispatched or full refund sent to your bKash, Nagad, or Bank account.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
              <FiRefreshCw className="w-3.5 h-3.5" />
              <span>Refund in 24–48 Hours</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Return Eligibility by Category ── */}
      <section className="py-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5]">
              Category Guidelines
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B132B] mt-0.5">
              Product Return Eligibility &amp; Condition Criteria
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Please review the specific conditions required for items in each department.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h4 className="text-sm font-bold text-zinc-900">Skin Care &amp; Perfumes</h4>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Eligible if damaged/leaking during courier transit or if unopened with the original manufacturer seal intact. Opened or used personal care liquids cannot be returned due to hygiene regulations.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h4 className="text-sm font-bold text-zinc-900">Digital Electronics &amp; Gadgets</h4>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Eligible if dead on arrival (DOA), defective, or differing from specs. Must include original box, serial number, and all in-box charging cables/accessories. Backed by full brand warranty.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h4 className="text-sm font-bold text-zinc-900">Clothing &amp; Footwear</h4>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Eligible for size and style exchange within 7 days. Must be unwashed, unworn, and have all original tags attached with original packaging.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h4 className="text-sm font-bold text-zinc-900">Baby Care &amp; Feeding Products</h4>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Diaper packs, baby wipes, and feeding bottles must be unopened and sealed in original manufacturer blister packaging to guarantee child safety and hygiene.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. FAQs ── */}
      <section className="py-10 sm:py-14 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5]">
            Clarifications
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] mt-1">
            Frequently Asked Questions Regarding Returns
          </h2>
        </div>

        <div className="space-y-3">
          {returnFaqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-sm text-zinc-900 hover:text-[#4F46E5] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-600">
                    {isOpen ? <FiChevronUp className="w-4 h-4 text-[#4F46E5]" /> : <FiChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
