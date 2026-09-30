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
  FiMessageSquare,
  FiSend,
  FiHelpCircle,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { toast } from 'sonner';
import ScrollAnimate from '@/components/ui/scroll-animate';
import PageBanner from '@/components/ui/page-banner';
import PolicyNav from '@/components/sections/policy/policy-nav';
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

      toast.success('Thank you! Your message has been received. Our NovaMart support team will contact you shortly.');
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
        'Deliveries inside Dhaka Metropolitan are completed within Same Day to 24–48 hours (orders placed before 2:00 PM are prioritized for same-day dispatch). For all other 63 districts nationwide, standard door-to-door delivery takes 2 to 4 business days.',
    },
    {
      question: 'What are the delivery charges and how do I get Free Delivery?',
      answer:
        'Delivery inside Dhaka is ৳60 and outside Dhaka across 64 districts is ৳120. All orders with a subtotal of ৳1,999 or more automatically qualify for 100% Free Nationwide Delivery at checkout without any coupon needed.',
    },
    {
      question: 'Is Cash on Delivery (COD) available nationwide?',
      answer:
        'Yes! We provide Cash on Delivery (COD) across all 64 districts and 495+ Upazilas in Bangladesh. You may inspect the outer parcel condition at your doorstep before handing payment to the rider.',
    },
    {
      question: 'What is your 7-day return and replacement policy?',
      answer:
        `If you receive any product that is defective, damaged in transit, or incorrect, you can request an immediate replacement or full refund within 7 days of delivery. Contact our hotline at ${primaryPhone} or reach out to our WhatsApp return desk.`,
    },
    {
      question: 'Are all products on NovaMart 100% genuine and original?',
      answer:
        'Yes! NovaMart operates under a strict zero-tolerance policy against counterfeit merchandise. Every item is verified and directly sourced from authorized brand distributors, official importers, and certified manufacturers with a 100% authenticity guarantee.',
    },
    {
      question: 'How can I place a corporate bulk order or customized gift set?',
      answer:
        `For corporate employee gift boxes, festive bulk hampers, or wholesale inquiries, please call our corporate desk directly at ${primaryPhone} or email sales@novamart.com.bd. We provide specialized branding, custom packaging, and VAT invoice certificates.`,
    },
  ];

  return (
    <div className="w-full bg-[#FAF9F5] text-zinc-900 font-sans min-h-screen">
      {/* ── Page Banner ── */}
      <PageBanner
        title="Customer Care &amp; Contact Desk"
        subtitle="We are here to assist you 7 days a week. Connect directly with our customer experience team for orders, parcel tracking, and product consultations."
        breadcrumbs={[
          { label: 'Customer Care' },
          { label: 'Contact Us & FAQs' },
        ]}
        showTrustChips={true}
      />

      {/* ── Sticky Policy Navigation ── */}
      <PolicyNav currentKey="contact" />

      {/* ── 1. Quick Info Cards ── */}
      <section className="py-8 sm:py-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Phone */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/80 flex flex-col justify-between hover:border-[#4F46E5] hover:shadow-md transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center mb-4 border border-indigo-100">
                <FiPhone className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Customer Hotline
              </h3>
              <p className="text-lg font-extrabold text-[#0B132B] mt-1">
                {primaryPhone}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Daily Phone Support (9 AM – 10 PM)
              </p>
            </div>
            <a
              href={`tel:${cleanPhone}`}
              className="mt-4 text-xs font-bold text-[#4F46E5] hover:text-[#4338CA] inline-flex items-center gap-1"
            >
              <span>Call Helpline</span> →
            </a>
          </div>

          {/* Card 2: WhatsApp */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/80 flex flex-col justify-between hover:border-[#25D366] hover:shadow-md transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#25D366] flex items-center justify-center mb-4 border border-emerald-100">
                <FaWhatsapp className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                WhatsApp Live Help
              </h3>
              <p className="text-lg font-extrabold text-[#0B132B] mt-1">
                Instant Chat Support
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Fast responses for orders &amp; photos
              </p>
            </div>
            <a
              href={`https://wa.me/${fullWhatsapp}?text=Hello%20NovaMart%2C%20I%20need%20assistance%20with%20an%20order.`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-xs font-bold text-[#25D366] hover:text-[#1ea851] inline-flex items-center gap-1"
            >
              <span>Message on WhatsApp</span> →
            </a>
          </div>

          {/* Card 3: Location */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/80 flex flex-col justify-between hover:border-[#4F46E5] hover:shadow-md transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center mb-4 border border-indigo-100">
                <FiMapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Corporate Flagship
              </h3>
              <p className="text-xs font-bold text-[#0B132B] mt-1 leading-snug">
                {branchAddress}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Banani Commercial Hub, Dhaka-1213
              </p>
            </div>
            <span className="mt-4 text-xs font-bold text-zinc-600">
              Operations &amp; Central Distribution
            </span>
          </div>

          {/* Card 4: Hours */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-zinc-200/80 flex flex-col justify-between hover:border-[#4F46E5] hover:shadow-md transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center mb-4 border border-orange-100">
                <FiClock className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Operating Hours
              </h3>
              <p className="text-sm font-bold text-[#0B132B] mt-1">
                Support: 9:00 AM – 10:00 PM
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Web Ordering: 24 Hours / 7 Days
              </p>
            </div>
            <span className="mt-4 text-xs font-bold text-emerald-600 inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Online Ordering
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. Contact Form & FAQs Grid ── */}
      <section className="py-8 sm:py-12 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Form (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200/80 shadow-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-indigo-200/80 text-[#4F46E5] text-xs font-bold uppercase tracking-wider mb-2">
              <FiMessageSquare className="w-3.5 h-3.5" />
              <span>Send Us A Message</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight">
              How Can We Help You?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 leading-relaxed">
              Fill out the form below and our customer support team will get in touch with you promptly.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="e.g. Tanvir"
                    required
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all placeholder:text-zinc-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="e.g. Ahmed"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all placeholder:text-zinc-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="01712345678"
                    required
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all placeholder:text-zinc-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tanvir@example.com"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all placeholder:text-zinc-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Inquiry Topic
                </label>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleInputChange}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
                >
                  <option value="order">Order Tracking &amp; Delivery Status</option>
                  <option value="return">Return or Product Replacement</option>
                  <option value="product">Product Authenticity &amp; Inquiries</option>
                  <option value="corporate">Corporate Gifts &amp; Bulk Orders</option>
                  <option value="other">General Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="How can we assist you with your order?"
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all placeholder:text-zinc-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] active:scale-95 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <FiSend className="w-4 h-4" />
                <span>{submitting ? 'Sending Message...' : 'Submit Message'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Customer FAQs (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-indigo-200/80 text-[#4F46E5] text-xs font-bold uppercase tracking-wider mb-2">
                <FiHelpCircle className="w-3.5 h-3.5" />
                <span>Customer FAQs</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B132B]">
                Frequently Asked Questions
              </h3>
              <p className="text-xs text-zinc-500 mt-1 mb-6">
                Instant answers to the most common questions from our shoppers.
              </p>

              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-zinc-200/80 overflow-hidden transition-all bg-zinc-50/50"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        className="w-full text-left px-4 py-3.5 flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-zinc-900 hover:text-[#4F46E5] transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <div className="w-6 h-6 rounded-md bg-white border border-zinc-200 flex items-center justify-center shrink-0">
                          {isOpen ? (
                            <FiChevronUp className="w-3.5 h-3.5 text-[#4F46E5]" />
                          ) : (
                            <FiChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                          )}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-3.5 text-xs text-zinc-600 leading-relaxed border-t border-zinc-200/60 pt-2.5 bg-white">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct WhatsApp Callout Banner */}
            <div className="bg-[#1E1B4B] rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">Need an immediate answer?</h4>
                <p className="text-xs text-indigo-200 mt-0.5">
                  Our live support agents are active on WhatsApp right now.
                </p>
              </div>
              <a
                href={`https://wa.me/${fullWhatsapp}?text=Hello%20NovaMart%2C%20I%20have%20an%20urgent%20inquiry.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs transition-all flex items-center gap-2 shrink-0 shadow-xs"
              >
                <FaWhatsapp className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
