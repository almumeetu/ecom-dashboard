'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiTruck,
  FiMapPin,
  FiClock,
  FiPhone,
  FiPackage,
  FiShield,
  FiCheckCircle,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
  FiArrowRight,
  FiCheck,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import ScrollAnimate from '@/components/ui/scroll-animate';
import PageBanner from '@/components/ui/page-banner';
import PolicyNav from '@/components/sections/policy/policy-nav';
import {
  fetchShopSettings,
  parseContactEntries,
  fetchStorePolicies,
  type ShopSettings,
  type StorePolicies,
} from '@/lib/shop-api';

export default function DeliveryPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [policies, setPolicies] = useState<StorePolicies | null>(null);

  useEffect(() => {
    fetchShopSettings().then((s) => {
      if (s) setSettings(s);
    });
    fetchStorePolicies().then((p) => {
      if (p) setPolicies(p);
    });
  }, []);

  const shopName = settings?.shopName?.trim() || 'NovaMart';
  const deliveryInside =
    settings?.deliveryChargeInside !== undefined && settings?.deliveryChargeInside !== null
      ? Number(settings.deliveryChargeInside) === 0
        ? 'FREE'
        : `৳${settings.deliveryChargeInside}`
      : '৳60';
  const deliveryOutside =
    settings?.deliveryChargeOutside !== undefined && settings?.deliveryChargeOutside !== null
      ? Number(settings.deliveryChargeOutside) === 0
        ? 'FREE'
        : `৳${settings.deliveryChargeOutside}`
      : '৳120';
  const deliveryNearCity =
    settings?.deliveryChargeNearCity !== undefined && settings?.deliveryChargeNearCity !== null
      ? Number(settings.deliveryChargeNearCity) === 0
        ? 'FREE'
        : `৳${settings.deliveryChargeNearCity}`
      : '৳80';

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

  const deliveryFaqs = [
    {
      q: 'How fast is delivery in Dhaka and nationwide across Bangladesh?',
      a: 'Inside Dhaka Metropolitan, deliveries are completed within Same Day to 24–48 hours. Orders placed before 2:00 PM are prioritized for express same-day dispatch. For all other 63 districts across Bangladesh, standard door-to-door delivery takes 2 to 4 business days.',
    },
    {
      q: 'Is Cash on Delivery (COD) supported across all 64 districts?',
      a: 'Yes! We offer 100% Cash on Delivery across all 64 districts and 495+ Upazilas in Bangladesh. You may inspect the outer parcel integrity at your doorstep before handing payment to the delivery rider.',
    },
    {
      q: 'How are sensitive skin care, perfumes, and digital electronics packaged?',
      a: 'All fragile and sensitive items—including liquid serums, perfumes, glass bottles, and electronic gadgets—are packed with multi-layer bubble wrap, moisture-resistant sealing, and shock-absorbing corrugated boxes with tamper-evident security tape.',
    },
    {
      q: 'How do I qualify for 100% Free Nationwide Delivery?',
      a: 'Any single order with a cart subtotal of ৳1,999 or more qualifies for 100% Free Delivery automatically at checkout — no promo code or coupon needed.',
    },
    {
      q: 'What should I do if a product is damaged or defective upon arrival?',
      a: `Under our 7-Day Return & Replacement Guarantee, simply call our support desk at ${primaryPhone} or message our WhatsApp team with a picture of the item. We will arrange a free reverse courier pickup and dispatch an immediate replacement or full refund.`,
    },
    {
      q: 'Can I track my parcel live after placing an order?',
      a: 'Yes. As soon as your parcel is packed and handed over to our verified logistics partner, an SMS is automatically dispatched containing your tracking ID and a live real-time tracking link. You can also view real-time status from your NovaMart account under Profile → Orders.',
    },
  ];

  return (
    <div className="w-full bg-[#FAF9F5] text-zinc-900 font-sans min-h-screen">
      {/* ── Page Banner ── */}
      <PageBanner
        title="Delivery & Shipping Rates"
        subtitle="Prompt, secure, and nationwide delivery for all marketplace categories — skin care, digital electronics, luxury perfumes, fashion & baby products."
        breadcrumbs={[
          { label: 'Customer Care', href: '/contact' },
          { label: 'Delivery & Shipping' },
        ]}
        showTrustChips={true}
      />

      {/* ── Sticky Policy Navigation ── */}
      <PolicyNav currentKey="delivery" />

      {/* ── 1. Hero / Coverage Summary ── */}
      <section className="py-10 sm:py-14 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <ScrollAnimate variant="fade-in-up">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200/80 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-indigo-200/80 text-[#4F46E5] text-xs font-bold uppercase tracking-wider">
                  <FiTruck className="w-3.5 h-3.5 text-[#4F46E5]" />
                  <span>Nationwide Logistics Network • 64 Districts</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0B132B] tracking-tight leading-tight">
                  Fast, Reliable &amp; Insured Doorstep Delivery
                </h1>

                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-3xl">
                  NovaMart partners with verified nationwide logistics networks including Steadfast, RedX, and Pathao to guarantee rapid delivery across all 64 districts in Bangladesh with real-time SMS tracking and 100% Cash on Delivery support.
                </p>

                {/* Free shipping callout pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-[#EA580C] text-xs sm:text-sm font-bold">
                  <FiCheckCircle className="w-4 h-4 text-[#EA580C]" />
                  <span>Free Nationwide Delivery on all orders over ৳1,999</span>
                </div>
              </div>

              {/* Quick Contact Box */}
              <div className="lg:col-span-4 bg-zinc-50 rounded-2xl p-5 border border-zinc-200/80 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Delivery Inquiries &amp; Live Tracking
                </h3>
                <div className="text-xs text-zinc-700 space-y-1.5">
                  <p className="font-semibold text-zinc-900">Banani Central Fulfillment Hub</p>
                  <p>Daily Dispatch: 9:00 AM – 7:00 PM</p>
                  <p>Hotline: <strong className="text-[#4F46E5]">{primaryPhone}</strong></p>
                </div>
                <div className="pt-1 flex flex-col sm:flex-row lg:flex-col gap-2">
                  <Link
                    href="/profile?tab=track"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold text-center transition-all shadow-xs"
                  >
                    Track Your Parcel
                  </Link>
                  <a
                    href={`https://wa.me/${fullWhatsapp}?text=Hello%20NovaMart%2C%20I%20have%20a%20question%20about%20my%20delivery.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-bold text-center border border-zinc-300 transition-all flex items-center justify-center gap-2"
                  >
                    <FaWhatsapp className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>WhatsApp Courier Desk</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 4 Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-zinc-100">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 text-center">
                <span className="text-lg sm:text-xl font-extrabold text-[#4F46E5] block">64 Districts</span>
                <span className="text-xs text-zinc-500 block mt-0.5">Nationwide Doorstep Coverage</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 text-center">
                <span className="text-lg sm:text-xl font-extrabold text-[#4F46E5] block">24 – 48 Hours</span>
                <span className="text-xs text-zinc-500 block mt-0.5">Dhaka Metro Express</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 text-center">
                <span className="text-lg sm:text-xl font-extrabold text-[#EA580C] block">FREE on ৳1,999+</span>
                <span className="text-xs text-zinc-500 block mt-0.5">Zero Shipping Cost</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 text-center">
                <span className="text-lg sm:text-xl font-extrabold text-[#4F46E5] block">7-Day Protection</span>
                <span className="text-xs text-zinc-500 block mt-0.5">Free Return &amp; Replacement</span>
              </div>
            </div>
          </div>
        </ScrollAnimate>
      </section>

      {/* ── 2. Primary Delivery Zones (3 Columns) ── */}
      <section className="py-6 sm:py-8 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5]">
            Coverage &amp; Schedules
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight mt-1">
            Delivery Zones &amp; Shipping Timelines
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Transparent flat-rate shipping tailored for urban speed and regional courier safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Dhaka Metro */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:border-[#4F46E5] hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center border border-indigo-100">
                  <FiMapPin className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-[#4F46E5] text-[11px] font-bold uppercase tracking-wider">
                  Express Route
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#0B132B] mb-0.5">
                Inside Dhaka Metro
              </h3>
              <p className="text-[#4F46E5] font-extrabold text-sm mb-3">
                Same Day / 24 – 48 Hours
              </p>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-100 text-zinc-800 text-xs font-bold mb-4">
                <span>Standard Fee: {deliveryInside}</span>
                <span className="text-[#EA580C] font-black">• FREE on ৳1,999+</span>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                Fast courier dispatch across all major Dhaka residential and commercial sectors.
              </p>

              <ul className="space-y-2 text-xs text-zinc-600 border-t border-zinc-100 pt-4">
                <li className="flex items-start gap-2">
                  <FiCheck className="w-3.5 h-3.5 text-[#4F46E5] shrink-0 mt-0.5" />
                  <span>Orders before 2:00 PM eligible for same-day dispatch</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="w-3.5 h-3.5 text-[#4F46E5] shrink-0 mt-0.5" />
                  <span>Protective bubble wrapping for fragile cosmetics &amp; perfumes</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="w-3.5 h-3.5 text-[#4F46E5] shrink-0 mt-0.5" />
                  <span>Direct phone confirmation by delivery rider prior to arrival</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-3 border-t border-zinc-100 text-[11px] text-zinc-500">
              <strong className="text-zinc-700">Hub Areas:</strong> Banani, Gulshan, Uttara, Dhanmondi, Mirpur, Motijheel, Mohammadpur.
            </div>
          </div>

          {/* Card 2: Greater Dhaka Suburbs */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:border-[#4F46E5] hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center border border-indigo-100">
                  <FiTruck className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 text-[11px] font-bold uppercase tracking-wider">
                  Suburban Route
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#0B132B] mb-0.5">
                Greater Dhaka Suburbs
              </h3>
              <p className="text-[#4F46E5] font-extrabold text-sm mb-3">
                24 – 48 Hours
              </p>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-100 text-zinc-800 text-xs font-bold mb-4">
                <span>Standard Fee: {deliveryNearCity}</span>
                <span className="text-[#EA580C] font-black">• FREE on ৳1,999+</span>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                Direct daily connection to surrounding manufacturing and residential hubs.
              </p>

              <ul className="space-y-2 text-xs text-zinc-600 border-t border-zinc-100 pt-4">
                <li className="flex items-start gap-2">
                  <FiCheck className="w-3.5 h-3.5 text-[#4F46E5] shrink-0 mt-0.5" />
                  <span>Daily scheduled courier runs across suburban districts</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="w-3.5 h-3.5 text-[#4F46E5] shrink-0 mt-0.5" />
                  <span>Cash on Delivery supported at your door or workplace</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="w-3.5 h-3.5 text-[#4F46E5] shrink-0 mt-0.5" />
                  <span>Real-time SMS updates with rider contact number</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-3 border-t border-zinc-100 text-[11px] text-zinc-500">
              <strong className="text-zinc-700">Hub Areas:</strong> Gazipur, Savar, Narayanganj, Tongi, Keraniganj, Ashulia.
            </div>
          </div>

          {/* Card 3: All 64 Districts Nationwide */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:border-[#4F46E5] hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center border border-orange-100">
                  <FiPackage className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-orange-100 text-[#EA580C] text-[11px] font-bold uppercase tracking-wider">
                  All 64 Districts
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#0B132B] mb-0.5">
                All Over Bangladesh
              </h3>
              <p className="text-[#4F46E5] font-extrabold text-sm mb-3">
                2 – 4 Business Days
              </p>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-100 text-zinc-800 text-xs font-bold mb-4">
                <span>Standard Fee: {deliveryOutside}</span>
                <span className="text-[#EA580C] font-black">• FREE on ৳1,999+</span>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                Secure nationwide doorstep delivery to every Thana and Upazila via Steadfast &amp; RedX.
              </p>

              <ul className="space-y-2 text-xs text-zinc-600 border-t border-zinc-100 pt-4">
                <li className="flex items-start gap-2">
                  <FiCheck className="w-3.5 h-3.5 text-[#4F46E5] shrink-0 mt-0.5" />
                  <span>Nationwide Cash on Delivery (COD) supported in all Upazilas</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="w-3.5 h-3.5 text-[#4F46E5] shrink-0 mt-0.5" />
                  <span>Corrugated shockproof box packaging for electronic devices</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="w-3.5 h-3.5 text-[#4F46E5] shrink-0 mt-0.5" />
                  <span>Real-time tracking link sent via SMS upon courier dispatch</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-3 border-t border-zinc-100 text-[11px] text-zinc-500">
              <strong className="text-zinc-700">Divisions:</strong> Chittagong, Sylhet, Rajshahi, Khulna, Barishal, Rangpur, Mymensingh.
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Transparent Shipping Rates Table ── */}
      <section className="py-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5]">
                Clear Pricing
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B132B] mt-0.5">
                Standard Shipping Rates &amp; Free Delivery Policy
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#EEF2FF] border border-indigo-200 text-[#4F46E5] text-xs font-bold">
              <FiCheckCircle className="w-4 h-4 text-[#4F46E5]" />
              <span>Free Delivery Threshold: ৳1,999+</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-200 shadow-2xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-700 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6">Destination Zone</th>
                  <th className="py-3.5 px-4 sm:px-6">Orders &lt; ৳1,999</th>
                  <th className="py-3.5 px-4 sm:px-6">Orders ৳1,999 &amp; Above</th>
                  <th className="py-3.5 px-4 sm:px-6">Estimated Transit</th>
                  <th className="py-3.5 px-4 sm:px-6">Payment Supported</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                <tr className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-zinc-950">
                    Dhaka Metro (All Thanas)
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold">{deliveryInside}</td>
                  <td className="py-3.5 px-4 sm:px-6">
                    <span className="inline-flex px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs">
                      100% FREE
                    </span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-zinc-600">Same Day / 24–48 Hours</td>
                  <td className="py-3.5 px-4 sm:px-6 text-zinc-500">Cash on Delivery, bKash, Cards</td>
                </tr>
                <tr className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-zinc-950">
                    Greater Dhaka (Gazipur, Savar, Narayanganj)
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold">{deliveryNearCity}</td>
                  <td className="py-3.5 px-4 sm:px-6">
                    <span className="inline-flex px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs">
                      100% FREE
                    </span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-zinc-600">24–48 Hours</td>
                  <td className="py-3.5 px-4 sm:px-6 text-zinc-500">Cash on Delivery, bKash, Cards</td>
                </tr>
                <tr className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-zinc-950">
                    All 64 Districts (Outside Dhaka)
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold">{deliveryOutside}</td>
                  <td className="py-3.5 px-4 sm:px-6">
                    <span className="inline-flex px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs">
                      100% FREE
                    </span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-zinc-600">2–4 Business Days</td>
                  <td className="py-3.5 px-4 sm:px-6 text-zinc-500">Cash on Delivery, bKash, Cards</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 4. 4-Stage Fulfillment Lifecycle ── */}
      <section className="py-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="mb-8 text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5]">
            Transparency &amp; Care
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] mt-1">
            How Your Order Travels to You
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Every order is inspected, protected, tracked, and safely handed over to your doorstep.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-2xl font-black text-[#4F46E5]/30 block mb-2 font-mono">01</span>
              <h3 className="text-sm font-bold text-zinc-900 mb-1.5">Order Verification</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                As soon as your order is confirmed, our Banani central hub reserves authentic items directly from stock.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-bold text-[#4F46E5]">
              <FiCheckCircle className="w-3.5 h-3.5" />
              <span>Instant SMS Confirmation</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-2xl font-black text-[#4F46E5]/30 block mb-2 font-mono">02</span>
              <h3 className="text-sm font-bold text-zinc-900 mb-1.5">QC &amp; Sealed Packaging</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Items are checked for seal integrity and batch codes, then enclosed in multi-layer shockproof bubble wrap.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-bold text-[#4F46E5]">
              <FiShield className="w-3.5 h-3.5" />
              <span>100% Quality Inspected</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-2xl font-black text-[#4F46E5]/30 block mb-2 font-mono">03</span>
              <h3 className="text-sm font-bold text-zinc-900 mb-1.5">Courier Handover &amp; SMS</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Parcels are handed over to express couriers. A tracking ID link is sent straight to your phone.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-bold text-[#4F46E5]">
              <FiClock className="w-3.5 h-3.5" />
              <span>Live Real-Time Tracking</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-2xl font-black text-[#4F46E5]/30 block mb-2 font-mono">04</span>
              <h3 className="text-sm font-bold text-zinc-900 mb-1.5">Doorstep COD &amp; Protection</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Inspect parcel exterior before paying COD. You are covered by our 7-Day Return &amp; Replacement policy.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-bold text-[#4F46E5]">
              <FiRefreshCw className="w-3.5 h-3.5" />
              <span>7-Day Return Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. FAQs Accordion ── */}
      <section className="py-10 sm:py-14 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5]">
            Have Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] mt-1">
            Frequently Asked Delivery Questions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Answers regarding dispatch, payment options, and nationwide coverage.
          </p>
        </div>

        <div className="space-y-3">
          {deliveryFaqs.map((faq, index) => {
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

        {/* Still have questions? Help Banner */}
        <div className="mt-10 p-6 rounded-3xl bg-zinc-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold">Still have delivery questions?</h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Our NovaMart customer support team is available daily 9 AM – 10 PM.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`tel:${cleanPhone}`}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs transition-colors flex items-center gap-2"
            >
              <FiPhone className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span>{primaryPhone}</span>
            </a>
            <a
              href={`https://wa.me/${fullWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs transition-colors flex items-center gap-2"
            >
              <FaWhatsapp className="w-3.5 h-3.5 text-white" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
