'use client';

import Link from 'next/link';
import {
  FiPhone,
  FiMail,
  FiCheck,
} from 'react-icons/fi';
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
        'All prices listed on NovaMart are in Bangladeshi Taka (BDT) inclusive of applicable taxes. NovaMart reserves the right to correct any typographical or technological pricing errors prior to shipment. Available payment methods are shown during checkout.',
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
        'Available delivery options, applicable charges, and any estimated delivery times depend on the delivery address and are shown during checkout. Please review these details before placing an order.',
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
    <div className="w-full bg-store-page text-zinc-900 font-sans min-h-screen">
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
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          
          {/* Main Content Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <article className="space-y-7 rounded-[28px] border border-store-border/80 bg-white p-6 shadow-[0_12px_40px_rgba(20,38,56,0.045)] sm:space-y-8 sm:p-9 lg:p-10">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-store-ink sm:text-3xl">
                  NovaMart Bangladesh Terms of Service
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500 sm:text-[15px] sm:leading-7">
                  Effective January 1, 2026. Please review these terms carefully before placing an order. These provisions define your legal rights, warranties, and obligations.
                </p>
              </div>

              <div className="divide-y divide-store-border/70">
                {sections.map((section, idx) => (
                  <section key={section.id} id={section.id} className={idx > 0 ? 'pt-6 sm:pt-7' : 'pb-6 sm:pb-7'}>
                    <h3 className="mb-2 text-base font-semibold text-store-ink sm:text-lg">
                      {section.title}
                    </h3>
                    <p className="text-sm leading-6 text-zinc-600 sm:text-[15px] sm:leading-7">
                      {section.content}
                    </p>
                  </section>
                ))}
              </div>
            </article>
          </div>

          {/* Sticky Sidebar (4 cols) */}
          <aside className="space-y-4 lg:sticky lg:top-32 lg:col-span-4">
            {/* Quick Guarantees Box */}
            <section className="space-y-4 rounded-2xl border border-store-border/80 bg-white p-5 shadow-[0_8px_28px_rgba(20,38,56,0.04)] sm:p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-store-ink">
                The NovaMart Buyer Charter
              </h3>

              <div className="space-y-3 text-sm text-zinc-600">
                <div className="flex items-start gap-2.5">
                  <FiCheck className="w-4 h-4 text-store-primary shrink-0 mt-0.5" />
                  <span><strong>100% Authentic:</strong> Zero counterfeit guarantee or double money back.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <FiCheck className="w-4 h-4 text-store-primary shrink-0 mt-0.5" />
                  <span><strong>7-Day Returns:</strong> Rapid replacement or full refund on damaged items.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <FiCheck className="w-4 h-4 text-store-primary shrink-0 mt-0.5" />
                  <span><strong>Cash on Delivery:</strong> Inspect parcel at your doorstep nationwide.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <FiCheck className="w-4 h-4 text-store-primary shrink-0 mt-0.5" />
                  <span><strong>Transparent Pricing:</strong> Inclusive of VAT, no hidden checkout fees.</span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100">
                <p className="text-[11px] text-zinc-500">
                  Questions regarding our terms or corporate contracts?
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <a
                    href="tel:01722301927"
                    className="w-full py-2.5 px-4 rounded-xl bg-store-primary hover:bg-store-hover text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-2"
                  >
                    <FiPhone className="w-3.5 h-3.5" />
                    <span>Helpline: +880 1722-301927</span>
                  </a>
                  <a
                    href="mailto:support@novamart.com.bd"
                    className="w-full py-2.5 px-4 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-xs font-bold text-center border border-zinc-200 transition-all flex items-center justify-center gap-2"
                  >
                    <FiMail className="w-3.5 h-3.5 text-store-primary" />
                    <span>support@novamart.com.bd</span>
                  </a>
                </div>
              </div>
            </section>

            {/* Quick Links to other policies */}
            <section className="space-y-3 rounded-2xl border border-store-border/80 bg-white p-5 shadow-[0_8px_28px_rgba(20,38,56,0.04)] sm:p-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Related Policies
              </h3>
              <ul className="space-y-2 text-xs font-semibold">
                <li>
                  <Link href="/delivery" className="text-zinc-700 hover:text-store-primary block">
                    → Delivery &amp; Shipping Rates
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-zinc-700 hover:text-store-primary block">
                    → 7-Day Returns &amp; Refunds Policy
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-zinc-700 hover:text-store-primary block">
                    → Data Privacy &amp; Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-zinc-700 hover:text-store-primary block">
                    → Customer FAQs &amp; Help Desk
                  </Link>
                </li>
              </ul>
            </section>
          </aside>

        </div>
      </section>
    </div>
  );
}
