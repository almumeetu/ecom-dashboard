'use client';

import React from 'react';
import Link from 'next/link';
import { FiCheckCircle, FiShield, FiTruck } from 'react-icons/fi';

export default function LuxuryHero() {
  const scrollToForm = () => {
    const element = document.getElementById('inquiry-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative w-full flex items-center justify-center bg-store-deep py-20 sm:py-28 px-6 overflow-hidden">
      {/* Repeating Luxury Pattern Image */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: "url('/images/pattern/pattern.png')",
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          backgroundSize: '160px auto',
          maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 90%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 90%)',
        }}
      />

      {/* Hero Content Stack */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-8 sm:gap-10">
        {/* Main Crest Icon */}
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/images/icons/icon-3.svg" 
            alt="NovaMart Crest" 
            className="w-12 h-14 object-contain opacity-90" 
          />
        </div>

        {/* Headings */}
        <div className="flex flex-col items-center text-center">
          <span className="text-[11px] sm:text-xs font-medium uppercase tracking-widest text-store-light mb-2">
            Enterprise &amp; Institutional Solutions
          </span>
          <h1 className="font-normal text-3xl sm:text-4xl md:text-5xl lg:text-[44px] text-white tracking-tight leading-tight">
            Bespoke Corporate Gifting &amp; Wholesale for Those
          </h1>
          <h2 className="font-medium text-3xl sm:text-4xl md:text-5xl lg:text-[48px] text-store-light mt-1 block tracking-tight">
            Who Represent Excellence
          </h2>
        </div>

        {/* Paragraph */}
        <p className="font-gotham text-store-light text-sm sm:text-base md:text-lg max-w-3xl leading-relaxed font-normal text-center">
          From bespoke executive hampers and seasonal Rajshahi harvest crates to bulk wholesale procurement for distinguished institutions across Bangladesh, we curate enterprise solutions that reflect your standards with distinction.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center items-center">
          <button 
            type="button"
            onClick={scrollToForm}
            className="w-full sm:w-auto px-8 py-3.5 bg-store-primary hover:bg-store-hover text-white rounded-xl transition-colors shadow-sm border border-white/10 cursor-pointer flex justify-center items-center"
          >
            <span className="text-white text-xs sm:text-sm font-semibold font-gotham uppercase tracking-wider">
              Request Proposal
            </span>
          </button>
          <Link 
            href="/products"
            className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-store-surface text-store-deep rounded-xl transition-colors shadow-sm cursor-pointer flex justify-center items-center"
          >
            <span className="text-store-deep text-xs sm:text-sm font-semibold font-gotham uppercase tracking-wider">
              Explore Catalog
            </span>
          </Link>
        </div>

        {/* B2B Trust Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/15 w-full text-xs font-semibold text-white/90">
          <div className="flex items-center justify-center gap-1.5">
            <FiCheckCircle className="w-4 h-4 text-store-light shrink-0" />
            <span>500+ B2B Partners</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <FiShield className="w-4 h-4 text-store-light shrink-0" />
            <span>Volume Discounts</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <FiCheckCircle className="w-4 h-4 text-store-light shrink-0" />
            <span>Custom Branding</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <FiTruck className="w-4 h-4 text-store-light shrink-0" />
            <span>64-District Dispatch</span>
          </div>
        </div>
      </div>
    </section>
  );
}
