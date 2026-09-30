'use client';

import React from 'react';
import Link from 'next/link';
import {
  FiShield,
  FiLock,
  FiEye,
  FiCheckCircle,
  FiPhone,
  FiMail,
  FiCheck,
} from 'react-icons/fi';
import ScrollAnimate from '@/components/ui/scroll-animate';
import PageBanner from '@/components/ui/page-banner';
import PolicyNav from '@/components/sections/policy/policy-nav';

export default function PrivacyPage() {
  const sections = [
    {
      id: 'commitment',
      title: '1. Our Privacy Commitment',
      content:
        'NovaMart Retail Bangladesh Limited ("NovaMart", "we", "our") values your personal privacy. We are committed to safeguarding your contact information, delivery coordinates, and browsing history. We never sell, rent, or trade your personal data to unauthorized third parties or marketing brokers.',
    },
    {
      id: 'collection',
      title: '2. Information We Collect',
      content:
        'When you place an order or register an account on NovaMart, we collect necessary transactional details including your full name, recipient delivery address, active contact phone number, and email address. When browsing our catalog, anonymous session cookies are utilized to remember your shopping cart items, wishlist, and preferred currency.',
    },
    {
      id: 'usage',
      title: '3. How Your Information Is Used',
      content:
        'Your information is strictly used for order processing, issuing commercial VAT invoices, sending real-time SMS courier tracking notifications, arranging doorstep delivery across Bangladesh, and delivering customer support through our helpline and WhatsApp desk.',
    },
    {
      id: 'security',
      title: '4. Bank-Grade 256-bit SSL Security',
      content:
        'All communications between your browser and NovaMart are encrypted with 256-bit Secure Socket Layer (SSL) certificates. NovaMart does not store or log your credit card numbers, debit card CVV, or mobile banking PINs. All financial transactions are processed directly through PCI-DSS certified gateways (SSLCommerz, bKash Direct, Nagad).',
    },
    {
      id: 'courier',
      title: '5. Authorized Third-Party Logistics Partners',
      content:
        'To fulfill physical orders, your delivery name, address, and phone number are securely transmitted to verified courier partners (such as Steadfast Logistics, RedX, Pathao, or Sundarban Courier). These partners are legally contractually bound to utilize this data exclusively for parcel delivery.',
    },
    {
      id: 'rights',
      title: '6. Your Rights & Data Deletion',
      content:
        'You have full control over your personal data. You may update your profile coordinates at any time under My Account → Settings. If you wish to delete your account or erase past order records from our systems, simply submit a written request to support@novamart.com.bd and our data protection officer will process it within 48 business hours.',
    },
  ];

  return (
    <div className="w-full bg-[#FAF9F5] text-zinc-900 font-sans min-h-screen">
      {/* ── Page Banner ── */}
      <PageBanner
        title="Privacy & Data Protection Policy"
        subtitle="Bank-grade 256-bit SSL encryption, zero third-party data selling, and strict privacy safeguards across all NovaMart services."
        breadcrumbs={[
          { label: 'Customer Care', href: '/contact' },
          { label: 'Privacy Policy' },
        ]}
        showTrustChips={true}
      />

      {/* ── Sticky Policy Navigation ── */}
      <PolicyNav currentKey="privacy" />

      {/* ── Main Content Container ── */}
      <section className="py-10 sm:py-14 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Policy Content (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200/80 shadow-xs space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-indigo-200/80 text-[#4F46E5] text-xs font-bold uppercase tracking-wider mb-3">
                  <FiLock className="w-3.5 h-3.5 text-[#4F46E5]" />
                  <span>ISO &amp; SSL Bank-Grade Security</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight">
                  NovaMart Bangladesh Privacy Statement
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 leading-relaxed">
                  Last updated: January 2026. This policy explains how we collect, safeguard, and process your personal information.
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

          {/* Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-32">
            {/* Security Guarantee Box */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#0B132B] uppercase tracking-wider">
                Security Checklist
              </h3>

              <div className="space-y-3 text-xs text-zinc-600">
                <div className="flex items-start gap-2.5">
                  <FiCheck className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
                  <span><strong>256-Bit SSL:</strong> Encrypted browser sessions and tokenized payments.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <FiCheck className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
                  <span><strong>Zero Card Storage:</strong> No card numbers or MFS PINs stored on servers.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <FiCheck className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
                  <span><strong>Strict Confidentiality:</strong> Courier partners restricted by NDA.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <FiCheck className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
                  <span><strong>Data Control:</strong> Request deletion or download of your data anytime.</span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100">
                <p className="text-[11px] text-zinc-500">
                  Data Protection Officer Contact:
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <a
                    href="mailto:privacy@novamart.com.bd"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-2"
                  >
                    <FiMail className="w-3.5 h-3.5" />
                    <span>privacy@novamart.com.bd</span>
                  </a>
                  <a
                    href="tel:01712345678"
                    className="w-full py-2.5 px-4 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-xs font-bold text-center border border-zinc-200 transition-all flex items-center justify-center gap-2"
                  >
                    <FiPhone className="w-3.5 h-3.5 text-[#4F46E5]" />
                    <span>Call Helpline: +880 1712-345678</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Policy Directory */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Quick Directory
              </h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li>
                  <Link href="/delivery" className="text-zinc-700 hover:text-[#4F46E5] block">
                    → Delivery &amp; Shipping Rates
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-zinc-700 hover:text-[#4F46E5] block">
                    → Returns &amp; Refunds Guarantee
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-zinc-700 hover:text-[#4F46E5] block">
                    → Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-zinc-700 hover:text-[#4F46E5] block">
                    → Customer Support &amp; FAQs
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
