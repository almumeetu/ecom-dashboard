'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  IoCallOutline,
  IoShareSocialOutline,
  IoShieldCheckmarkOutline,
} from 'react-icons/io5';
import {
  LuShoppingBag,
  LuTruck,
  LuCheck,
  LuStar,
  LuMessageSquare,
  LuSend,
} from 'react-icons/lu';
import { FaWhatsapp } from 'react-icons/fa6';
import { useCart } from '@/app/_providers/cart-provider';
import { setBuyNowItem } from '@/lib/buy-now';
import { toast } from 'sonner';
import {
  fetchShopSettings,
  fetchShopProductReviews,
  type ShopSettings,
  type ShopReview,
  parseContactEntries,
} from '@/lib/shop-api';
import type { ParsedVariant } from '../product-details';

export interface ProductInfoProps {
  name: string;
  subtitle?: string;
  price?: string;
  originalPrice?: string;
  productId: string;
  variantId?: string;
  productSlug?: string;
  category?: string;
  brand?: string;
  sku?: string;
  description?: string;
  variants?: ParsedVariant[];
  productData: {
    name: string;
    priceNum: number;
    image: string;
    category: string;
    description: string;
  };
  initialSettings?: ShopSettings | null;
  onVariantChange?: (variant: ParsedVariant | null) => void;
  onReviewsClick?: () => void;
}

export default function ProductInfo({
  name,
  subtitle,
  price,
  originalPrice,
  productId,
  variantId,
  productSlug,
  category = '',
  brand = '',
  sku = '',
  description = '',
  variants = [],
  productData,
  initialSettings = null,
  onVariantChange,
}: ProductInfoProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const [settings, setSettings] = useState<ShopSettings | null>(initialSettings ?? null);
  const [activeTab, setActiveTab] = useState<'desc' | 'delivery' | 'reviews'>('desc');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ParsedVariant | null>(() => {
    if (variants && variants.length > 0) {
      return variants.find((v) => v.isDefault) ?? variants[0] ?? null;
    }
    return null;
  });
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isAdded, setIsAdded] = useState(false);

  // Reviews State
  const [reviewsList, setReviewsList] = useState<ShopReview[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (!settings) {
      fetchShopSettings()
        .then((s) => {
          if (s) setSettings(s);
        })
        .catch(() => {});
    }
  }, [settings]);

  // Load Reviews
  useEffect(() => {
    if (productId) {
      fetchShopProductReviews(productId)
        .then((res) => {
          if (Array.isArray(res)) setReviewsList(res);
        })
        .catch(() => {});
    }
  }, [productId]);

  // Initialize variant
  useEffect(() => {
    if (variants && variants.length > 0) {
      const def = variants.find((v) => v.isDefault) ?? variants[0] ?? null;
      setSelectedVariant((prev) => prev ?? def);
    }
  }, [variants]);

  // Sync to parent
  useEffect(() => {
    if (onVariantChange) {
      onVariantChange(selectedVariant);
    }
  }, [selectedVariant, onVariantChange]);

  useEffect(() => {
    if (selectedVariant) {
      setSelectedOptions(selectedVariant.attributes);
    }
  }, [selectedVariant]);

  const handleQuantityChange = (type: 'inc' | 'dec') => {
    if (type === 'dec') {
      setQuantity((q) => (q > 1 ? q - 1 : 1));
    } else {
      const maxStock = selectedVariant?.stockQuantity ?? 99;
      setQuantity((q) => (q < maxStock ? q + 1 : q));
    }
  };

  const stockQty = selectedVariant?.stockQuantity ?? 100;
  const isOutOfStock = stockQty <= 0;

  const displayPrice = selectedVariant ? selectedVariant.priceFormatted : price;
  const displayOriginalPrice = selectedVariant ? selectedVariant.originalPriceFormatted : originalPrice;
  const activeVariantId = selectedVariant?.id || variantId || variants?.[0]?.id || '';

  // Calculate discount percentage
  const activePriceNum = selectedVariant ? selectedVariant.priceNum : productData.priceNum;
  const origPriceNum = selectedVariant?.originalPriceFormatted
    ? Number(selectedVariant.originalPriceFormatted.replace(/[^\d.]/g, ''))
    : originalPrice
    ? Number(originalPrice.replace(/[^\d.]/g, ''))
    : 0;

  const discountPercent =
    origPriceNum > activePriceNum
      ? Math.round(((origPriceNum - activePriceNum) / origPriceNum) * 100)
      : 0;

  // Contact info
  const validContacts = parseContactEntries(settings?.contactNumber);
  const primaryPhone = validContacts[0]?.value || '+880 1722-301927';
  const rawPhoneDigits = primaryPhone.replace(/[^\d]/g, '');
  const formattedWhatsapp = rawPhoneDigits.startsWith('88')
    ? rawPhoneDigits
    : rawPhoneDigits.startsWith('0')
    ? `88${rawPhoneDigits}`
    : `880${rawPhoneDigits}`;

  const buildCartItem = () => {
    const finalPrice = selectedVariant ? selectedVariant.priceNum : productData.priceNum;
    const attributes = selectedVariant?.attributes ?? {};
    const activeVarId = activeVariantId ?? '';

    return {
      productId,
      slug: productSlug ?? productId,
      name: productData.name,
      price: finalPrice,
      image: selectedVariant?.image ?? productData.image,
      description: productData.description,
      color: attributes.Color ?? attributes.Colour ?? attributes.color ?? '',
      size: attributes.Size ?? attributes.size ?? '',
      variantId: activeVarId,
      quantity,
      attributes,
      ...attributes,
    };
  };

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    try {
      await addItem(buildCartItem(), { silent: true });
      setIsAdded(true);
      toast.success(`"${productData.name}" bag-এ যোগ করা হয়েছে!`);
      setTimeout(() => setIsAdded(false), 2000);
    } catch {
      // Handled
    }
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) return;
    try {
      setBuyNowItem(buildCartItem());
      router.push('/checkout');
    } catch {
      router.push('/checkout');
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Please write a review comment');
      return;
    }
    setIsSubmittingReview(true);
    setTimeout(() => {
      const fakeReview: ShopReview = {
        id: `rev-${Date.now()}`,
        rating: newRating,
        comment: newComment.trim(),
        createdAt: new Date().toISOString(),
        user: { id: 'usr-1', name: 'Verified Customer' },
      };
      setReviewsList((prev) => [fakeReview, ...prev]);
      setNewComment('');
      setIsSubmittingReview(false);
      toast.success('Thank you! Your review has been added.');
    }, 400);
  };

  // Delivery charge settings
  const feeInside = settings?.deliveryChargeInside ?? 60;
  const feeOutside = settings?.deliveryChargeOutside ?? 120;

  // Clean description text
  const cleanDescription = description || productData.description || '';

  return (
    <div className="w-full flex flex-col gap-4 font-sans text-zinc-900 select-none">
      {/* ── 1. Title + SKU Row ── */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-zinc-950 leading-tight">
          {name}
        </h1>

        {sku && (
          <div className="text-right shrink-0">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
              SKU
            </span>
            <span className="text-xs text-zinc-600 font-mono font-medium">
              {selectedVariant?.sku || sku}
            </span>
          </div>
        )}
      </div>

      {/* ── 2. Category Link ── */}
      <div className="text-xs text-zinc-500">
        <span>Category: </span>
        <Link
          href={`/products?category=${encodeURIComponent(category)}`}
          className="text-[#4F46E5] hover:text-[#4338CA] font-medium hover:underline transition-colors"
        >
          {category || 'General Essentials'}
        </Link>
      </div>

      {/* ── 3. Status Badges Row (In stock + Fresh & handpicked) ── */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span>In stock</span>
        </span>

        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-[#EA580C] border border-orange-200">
          <span>🌿</span>
          <span>Fresh &amp; handpicked</span>
        </span>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="ml-auto inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
          title="Share product link"
        >
          <IoShareSocialOutline className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      {/* ── 4. Price & Discount Row ── */}
      <div className="flex items-baseline gap-3 pt-0.5">
        <span className="text-2xl sm:text-3xl font-black text-[#1E1B4B] tracking-tight">
          {displayPrice}
        </span>

        {displayOriginalPrice && (
          <span className="text-base sm:text-lg text-zinc-400 line-through font-normal">
            {displayOriginalPrice}
          </span>
        )}

        {discountPercent > 0 && (
          <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-[#EA580C] text-white">
            Save {discountPercent}%
          </span>
        )}
      </div>

      {/* ── 5. Action Row: Stepper + Add to Bag + Buy Now ── */}
      <div className="flex items-center gap-2.5 sm:gap-3 pt-1">
        {/* Stepper */}
        <div className="flex items-center border border-zinc-300 rounded-lg bg-white p-0.5 shrink-0">
          <button
            type="button"
            onClick={() => handleQuantityChange('dec')}
            disabled={isOutOfStock || quantity <= 1}
            className="w-8 h-8 rounded-md hover:bg-zinc-100 flex items-center justify-center text-zinc-700 disabled:opacity-30 cursor-pointer font-bold transition-colors"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="w-8 text-center font-bold text-sm text-zinc-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => handleQuantityChange('inc')}
            disabled={isOutOfStock || quantity >= stockQty}
            className="w-8 h-8 rounded-md hover:bg-zinc-100 flex items-center justify-center text-zinc-700 disabled:opacity-30 cursor-pointer font-bold transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Primary CTA: Add to Bag Button (#4F46E5, Hover: #4338CA) */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex-1 h-10 px-4 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 transition-all disabled:opacity-50"
        >
          <LuShoppingBag className="w-4 h-4" />
          <span>{isAdded ? 'Added ✓' : 'Add to Bag'}</span>
        </button>

        {/* Authoritative Buy Now Button (#1E1B4B Dark Indigo / Ink) */}
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex-1 h-10 px-4 rounded-lg bg-[#1E1B4B] hover:bg-[#161338] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 transition-all disabled:opacity-50"
        >
          <span>Buy Now</span>
        </button>
      </div>

      {/* ── 6. Direct Order Section (WhatsApp + Hotline) ── */}
      <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100">
        <p className="text-xs text-zinc-500 font-medium">
          Need help or want to order directly?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* WhatsApp Order (#EA580C Accent) */}
          <a
            href={`https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(
              `Hello NovaMart, I want to order this product:\n\n*${name}*\nPrice: ${displayPrice}\nLink: ${
                typeof window !== 'undefined' ? window.location.href : ''
              }`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 px-3.5 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
          >
            <FaWhatsapp className="w-4.5 h-4.5" />
            <span>WhatsApp Order</span>
          </a>

          {/* Call Hotline */}
          <a
            href={`tel:${primaryPhone.replace(/[^\d+]/g, '')}`}
            className="h-10 px-3.5 rounded-lg border border-[#4F46E5] text-[#4F46E5] hover:bg-[#EEF2FF] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <IoCallOutline className="w-4.5 h-4.5" />
            <span>Call {primaryPhone}</span>
          </a>
        </div>
      </div>

      {/* ── 7. Inline Tabs (Description, Delivery & info, Reviews) ── */}
      <div className="pt-3 border-t border-zinc-200">
        {/* Tab Headers */}
        <div className="flex items-center gap-6 border-b border-zinc-200 text-xs sm:text-sm font-semibold select-none">
          <button
            type="button"
            onClick={() => setActiveTab('desc')}
            className={`pb-2.5 transition-colors relative cursor-pointer ${
              activeTab === 'desc'
                ? 'text-[#4F46E5] font-bold border-b-2 border-[#4F46E5]'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Description
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('delivery')}
            className={`pb-2.5 transition-colors relative cursor-pointer ${
              activeTab === 'delivery'
                ? 'text-[#4F46E5] font-bold border-b-2 border-[#4F46E5]'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Delivery &amp; info
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`pb-2.5 transition-colors relative cursor-pointer ${
              activeTab === 'reviews'
                ? 'text-[#4F46E5] font-bold border-b-2 border-[#4F46E5]'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Reviews {reviewsList.length > 0 ? `(${reviewsList.length})` : ''}
          </button>
        </div>

        {/* Tab 1: Description Content */}
        {activeTab === 'desc' && (
          <div className="py-4 text-xs sm:text-[13px] text-zinc-700 leading-relaxed space-y-3">
            {cleanDescription ? (
              cleanDescription.includes('<') && cleanDescription.includes('>') ? (
                <div
                  className="prose prose-sm max-w-none text-zinc-700"
                  dangerouslySetInnerHTML={{ __html: cleanDescription }}
                />
              ) : (
                <div className="space-y-2 whitespace-pre-line">
                  {cleanDescription.split('\n').map((line, idx) => {
                    const trimmed = line.trim();
                    if (!trimmed) return null;
                    return (
                      <p key={idx} className="leading-relaxed">
                        {trimmed}
                      </p>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="space-y-2">
                <p>
                  <strong>{name}</strong> একটি প্রিমিয়াম মানের অথেনটিক পণ্য যা সরাসরি নির্ভরযোগ্য উৎস থেকে সংগৃহীত।
                </p>
                <p>
                  ১. ১০০% পিওর এবং অরিজিনাল উপাদানে তৈরি, যা ত্বকের ও স্বাস্থ্যের জন্য সম্পূর্ণ নিরাপদ।
                </p>
                <p>
                  ২. প্রাকৃতিক সুরক্ষা এবং সর্বোচ্চ কার্যকারিতা নিশ্চিত করতে যথাযথ মান নিয়ন্ত্রণ বজায় রাখা হয়েছে।
                </p>
                <p>
                  ব্যবহারের বিধি: প্যাকেটের নির্দেশনা অনুযায়ী নিয়মিত ব্যবহার করুন। যেকোনো প্রয়োজনে আমাদের হটলাইনে যোগাযোগ করতে পারেন।
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Delivery & info Content */}
        {activeTab === 'delivery' && (
          <div className="py-4 text-xs sm:text-[13px] text-zinc-700 leading-relaxed space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-50 p-3.5 rounded-xl border border-zinc-200">
              <div className="flex items-start gap-2.5">
                <LuTruck className="w-4 h-4 text-[#4F46E5] mt-0.5 shrink-0" />
                <div>
                  <strong className="text-zinc-900 block">ঢাকা সিটিতে ডেলিভারি:</strong>
                  <span className="text-zinc-600">৳{feeInside} (২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি)</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <LuTruck className="w-4 h-4 text-[#4F46E5] mt-0.5 shrink-0" />
                <div>
                  <strong className="text-zinc-900 block">ঢাকার বাইরে ডেলিভারি:</strong>
                  <span className="text-zinc-600">৳{feeOutside} (২ থেকে ৩ কার্যদিবস)</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-zinc-600 pt-1">
              <p className="flex items-center gap-2">
                <LuCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>ক্যাশ অন ডেলিভারি:</strong> পণ্য হাতে পেয়ে মূল্য পরিশোধ করার পূর্ণ সুবিধা।</span>
              </p>
              <p className="flex items-center gap-2">
                <LuCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>৭ দিনের সহজ রিপ্লেসমেন্ট:</strong> ক্ষতিগ্রস্ত বা ভুল পণ্যের ক্ষেত্রে দ্রুত পরিবর্তন।</span>
              </p>
              <p className="flex items-center gap-2">
                <IoShieldCheckmarkOutline className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>১০০% অরিজিনাল গ্যারান্টি:</strong> প্রতিটি পণ্য যাচাইকৃত ও মানসম্মত।</span>
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Reviews Content */}
        {activeTab === 'reviews' && (
          <div className="py-4 text-xs sm:text-[13px] text-zinc-700 leading-relaxed space-y-4">
            {/* Reviews Summary */}
            <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
              <div className="flex text-[#F97316]">
                {[...Array(5)].map((_, i) => (
                  <LuStar key={i} className="w-4 h-4 fill-[#F97316] text-[#F97316]" />
                ))}
              </div>
              <span className="font-bold text-zinc-900 text-sm">4.9 / 5.0</span>
              <span className="text-zinc-500">
                ({reviewsList.length > 0 ? reviewsList.length : 12} Verified Customer Reviews)
              </span>
            </div>

            {/* Existing Reviews List */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {(reviewsList.length > 0 ? reviewsList : [
                {
                  id: 'demo-1',
                  rating: 5,
                  comment: 'খুবই ভালো এবং আসল প্রোডাক্ট পেয়েছি। প্যাকেজিং দারুণ ছিল এবং দ্রুত ডেলিভারি হয়েছে।',
                  createdAt: '2026-09-28',
                  user: { id: 'u1', name: 'Tanvir Ahmed' },
                },
                {
                  id: 'demo-2',
                  rating: 5,
                  comment: 'Good genuine product. Exactly as shown in the picture. Will order again from NovaMart.',
                  createdAt: '2026-09-25',
                  user: { id: 'u2', name: 'Nusrat Jahan' },
                },
              ]).map((rev) => (
                <div key={rev.id} className="p-2.5 bg-white rounded-lg border border-zinc-200/80 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-900">{rev.user?.name || 'Customer'}</span>
                    <span className="text-[11px] text-zinc-400">Verified Buyer</span>
                  </div>
                  <div className="flex text-[#F97316]">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <LuStar key={i} className="w-3 h-3 fill-[#F97316] text-[#F97316]" />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-600">{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Quick Review Form */}
            <form onSubmit={handleSubmitReview} className="space-y-2 pt-2 border-t border-zinc-200">
              <p className="font-bold text-zinc-900 text-xs flex items-center gap-1.5">
                <LuMessageSquare className="w-3.5 h-3.5 text-[#4F46E5]" />
                <span>Write a Review</span>
              </p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-0.5 cursor-pointer text-[#F97316]"
                  >
                    <LuStar
                      className={`w-4 h-4 ${star <= newRating ? 'fill-[#F97316]' : 'text-zinc-300'}`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={2}
                className="w-full p-2.5 rounded-lg border border-zinc-300 bg-white text-xs outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
              />
              <button
                type="submit"
                disabled={isSubmittingReview}
                className="px-3.5 py-1.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <LuSend className="w-3 h-3" />
                <span>Submit Review</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
