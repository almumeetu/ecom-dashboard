import React from 'react';
import PageBanner from '@/components/ui/page-banner';
import LuxuryHero from '@/components/sections/luxury-hero-banner';
import CorporateSolutions from '@/components/sections/corporate-solutions';
import TrustFeatures from '@/components/sections/trust-features';
import Brands from '@/components/sections/brands';
import InquiryForm from '@/components/sections/inquiry-form';
import CorporateFAQ from '@/components/sections/corporate-faq';
import ScrollAnimate from '@/components/ui/scroll-animate';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Corporate & Wholesale Orders | NovaMart Bangladesh',
  description: 'Custom corporate gifting, bulk wholesale orders, employee celebration packages, and business supply across all categories with nationwide dispatch from NovaMart.',
};

export default function CorporateOrderPage() {
  return (
    <main className="flex-grow bg-white w-full">
      <PageBanner
        title="Corporate & Wholesale Orders"
        subtitle="Custom corporate gifting, bulk wholesale orders, and employee reward bundles tailored to your organization."
        breadcrumbs={[
          { label: "Corporate Orders" },
        ]}
        showTrustChips={true}
      />
      
      {/* 1. Luxury Hero Banner */}
      <ScrollAnimate variant="fade-in-up">
        <LuxuryHero />
      </ScrollAnimate>

      {/* 2. Curated Corporate Solutions (Showcase + 4-Step Process) */}
      <CorporateSolutions />

      {/* 3. Marketplace B2B Pillars */}
      <ScrollAnimate variant="fade-in-up">
        <TrustFeatures />
      </ScrollAnimate>

      {/* 4. Verified Brands & Vendor Partners */}
      <ScrollAnimate variant="fade-in-up">
        <Brands variant="vertical" />
      </ScrollAnimate>

      {/* 5. Corporate Inquiry Form */}
      <ScrollAnimate variant="fade-in-up">
        <InquiryForm />
      </ScrollAnimate>

      {/* 6. Corporate FAQs & Executive Contact */}
      <CorporateFAQ />
    </main>
  );
}
