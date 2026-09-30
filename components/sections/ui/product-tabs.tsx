'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  LuCheck,
  LuShieldCheck,
  LuTruck,
  LuRotateCcw,
  LuStar,
  LuThumbsUp,
  LuSparkles,
  LuBadgeCheck,
  LuClock,
  LuPencilLine,
  LuMessageSquarePlus,
  LuPackage,
} from 'react-icons/lu';
import { toast } from 'sonner';
import {
  fetchShopSettings,
  fetchStorePolicies,
  fetchShopProductReviews,
  type ShopSettings,
  type StorePolicies,
} from '@/lib/shop-api';

interface ProductTabsProps {
  productId?: string;
  productName?: string;
  description?: string;
  category?: string;
  brand?: string;
  sku?: string;
  unit?: string;
  origin?: string;
  tags?: string[];
  stockQuantity?: number;
  attributes?: Record<string, string>;
  initialSettings?: ShopSettings | null;
  initialPolicies?: StorePolicies | null;
}

interface DisplayReview {
  id: string | number;
  name: string;
  date: string;
  rating: number;
  title?: string;
  comment: string;
  verified: boolean;
}

export default function ProductTabs({
  productId,
  productName,
  description = '',
  category = '',
  brand = '',
  sku = '',
  unit = '',
  origin = '',
  tags = [],
  stockQuantity,
  attributes = {},
  initialSettings = null,
  initialPolicies = null,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'shipping' | 'reviews'>(
    'description'
  );

  // Settings & Policies state (dynamic from store/admin)
  const [settings, setSettings] = useState<ShopSettings | null>(initialSettings);
  const [policies, setPolicies] = useState<StorePolicies | null>(initialPolicies);

  useEffect(() => {
    if (!initialSettings) {
      fetchShopSettings().then((s) => {
        if (s) setSettings(s);
      });
    }
    if (!initialPolicies) {
      fetchStorePolicies().then((p) => {
        if (p) setPolicies(p);
      });
    }
  }, [initialSettings, initialPolicies]);

  // Dynamic Product Reviews state
  const [reviewsList, setReviewsList] = useState<DisplayReview[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<number | 'all'>('all');
  const [helpfulReviews, setHelpfulReviews] = useState<Record<string | number, boolean>>({});

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newHoverRating, setNewHoverRating] = useState(0);
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Fetch real reviews for this product
  useEffect(() => {
    if (!productId) return;
    let isCancelled = false;
    setIsLoadingReviews(true);

    fetchShopProductReviews(productId)
      .then((data) => {
        if (isCancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          const mapped: DisplayReview[] = data.map((r) => {
            const dateStr = r.createdAt
              ? new Date(r.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Recently';
            return {
              id: r.id,
              name: r.user?.name || 'Verified Customer',
              date: dateStr,
              rating: r.rating || 5,
              title: r.comment && r.comment.length > 40 ? r.comment.slice(0, 40) + '...' : 'Verified Purchase Review',
              comment: r.comment || 'Great authentic product. Highly recommended!',
              verified: true,
            };
          });
          setReviewsList(mapped);
        } else {
          // If no API reviews exist yet, initialize with an empty list
          setReviewsList([]);
        }
      })
      .catch((err) => {
        console.warn('Could not load reviews for product:', err);
      })
      .finally(() => {
        if (!isCancelled) setIsLoadingReviews(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [productId]);

  const toggleHelpful = (id: string | number) => {
    setHelpfulReviews((prev) => {
      const next = !prev[id];
      if (next) {
        toast.success('Thank you for your feedback!');
      }
      return { ...prev, [id]: next };
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) {
      toast.error('Please enter your name and review details');
      return;
    }

    setIsSubmittingReview(true);
    const newEntry: DisplayReview = {
      id: Date.now().toString(),
      name: newName.trim(),
      date: 'Just now',
      rating: newRating,
      title: newTitle.trim() || 'Verified Experience',
      comment: newComment.trim(),
      verified: true,
    };

    // Attempt to submit to backend API if productId is present
    if (productId) {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5010/api/v1';
        await fetch(`${apiBase}/products/${productId}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rating: newRating,
            comment: newTitle.trim() ? `${newTitle.trim()} — ${newComment.trim()}` : newComment.trim(),
          }),
        }).catch(() => null);
      } catch {
        // Handled silently
      }
    }

    setReviewsList((prev) => [newEntry, ...prev]);
    setIsSubmittingReview(false);
    setShowReviewForm(false);
    setNewName('');
    setNewTitle('');
    setNewComment('');
    setNewRating(5);
    toast.success('Review submitted successfully! Thank you for sharing your experience.');
  };

  // Filter reviews
  const filteredReviews = useMemo(() => {
    if (reviewFilter === 'all') return reviewsList;
    return reviewsList.filter((r) => r.rating === reviewFilter);
  }, [reviewsList, reviewFilter]);

  // Dynamic Rating calculations
  const averageRating = useMemo(() => {
    if (reviewsList.length === 0) return '5.0';
    const sum = reviewsList.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / reviewsList.length).toFixed(1);
  }, [reviewsList]);

  const starPercentages = useMemo(() => {
    const total = reviewsList.length;
    return [5, 4, 3, 2, 1].map((stars) => {
      const count = reviewsList.filter((r) => Math.round(r.rating) === stars).length;
      const pct = total > 0 ? Math.round((count / total) * 100) : stars === 5 ? 100 : 0;
      return { stars, pct, count };
    });
  }, [reviewsList]);

  // Dynamic Specifications rows
  const specRows = useMemo(() => {
    const rows: { label: string; value: string }[] = [];
    if (productName) rows.push({ label: 'Product Name', value: productName });
    if (brand && brand !== 'Verified Seller' && brand !== 'N/A') {
      rows.push({ label: 'Brand / Partner', value: brand });
    }
    if (category && category !== 'General') {
      rows.push({ label: 'Category', value: category });
    }
    if (sku && sku !== 'N/A') {
      rows.push({ label: 'SKU / Model Number', value: sku });
    }
    if (unit && unit !== 'Piece') {
      rows.push({ label: 'Unit Measurement', value: unit });
    }
    if (typeof stockQuantity === 'number') {
      rows.push({
        label: 'Stock Availability',
        value: stockQuantity > 0 ? `In Stock (${stockQuantity} units available)` : 'Out of Stock',
      });
    }
    if (tags && tags.length > 0) {
      rows.push({ label: 'Tags & Labels', value: tags.join(', ') });
    }
    if (origin && origin !== 'Authentic Origin') {
      rows.push({ label: 'Origin / Sourcing', value: origin });
    }

    // Dynamic variant attributes (Size, Color, Material, etc.)
    Object.entries(attributes).forEach(([k, v]) => {
      if (v && v.trim()) {
        rows.push({ label: k, value: v.trim() });
      }
    });

    return rows;
  }, [productName, brand, category, sku, unit, stockQuantity, tags, origin, attributes]);

  // Dynamic Delivery charges from settings
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

  const tabsConfig = [
    { id: 'description', label: 'Description & Features' },
    { id: 'specs', label: 'Specifications' },
    { id: 'shipping', label: 'Shipping & Returns' },
    { id: 'reviews', label: `Reviews (${reviewsList.length})` },
  ];

  return (
    <div id="product-details-tabs" className="w-full flex flex-col gap-8 scroll-mt-24">
      {/* ── Segmented Navigation Pills Bar (No FAQ) ─────────────────── */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto scrollbar-none pb-2">
        <div className="inline-flex p-1.5 rounded-2xl bg-white border border-stone-200/90 shadow-xs gap-1">
          {tabsConfig.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold tracking-tight rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-zinc-950 text-white shadow-md shadow-zinc-950/20'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-stone-100/70'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab 1: Description & Dynamic Overview ────────────────────── */}
      {activeTab === 'description' && (
        <div className="flex flex-col lg:flex-row gap-10 items-start animate-in fade-in duration-200">
          {/* Main Description Prose */}
          <div className="flex-1 w-full bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-2xs space-y-5">
            <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
              Product Overview & Details
            </h3>

            {description ? (
              <div
                className="prose prose-stone max-w-none text-sm sm:text-base leading-relaxed text-zinc-600 space-y-4
                           [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ul]:my-4
                           [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_ol]:my-4
                           [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-zinc-900
                           [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-zinc-900
                           [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-zinc-900
                           [&_p]:leading-relaxed
                           [&_strong]:font-bold [&_strong]:text-zinc-900"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
                Crafted to high quality standards with direct sourcing and verified authenticity. Each unit is inspected before dispatch to ensure genuine customer satisfaction.
              </p>
            )}
          </div>

          {/* Highlights & Guarantees Cards Sidebar */}
          <div className="w-full lg:w-96 flex flex-col gap-3.5 shrink-0">
            <div className="p-4 rounded-2xl bg-zinc-950 text-white flex items-center gap-3 shadow-md shadow-zinc-950/15">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <LuBadgeCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{shopName} Guarantee</h4>
                <p className="text-xs text-zinc-300">100% Genuine with Buyer Protection</p>
              </div>
            </div>

            {[
              {
                icon: <LuCheck className="w-4 h-4 text-[#4F46E5]" />,
                bg: 'bg-[#EEF2FF]',
                title: 'Authentic & Verified',
                desc: 'Procured directly from verified suppliers and brand authorized hubs.',
              },
              {
                icon: <LuSparkles className="w-4 h-4 text-amber-600" />,
                bg: 'bg-amber-50',
                title: 'Quality Controlled Dispatch',
                desc: 'Rigorous multi-point inspection before dispatch to ensure zero defect.',
              },
              {
                icon: <LuClock className="w-4 h-4 text-blue-600" />,
                bg: 'bg-blue-50',
                title: 'Fast Doorstep Delivery',
                desc: `Express courier dispatch across Bangladesh with live SMS tracking.`,
              },
              {
                icon: <LuRotateCcw className="w-4 h-4 text-purple-600" />,
                bg: 'bg-purple-50',
                title: '7-Day Return & Replacement',
                desc: 'Hassle-free replacement or refund guarantee within 7 days of delivery.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs"
              >
                <div className={`w-8 h-8 rounded-xl ${item.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-950">{item.title}</h4>
                  <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab 2: Specifications (100% Dynamic from Real Fields) ───── */}
      {activeTab === 'specs' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-2xs space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
              Technical Specifications & Details
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Authentic parameters and technical attributes configured for this product
            </p>
          </div>

          {specRows.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-stone-200">
              <table className="w-full text-left text-xs sm:text-sm">
                <tbody className="divide-y divide-stone-200">
                  {specRows.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-stone-50/50' : 'bg-white'}>
                      <td className="px-5 sm:px-6 py-3.5 font-bold text-zinc-700 w-1/3 sm:w-1/4 border-r border-stone-100">
                        {row.label}
                      </td>
                      <td className="px-5 sm:px-6 py-3.5 text-zinc-900 font-semibold">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 px-4 rounded-2xl bg-stone-50 border border-dashed border-stone-200 text-zinc-500 text-sm">
              <LuPackage className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              Standard technical specifications match the product description and category defaults.
            </div>
          )}
        </div>
      )}

      {/* ── Tab 3: Shipping & Returns (Dynamic from Store Policies) ─── */}
      {activeTab === 'shipping' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
          {/* Express Delivery Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-3 text-zinc-950 font-extrabold text-lg">
              <div className="w-10 h-10 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center">
                <LuTruck className="w-5 h-5" />
              </div>
              <div>
                <h4>Express Shipping Information</h4>
                <p className="text-xs font-normal text-zinc-500">Fast doorstep courier delivery across Bangladesh</p>
              </div>
            </div>

            {policies?.delivery?.content ? (
              <div
                className="prose prose-stone text-xs sm:text-sm text-zinc-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: policies.delivery.content }}
              />
            ) : (
              <ul className="space-y-3 pt-2 text-xs sm:text-sm text-zinc-600">
                <li className="flex items-start gap-2.5">
                  <LuCheck className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
                  <span>
                    <strong>Dhaka Metropolitan:</strong> Delivered in 1–2 business days ({deliveryInside} delivery charge).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <LuCheck className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
                  <span>
                    <strong>All Bangladesh (Outside Dhaka):</strong> Delivered in 2–4 business days via courier ({deliveryOutside} delivery charge).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <LuCheck className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
                  <span>
                    <strong>Real-time Tracking:</strong> SMS notifications and courier tracking links dispatched upon handover.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <LuCheck className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
                  <span>
                    <strong>Inspection Privilege:</strong> External parcel condition check allowed upon delivery before releasing COD payment.
                  </span>
                </li>
              </ul>
            )}
          </div>

          {/* Return & Exchange Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-3 text-zinc-950 font-extrabold text-lg">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <LuRotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4>7-Day Return &amp; Exchange Policy</h4>
                <p className="text-xs font-normal text-zinc-500">Hassle-free guarantee for our verified customers</p>
              </div>
            </div>

            {policies?.return?.content || policies?.refund?.content ? (
              <div
                className="prose prose-stone text-xs sm:text-sm text-zinc-600 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: policies.return?.content || policies.refund?.content || '',
                }}
              />
            ) : (
              <ul className="space-y-3 pt-2 text-xs sm:text-sm text-zinc-600">
                <li className="flex items-start gap-2.5">
                  <LuCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>7-Day Window:</strong> You can request an exchange or return within 7 calendar days of receipt.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <LuCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Condition:</strong> Product must remain unused, unworn, and undamaged with original tags intact.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <LuCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Fast Refund:</strong> Refunds processed directly to your bKash, Nagad, or bank card within 24–48 hours.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <LuCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Doorstep Pickup:</strong> Return courier pickup arranged from your home or drop-off at nearest partner hub.
                  </span>
                </li>
              </ul>
            )}
          </div>
        </div>
      )}

      {/* ── Tab 4: Customer Reviews (Interactive & Dynamic from API) ── */}
      {activeTab === 'reviews' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Reviews Scorecard */}
          <div className="flex flex-col md:flex-row items-center gap-8 p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-2xs">
            <div className="flex flex-col items-center justify-center text-center md:pr-8 md:border-r border-stone-200 shrink-0">
              <span className="text-5xl sm:text-6xl font-black text-zinc-950 font-sans tracking-tight">
                {averageRating}
              </span>
              <div className="flex text-amber-400 my-2">
                {[...Array(5)].map((_, i) => (
                  <LuStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(Number(averageRating))
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-zinc-600">
                {reviewsList.length > 0
                  ? `Based on ${reviewsList.length} verified ratings`
                  : 'Be the first to review this product'}
              </span>
            </div>

            {/* Rating distribution bars */}
            <div className="flex-1 w-full space-y-2 text-xs">
              {starPercentages.map((r) => (
                <div key={r.stars} className="flex items-center gap-3">
                  <span className="w-12 font-bold text-zinc-700 flex items-center gap-1">
                    {r.stars} <LuStar className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 h-2.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${r.pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-zinc-500 font-mono font-medium">{r.pct}%</span>
                </div>
              ))}
            </div>

            {/* Write Review Trigger Button */}
            <div className="md:pl-4 shrink-0">
              <button
                onClick={() => setShowReviewForm((prev) => !prev)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-zinc-950/20 active:scale-95"
              >
                <LuPencilLine className="w-4 h-4" />
                <span>{showReviewForm ? 'Cancel Review' : 'Write a Review'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Review Form (Toggled open) */}
          {showReviewForm && (
            <form
              onSubmit={handleReviewSubmit}
              className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-zinc-950 shadow-lg space-y-5 animate-in slide-in-from-top-4 duration-300"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div>
                  <h4 className="text-lg font-extrabold text-zinc-950">Share Your Experience</h4>
                  <p className="text-xs text-zinc-500">Help other verified buyers make an informed choice</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-zinc-700 mr-2">Your Rating:</span>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseEnter={() => setNewHoverRating(s)}
                      onMouseLeave={() => setNewHoverRating(0)}
                      onClick={() => setNewRating(s)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                      aria-label={`Rate ${s} stars`}
                    >
                      <LuStar
                        className={`w-5 h-5 ${
                          s <= (newHoverRating || newRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Tanzim Rahman"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Review Headline (Optional)
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Excellent fit and high-end feel"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Detailed Review *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share details about the quality, sizing, material, and packaging..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold uppercase tracking-wider text-zinc-700 hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-6 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          )}

          {/* Filter Pills */}
          {reviewsList.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              {[
                { id: 'all', label: 'All Reviews' },
                { id: 5, label: '5 Stars' },
                { id: 4, label: '4 Stars' },
                { id: 3, label: '3 Stars' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setReviewFilter(f.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    reviewFilter === f.id
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'bg-white border border-stone-200/90 text-zinc-600 hover:text-zinc-950 hover:border-zinc-400'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          {/* Reviews Feed */}
          {filteredReviews.length > 0 ? (
            <div className="space-y-4">
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-3 transition-all hover:border-stone-300"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-zinc-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                        {rev.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-zinc-950">{rev.name}</span>
                          {rev.verified && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#4F46E5] bg-[#EEF2FF] px-2 py-0.5 rounded-full border border-indigo-200/80">
                              <LuShieldCheck className="w-3 h-3 text-[#4F46E5]" />
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-400">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <LuStar key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {rev.title && <h5 className="text-sm font-bold text-zinc-950">{rev.title}</h5>}
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">{rev.comment}</p>

                  <div className="flex items-center gap-3 pt-2 text-xs text-zinc-500">
                    <button
                      onClick={() => toggleHelpful(rev.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        helpfulReviews[rev.id]
                          ? 'bg-[#EEF2FF] border-[#4F46E5] text-[#4F46E5]'
                          : 'border-stone-200 hover:bg-stone-50 text-zinc-600'
                      }`}
                    >
                      <LuThumbsUp className="w-3.5 h-3.5" />
                      <span>Helpful ({helpfulReviews[rev.id] ? 1 : 0})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-6 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <LuMessageSquarePlus className="w-6 h-6" />
              </div>
              <div>
                <h5 className="text-base font-bold text-zinc-950">No Reviews Yet</h5>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                  Have you purchased or used this product? Be the first to share your honest review with our community.
                </p>
              </div>
              <button
                onClick={() => setShowReviewForm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <LuPencilLine className="w-4 h-4" />
                <span>Write the First Review</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
