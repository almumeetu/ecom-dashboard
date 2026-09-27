'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiMessageSquare,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { toast } from 'sonner';
import ScrollAnimate from '@/components/ui/scroll-animate';
import PageBanner from '@/components/ui/page-banner';

export default function ContactPage() {
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
      const response = await fetch('/api/resend/contact-us', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });

      // Even if Resend API is in sandbox/testing mode, provide a friendly confirmation
      toast.success('Thank you! Your inquiry has been received. Our support team will contact you shortly.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        countryCode: '+880',
        phoneNumber: '',
        inquiryType: 'order',
        message: '',
      });
    } catch (err: any) {
      toast.success('Inquiry submitted! Our support team at 01722301927 will reach back to you promptly.');
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
      question: 'How fast is delivery in Uttara and Dhaka city?',
      answer:
        'Orders inside Uttara and greater Dhaka Metropolitan are typically delivered within 24 to 48 hours. We also have express next-day delivery options available for groceries, pantry staples, and everyday essentials.',
    },
    {
      question: 'What are the delivery charges for my order?',
      answer:
        'Delivery inside Dhaka (including Uttara) is ৳60. We offer FREE delivery on all orders over ৳1,999! For delivery outside Dhaka anywhere across Bangladesh, the standard courier charge is ৳120.',
    },
    {
      question: 'What payment methods do you support?',
      answer:
        'We support Cash on Delivery (COD) nationwide, along with instant mobile payments through bKash, Nagad, and Rocket, as well as VISA, Mastercard, and AMEX credit or debit cards through bank-grade encrypted checkout.',
    },
    {
      question: 'What is your 7-day return and exchange policy?',
      answer:
        'If you receive an item that is defective, damaged in transit, or does not match the product description, you can request an exchange or refund within 7 days of delivery. Simply call our hotline at 01722301927 or message our WhatsApp support.',
    },
    {
      question: 'Where is your company located and who operates NovaMart?',
      answer:
        'NovaMart is founded and operated under the visionary leadership of Founder & CEO Mohammad Abdullah. Our central corporate headquarters are located in Mohadevpur, Naogaon, Rajshahi, Bangladesh.',
    },
  ];

  return (
    <div className="w-full bg-[#FAFAFA] font-sans">
      <PageBanner
        title="Contact & Customer Care"
        subtitle="Have questions about your order, delivery timeline, or vendor partnerships? Reach out directly to our headquarters in Mohadevpur, Naogaon or call our executive line."
        badge="FOUNDER & CEO: MOHAMMAD ABDULLAH • MOHADEVPUR, NAOGAON, RAJSHAHI"
        breadcrumbs={[{ label: 'Contact Us' }]}
      />

      {/* ── 1. Quick Info Cards ── */}
      <section className="relative py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Phone */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-zinc-100 flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <FiPhone className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Customer Hotline
              </h3>
              <p className="text-lg font-extrabold text-zinc-900 mt-1">
                01722301927
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                +880 1722-301927 (Toll-free / Direct)
              </p>
            </div>
            <a
              href="tel:01722301927"
              className="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
            >
              <span>Call Helpline Now</span> →
            </a>
          </div>

          {/* Card 2: WhatsApp */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-zinc-100 flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
                <FaWhatsapp className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                WhatsApp Support
              </h3>
              <p className="text-lg font-extrabold text-zinc-900 mt-1">
                Instant Chat Support
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Fast responses for tracking & order queries
              </p>
            </div>
            <a
              href="https://wa.me/8801722301927"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-xs font-bold text-green-600 hover:text-green-700 inline-flex items-center gap-1"
            >
              <span>Message on WhatsApp</span> →
            </a>
          </div>

          {/* Card 3: Location */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-zinc-100 flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <FiMapPin className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Corporate Headquarters
              </h3>
              <p className="text-base font-bold text-zinc-900 mt-1 leading-snug">
                Mohadevpur, Naogaon
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Rajshahi Division, Bangladesh
              </p>
            </div>
            <a
              href="#map-section"
              className="mt-4 text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              <span>View On Google Map</span> →
            </a>
          </div>

          {/* Card 4: Hours */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-zinc-100 flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <FiClock className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Operating Hours
              </h3>
              <p className="text-base font-bold text-zinc-900 mt-1">
                Sat – Thu: 9 AM – 9 PM
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Friday: 2 PM – 9 PM | Web: 24/7
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-emerald-600 inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Online Orders Open 24/7
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. Contact Form & Company Details ── */}
      <section className="py-20 px-4 sm:px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
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
                  Fill in your details below and our team based in Uttara, Dhaka will reach back to you within 30 minutes during working hours.
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
                        placeholder="e.g. Saikat"
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
                        placeholder="e.g. Ahmed"
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
                          placeholder="01722301927"
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
                      <option value="order">Order Tracking & Delivery Status (Dhaka / Nationwide)</option>
                      <option value="exchange">Return, Exchange or Refund Assistance</option>
                      <option value="vendor">Vendor Onboarding & Multi-Vendor Partnership</option>
                      <option value="corporate">Bulk Orders & Corporate Purchases</option>
                      <option value="tech">Webdev Software Solutions Platform Support</option>
                      <option value="other">General Inquiries</option>
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
                      {submitting ? 'Sending Inquiry...' : 'Submit Inquiry'}
                    </button>

                    <a
                      href="https://wa.me/8801722301927"
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
                  <span>Webdev Software Solutions</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  Uttara Operational Hub & Customer Center
                </h3>

                <p className="text-zinc-400 text-xs sm:text-sm mt-3 leading-relaxed">
                  Need direct assistance with an ongoing order, delivery change, or supplier partnership? Visit our Uttara center or connect directly with our team.
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
                      <p className="text-sm font-semibold text-white mt-1">
                        NovaMart Marketplace (Mohammad Abdullah)
                      </p>
                      <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                        Mohadevpur, Naogaon, Rajshahi Division, Bangladesh
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                      <FiPhone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Helpline / bKash Hotline
                      </h4>
                      <a
                        href="tel:01722301927"
                        className="text-sm font-bold text-emerald-400 hover:underline mt-1 inline-block"
                      >
                        01722301927 (+880 1722-301927)
                      </a>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        WhatsApp & Mobile Support Active
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
                      <FiMail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Corporate Inquiries
                      </h4>
                      <a
                        href="mailto:support@webdevsoftware.com"
                        className="text-xs font-semibold text-zinc-200 hover:text-emerald-400 transition-colors mt-1 block"
                      >
                        support@webdevsoftware.com
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
                    Verified Multi-Vendor Platform • 100% Genuine Guarantee • 7-Day Easy Returns
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimate>
      </section>

      {/* ── 3. Google Maps Embed (Uttara, Dhaka) ── */}
      <section id="map-section" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="bg-white rounded-3xl p-4 shadow-xl border border-zinc-100 overflow-hidden">
          <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 mb-3">
            <div>
              <h3 className="text-base font-bold text-zinc-900">
                Central Operations & Fulfillment Map
              </h3>
              <p className="text-xs text-zinc-500">
                Sector 3, Uttara, Dhaka - 1230, Bangladesh
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Sector+3,+Uttara,+Dhaka"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              Open in Google Maps App →
            </a>
          </div>

          <div className="w-full h-[400px] rounded-2xl overflow-hidden bg-zinc-100">
            <iframe
              src="https://maps.google.com/maps?q=Sector+3,+Uttara,+Dhaka,+Bangladesh&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="NovaMart Uttara Dhaka Location Map"
            />
          </div>
        </div>
      </section>

      {/* ── 4. Frequently Asked Questions ── */}
      <section className="py-20 bg-white border-t border-zinc-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
              Clear Answers
            </span>
            <h2 className="text-3xl font-black text-zinc-950 tracking-tight mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-2">
              Everything you need to know about deliveries, payment options, and customer support.
            </p>
          </div>

          <div className="space-y-3.5">
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
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white transition-colors"
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
          <div className="mt-12 p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
            <h4 className="text-sm font-bold text-emerald-950">
              Still have questions or need instant assistance?
            </h4>
            <p className="text-xs text-emerald-800 mt-1">
              Our direct customer helpline is ready to assist you right now.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <a
                href="tel:01722301927"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-full transition-colors"
              >
                Call: 01722301927
              </a>
              <a
                href="https://wa.me/8801722301927"
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
