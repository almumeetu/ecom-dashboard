import React from 'react';
import PageBanner from '@/components/ui/page-banner';
import LuxuryHero from '@/components/sections/luxury-hero-banner';
import TrustFeatures from '@/components/sections/trust-features';
import Brands from '@/components/sections/brands';
import InquiryForm from '@/components/sections/inquiry-form';
import ScrollAnimate from '@/components/ui/scroll-animate';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Corporate & Wholesale Orders | NovaMart Marketplace',
  description: 'Curated corporate gifting, wholesale supplies, and bespoke employee celebration packages across all categories.',
};

export default function CorporateOrderPage() {
  return (
    <main className="flex-grow bg-white w-full">
      <PageBanner
        title="Corporate & Wholesale Orders"
        subtitle="Custom corporate gifting, bulk wholesale orders, and employee reward bundles tailored to your organization."
        badge="B2B & WHOLESALE"
        breadcrumbs={[
          { label: "Corporate Orders" },
        ]}
      />
      <ScrollAnimate variant="fade-in-up">
        <LuxuryHero />
      </ScrollAnimate>
      <ScrollAnimate variant="fade-in-up">
        <TrustFeatures />
      </ScrollAnimate>
      <ScrollAnimate variant="fade-in-up">
        <Brands variant="vertical" />
      </ScrollAnimate>
      <ScrollAnimate variant="fade-in-up">
        <InquiryForm />
      </ScrollAnimate>
    </main>
  );
}
