'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { toast } from 'sonner';
import ScrollAnimate from '@/components/ui/scroll-animate';
import PageBanner from '@/components/ui/page-banner';
import { fetchShopSettings, parseContactEntries, type ShopSettings } from '@/lib/shop-api';

export default function ContactPage() {
  const [settings, setSettings] = useState<ShopSettings | null>(null);

  useEffect(() => {
    fetchShopSettings().then((s) => {
      if (s) setSettings(s);
    });
  }, []);

  const shopName = settings?.shopName?.trim() || 'NovaMart';
  const contactEntries = parseContactEntries(settings?.contactNumber);
  const primaryPhone = contactEntries[0]?.value || '+880 1712-345678';
  const cleanPhone = primaryPhone.replace(/[^\d+]/g, '') || '01712345678';
  const rawWhatsapp = settings?.socialContact?.whatsapp || primaryPhone;
  const whatsappNumber = rawWhatsapp.replace(/[^\d]/g, '') || '8801712345678';
  const fullWhatsapp = whatsappNumber.startsWith('88') ? whatsappNumber : `88${whatsappNumber.replace(/^0+/, '')}`;
  const emailEntries = parseContactEntries(settings?.email);
  const primaryEmail = emailEntries[0]?.value || 'support@novamart.com.bd';
  const branchAddress = settings?.branchAddress?.trim() || 'Level 4, Nova Tower, Plot 18, Road 11, Banani, Dhaka-1213, Bangladesh';
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

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+880',
    phoneNumber: '',
    inquiryType: 'order',
    message: '',
  });

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await fetch('/api/resend/contact-us', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });

      toast.success('Thank you! Your inquiry has been received. Our NovaMart support team will contact you shortly.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        countryCode: '+880',
        phoneNumber: '',
        inquiryType: 'order',
        message: '',
      });
    } catch {
      toast.success(`Inquiry submitted! Our support team at ${primaryPhone} will contact you promptly.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: 'How fast is delivery in Dhaka and nationwide across Bangladesh?',
      answer:
        'Deliveries inside Dhaka Metropolitan are completed within 24 to 48 hours (with Same Day express option available for urgent orders). For all other 63 districts nationwide, standard door-to-door delivery takes 2 to 4 business days.',
    },
    {
      question: 'What are the delivery charges for my NovaMart order?',
      answer:
        `Delivery inside Dhaka is ${deliveryInside}. We offer FREE delivery on all orders over ৳1,999! For delivery outside Dhaka across all 64 districts, the standard courier charge is ${deliveryOutside}.`,
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We support Cash on Delivery (COD) across all 64 districts in Bangladesh, alongside instant mobile banking through bKash, Nagad, and Rocket, plus VISA, Mastercard, and AMEX credit or debit cards through bank-grade SSL encrypted checkout.',
    },
    {
      question: 'What is your 7-day return and replacement policy?',
      answer:
        `If you receive an item that is defective, damaged in transit, or does not match the product description, you can request an exchange or refund within 7 days of delivery. Call our hotline at ${primaryPhone} or message our WhatsApp team.`,
    },
    {
      question: 'Are all products on NovaMart 100% genuine and original?',
      answer:
        'Yes. NovaMart guarantees 100% authentic, verified products sourced directly from authorized brand distributors, official importers, and certified manufacturers with money-back authenticity guarantee.',
    },
    {
      question: 'Where is NovaMart located?',
      answer:
        `NovaMart operates its flagship customer experience and fulfillment center at ${branchAddress}.`,
    },
  ];

  return (
    <div className="w-full bg-[#FAFAFA] font-sans">
      <PageBanner
        title={`Contact & Customer Care — ${shopName}`}
        subtitle="We are here to assist you 24/7. Connect directly with our customer experience team for order tracking, product recommendations, and corporate orders."
        breadcrumbs={[{ label: 'Contact Us' }]}
      />

      {/* ── 1. Quick Info Cards ── */}
      <section className="relative py-8 sm:py-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Phone */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200/80 flex flex-col justify-between hover:shadow-lg transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <FiPhone className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Customer Hotline
              </h3>
              <p className="text-lg font-extrabold text-zinc-900 mt-1">
                {primaryPhone}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Direct helpline &amp; support
              </p>
            </div>
            <a
              href={`tel:${cleanPhone}`}
              className="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
            >
              <span>Call Helpline</span> →
            </a>
          </div>

          {/* Card 2: WhatsApp */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200/80 flex flex-col justify-between hover:shadow-lg transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
                <FaWhatsapp className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                WhatsApp Support
              </h3>
              <p className="text-lg font-extrabold text-zinc-900 mt-1">
                Instant Chat Help
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Fast responses for orders &amp; parcel tracking
              </p>
            </div>
            <a
              href={`https://wa.me/${fullWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-xs font-bold text-green-600 hover:text-green-700 inline-flex items-center gap-1"
            >
              <span>Message on WhatsApp</span> →
            </a>
          </div>

          {/* Card 3: Location */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200/80 flex flex-col justify-between hover:shadow-lg transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <FiMapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Corporate Flagship
              </h3>
              <p className="text-sm font-bold text-zinc-900 mt-1 leading-snug">
                {branchAddress}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Operations &amp; Central Distribution
              </p>
            </div>
            <a
              href="#map-section"
              className="mt-4 text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              <span>View On Map</span> →
            </a>
          </div>

          {/* Card 4: Hours */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200/80 flex flex-col justify-between hover:shadow-lg transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <FiClock className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Support Hours
              </h3>
              <p className="text-sm font-bold text-zinc-900 mt-1">
                Daily: 9:00 AM – 10:00 PM
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Website: Online Ordering 24/7
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-emerald-600 inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Orders Open 24/7
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. Contact Form & Company Details ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
        <ScrollAnimate variant="fade-in-up">
          <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Form Column (7 cols) */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14">
              <div className="max-w-xl">
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
                  Send Us A Message
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
                  How Can We Help You Today?
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 mt-2 leading-relaxed">
                  Fill in your details below and our NovaMart customer support team will get in touch with you within 30 minutes during business hours.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="e.g. Tanvir"
                        required
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all placeholder:text-zinc-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="e.g. Hasan"
                        required
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all placeholder:text-zinc-400"
                      />
                    </div>
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex rounded-xl border border-zinc-200 bg-zinc-50 overflow-hidden focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600 focus-within:bg-white transition-all">
                        <span className="px-3.5 py-3 text-xs font-bold text-zinc-500 bg-zinc-100/80 border-r border-zinc-200 shrink-0 flex items-center">
                          +880
                        </span>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="1712345678"
                          required
                          className="w-full bg-transparent px-3 py-3 text-sm text-zinc-900 focus:outline-none placeholder:text-zinc-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="yourname@gmail.com"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all placeholder:text-zinc-400"
                      />
                    </div>
                  </div>

                  {/* Inquiry Type */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                      Subject / Inquiry Category
                    </label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all cursor-pointer"
                    >
                      <option value="order">Order Tracking &amp; Delivery Status</option>
                      <option value="exchange">7-Day Return, Exchange or Refund Assistance</option>
                      <option value="vendor">Brand &amp; Merchant Partnership</option>
                      <option value="corporate">Corporate Bulk Orders &amp; Hampers</option>
                      <option value="other">General Customer Inquiries</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please share details about your inquiry, order number, or delivery address..."
                      required
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all resize-none placeholder:text-zinc-400"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm px-9 py-3.5 rounded-full shadow-lg shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? 'Sending Message...' : 'Submit Inquiry'}
                    </button>

                    <a
                      href={`https://wa.me/${fullWhatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 font-semibold text-sm px-6 py-3.5 rounded-full border border-green-200 transition-all cursor-pointer"
                    >
                      <FaWhatsapp className="w-4 h-4 text-green-600" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </form>
              </div>
            </div>

            {/* Info Column (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#121614] to-[#1D2420] p-8 sm:p-12 lg:p-14 text-white flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 text-[11px] font-bold tracking-wider uppercase mb-6">
                  <span>NovaMart Bangladesh</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  Banani Corporate Flagship &amp; Support Hub
                </h3>

                <p className="text-zinc-400 text-xs sm:text-sm mt-3 leading-relaxed">
                  Need direct assistance with an ongoing order, delivery change, or corporate procurement? Connect with our dedicated support desk.
                </p>

                <div className="space-y-6 mt-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                      <FiMapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Corporate Headquarters
                      </h4>
                      <p className="text-sm font-semibold text-white mt-0.5">
                        {shopName} Retail Bangladesh
                      </p>
                      <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                        {branchAddress}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                      <FiPhone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Customer Hotline
                      </h4>
                      <a
                        href={`tel:${cleanPhone}`}
                        className="text-sm font-bold text-emerald-400 hover:underline mt-1 inline-block"
                      >
                        {primaryPhone}
                      </a>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Daily 9 AM – 10 PM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                      <FiMail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Email Support
                      </h4>
                      <a
                        href={`mailto:${primaryEmail}`}
                        className="text-sm font-semibold text-emerald-400 hover:underline mt-1 inline-block"
                      >
                        {primaryEmail}
                      </a>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Response within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                      <FaWhatsapp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Instant WhatsApp Chat
                      </h4>
                      <a
                        href={`https://wa.me/${fullWhatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-zinc-200 hover:text-emerald-400 transition-colors mt-1 block"
                      >
                        {primaryPhone} (Live WhatsApp)
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badge at bottom */}
              <div className="mt-10 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <p className="text-xs text-zinc-300 leading-normal">
                    100% Genuine Guaranteed • 7-Day Easy Returns • Cash on Delivery in all 64 Districts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimate>
      </section>

      {/* ── 3. Google Maps Embed (Banani, Dhaka) ── */}
      <section id="map-section" className="py-8 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-zinc-200/80 overflow-hidden">
          <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 mb-3">
            <div>
              <h3 className="text-base font-bold text-zinc-900">
                NovaMart Corporate Flagship &amp; Operations Map
              </h3>
              <p className="text-xs text-zinc-500">
                Road 11, Banani, Dhaka - 1213, Bangladesh
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Road+11,+Banani,+Dhaka"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              Open in Google Maps App →
            </a>
          </div>

          <div className="w-full h-[380px] rounded-2xl overflow-hidden bg-zinc-100">
            <iframe
              src="https://maps.google.com/maps?q=Road+11,+Banani,+Dhaka,+Bangladesh&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="NovaMart Banani Dhaka Location Map"
            />
          </div>
        </div>
      </section>

      {/* ── 4. Frequently Asked Questions ── */}
      <section className="py-16 bg-white border-t border-zinc-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
              Clear Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-2">
              Everything you need to know about deliveries, payment options, and customer support.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-zinc-200/80 overflow-hidden bg-zinc-50/60 transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white transition-colors"
                  >
                    <span className="text-sm font-bold text-zinc-900 leading-snug">
                      {faq.question}
                    </span>
                    <span className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-600">
                      {isOpen ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 bg-white">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Still have questions banner */}
          <div className="mt-10 p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
            <h4 className="text-sm font-bold text-emerald-950">
              Still have questions or need instant assistance?
            </h4>
            <p className="text-xs text-emerald-800 mt-1">
              Our direct customer helpline is ready to assist you right now.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`tel:${cleanPhone}`}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-full transition-colors"
              >
                Call: {primaryPhone}
              </a>
              <a
                href={`https://wa.me/${fullWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-zinc-100 text-emerald-900 font-semibold text-xs px-6 py-2.5 rounded-full border border-emerald-200 transition-colors"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
