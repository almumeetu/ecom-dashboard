'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiCheckCircle,
  FiTruck,
  FiShield,
  FiPhone,
  FiArrowRight,
  FiShoppingBag,
  FiRefreshCw,
  FiAward,
  FiPackage,
  FiHeart,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { HiCheckCircle, HiShieldCheck, HiSparkles } from 'react-icons/hi';
import ScrollAnimate from '@/components/ui/scroll-animate';

export default function About() {
  const departments = [
    {
      title: 'Skin Care & Beauty',
      desc: 'Authentic serums, cleansers, dermatological moisturizers, and Korean beauty essentials.',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      link: '/products?category=skin-care',
      tag: '100% Authentic',
    },
    {
      title: 'Digital Electronics',
      desc: 'Smartwatches, wireless noise-cancelling earbuds, fast power banks, and certified accessories.',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      link: '/products?category=digital-electronics',
      tag: 'Tech Warranty',
    },
    {
      title: 'Perfumes & Fragrances',
      desc: 'Designer Eau De Parfum, luxury Arabian ouds, and long-lasting artisanal perfume sets.',
      image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80',
      link: '/products?category=perfume',
      tag: 'Original Seal',
    },
    {
      title: 'Clothing & Fashion',
      desc: 'Royal silk festive panjabis, combed Supima cotton tees, handloom sarees, and smart formalwear.',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
      link: '/products?category=clothing',
      tag: 'Premium Fabric',
    },
    {
      title: 'Baby & Kids Care',
      desc: 'Hypoallergenic diapers, BPA-free feeding bottles, organic cotton rompers, and pediatric care.',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80',
      link: '/products?category=baby-products',
      tag: 'Gentle & Safe',
    },
    {
      title: 'Home & Living',
      desc: 'Ultrasonic aroma diffusers, vacuum-insulated thermal tumblers, and granite cookware sets.',
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80',
      link: '/products?category=home-living',
      tag: 'Modern Living',
    },
  ];

  const commitments = [
    {
      icon: FiShield,
      title: '100% Genuine Guaranteed',
      desc: 'Zero tolerance for counterfeit items. Every product is sourced directly from authorized distributors and certified importers.',
    },
    {
      icon: FiTruck,
      title: 'Nationwide Delivery',
      desc: 'Express 24-48 hours inside Dhaka (৳60) and 2-4 business days across all 64 districts in Bangladesh (৳120). Free on ৳1,999+.',
    },
    {
      icon: FiRefreshCw,
      title: '7-Day Easy Returns',
      desc: 'Hassle-free replacement or refund policy if an item arrives damaged, defective, or incorrect upon delivery.',
    },
    {
      icon: FiPhone,
      title: 'Dedicated Helpline Support',
      desc: 'Friendly customer service available via call and WhatsApp to assist with product inquiries and real-time order tracking.',
    },
  ];

  return (
    <div className="w-full bg-[#FAF9F5] text-zinc-900 font-sans">
      
      {/* ── 1. Our Story & Purpose Section ── */}
      <section className="py-12 sm:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <ScrollAnimate variant="fade-in-up">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Left Column: Mission & Narrative */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-indigo-200/80 text-[#4F46E5] text-xs font-bold tracking-wider uppercase">
                  <FiShoppingBag className="w-3.5 h-3.5 text-[#4F46E5]" />
                  <span>About NovaMart Bangladesh</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-950 tracking-tight leading-tight">
                  Authentic Quality &amp; Multi-Category Convenience Across Bangladesh
                </h2>

                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">
                  <strong className="text-zinc-950 font-bold">NovaMart</strong> is Bangladesh&apos;s premier multi-category online shopping platform, built with one clear mission: to provide families across Bangladesh with guaranteed genuine products, transparent pricing, and dependable doorstep delivery.
                </p>

                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                  From international dermatological skin care and cutting-edge digital gadgets to luxury perfumes, contemporary lifestyle fashion, and baby care essentials—we eliminate counterfeit risks and unnecessary retail markups by partnering directly with verified brand distributors and authorized importers.
                </p>

                {/* 4 Feature Badges Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-zinc-200/80 shadow-xs">
                    <HiCheckCircle className="w-5 h-5 text-[#4F46E5] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-900">Direct Brand Partnerships</h4>
                      <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                        Authorized distribution channels with 100% authenticity guarantee.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-zinc-200/80 shadow-xs">
                    <HiCheckCircle className="w-5 h-5 text-[#4F46E5] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-900">Quality Inspection</h4>
                      <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                        Every order is sealed and verified before courier dispatch.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-zinc-200/80 shadow-xs">
                    <HiCheckCircle className="w-5 h-5 text-[#4F46E5] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-900">All 64 Districts</h4>
                      <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                        Cash on Delivery available nationwide with live SMS tracking.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-zinc-200/80 shadow-xs">
                    <HiCheckCircle className="w-5 h-5 text-[#4F46E5] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-900">Customer Helpline</h4>
                      <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                        Direct support team ready to assist via call and WhatsApp.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] active:scale-95 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    <span>Browse Catalog</span>
                    <FiArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href="tel:01722301927"
                    className="inline-flex items-center gap-2 bg-white hover:bg-zinc-100 active:scale-95 text-zinc-800 font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl border border-zinc-300 shadow-xs transition-all cursor-pointer"
                  >
                    <FiPhone className="w-4 h-4 text-[#4F46E5]" />
                    <span>Hotline: +880 1722-301927</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Visual Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-zinc-200 bg-zinc-900 aspect-[4/5] sm:aspect-square lg:aspect-[4/5] group">
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80"
                    alt="NovaMart Fulfillment & Operations"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />

                  {/* Bottom Info Card */}
                  <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-white/40 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#3730A3] text-white flex items-center justify-center font-black text-lg shrink-0 shadow-xs">
                        NM
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-950 leading-tight">
                          NovaMart Bangladesh
                        </h4>
                        <p className="text-xs text-zinc-600 mt-0.5">
                          Multi-Category E-Commerce Mart
                        </p>
                        <p className="text-[11px] text-[#4F46E5] font-medium mt-0.5">
                          Banani Corporate Hub, Dhaka-1213
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* ── 2. Operational Standard & Standards Strip ── */}
      <section className="py-12 sm:py-16 bg-[#0B0F17] text-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  <HiShieldCheck className="w-4 h-4 text-[#4F46E5]" />
                  <span>The NovaMart Promise</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Authenticity First, Customer Always
                </h3>

                <p className="text-sm text-zinc-300 leading-relaxed">
                  We believe that online shopping in Bangladesh deserves uncompromised confidence. When you shop on NovaMart, you receive genuine merchandise backed by verifiable manufacturer warranties, protective packaging, transparent return windows, and attentive customer service.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-zinc-800/60 border border-white/5 rounded-xl p-3.5">
                    <h5 className="text-xs font-bold text-white uppercase tracking-wide">
                      100% Genuine
                    </h5>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Batch verified directly from official brand suppliers.
                    </p>
                  </div>

                  <div className="bg-zinc-800/60 border border-white/5 rounded-xl p-3.5">
                    <h5 className="text-xs font-bold text-white uppercase tracking-wide">
                      Fair Pricing
                    </h5>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      No deceptive discounts or hidden checkout fees.
                    </p>
                  </div>

                  <div className="bg-zinc-800/60 border border-white/5 rounded-xl p-3.5">
                    <h5 className="text-xs font-bold text-white uppercase tracking-wide">
                      7-Day Guarantee
                    </h5>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Easy doorstep return and replacement assistance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-indigo-950/30 border border-indigo-500/20 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#4F46E5] text-white flex items-center justify-center shadow-md">
                  <FiPhone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Need Support or Corporate Bulk Order?</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Our team is available daily 9 AM – 10 PM</p>
                </div>
                <a
                  href="tel:01722301927"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Call +880 1722-301927
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Marketplace Departments ── */}
      <section className="py-14 sm:py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5]">
                Product Departments
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight mt-1">
                Explore Our Core Categories
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Curated skin care, digital electronics, luxury perfumes, fashion, and baby essentials.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#4F46E5] hover:text-[#4338CA] transition-colors shrink-0"
            >
              <span>View All Products</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((d, idx) => (
              <Link
                key={idx}
                href={d.link}
                className="group rounded-2xl overflow-hidden bg-white border border-zinc-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-zinc-100">
                  <img
                    src={d.image}
                    alt={d.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-zinc-900/85 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {d.tag}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 group-hover:text-[#4F46E5] transition-colors">
                      {d.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                      {d.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-[#4F46E5]">
                    <span>Browse Category</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Our Commitments ── */}
      <section className="py-14 sm:py-20 bg-white border-y border-zinc-200/80">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5]">
              Why NovaMart
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight mt-1">
              Our Core Service Commitments
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 leading-relaxed">
              Built on transparency, verified authenticity, and reliable customer service across Bangladesh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {commitments.map((c, idx) => {
              const Icon = c.icon;
              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-zinc-50/70 border border-zinc-200/70 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center mb-4 border border-indigo-100">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900 leading-snug mb-1.5">
                      {c.title}
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {c.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
