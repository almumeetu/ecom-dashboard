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
  FiExternalLink,
  FiCheck,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import ScrollAnimate from '@/components/ui/scroll-animate';
import PageBanner from '@/components/ui/page-banner';
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

  const shopName = settings?.shopName?.trim() || 'Trust Point Mart';
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
  const primaryPhone = contactEntries[0]?.value || '01707819676';
  const cleanPhone = primaryPhone.replace(/[^\d+]/g, '') || '01707819676';
  const rawWhatsapp = settings?.socialContact?.whatsapp || primaryPhone;
  const whatsappNumber = rawWhatsapp.replace(/[^\d]/g, '') || '8801707819676';
  const fullWhatsapp = whatsappNumber.startsWith('88')
    ? whatsappNumber
    : `88${whatsappNumber.replace(/^0+/, '')}`;

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const deliveryFaqs = [
    {
      q: 'How fast is delivery in Dhaka and nationwide?',
      a: 'Inside Dhaka Metropolitan, deliveries are completed within Same Day to 24–48 hours. Orders placed before 2:00 PM are prioritized for same-day dispatch. For all other 63 districts across Bangladesh, standard door-to-door delivery takes 2 to 4 business days.',
    },
    {
      q: 'Is Cash on Delivery (COD) supported across all 64 districts?',
      a: 'Yes! We offer 100% Cash on Delivery across all 64 districts and 495+ Upazilas in Bangladesh. You may inspect the outer parcel integrity at your doorstep before handing payment to the delivery rider.',
    },
    {
      q: 'How do you transport fresh Rajshahi mangoes and perishable groceries without damage?',
      a: 'Perishables and seasonal harvests from Mohadevpur, Naogaon and Rajshahi orchards are harvested early morning, packed into heavy-duty ventilated shock-absorbing crates with food-grade cushioning, and transferred through express direct transport routes. We guarantee zero chemical ripening and 100% fresh arrival.',
    },
    {
      q: 'How do I qualify for 100% Free Delivery?',
      a: 'Any single order with a cart subtotal of ৳1,999 or more qualifies for 100% Free Nationwide Delivery automatically at checkout — no promo code or coupon needed.',
    },
    {
      q: 'What should I do if a product is damaged or defective upon arrival?',
      a: 'Under our 7-Day Return & Replacement Guarantee, simply call our support desk at 01707819676 or message our WhatsApp team with a picture of the item. We will arrange a free reverse courier pickup and dispatch an immediate replacement or full refund.',
    },
    {
      q: 'Can I track my parcel live after placing an order?',
      a: 'Yes. As soon as your parcel is packed and handed over to our verified logistics partner, an SMS is automatically dispatched containing your tracking ID and a live real-time tracking link. You can also view real-time status from your Trust Point account under Profile → Orders.',
    },
  ];

  return (
    <div className="w-full bg-[#FAF9F6] text-stone-900 font-sans min-h-screen">
      {/* ── Page Banner ── */}
      <PageBanner
        title="Shipping & Delivery Information"
        subtitle="Prompt, secure, and nationwide delivery for all marketplace categories — fresh groceries, apparel, footwear & lifestyle."
        breadcrumbs={[{ label: 'Delivery Information' }]}
        showTrustChips={true}
      />

      {/* ── Hero / Intro Section ── */}
      <section className="relative w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-10 lg:px-16 overflow-hidden border-b border-stone-200/80">
        {/* Subtle Watermark Pattern */}
        <div
          className="absolute inset-0 z-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: "url('/images/pattern/pattern.png')",
            backgroundRepeat: 'repeat',
            backgroundSize: '160px 160px',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <ScrollAnimate variant="fade-in-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Doorstep Logistics Hub • All 64 Districts</span>
            </div>

            <h1 className="font-['Bembo_Std'] text-3xl sm:text-5xl md:text-6xl text-stone-900 font-normal tracking-wide leading-tight">
              Fast &amp; Secure{' '}
              <span className="font-['Snell_Roundhand_LT_Std'] italic text-emerald-700 lowercase text-4xl sm:text-6xl md:text-7xl -ml-1">
                Delivery
              </span>
            </h1>

            <p className="font-['Bembo_Std'] text-stone-600 text-base sm:text-lg md:text-xl tracking-wide mt-4 font-normal max-w-2xl mx-auto leading-relaxed">
              Prompt, temperature-aware, and nationwide doorstep delivery for all verified orders.
            </p>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto mt-4 font-normal">
              Trust Point offers nationwide delivery across all 64 districts in Bangladesh, ensuring that fresh mangoes, groceries, fashion, and authentic products reach your home safely.
            </p>

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-10 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-stone-200/90 shadow-xs flex flex-col items-center">
                <span className="text-emerald-700 font-bold text-lg sm:text-xl">64 Districts</span>
                <span className="text-stone-500 text-xs font-medium mt-0.5">Nationwide Coverage</span>
              </div>
              <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-stone-200/90 shadow-xs flex flex-col items-center">
                <span className="text-emerald-700 font-bold text-lg sm:text-xl">Same Day / 24h</span>
                <span className="text-stone-500 text-xs font-medium mt-0.5">Within Dhaka</span>
              </div>
              <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-stone-200/90 shadow-xs flex flex-col items-center">
                <span className="text-emerald-700 font-bold text-lg sm:text-xl">FREE ৳1,999+</span>
                <span className="text-stone-500 text-xs font-medium mt-0.5">Zero Delivery Fee</span>
              </div>
              <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-stone-200/90 shadow-xs flex flex-col items-center">
                <span className="text-emerald-700 font-bold text-lg sm:text-xl">7-Day Guarantee</span>
                <span className="text-stone-500 text-xs font-medium mt-0.5">Return &amp; Replacement</span>
              </div>
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* ── Primary Delivery Zones & Timelines (3 Columns) ── */}
      <section className="py-14 sm:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <ScrollAnimate variant="fade-in-up">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">
              Coverage &amp; Schedules
            </span>
            <h2 className="font-['Bembo_Std'] text-3xl sm:text-4xl text-stone-900 mt-1">
              Delivery Zones &amp; Timelines
            </h2>
            <p className="text-stone-500 text-sm mt-2">
              Transparent, reliable transport tailored to urban speed and regional parcel security.
            </p>
          </div>
        </ScrollAnimate>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1: Within Dhaka */}
          <ScrollAnimate variant="fade-in-up">
            <div className="h-full bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 hover:border-emerald-600 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-xs">
                    <FiMapPin className="w-7 h-7" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                    Same Day Available
                  </span>
                </div>

                <h3 className="font-['Bembo_Std'] text-2xl text-stone-900 font-semibold mb-1">
                  Within Dhaka
                </h3>
                <p className="text-emerald-700 font-bold text-base sm:text-lg mb-3">
                  Same Day / 24 – 48 Hours
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-stone-100 text-stone-800 text-xs font-bold mb-4">
                  <span>Standard Rate: {deliveryInside}</span>
                  <span className="text-emerald-600 font-black">• FREE on ৳1,999+</span>
                </div>

                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  Express courier and grocery temperature-controlled transport across greater Dhaka.
                </p>

                <ul className="space-y-2.5 text-xs sm:text-sm text-stone-600 border-t border-stone-100 pt-5">
                  <li className="flex items-start gap-2.5">
                    <FiCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Orders placed before 2:00 PM eligible for same-day dispatch</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <FiCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Dedicated temperature-safe handling for dairy, bakery &amp; farm produce</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <FiCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Direct SMS with rider phone number prior to arrival</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-stone-100">
                <span className="text-[11px] text-stone-400 uppercase tracking-wider block font-medium">
                  Primary Coverage:
                </span>
                <span className="text-xs text-stone-700 font-semibold block mt-1">
                  Uttara, Mirpur, Gulshan, Banani, Dhanmondi, Mohammadpur, Old Dhaka &amp; Motijheel
                </span>
              </div>
            </div>
          </ScrollAnimate>

          {/* Card 2: All Over Bangladesh */}
          <ScrollAnimate variant="fade-in-up">
            <div className="h-full bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 hover:border-emerald-600 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-xs">
                    <FiTruck className="w-7 h-7" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-[11px] font-bold uppercase tracking-wider">
                    All 64 Districts
                  </span>
                </div>

                <h3 className="font-['Bembo_Std'] text-2xl text-stone-900 font-semibold mb-1">
                  All Over Bangladesh
                </h3>
                <p className="text-emerald-700 font-bold text-base sm:text-lg mb-3">
                  2 – 4 Business Days
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-stone-100 text-stone-800 text-xs font-bold mb-4">
                  <span>Standard Rate: {deliveryOutside}</span>
                  <span className="text-emerald-600 font-black">• FREE on ৳1,999+</span>
                </div>

                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  Reliable door-to-door delivery across all divisions via verified partner logistics.
                </p>

                <ul className="space-y-2.5 text-xs sm:text-sm text-stone-600 border-t border-stone-100 pt-5">
                  <li className="flex items-start gap-2.5">
                    <FiCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Nationwide Cash on Delivery (COD) supported in every Thana</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <FiCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Verified courier network: Steadfast, RedX, Pathao &amp; Sundarban</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <FiCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Real-time tracking link with live parcel transit updates</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-stone-100">
                <span className="text-[11px] text-stone-400 uppercase tracking-wider block font-medium">
                  Divisional Hubs:
                </span>
                <span className="text-xs text-stone-700 font-semibold block mt-1">
                  Rajshahi, Chittagong, Sylhet, Khulna, Barishal, Rangpur &amp; Mymensingh
                </span>
              </div>
            </div>
          </ScrollAnimate>

          {/* Card 3: Seasonal Harvests & Perishables */}
          <ScrollAnimate variant="fade-in-up">
            <div className="h-full bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 hover:border-emerald-600 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 shadow-xs">
                    <FiPackage className="w-7 h-7" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-100/70 text-amber-800 text-[11px] font-bold uppercase tracking-wider">
                    Direct From Source
                  </span>
                </div>

                <h3 className="font-['Bembo_Std'] text-2xl text-stone-900 font-semibold mb-1">
                  Seasonal Harvests &amp; Produce
                </h3>
                <p className="text-amber-700 font-bold text-base sm:text-lg mb-3">
                  Direct Orchard Dispatch
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 text-amber-900 text-xs font-bold mb-4">
                  <span>Farm Dispatch: ৳120</span>
                  <span className="text-emerald-700 font-black">• FREE on ৳1,999+</span>
                </div>

                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  Direct-from-source morning harvest, foam-cushioned and climate-conscious dispatch straight to your door.
                </p>

                <ul className="space-y-2.5 text-xs sm:text-sm text-stone-600 border-t border-stone-100 pt-5">
                  <li className="flex items-start gap-2.5">
                    <FiCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>Harvested at peak maturity in Mohadevpur, Naogaon &amp; Rajshahi</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <FiCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>Heavy-duty ventilated crates protect mangoes and fragile bottles</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <FiCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>100% Guaranteed zero carbide, formalin or artificial ripening</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-stone-100">
                <span className="text-[11px] text-stone-400 uppercase tracking-wider block font-medium">
                  Specialty Categories:
                </span>
                <span className="text-xs text-stone-700 font-semibold block mt-1">
                  Rajshahi Mangoes, Sundarban Honey, Cold-Pressed Mustard Oil &amp; Farm Grains
                </span>
              </div>
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* ── Transparent Shipping Rates Table & Free Shipping Banner ── */}
      <section className="py-12 sm:py-16 bg-white border-y border-stone-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">
                Transparent Pricing
              </span>
              <h2 className="font-['Bembo_Std'] text-2xl sm:text-3xl md:text-4xl text-stone-900 mt-1">
                Standard Shipping Rates &amp; Free Delivery
              </h2>
            </div>
            {/* Free Delivery Threshold Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm font-bold">
              <FiCheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Free Delivery On Cart Value ৳1,999 and Above</span>
            </div>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto rounded-xl border border-stone-200 shadow-xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-4 px-4 sm:px-6">Destination Zone</th>
                  <th className="py-4 px-4 sm:px-6">Standard Rate (&lt; ৳1,999)</th>
                  <th className="py-4 px-4 sm:px-6">Orders ৳1,999 &amp; Above</th>
                  <th className="py-4 px-4 sm:px-6">Estimated Transit Time</th>
                  <th className="py-4 px-4 sm:px-6">Payment Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                <tr className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-4 px-4 sm:px-6 font-semibold text-stone-900">
                    Dhaka Metro &amp; Uttara
                  </td>
                  <td className="py-4 px-4 sm:px-6">{deliveryInside}</td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                      100% FREE
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-stone-600">Same Day / 24–48 Hours</td>
                  <td className="py-4 px-4 sm:px-6 text-stone-500">COD, bKash, Nagad, Cards</td>
                </tr>
                <tr className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-4 px-4 sm:px-6 font-semibold text-stone-900">
                    Greater Dhaka (Gazipur, Savar, Narayanganj)
                  </td>
                  <td className="py-4 px-4 sm:px-6">{deliveryNearCity}</td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                      100% FREE
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-stone-600">24–48 Hours</td>
                  <td className="py-4 px-4 sm:px-6 text-stone-500">COD, bKash, Nagad, Cards</td>
                </tr>
                <tr className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-4 px-4 sm:px-6 font-semibold text-stone-900">
                    All 64 Districts (Outside Dhaka)
                  </td>
                  <td className="py-4 px-4 sm:px-6">{deliveryOutside}</td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                      100% FREE
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-stone-600">2–4 Business Days</td>
                  <td className="py-4 px-4 sm:px-6 text-stone-500">COD, bKash, Nagad, Cards</td>
                </tr>
                <tr className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-4 px-4 sm:px-6 font-semibold text-stone-900">
                    Seasonal Rajshahi Mangoes (10kg–20kg Crate)
                  </td>
                  <td className="py-4 px-4 sm:px-6">৳120 per crate</td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                      100% FREE
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-stone-600">24–48 Hours Direct Courier</td>
                  <td className="py-4 px-4 sm:px-6 text-stone-500">COD, bKash, Nagad</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 4-Stage Fulfillment Lifecycle ── */}
      <section className="py-14 sm:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">
            Step-by-Step Transparency
          </span>
          <h2 className="font-['Bembo_Std'] text-3xl sm:text-4xl text-stone-900 mt-1">
            How Your Order Travels to You
          </h2>
          <p className="text-stone-500 text-sm mt-2">
            From verified harvest and warehouse inspection to your doorstep in 4 clear stages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-3xl font-black text-emerald-600/30 block mb-2 font-mono">
                01
              </span>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Order Verification &amp; Farm Picking
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                As soon as your order is confirmed, our central hub in Mohadevpur or verified vendor partner reserves your items. Orders before 2 PM enter the daily queue immediately.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <FiCheckCircle className="w-4 h-4" />
              <span>Instant SMS Confirmation</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-3xl font-black text-emerald-600/30 block mb-2 font-mono">
                02
              </span>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                QC &amp; Protective Packaging
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                Every unit is checked for freshness, expiration dates, and authenticity. Delicate items receive multi-layer air cushioning, moisture seals, and anti-tamper tape.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <FiShield className="w-4 h-4" />
              <span>100% Quality Inspected</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-3xl font-black text-emerald-600/30 block mb-2 font-mono">
                03
              </span>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Courier Handover &amp; Live Tracking
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                Parcels are routed through our verified logistics partners (Steadfast, RedX, Pathao, Sundarban). A tracking link is dispatched straight to your registered phone.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <FiClock className="w-4 h-4" />
              <span>Live SMS Parcel Tracking</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-3xl font-black text-emerald-600/30 block mb-2 font-mono">
                04
              </span>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Doorstep Delivery &amp; 7-Day Protection
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                Your rider contacts you upon arrival. Inspect the parcel exterior before paying COD. You enjoy our complete 7-Day Return and Replacement safety net.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <FiRefreshCw className="w-4 h-4" />
              <span>7-Day Return Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7-Day Return & Exchange Commitment ── */}
      <section className="py-12 sm:py-16 bg-stone-100/70 border-y border-stone-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="bg-white rounded-3xl p-8 sm:p-12 md:p-14 border border-stone-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider inline-block mb-3">
                Buyer Protection Guarantee
              </span>
              <h2 className="font-['Bembo_Std'] text-2xl sm:text-3xl md:text-4xl text-stone-900 font-semibold mb-3">
                7-Day Hassle-Free Return &amp; Exchange
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6">
                If any product arrives damaged in transit, with an expired batch code, or does not match your ordered specifications, we will replace it immediately or issue a 100% full refund. Zero return delivery charges for defective items.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-2 text-xs text-stone-700">
                  <FiCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Doorstep reverse pickup in Dhaka</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-stone-700">
                  <FiCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Free courier return across 64 districts</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-stone-700">
                  <FiCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Refund within 24–48h via bKash/Bank</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
              <a
                href="tel:01707819676"
                className="px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm tracking-wide text-center transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <FiPhone className="w-4 h-4" />
                <span>Call Support: 01707819676</span>
              </a>
              <a
                href="https://wa.me/8801707819676?text=Hello%20Trust%20Point%20Delivery%20Support%2C%20I%20need%20assistance%20with%20my%20delivery."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm tracking-wide text-center transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <FaWhatsapp className="w-4 h-4" />
                <span>WhatsApp Return Support</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Live Tracking & Support Hub Cards ── */}
      <section className="py-14 sm:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Track Order */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <FiPackage className="w-6 h-6" />
              </div>
              <h3 className="text-xs uppercase font-bold text-stone-400 tracking-wider">
                Self Service
              </h3>
              <h4 className="text-base font-bold text-stone-900 mt-1">Track Ongoing Order</h4>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                Log in to check live progress, courier consignment numbers, and estimated delivery dates.
              </p>
            </div>
            <Link
              href="/profile?tab=track"
              className="mt-6 text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1.5"
            >
              <span>Track Your Order</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: 24/7 Helpline */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <FiPhone className="w-6 h-6" />
              </div>
              <h3 className="text-xs uppercase font-bold text-stone-400 tracking-wider">
                Support Hotline
              </h3>
              <h4 className="text-base font-bold text-stone-900 mt-1">01707819676</h4>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                Immediate phone support for urgent address updates, courier coordination, or questions.
              </p>
            </div>
            <a
              href="tel:01707819676"
              className="mt-6 text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5"
            >
              <span>Call Support Now</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 3: WhatsApp Support */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
                <FaWhatsapp className="w-6 h-6" />
              </div>
              <h3 className="text-xs uppercase font-bold text-stone-400 tracking-wider">
                Instant Chat
              </h3>
              <h4 className="text-base font-bold text-stone-900 mt-1">WhatsApp Live Support</h4>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                Fast responses for delivery time inquiries, photo verifications, and instant updates.
              </p>
            </div>
            <a
              href="https://wa.me/8801707819676"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 text-xs font-bold text-green-600 hover:text-green-700 inline-flex items-center gap-1.5"
            >
              <span>Chat on WhatsApp</span>
              <FiExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 4: Dispatch Hub */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <FiMapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xs uppercase font-bold text-stone-400 tracking-wider">
                Logistics Center
              </h3>
              <h4 className="text-base font-bold text-stone-900 mt-1">Mohadevpur, Naogaon</h4>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                Direct regional distribution hub in Rajshahi Division with express dispatch links across Bangladesh.
              </p>
            </div>
            <Link
              href="/about"
              className="mt-6 text-xs font-bold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1.5"
            >
              <span>Learn About Our Hub</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Shipping & Delivery FAQ Accordion ── */}
      <section className="py-14 sm:py-20 bg-white border-t border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-12">
            <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">
              Answers &amp; Clarity
            </span>
            <h2 className="font-['Bembo_Std'] text-3xl sm:text-4xl text-stone-900 mt-1">
              Frequently Asked Delivery Questions
            </h2>
            <p className="text-stone-500 text-sm mt-2">
              Everything you need to know about our packaging, coverage, timelines, and costs.
            </p>
          </div>

          <div className="space-y-3.5">
            {deliveryFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-stone-200 bg-stone-50/50 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
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
        </div>
      </section>

      {/* ── Bottom CTA Banner ── */}
      <section className="py-14 sm:py-20 bg-[#FAF9F6] border-t border-stone-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 text-center">
          <h2 className="font-['Bembo_Std'] text-3xl sm:text-4xl text-stone-900 mb-3">
            Ready to Experience Fresh &amp; Authentic Delivery?
          </h2>
          <p className="text-stone-500 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Browse our full catalog of farm-fresh groceries, Rajshahi mangoes, executive apparel, footwear, and lifestyle essentials.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-sm"
            >
              Browse All Products
            </Link>
            <Link
              href="/corporate-order"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-bold text-xs sm:text-sm tracking-wide transition-all shadow-xs"
            >
              Corporate &amp; Bulk Orders
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
