'use client';

import React from 'react';
import Link from 'next/link';
import {
  FiFileText,
  FiShield,
  FiCheckCircle,
  FiPhone,
  FiMail,
  FiCheck,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import ScrollAnimate from '@/components/ui/scroll-animate';
import PageBanner from '@/components/ui/page-banner';
import PolicyNav from '@/components/sections/policy/policy-nav';

export default function TermsPage() {
  const sections = [
    {
      id: 'agreement',
      title: '1. Agreement & Acceptance of Terms',
      content:
        'By browsing, accessing, or placing an order on NovaMart Bangladesh (novamart.com.bd), you agree to be bound by these Terms & Conditions. These terms govern all purchases made across our multi-category marketplace including Skin Care & Beauty, Digital Electronics, Perfumes & Fragrances, Clothing & Fashion, Baby Products, and Home & Living.',
    },
    {
      id: 'authenticity',
      title: '2. 100% Authentic Product Guarantee',
      content:
        'NovaMart operates under a zero-tolerance policy against counterfeit merchandise. All products listed on our platform are guaranteed 100% genuine, directly sourced from authorized brand distributors, verified global importers, and official manufacturers. Every item is verified for batch codes, expiry dates, and manufacturer seals before courier packaging.',
    },
    {
      id: 'pricing',
      title: '3. Pricing, Discounts & Payment Methods',
      content:
        'All prices listed on NovaMart are in Bangladeshi Taka (BDT) inclusive of applicable taxes. NovaMart reserves the right to correct any typographical or technological pricing errors prior to shipment. We accept Cash on Delivery (COD) across all 64 districts in Bangladesh, mobile financial banking (bKash, Nagad, Rocket), and international credit/debit cards processed through bank-grade SSL encrypted gateways.',
    },
    {
      id: 'orders',
      title: '4. Order Placement, Verification & Cancellation',
      content:
        'Upon submitting an order, you will receive an automated SMS confirmation. For high-value digital electronics or non-standard orders, our verification team may call to re-confirm address details prior to warehouse dispatch. Customers may cancel an order free of charge before the parcel is handed over to our courier partner by contacting our hotline or WhatsApp desk.',
    },
    {
      id: 'shipping',
      title: '5. Doorstep Delivery & Risk of Loss',
      content:
        'NovaMart provides nationwide delivery across all 64 districts in Bangladesh. Estimated transit times are 24–48 hours within Dhaka Metro and 2–4 business days across other districts. Orders with a subtotal of ৳1,999 or more qualify for 100% Free Delivery. The risk of loss transfers to the customer upon physical doorstep delivery and payment acceptance.',
    },
    {
      id: 'returns',
      title: '6. 7-Day Return & Replacement Guarantee',
      content:
        'Customers are entitled to request a return or replacement within 7 calendar days of receipt if an item arrives damaged, defective, expired, or incorrect. NovaMart covers 100% of reverse courier shipping costs for verified defective items. Refunds are issued via bKash/Nagad within 24–48 hours of item receipt at our fulfillment center.',
    },
    {
      id: 'law',
      title: '7. Governing Law & Dispute Resolution',
      content:
        'These Terms & Conditions are governed by and construed in accordance with the laws of the People’s Republic of Bangladesh, including the Consumers’ Right Protection Act, 2009 and the Digital Commerce Operation Guidelines. Any disputes arising shall be subject to the exclusive jurisdiction of the competent courts of Dhaka, Bangladesh.',
    },
  ];

  return (
    <div className="w-full bg-[#FAF9F5] text-zinc-900 font-sans min-h-screen">
      {/* ── Page Banner ── */}
      <PageBanner
        title="Terms & Conditions"
        subtitle="Transparent customer rights, authentic product guarantees, and fair trade practices across all NovaMart departments."
        breadcrumbs={[
          { label: 'Customer Care', href: '/contact' },
          { label: 'Terms & Conditions' },
        ]}
        showTrustChips={true}
      />

      {/* ── Sticky Policy Navigation ── */}
      <PolicyNav currentKey="terms" />

      {/* ── Content Container ── */}
      <section className="py-10 sm:py-14 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200/80 shadow-xs space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-indigo-200/80 text-[#4F46E5] text-xs font-bold uppercase tracking-wider mb-3">
                  <FiFileText className="w-3.5 h-3.5 text-[#4F46E5]" />
                  <span>Effective Date: January 1, 2026</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight">
                  NovaMart Bangladesh Terms of Service
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 leading-relaxed">
                  Please review these terms carefully before placing an order. These provisions define your legal rights, warranties, and obligations.
                </p>
              </div>

              <div className="space-y-6 divide-y divide-zinc-100">
                {sections.map((section, idx) => (
                  <div key={section.id} className={idx > 0 ? 'pt-6' : ''}>
                    <h2 className="text-base sm:text-lg font-bold text-[#0B132B] mb-2">
                      {section.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-32">
            {/* Quick Guarantees Box */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#0B132B] uppercase tracking-wider">
                The NovaMart Buyer Charter
              </h3>

              <div className="space-y-3 text-xs text-zinc-600">
                <div className="flex items-start gap-2.5">
                  <FiCheck className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
                  <span><strong>100% Authentic:</strong> Zero counterfeit guarantee or double money back.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <FiCheck className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
                  <span><strong>7-Day Returns:</strong> Rapid replacement or full refund on damaged items.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <FiCheck className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
                  <span><strong>Cash on Delivery:</strong> Inspect parcel at your doorstep nationwide.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <FiCheck className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
                  <span><strong>Transparent Pricing:</strong> Inclusive of VAT, no hidden checkout fees.</span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100">
                <p className="text-[11px] text-zinc-500">
                  Questions regarding our terms or corporate contracts?
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <a
                    href="tel:01712345678"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-2"
                  >
                    <FiPhone className="w-3.5 h-3.5" />
                    <span>Helpline: +880 1712-345678</span>
                  </a>
                  <a
                    href="mailto:support@novamart.com.bd"
                    className="w-full py-2.5 px-4 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-xs font-bold text-center border border-zinc-200 transition-all flex items-center justify-center gap-2"
                  >
                    <FiMail className="w-3.5 h-3.5 text-[#4F46E5]" />
                    <span>support@novamart.com.bd</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links to other policies */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Related Policies
              </h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li>
                  <Link href="/delivery" className="text-zinc-700 hover:text-[#4F46E5] block">
                    → Delivery &amp; Shipping Rates
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-zinc-700 hover:text-[#4F46E5] block">
                    → 7-Day Returns &amp; Refunds Policy
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-zinc-700 hover:text-[#4F46E5] block">
                    → Data Privacy &amp; Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-zinc-700 hover:text-[#4F46E5] block">
                    → Customer FAQs &amp; Help Desk
                  </Link>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
