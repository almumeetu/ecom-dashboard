'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  IoHeartOutline,
  IoHeart,
  IoAddOutline,
  IoRemoveOutline,
  IoShareSocialOutline,
  IoCheckmarkCircle,
  IoShieldCheckmarkOutline,
  IoFlashOutline,
  IoRepeatOutline,
  IoBagCheckOutline,
  IoLogoWhatsapp,
  IoCallOutline,
} from 'react-icons/io5';
import { LuRuler, LuStar, LuTruck, LuSparkles, LuCheck, LuShieldCheck } from 'react-icons/lu';
import { useCart } from '@/app/_providers/cart-provider';
import { useWishlist } from '@/app/_providers/wishlist-provider';
import { useAuth } from '@/app/_providers/auth-provider';
import { setBuyNowItem } from '@/lib/buy-now';
import { toast } from 'sonner';
import { fetchShopSettings, type ShopSettings } from '@/lib/shop-api';
import SizeGuideModal from './size-guide-modal';
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

// Color name to hex mapping for rich swatches
const COLOR_MAP: Record<string, string> = {
  black: '#18181b',
  white: '#ffffff',
  red: '#dc2626',
  blue: '#2563eb',
  navy: '#1e3a8a',
  green: '#16a34a',
  olive: '#556b2f',
  gray: '#71717a',
  grey: '#71717a',
  charcoal: '#334155',
  brown: '#78350f',
  tan: '#d97706',
  beige: '#f5f5dc',
  yellow: '#eab308',
  purple: '#9333ea',
  pink: '#ec4899',
  orange: '#f97316',
};

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
  variants = [],
  productData,
  initialSettings = null,
  onVariantChange,
  onReviewsClick,
}: ProductInfoProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated, setShowAuthModal } = useAuth();

  const [settings, setSettings] = useState<ShopSettings | null>(initialSettings ?? null);

  useEffect(() => {
    if (!settings) {
      fetchShopSettings()
        .then((s) => {
          if (s) setSettings(s);
        })
        .catch(() => {});
    }
  }, [settings]);

  const insideFeeText = useMemo(() => {
    if (settings?.deliveryChargeInside === undefined || settings?.deliveryChargeInside === null) {
      return '৳৬০';
    }
    const val = Number(settings.deliveryChargeInside);
    return val === 0 ? 'ফ্রি' : `৳${val}`;
  }, [settings?.deliveryChargeInside]);

  const outsideFeeText = useMemo(() => {
    if (settings?.deliveryChargeOutside === undefined || settings?.deliveryChargeOutside === null) {
      return '৳১২০';
    }
    const val = Number(settings.deliveryChargeOutside);
    return val === 0 ? 'ফ্রি' : `৳${val}`;
  }, [settings?.deliveryChargeOutside]);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ParsedVariant | null>(() => {
    if (variants && variants.length > 0) {
      return variants.find((v) => v.isDefault) ?? variants[0] ?? null;
    }
    return null;
  });
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Initialize default variant
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

  // Extract all unique attribute groups and values
  const allAttributes = useMemo(() => {
    if (!variants) return {};
    const attrs: Record<string, Set<string>> = {};
    variants.forEach((v) => {
      Object.entries(v.attributes).forEach(([key, val]) => {
        if (!attrs[key]) {
          attrs[key] = new Set<string>();
        }
        attrs[key].add(val);
      });
    });
    return Object.entries(attrs).reduce((acc, [key, set]) => {
      acc[key] = Array.from(set);
      return acc;
    }, {} as Record<string, string[]>);
  }, [variants]);

  const handleOptionSelect = (attrName: string, val: string) => {
    const nextOptions = { ...selectedOptions, [attrName]: val };
    setSelectedOptions(nextOptions);

    if (variants) {
      const match = variants.find((v) =>
        Object.entries(nextOptions).every(([k, selectVal]) => v.attributes[k] === selectVal)
      );
      if (match) {
        setSelectedVariant(match);
      }
    }
  };

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
  const isLowStock = stockQty > 0 && stockQty <= 10;

  const displayPrice = selectedVariant ? selectedVariant.priceFormatted : price;
  const displayOriginalPrice = selectedVariant ? selectedVariant.originalPriceFormatted : originalPrice;
  const activeVariantId = selectedVariant?.id || variantId || variants?.[0]?.id || '';

  // Calculate discount savings
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

  const savingsAmount = origPriceNum > activePriceNum ? origPriceNum - activePriceNum : 0;

  const buildCartItem = () => {
    const finalPrice = selectedVariant ? selectedVariant.priceNum : productData.priceNum;
    const attributes = selectedVariant?.attributes ?? {};
    const activeVarId = activeVariantId ?? '';

    const optionSummary = selectedVariant
      ? Object.values(selectedVariant.attributes).join(', ')
      : '';
    const finalName = optionSummary
      ? `${productData.name} (${optionSummary})`
      : productData.name;

    return {
      productId,
      slug: productSlug ?? productId,
      name: finalName,
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
      toast.success(`"${productData.name}" কার্টে যুক্ত হয়েছে!`);
      setTimeout(() => setIsAdded(false), 2000);
    } catch {
      // Error handled by CartProvider
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

  const isItInWishlist = isInWishlist(productId);

  const handleToggleWishlist = () => {
    const finalPrice = selectedVariant ? selectedVariant.priceNum : productData.priceNum;
    const attributes = selectedVariant?.attributes ?? {};
    const activeVarId = activeVariantId ?? '';

    toggleWishlist({
      id: productId,
      name: productData.name,
      slug: productSlug ?? productId,
      price: finalPrice,
      image: productData.image,
      description: productData.description,
      color: attributes.Color ?? attributes.Colour ?? attributes.color ?? '',
      size: attributes.Size ?? attributes.size ?? '',
      category: productData.category,
      team: brand,
      variantId: activeVarId,
      attributes,
      ...attributes,
    });

    if (!isItInWishlist) {
      toast.success('উইশলিস্টে সেভ করা হয়েছে!');
    } else {
      toast.info('উইশলিস্ট থেকে সরানো হয়েছে');
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('প্রোডাক্ট লিংক কপি করা হয়েছে!');
    }
  };

  const hasSizeAttribute = Object.keys(allAttributes).some(
    (k) => k.toLowerCase() === 'size'
  );

  return (
    <div className="w-full flex flex-col gap-5 select-none font-sans text-zinc-900">
      {/* ── 1. Top Badges & Share Bar ─────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {brand ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              <LuShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{brand}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              <LuShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>NovaMart 100% Genuine</span>
            </span>
          )}

          {category && (
            <Link
              href={`/products?category=${encodeURIComponent(category)}`}
              className="text-xs text-zinc-500 hover:text-emerald-700 transition-colors uppercase tracking-wider font-semibold"
            >
              {category}
            </Link>
          )}
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-zinc-100"
          title="Share Product"
        >
          <IoShareSocialOutline className="w-4 h-4" />
          <span className="font-medium">Share</span>
        </button>
      </div>

      {/* ── 2. Product Title & Subtitle ─────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 leading-[1.25]">
          {name}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {/* ── 3. Reviews & Trust Strip ─────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap text-xs pb-1">
        <button
          onClick={onReviewsClick}
          className="flex items-center gap-1.5 group cursor-pointer"
        >
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <LuStar key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="font-bold text-zinc-950">4.9</span>
          <span className="text-zinc-400 group-hover:text-emerald-700 transition-colors">
            (128 কাস্টমার রিভিউ)
          </span>
        </button>

        <span className="text-zinc-300">•</span>

        <span className="text-emerald-700 font-semibold flex items-center gap-1">
          <IoCheckmarkCircle className="w-3.5 h-3.5" />
          <span>ভেরিফাইড অরিজিনাল স্টক</span>
        </span>
      </div>

      {/* ── 4. Price & Discount Card ─────────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F9FA] border border-zinc-200/90 flex flex-col gap-2 shadow-2xs">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
            {displayPrice}
          </span>

          {displayOriginalPrice && (
            <span className="text-lg sm:text-xl text-zinc-400 line-through font-semibold">
              {displayOriginalPrice}
            </span>
          )}

          {discountPercent > 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#E53E3E] text-white shadow-2xs">
              -{discountPercent}% OFF {savingsAmount > 0 ? `(৳${savingsAmount.toLocaleString('en-BD')} সাশ্রয়)` : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500 pt-1">
          <IoShieldCheckmarkOutline className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা প্রযোজ্য</span>
        </div>
      </div>

      {/* ── 5. Live Stock Status & SKU ─────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2 text-xs">
        {isOutOfStock ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            <span>Currently Out of Stock</span>
          </div>
        ) : isLowStock ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>আর মাত্র {stockQty} টি অবশিষ্ট আছে</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>ইন-স্টক (২৪ ঘণ্টার মধ্যে ডেলিভারির জন্য প্রস্তুত)</span>
          </div>
        )}

        {sku && (
          <span className="text-zinc-400 font-mono text-[11px]">
            SKU: {selectedVariant?.sku || sku}
          </span>
        )}
      </div>

      {/* ── 6. Dynamic Variant Options (If Any) ────────────────────────── */}
      {Object.keys(allAttributes).length > 0 && (
        <div className="flex flex-col gap-4 py-3 border-y border-zinc-200">
          {Object.entries(allAttributes).map(([attrName, values]) => {
            const isColor = attrName.toLowerCase().includes('color') || attrName.toLowerCase().includes('colour');
            const isSize = attrName.toLowerCase().includes('size');
            const currentSelected = selectedOptions[attrName] || values[0];

            return (
              <div key={attrName} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-bold text-zinc-900">
                    {attrName}: <span className="font-semibold text-emerald-700 capitalize ml-1">{currentSelected}</span>
                  </span>

                  {isSize && (
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="inline-flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-950 underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      <LuRuler className="w-3.5 h-3.5 text-zinc-700" />
                      <span className="font-medium">Size Guide</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  {values.map((val) => {
                    const isSelected = selectedOptions[attrName] === val;
                    const colorHex = COLOR_MAP[val.toLowerCase().trim()];

                    if (isColor && colorHex) {
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleOptionSelect(attrName, val)}
                          className={`relative w-8 h-8 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                            isSelected
                              ? 'ring-2 ring-emerald-600 ring-offset-2 scale-110 shadow-sm'
                              : 'hover:scale-105 border border-zinc-300'
                          }`}
                          style={{ backgroundColor: colorHex }}
                          title={val}
                          aria-label={val}
                        >
                          {isSelected && (
                            <IoCheckmarkCircle
                              className={`w-4 h-4 ${
                                val.toLowerCase() === 'white' || val.toLowerCase() === 'beige'
                                  ? 'text-zinc-900'
                                  : 'text-white'
                              }`}
                            />
                          )}
                        </button>
                      );
                    }

                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleOptionSelect(attrName, val)}
                        className={`min-w-[42px] px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0D7053] border-[#0D7053] text-white shadow-xs'
                            : 'bg-white border-zinc-300 text-zinc-800 hover:border-emerald-600'
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 7. Primary Action Controls (High-Conversion & Simple) ──────── */}
      <div className="flex flex-col gap-3 pt-1">
        {/* Quantity Stepper + Add to Bag + Wishlist */}
        <div className="flex items-center gap-3">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-zinc-300 rounded-xl bg-zinc-50 p-1 shrink-0">
            <button
              type="button"
              onClick={() => handleQuantityChange('dec')}
              disabled={isOutOfStock || quantity <= 1}
              className="w-9 h-9 rounded-lg bg-white hover:bg-zinc-100 flex items-center justify-center text-zinc-700 disabled:opacity-40 transition-colors shadow-2xs cursor-pointer"
              aria-label="Decrease quantity"
            >
              <IoRemoveOutline className="w-4 h-4" />
            </button>
            <div className="w-10 text-center font-black text-sm text-zinc-900">
              {quantity}
            </div>
            <button
              type="button"
              onClick={() => handleQuantityChange('inc')}
              disabled={isOutOfStock || quantity >= stockQty}
              className="w-9 h-9 rounded-lg bg-white hover:bg-zinc-100 flex items-center justify-center text-zinc-700 disabled:opacity-40 transition-colors shadow-2xs cursor-pointer"
              aria-label="Increase quantity"
            >
              <IoAddOutline className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Bag Button (Warm Orange matching screenshot) */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 h-12 px-6 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-40 active:scale-98 ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#E87A18] hover:bg-[#D46B0E] text-white shadow-orange-200'
            }`}
          >
            {isAdded ? (
              <>
                <LuCheck className="w-4 h-4" />
                <span>কার্টে যুক্ত হয়েছে ✓</span>
              </>
            ) : (
              <>
                <IoBagCheckOutline className="w-4 h-4" />
                <span>Add to Bag</span>
              </>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() =>
              isAuthenticated ? handleToggleWishlist() : setShowAuthModal(true)
            }
            className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all cursor-pointer shrink-0 shadow-2xs ${
              isItInWishlist
                ? 'bg-rose-50 border-rose-300 text-rose-600'
                : 'bg-white border-zinc-300 text-zinc-600 hover:text-rose-600 hover:border-rose-300'
            }`}
            aria-label="Wishlist"
            title={isItInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isItInWishlist ? (
              <IoHeart className="w-5 h-5 text-rose-600" />
            ) : (
              <IoHeartOutline className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Direct Order Now (Instant Cash on Delivery Checkout) */}
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="w-full h-12 px-6 bg-[#0D7053] hover:bg-[#0B6046] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-800/20 transition-all cursor-pointer disabled:opacity-40 active:scale-98"
        >
          <IoFlashOutline className="w-4 h-4 text-amber-300" />
          <span>অর্ডার করুন (ক্যাশ অন ডেলিভারি)</span>
        </button>

        {/* WhatsApp Direct Order Button */}
        <a
          href={`https://wa.me/8801712345678?text=${encodeURIComponent(
            `আসসালামু আলাইকুম NovaMart, আমি এই পণ্যটি অর্ডার করতে চাই:\n\nপণ্য: ${name}\nমূল্য: ${displayPrice}\nলিংক: ${typeof window !== 'undefined' ? window.location.href : ''}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-11 px-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <IoLogoWhatsapp className="w-4.5 h-4.5" />
          <span>WhatsApp এ সরাসরি অর্ডার বা মেসেজ করুন</span>
        </a>
      </div>

      {/* ── 8. Unified Bangladesh Delivery & Trust Card ─────────────────── */}
      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90 text-xs space-y-3">
        <div className="font-bold text-zinc-950 flex items-center gap-2 border-b border-zinc-200/80 pb-2">
          <LuTruck className="w-4 h-4 text-[#0D7053]" />
          <span>ডেলিভারি ও সেবা সংক্রান্ত তথ্য:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-zinc-700">
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
            <span><strong>ঢাকা সিটিতে:</strong> {insideFeeText} (২৪–৪৮ ঘণ্টা)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
            <span><strong>ঢাকার বাইরে:</strong> {outsideFeeText} (২–৩ দিন)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
            <span><strong>ক্যাশ অন ডেলিভারি:</strong> পণ্য দেখে মূল্য পরিশোধ</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
            <span><strong>রিটার্ন পলিসি:</strong> ৭ দিনের সহজ রিপ্লেসমেন্ট</span>
          </div>
        </div>

        <div className="pt-2 border-t border-zinc-200/80 flex items-center justify-between text-zinc-600 text-[11px]">
          <span className="flex items-center gap-1">
            <IoShieldCheckmarkOutline className="w-3.5 h-3.5 text-emerald-600" />
            <span>১০০% আসল পণ্যের গ্যারান্টি</span>
          </span>
          <a href="tel:01712345678" className="flex items-center gap-1 text-emerald-700 font-bold hover:underline">
            <IoCallOutline className="w-3.5 h-3.5" />
            <span>হটলাইন: 01712-345678</span>
          </a>
        </div>
      </div>

      {/* Size Guide Modal (When Applicable) */}
      {hasSizeAttribute && (
        <SizeGuideModal
          isOpen={isSizeGuideOpen}
          onClose={() => setIsSizeGuideOpen(false)}
          category={category}
        />
      )}
    </div>
  );
}
