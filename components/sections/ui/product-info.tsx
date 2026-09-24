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
  IoLockClosedOutline,
  IoBagCheckOutline,
} from 'react-icons/io5';
import { LuRuler, LuStar, LuTruck } from 'react-icons/lu';
import { useCart } from '@/app/_providers/cart-provider';
import { useWishlist } from '@/app/_providers/wishlist-provider';
import { useAuth } from '@/app/_providers/auth-provider';
import { setBuyNowItem } from '@/lib/buy-now';
import { toast } from 'sonner';
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
  onVariantChange?: (variant: ParsedVariant | null) => void;
  onReviewsClick?: () => void;
}

// Color name to hex/preview mapping for rich swatches
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
  onVariantChange,
  onReviewsClick,
}: ProductInfoProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated, setShowAuthModal } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ParsedVariant | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Initialize default variant
  useEffect(() => {
    if (variants && variants.length > 0) {
      const def = variants.find((v) => v.isDefault) ?? variants[0] ?? null;
      setSelectedVariant(def);
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
  const activeVariantId = selectedVariant ? selectedVariant.id : variantId;

  // Calculate discount savings if applicable
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

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(buildCartItem());
    toast.success(`Added ${productData.name} to your bag!`, {
      description: `${quantity} item(s) ready in cart.`,
    });
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

    const optionSummary = selectedVariant
      ? Object.values(selectedVariant.attributes).join(', ')
      : '';
    const finalName = optionSummary
      ? `${productData.name} (${optionSummary})`
      : productData.name;

    toggleWishlist({
      id: productId,
      name: finalName,
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
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  const hasSizeAttribute = Object.keys(allAttributes).some(
    (k) => k.toLowerCase() === 'size'
  );

  return (
    <div className="w-full flex flex-col gap-6 select-none">
      {/* ── Brand & Meta Row ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          {brand && (
            <Link
              href={`/products?brand=${encodeURIComponent(brand)}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-100 text-zinc-900 hover:bg-zinc-900 hover:text-white transition-all shadow-2xs"
            >
              <span>{brand}</span>
              <IoCheckmarkCircle className="w-3.5 h-3.5 text-emerald-600" />
            </Link>
          )}

          {category && (
            <Link
              href={`/products?category=${encodeURIComponent(category)}`}
              className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors uppercase tracking-wider font-semibold"
            >
              {category}
            </Link>
          )}
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-stone-100"
          title="Share Product"
        >
          <IoShareSocialOutline className="w-4 h-4" />
          <span className="hidden sm:inline font-medium">Share</span>
        </button>
      </div>

      {/* ── Product Title & Highlights ───────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900 font-sans leading-tight">
          {name}
        </h1>
        {subtitle && (
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {/* ── Social Proof & Rating Strip ─────────────────────────────── */}
      <div className="flex items-center gap-4 flex-wrap pb-2 border-b border-stone-100">
        <button
          onClick={onReviewsClick}
          className="flex items-center gap-1.5 group cursor-pointer"
        >
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <LuStar
                key={i}
                className="w-4 h-4 fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <span className="text-xs font-bold text-zinc-900 ml-1">4.9</span>
          <span className="text-xs text-zinc-500 group-hover:text-emerald-700 underline underline-offset-2 transition-colors">
            (128 reviews)
          </span>
        </button>

        <span className="text-stone-300">•</span>

        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
          <IoFlashOutline className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>50+ purchased in the last 24h</span>
        </div>
      </div>

      {/* ── Price Block ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 p-4 sm:p-5 rounded-2xl bg-stone-50/80 border border-stone-200/80">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-3xl sm:text-4xl font-extrabold text-zinc-950 font-sans tracking-tight">
            {displayPrice}
          </span>

          {displayOriginalPrice && (
            <span className="text-lg sm:text-xl text-zinc-400 line-through font-medium">
              {displayOriginalPrice}
            </span>
          )}

          {discountPercent > 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
              Save {discountPercent}%
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500 pt-1">
          <IoShieldCheckmarkOutline className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Tax included • Free express shipping on orders over ৳2,000</span>
        </div>
      </div>

      {/* ── Live Inventory Status ────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-xs">
        {isOutOfStock ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            <span>Currently Out of Stock</span>
          </div>
        ) : isLowStock ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span>Only {stockQty} units remaining — order soon!</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            <span>In Stock — Dispatched within 24 hours</span>
          </div>
        )}

        {sku && (
          <span className="text-zinc-400 font-mono text-[11px] ml-auto">
            SKU: {selectedVariant?.sku || sku}
          </span>
        )}
      </div>

      {/* ── Dynamic Variant Selectors ────────────────────────────────── */}
      {Object.keys(allAttributes).length > 0 && (
        <div className="flex flex-col gap-5 py-4 border-y border-stone-200">
          {Object.entries(allAttributes).map(([attrName, values]) => {
            const isColor = attrName.toLowerCase().includes('color') || attrName.toLowerCase().includes('colour');
            const isSize = attrName.toLowerCase().includes('size');
            const currentSelected = selectedOptions[attrName] || values[0];

            return (
              <div key={attrName} className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-bold text-zinc-900">
                    {attrName}: <span className="font-normal text-zinc-600 capitalize">{currentSelected}</span>
                  </span>

                  {isSize && (
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      <LuRuler className="w-3.5 h-3.5" />
                      <span>Size Guide</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2.5 items-center">
                  {values.map((val) => {
                    const isSelected = selectedOptions[attrName] === val;
                    const colorHex = COLOR_MAP[val.toLowerCase().trim()];

                    if (isColor && colorHex) {
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleOptionSelect(attrName, val)}
                          className={`relative w-9 h-9 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                            isSelected
                              ? 'ring-2 ring-zinc-900 ring-offset-2 scale-110 shadow-sm'
                              : 'hover:scale-105 border border-stone-300'
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
                        className={`min-w-[44px] px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm'
                            : 'bg-white border-stone-300 text-zinc-700 hover:border-zinc-900 hover:text-zinc-900'
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

      {/* ── Quantity & High-Conversion Action Controls ────────────────── */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center gap-3">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 p-1 shrink-0">
            <button
              type="button"
              onClick={() => handleQuantityChange('dec')}
              disabled={isOutOfStock || quantity <= 1}
              className="w-9 h-9 rounded-lg bg-white hover:bg-stone-100 flex items-center justify-center text-zinc-700 disabled:opacity-40 transition-colors shadow-2xs cursor-pointer"
              aria-label="Decrease quantity"
            >
              <IoRemoveOutline className="w-4 h-4" />
            </button>
            <div className="w-10 text-center font-bold text-sm text-zinc-900">
              {quantity}
            </div>
            <button
              type="button"
              onClick={() => handleQuantityChange('inc')}
              disabled={isOutOfStock || quantity >= stockQty}
              className="w-9 h-9 rounded-lg bg-white hover:bg-stone-100 flex items-center justify-center text-zinc-700 disabled:opacity-40 transition-colors shadow-2xs cursor-pointer"
              aria-label="Increase quantity"
            >
              <IoAddOutline className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 h-12 px-6 bg-white border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
          >
            <IoBagCheckOutline className="w-4 h-4" />
            <span>Add to Bag</span>
          </button>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() =>
              isAuthenticated ? handleToggleWishlist() : setShowAuthModal(true)
            }
            className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all cursor-pointer shrink-0 shadow-xs ${
              isItInWishlist
                ? 'bg-rose-50 border-rose-300 text-rose-600'
                : 'bg-white border-stone-300 text-zinc-700 hover:border-zinc-900 hover:text-zinc-900'
            }`}
            aria-label="Wishlist"
            title={isItInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isItInWishlist ? (
              <IoHeart className="w-5 h-5 text-rose-600 animate-in zoom-in-50 duration-150" />
            ) : (
              <IoHeartOutline className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Buy Now (Direct Instant Checkout) */}
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="w-full h-13 px-8 bg-zinc-950 hover:bg-zinc-800 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-zinc-950/20 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none hover:scale-[1.01] active:scale-[0.99]"
        >
          <IoFlashOutline className="w-4 h-4 text-amber-400" />
          <span>Buy Now — Instant Checkout</span>
        </button>
      </div>

      {/* ── Delivery Estimator Box ──────────────────────────────────── */}
      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 text-xs space-y-2.5">
        <div className="font-bold text-zinc-900 flex items-center gap-2">
          <LuTruck className="w-4 h-4 text-zinc-900" />
          <span>Estimated Delivery Timeline:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-600">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span><strong>Inside Dhaka:</strong> 1–2 business days</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span><strong>Nationwide:</strong> 2–4 business days</span>
          </div>
        </div>
      </div>

      {/* ── International Buyer Protection & Trust Guarantees ────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-stone-200">
          <IoShieldCheckmarkOutline className="w-5 h-5 text-emerald-600 mb-1" />
          <span className="text-[11px] font-bold text-zinc-900">100% Authentic</span>
          <span className="text-[10px] text-zinc-500">Verified Brand</span>
        </div>
        <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-stone-200">
          <LuTruck className="w-5 h-5 text-blue-600 mb-1" />
          <span className="text-[11px] font-bold text-zinc-900">Fast Dispatch</span>
          <span className="text-[10px] text-zinc-500">Doorstep Delivery</span>
        </div>
        <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-stone-200">
          <IoRepeatOutline className="w-5 h-5 text-purple-600 mb-1" />
          <span className="text-[11px] font-bold text-zinc-900">Easy Returns</span>
          <span className="text-[10px] text-zinc-500">7-Day Guarantee</span>
        </div>
        <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white border border-stone-200">
          <IoLockClosedOutline className="w-5 h-5 text-amber-600 mb-1" />
          <span className="text-[11px] font-bold text-zinc-900">Secure Checkout</span>
          <span className="text-[10px] text-zinc-500">bKash, Cards, COD</span>
        </div>
      </div>

      {/* Size Guide Modal */}
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
