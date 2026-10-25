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
  const primaryPhone = contactEntries[0]?.value || '+880 1722-301927';
  const cleanPhone = primaryPhone.replace(/[^\d+]/g, '') || '01722301927';
  const rawWhatsapp = settings?.socialContact?.whatsapp || primaryPhone;
  const whatsappNumber = rawWhatsapp.replace(/[^\d]/g, '') || '8801722301927';
  const fullWhatsapp = whatsappNumber.startsWith('88')
    ? whatsappNumber
    : `88${whatsappNumber.replace(/^0+/, '')}`;

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const deliveryFaqs = [
    {
      q: 'Where can I find delivery options and estimates?',
      a: 'Available delivery options and estimated delivery times depend on your address. Review the current details during checkout before placing your order.',
    },
    {
      q: 'Which payment methods are available?',
      a: 'Available payment methods are shown during checkout for your order.',
    },
    {
      q: 'Where can I review delivery charges?',
      a: 'Delivery charges depend on your delivery address and are displayed during checkout.',
    },
    {
      q: 'Can delivery charges vary by location?',
      a: 'Yes. The applicable options and charges are based on the delivery address entered for your order.',
    },
    {
      q: 'What if I have a question about delivery?',
      a: `Contact our support team at ${primaryPhone} for help with delivery questions.`,
    },
    {
      q: 'Where can I check my order status?',
      a: 'Sign in to your account and open your orders to view available order updates.',
    },
  ];

  return (
    <div className="w-full bg-store-page text-zinc-900 font-sans min-h-screen">
      {/* ── Page Banner ── */}
      <PageBanner
        title="Delivery Information"
        subtitle="Review delivery options and charges for your order."
        breadcrumbs={[
          { label: 'Customer Care', href: '/contact' },
          { label: 'Delivery & Shipping' },
        ]}
        showTrustChips={false}
      />

      {/* ── Sticky Policy Navigation ── */}
      <PolicyNav currentKey="delivery" />

      {/* ── 1. Hero / Coverage Summary ── */}
      <section className="py-10 sm:py-14 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <ScrollAnimate variant="fade-in-up">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200/80 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-store-surface border border-store-border/80 text-store-primary text-xs font-bold uppercase tracking-wider">
                  <FiTruck className="w-3.5 h-3.5 text-store-primary" />
                  <span>Delivery options and charges</span>
                </div>

                <h2 className="text-2xl font-semibold leading-tight tracking-tight text-store-ink sm:text-4xl">
                  Delivery options for your order
                </h2>

                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-3xl">
                  Available delivery services and charges depend on the address entered for your order. Review the current details during checkout.
                </p>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-[#8B4F2B] text-xs sm:text-sm font-bold">
                  <FiCheckCircle className="w-4 h-4 text-[#8B4F2B]" />
                  <span>Delivery charges are shown during checkout</span>
                </div>
              </div>

              {/* Quick Contact Box */}
              <div className="lg:col-span-4 bg-zinc-50 rounded-2xl p-5 border border-zinc-200/80 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Delivery questions
                </h3>
                <div className="text-xs text-zinc-700 space-y-1.5">
                  <p className="font-semibold text-zinc-900">Contact customer support</p>
                  <p>Hotline: <strong className="text-store-primary">{primaryPhone}</strong></p>
                </div>
                <div className="pt-1 flex flex-col sm:flex-row lg:flex-col gap-2">
                  <Link
                    href="/profile?tab=track"
                    className="w-full py-2.5 px-4 rounded-xl bg-store-primary hover:bg-store-hover text-white text-xs font-bold text-center transition-all shadow-xs"
                  >
                    View Your Orders
                  </Link>
                  <a
                    href={`https://wa.me/${fullWhatsapp}?text=Hello%20NovaMart%2C%20I%20have%20a%20question%20about%20my%20delivery.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-bold text-center border border-zinc-300 transition-all flex items-center justify-center gap-2"
                  >
                    <FaWhatsapp className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>Contact Support</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 4 Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-zinc-100">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 text-center">
                <span className="text-lg sm:text-xl font-extrabold text-store-primary block">Delivery</span>
                <span className="text-xs text-zinc-500 block mt-0.5">Options shown at checkout</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 text-center">
                <span className="text-lg sm:text-xl font-extrabold text-store-primary block">Charges</span>
                <span className="text-xs text-zinc-500 block mt-0.5">Based on your address</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 text-center">
                <span className="text-lg sm:text-xl font-extrabold text-[#8B4F2B] block">Payment</span>
                <span className="text-xs text-zinc-500 block mt-0.5">Options shown at checkout</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 text-center">
                <span className="text-lg sm:text-xl font-extrabold text-store-primary block">Support</span>
                <span className="text-xs text-zinc-500 block mt-0.5">Contact details below</span>
              </div>
            </div>
          </div>
        </ScrollAnimate>
      </section>

      {/* ── 2. Primary Delivery Zones (3 Columns) ── */}
      <section className="py-6 sm:py-8 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-store-primary">
            Delivery details
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-store-ink tracking-tight mt-1">
            Delivery areas and charges
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Available areas and charges are confirmed during checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Dhaka Metro */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:border-store-primary hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-store-surface text-store-primary flex items-center justify-center border border-store-border">
                  <FiMapPin className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-store-surface text-store-primary text-[11px] font-bold uppercase tracking-wider">
                  Dhaka
                </span>
              </div>

              <h3 className="text-lg font-bold text-store-ink mb-0.5">
                Inside Dhaka Metro
              </h3>
              <p className="text-store-primary font-extrabold text-sm mb-3">
                Delivery fee: {deliveryInside}
              </p>

              <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                Delivery availability and timing may vary by address.
              </p>

              <ul className="space-y-2 text-xs text-zinc-600 border-t border-zinc-100 pt-4">
                <li className="flex items-start gap-2">
                  <FiCheck className="w-3.5 h-3.5 text-store-primary shrink-0 mt-0.5" />
                  <span>Check delivery details during checkout</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="w-3.5 h-3.5 text-store-primary shrink-0 mt-0.5" />
                  <span>Available delivery options are shown with your order</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="w-3.5 h-3.5 text-store-primary shrink-0 mt-0.5" />
                  <span>Contact support if you have a delivery question</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-3 border-t border-zinc-100 text-[11px] text-zinc-500">
            Delivery details depend on the address entered at checkout.
            </div>
          </div>

          {/* Card 2: Greater Dhaka Suburbs */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:border-store-primary hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-store-surface text-store-primary flex items-center justify-center border border-store-border">
                  <FiTruck className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 text-[11px] font-bold uppercase tracking-wider">
                  Nearby areas
                </span>
              </div>

              <h3 className="text-lg font-bold text-store-ink mb-0.5">
                Greater Dhaka Suburbs
              </h3>
              <p className="text-store-primary font-extrabold text-sm mb-3">
                Delivery fee: {deliveryNearCity}
              </p>

              <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                Delivery availability and timing may vary by address.
              </p>

              <ul className="space-y-2 text-xs text-zinc-600 border-t border-zinc-100 pt-4">
                <li className="flex items-start gap-2">
                  <FiCheck className="w-3.5 h-3.5 text-store-primary shrink-0 mt-0.5" />
                  <span>Check delivery details during checkout</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="w-3.5 h-3.5 text-store-primary shrink-0 mt-0.5" />
                  <span>Available payment methods are shown at checkout</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="w-3.5 h-3.5 text-store-primary shrink-0 mt-0.5" />
                  <span>Order updates are available from your account</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-3 border-t border-zinc-100 text-[11px] text-zinc-500">
              Delivery details depend on the address entered at checkout.
            </div>
          </div>

          {/* Card 3: Outside Dhaka */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:border-store-primary hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#8B4F2B] flex items-center justify-center border border-orange-100">
                  <FiPackage className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-orange-100 text-[#8B4F2B] text-[11px] font-bold uppercase tracking-wider">
                  Other locations
                </span>
              </div>

              <h3 className="text-lg font-bold text-store-ink mb-0.5">
                Outside Dhaka
              </h3>
              <p className="text-store-primary font-extrabold text-sm mb-3">
                Delivery fee: {deliveryOutside}
              </p>

              <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                Delivery availability and timing may vary by address.
              </p>

              <ul className="space-y-2 text-xs text-zinc-600 border-t border-zinc-100 pt-4">
                <li className="flex items-start gap-2">
                  <FiCheck className="w-3.5 h-3.5 text-store-primary shrink-0 mt-0.5" />
                  <span>Check delivery details during checkout</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="w-3.5 h-3.5 text-store-primary shrink-0 mt-0.5" />
                  <span>Available payment methods are shown at checkout</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="w-3.5 h-3.5 text-store-primary shrink-0 mt-0.5" />
                  <span>Order updates are available from your account</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-3 border-t border-zinc-100 text-[11px] text-zinc-500">
              Delivery details depend on the address entered at checkout.
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Transparent Shipping Rates Table ── */}
      <section className="py-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-store-primary">
                Clear Pricing
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-store-ink mt-0.5">
                Delivery charges
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-store-surface border border-store-border text-store-primary text-xs font-bold">
              <FiCheckCircle className="w-4 h-4 text-store-primary" />
              <span>Current delivery fees</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-200 shadow-2xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-700 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6">Destination Zone</th>
                  <th className="py-3.5 px-4 sm:px-6">Current delivery fee</th>
                  <th className="py-3.5 px-4 sm:px-6">Delivery details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                <tr className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-zinc-950">
                    Dhaka Metro (All Thanas)
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold">{deliveryInside}</td>
                  <td className="py-3.5 px-4 sm:px-6 text-zinc-600">See available options during checkout</td>
                </tr>
                <tr className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-zinc-950">
                    Greater Dhaka (Gazipur, Savar, Narayanganj)
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold">{deliveryNearCity}</td>
                  <td className="py-3.5 px-4 sm:px-6 text-zinc-600">See available options during checkout</td>
                </tr>
                <tr className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-zinc-950">
                    Outside Dhaka
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 font-semibold">{deliveryOutside}</td>
                  <td className="py-3.5 px-4 sm:px-6 text-zinc-600">See available options during checkout</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

        {/* ── 4. Order overview ── */}
      <section className="py-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="mb-8 text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-store-primary">
            Order information
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-store-ink mt-1">
            Order and delivery overview
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Review your order details and check your account for available updates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-2xl font-black text-store-primary/30 block mb-2 font-mono">01</span>
              <h3 className="text-sm font-bold text-zinc-900 mb-1.5">Place your order</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Review your items, delivery address, and applicable charges before confirming your order.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-bold text-store-primary">
              <FiCheckCircle className="w-3.5 h-3.5" />
              <span>Review order details</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-2xl font-black text-store-primary/30 block mb-2 font-mono">02</span>
              <h3 className="text-sm font-bold text-zinc-900 mb-1.5">Order processing</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Order processing information is available through your account.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-bold text-store-primary">
              <FiShield className="w-3.5 h-3.5" />
              <span>View your order status</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-2xl font-black text-store-primary/30 block mb-2 font-mono">03</span>
              <h3 className="text-sm font-bold text-zinc-900 mb-1.5">Delivery updates</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Check your account for delivery updates that are available for your order.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-bold text-store-primary">
              <FiClock className="w-3.5 h-3.5" />
              <span>Order updates</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-2xl font-black text-store-primary/30 block mb-2 font-mono">04</span>
              <h3 className="text-sm font-bold text-zinc-900 mb-1.5">Need assistance?</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Contact customer support if you have a question about your order or delivery.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-bold text-store-primary">
              <FiRefreshCw className="w-3.5 h-3.5" />
              <span>Contact support</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. FAQs Accordion ── */}
      <section className="py-10 sm:py-14 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-store-primary">
            Have Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-store-ink mt-1">
            Frequently Asked Delivery Questions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Answers about delivery options and order updates.
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
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-sm text-zinc-900 hover:text-store-primary transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-600">
                    {isOpen ? <FiChevronUp className="w-4 h-4 text-store-primary" /> : <FiChevronDown className="w-4 h-4" />}
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
              <FiPhone className="w-3.5 h-3.5 text-store-primary" />
              <span>{primaryPhone}</span>
            </a>
            <a
              href={`https://wa.me/${fullWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#8B4F2B] hover:bg-[#704321] text-white font-bold text-xs transition-colors flex items-center gap-2"
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
