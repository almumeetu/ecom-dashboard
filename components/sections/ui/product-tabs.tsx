'use client';

import { useState } from 'react';
import {
  LuCheck,
  LuShieldCheck,
  LuTruck,
  LuRotateCcw,
  LuStar,
  LuThumbsUp,
  LuChevronDown,
  LuInfo,
} from 'react-icons/lu';
import { toast } from 'sonner';

interface ProductTabsProps {
  description?: string;
  category?: string;
  brand?: string;
  sku?: string;
  unit?: string;
  origin?: string;
  attributes?: Record<string, string>;
}

export default function ProductTabs({
  description = '',
  category = 'General',
  brand = 'Verified Seller',
  sku = 'N/A',
  unit = 'Piece',
  origin = 'Authentic Origin',
  attributes = {},
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'shipping' | 'reviews' | 'faq'>(
    'description'
  );
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [helpfulReviews, setHelpfulReviews] = useState<Record<number, boolean>>({});

  const toggleHelpful = (id: number) => {
    setHelpfulReviews((prev) => ({ ...prev, [id]: !prev[id] }));
    toast.success('Thank you for your feedback!');
  };

  const handleWriteReview = () => {
    toast.info('Review submission is currently open to verified buyers after order delivery.');
  };

  return (
    <div id="product-details-tabs" className="w-full flex flex-col gap-6 pt-8 border-t border-stone-200">
      {/* ── Tabs Navigation Bar ───────────────────────────────────────── */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-stone-200 overflow-x-auto scrollbar-none pb-px">
        {[
          { id: 'description', label: 'Description' },
          { id: 'specs', label: 'Specifications' },
          { id: 'shipping', label: 'Shipping & Returns' },
          { id: 'reviews', label: 'Reviews (128)' },
          { id: 'faq', label: 'FAQ' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 sm:px-6 py-3.5 text-xs sm:text-sm font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer border-b-2 ${
                isActive
                  ? 'border-zinc-950 text-zinc-950 bg-stone-50/50'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:border-stone-300'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab 1: Description & Highlights ──────────────────────────── */}
      {activeTab === 'description' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200 text-zinc-700">
          {description ? (
            <div
              className="prose prose-stone max-w-none text-sm sm:text-base leading-relaxed text-zinc-600 space-y-4
                         [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:my-3
                         [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ol]:my-3
                         [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-zinc-900
                         [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-zinc-900
                         [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-zinc-900
                         [&_strong]:font-semibold [&_strong]:text-zinc-900"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          ) : (
            <p className="text-zinc-500 text-sm leading-relaxed">
              Crafted to international standards with rigorous material inspection and quality control. This product delivers superior reliability, aesthetic excellence, and long-lasting performance.
            </p>
          )}

          {/* Key Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
            {[
              {
                title: 'Authentic & Verified',
                desc: 'Sourced directly from authorized distributors or manufacturer brand partners.',
              },
              {
                title: 'High Durability',
                desc: 'Manufactured with high-grade components designed for heavy everyday use.',
              },
              {
                title: 'Quality Controlled',
                desc: 'Individually inspected and sealed prior to dispatch to prevent defects.',
              },
              {
                title: 'Customer Satisfaction',
                desc: 'Backed by NovaMart marketplace buyer protection and verified return policy.',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <LuCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">{item.title}</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5 leading-normal">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab 2: Specifications ────────────────────────────────────── */}
      {activeTab === 'specs' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          <div className="overflow-hidden rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <tbody className="divide-y divide-stone-100">
                {[
                  { label: 'Brand / Partner', value: brand },
                  { label: 'Category', value: category },
                  { label: 'SKU / Model Number', value: sku },
                  { label: 'Unit Measurement', value: unit },
                  { label: 'Origin / Manufacturing', value: origin },
                  { label: 'Authenticity Guarantee', value: '100% Genuine Verified' },
                  { label: 'Warranty Period', value: 'Standard 7-Day Replacement' },
                  ...Object.entries(attributes).map(([k, v]) => ({ label: k, value: v })),
                ].map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-stone-50/60' : 'bg-white'}>
                    <td className="px-5 py-3 font-semibold text-zinc-700 w-1/3 sm:w-1/4">
                      {row.label}
                    </td>
                    <td className="px-5 py-3 text-zinc-900 font-medium">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab 3: Shipping & Returns ────────────────────────────────── */}
      {activeTab === 'shipping' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200 text-zinc-700 text-xs sm:text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Details */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
                <LuTruck className="w-5 h-5 text-emerald-600" />
                <span>Express Shipping Information</span>
              </div>
              <ul className="space-y-2 text-zinc-600">
                <li className="flex items-start gap-2">
                  <LuCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Dhaka Metropolitan:</strong> Delivered in 1–2 business days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <LuCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Outside Dhaka (All Districts):</strong> Delivered in 2–4 business days via courier.</span>
                </li>
                <li className="flex items-start gap-2">
                  <LuCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Tracking Included:</strong> Real-time SMS and email tracking links sent upon dispatch.</span>
                </li>
                <li className="flex items-start gap-2">
                  <LuCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Free Delivery:</strong> Applied automatically on all orders over ৳2,000.</span>
                </li>
              </ul>
            </div>

            {/* Return Policy */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center gap-2 text-zinc-900 font-bold text-sm">
                <LuRotateCcw className="w-5 h-5 text-purple-600" />
                <span>7-Day Return & Exchange Policy</span>
              </div>
              <ul className="space-y-2 text-zinc-600">
                <li className="flex items-start gap-2">
                  <LuCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Items can be returned or exchanged within 7 days of delivery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <LuCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Product must remain unused with all tags, original boxing, and seal intact.</span>
                </li>
                <li className="flex items-start gap-2">
                  <LuCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Refunds processed instantly to your bKash, Nagad, or original payment card.</span>
                </li>
                <li className="flex items-start gap-2">
                  <LuCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Free return pickup available across Dhaka, Chattogram, and Sylhet.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 4: Customer Reviews ──────────────────────────────────── */}
      {activeTab === 'reviews' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Reviews Scorecard */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="flex flex-col items-center justify-center text-center sm:pr-8 sm:border-r border-stone-200">
              <span className="text-5xl font-extrabold text-zinc-950 font-sans">4.9</span>
              <div className="flex text-amber-400 my-1">
                {[...Array(5)].map((_, i) => (
                  <LuStar key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs text-zinc-500 font-medium">Based on 128 verified ratings</span>
            </div>

            {/* Rating distribution bars */}
            <div className="flex-1 w-full space-y-1.5 text-xs">
              {[
                { stars: 5, pct: 88, count: 112 },
                { stars: 4, pct: 9, count: 12 },
                { stars: 3, pct: 2, count: 3 },
                { stars: 2, pct: 1, count: 1 },
                { stars: 1, pct: 0, count: 0 },
              ].map((r) => (
                <div key={r.stars} className="flex items-center gap-3">
                  <span className="w-10 font-bold text-zinc-700 flex items-center gap-1">
                    {r.stars} <LuStar className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${r.pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-zinc-500 font-mono">{r.pct}%</span>
                </div>
              ))}
            </div>

            {/* Write Review Button */}
            <div className="sm:pl-4">
              <button
                onClick={handleWriteReview}
                className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
              >
                Write a Review
              </button>
            </div>
          </div>

          {/* Sample Verified Reviews */}
          <div className="space-y-4 pt-2">
            {[
              {
                id: 1,
                name: 'Tanzim R.',
                date: '3 days ago',
                rating: 5,
                title: 'Exceptional build quality and fast delivery!',
                comment:
                  'Arrived in pristine packaging within 24 hours of ordering in Dhaka. The product matches the photos perfectly and feels extremely premium. 100% satisfied!',
                verified: true,
              },
              {
                id: 2,
                name: 'Samantha K.',
                date: '1 week ago',
                rating: 5,
                title: 'True to size and very comfortable',
                comment:
                  'The size guide was very accurate. Material is top notch and stitching is flawless. Will definitely order from this verified seller again.',
                verified: true,
              },
              {
                id: 3,
                name: 'Farhan A.',
                date: '2 weeks ago',
                rating: 4,
                title: 'Great value for money',
                comment:
                  'Solid product for the price. Minor delay with the courier outside Dhaka, but customer support resolved it immediately.',
                verified: true,
              },
            ].map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-stone-100 font-bold text-zinc-800 text-xs flex items-center justify-center">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900">{rev.name}</span>
                        {rev.verified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <LuShieldCheck className="w-3 h-3" />
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400">{rev.date}</span>
                    </div>
                  </div>

                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <LuStar key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <h5 className="text-xs font-bold text-zinc-900">{rev.title}</h5>
                <p className="text-xs text-zinc-600 leading-relaxed">{rev.comment}</p>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-500">
                  <button
                    onClick={() => toggleHelpful(rev.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      helpfulReviews[rev.id]
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <LuThumbsUp className="w-3 h-3" />
                    <span>Helpful ({helpfulReviews[rev.id] ? 1 : 0})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab 5: FAQ ───────────────────────────────────────────────── */}
      {activeTab === 'faq' && (
        <div className="flex flex-col gap-3 animate-in fade-in duration-200">
          {[
            {
              q: 'How can I be sure this product is 100% authentic?',
              a: 'All items on NovaMart are procured directly from verified brand partners, official distributors, or audited manufacturers. Every package is sealed with quality assurance hologram tags.',
            },
            {
              q: 'How long will delivery take?',
              a: 'Orders within Dhaka are delivered within 24 to 48 hours. Nationwide deliveries to all other districts take 2 to 4 business days.',
            },
            {
              q: 'What if the size does not fit?',
              a: 'We provide a 7-day hassle-free exchange policy. Simply initiate an exchange from your account or contact our helpline, and our courier will arrange a size swap.',
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept Cash on Delivery (COD), bKash, Nagad, Visa, Mastercard, American Express, and major bank mobile wallets.',
            },
          ].map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-stone-200 rounded-xl overflow-hidden bg-white"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-zinc-900 bg-stone-50/50 hover:bg-stone-100/60 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <LuInfo className="w-4 h-4 text-zinc-500 shrink-0" />
                    {item.q}
                  </span>
                  <LuChevronDown
                    className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 py-4 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-stone-100 bg-white">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
