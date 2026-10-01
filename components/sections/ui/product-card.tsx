"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProductCardProps } from "@/data/types";
import { useWishlist } from "@/app/_providers/wishlist-provider";
import { useCart } from "@/app/_providers/cart-provider";
import { useAuth } from "@/app/_providers/auth-provider";
import type { WishlistProduct } from "@/lib/types";
import { getProductFallbackImage } from "@/lib/admin-api";
import { toast } from "sonner";
import { LuShoppingBag, LuCheck, LuHeart, LuSparkles, LuShieldCheck } from "react-icons/lu";
import { IoStar } from "react-icons/io5";

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  slug,
  category,
  brand,
  vendor,
  rating,
  reviewCount,
  unit,
  badge,
  variantId,
}: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { isAuthenticated, setShowAuthModal } = useAuth();

  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const inWishlist = !!id && isInWishlist(id);
  const priceNum = useMemo(() => parseFloat(price.replace(/[^0-9.-]/g, "")) || 0, [price]);
  const originalNum = useMemo(
    () => (originalPrice ? parseFloat(originalPrice.replace(/[^0-9.-]/g, "")) || 0 : 0),
    [originalPrice]
  );

  const discountPercent = useMemo(() => {
    if (originalNum > priceNum && originalNum > 0) {
      return Math.round(((originalNum - priceNum) / originalNum) * 100);
    }
    return 0;
  }, [originalNum, priceNum]);

  // Deterministic realistic rating & review count
  const ratingValue = useMemo(() => {
    if (rating) return rating.toFixed(1);
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % 100;
    return (4.6 + (hash % 4) * 0.1).toFixed(1);
  }, [rating, name]);

  const reviewCountValue = useMemo(() => {
    if (reviewCount) return reviewCount;
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 19 + name.charCodeAt(i)) % 100;
    return 24 + (hash % 60);
  }, [reviewCount, name]);

  const resolvedImage = useMemo(() => {
    if (imageError || !image) {
      return getProductFallbackImage(name, category);
    }
    return image;
  }, [image, imageError, name, category]);

  const wishlistProduct: WishlistProduct = {
    id: id ?? "",
    name,
    slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    price: priceNum,
    image: resolvedImage,
    color: "",
    size: "",
    category: category || "",
    team: brand || vendor || "",
    variantId,
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addItem(
        {
          id: id || slug || name,
          productId: id,
          slug: slug || id || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          name,
          price: priceNum,
          image: resolvedImage,
          color: "",
          size: "",
          variantId,
          quantity: 1,
        },
        { silent: true }
      );

      setIsAdded(true);
      toast.success(`"${name}" added to cart!`);
      setTimeout(() => setIsAdded(false), 1600);
    } catch {
      // Cart provider handles errors
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!id) return;

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    toggleWishlist(wishlistProduct);
    if (!inWishlist) {
      toast.success(`Saved to wishlist!`);
    } else {
      toast.info(`Removed from wishlist`);
    }
  };

  const isVariantProduct = useMemo(() => {
    // If unit mentions weights or sizes, or category is apparel/fragrance
    const cat = (category || "").toLowerCase();
    const n = name.toLowerCase();
    return (
      cat.includes("cloth") ||
      cat.includes("fashion") ||
      cat.includes("perfume") ||
      n.includes("dates") ||
      n.includes("soap") ||
      n.includes("tang") ||
      n.includes("shampoo") ||
      n.includes("pack") ||
      n.includes("combo")
    );
  }, [category, name]);

  const productUrl = `/products/${slug || id || ""}`;
  const displayCategory = (category || brand || "NovaMart Genuine").toUpperCase();

  return (
    <div className="group relative flex flex-col justify-between w-full h-full bg-white rounded-xl border border-zinc-200/80 hover:border-[#4F46E5]/40 shadow-2xs hover:shadow-lg transition-all duration-300 overflow-hidden mx-auto">
      {/* Top Media & Visual Badge Container */}
      <div className="relative w-full aspect-square bg-[#F8F9FA] overflow-hidden p-3 flex items-center justify-center">
        {/* Floating Left Badges (Dynamic Discount & Special Tag) */}
        <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none flex flex-col gap-1 items-start">
          {discountPercent > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-[#EA580C] text-white shadow-xs tracking-tight">
              -{discountPercent}%
            </span>
          )}
          {badge && !badge.startsWith("-") && badge !== "NEW" && badge !== "HOT" && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#1E1B4B]/90 backdrop-blur-xs text-white shadow-2xs tracking-wider uppercase">
              {badge}
            </span>
          )}
        </div>

        {/* Floating Interactive Wishlist Button (Right) */}
        <div className="absolute top-2.5 right-2.5 z-20">
          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer shadow-xs hover:scale-105 active:scale-95 ${
              inWishlist
                ? "bg-rose-500 text-white shadow-rose-200"
                : "bg-white/90 text-zinc-500 hover:text-rose-500 hover:bg-white border border-zinc-200/70"
            }`}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <LuHeart className={`w-3.5 h-3.5 ${inWishlist ? "fill-white" : ""}`} />
          </button>
        </div>

        {/* Product Image */}
        <Link href={productUrl} className="relative w-full h-full block">
          <Image
            src={resolvedImage}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={() => setImageError(true)}
            unoptimized={resolvedImage.includes("unsplash.com")}
          />
        </Link>
      </div>

      {/* ── Card Body Information ── */}
      <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-grow min-w-0">
        <div>
          {/* Muted Category / Department Tag */}
          <p className="text-[10px] sm:text-[11px] font-semibold text-zinc-400 uppercase tracking-wider truncate mb-1">
            {displayCategory}
          </p>

          {/* Product Title */}
          <Link href={productUrl} className="block group-hover:text-[#4F46E5] transition-colors">
            <h3 className="text-zinc-900 font-bold text-xs sm:text-[13px] leading-snug line-clamp-2 min-h-[2.3rem]">
              {name}
            </h3>
          </Link>

          {/* Price Row */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-sm sm:text-base font-black text-zinc-950 tracking-tight">
              {price}
            </span>
            {originalPrice && (
              <span className="text-xs text-zinc-400 line-through">
                {originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* ── Full Width Bottom Action Button ── */}
        <div className="mt-3">
          {isVariantProduct ? (
            <Link
              href={productUrl}
              className="w-full h-9 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs active:scale-98"
            >
              Select Option
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full h-9 rounded-lg text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs active:scale-98 ${
                isAdded
                  ? "bg-emerald-600 shadow-emerald-200"
                  : "bg-[#4F46E5] hover:bg-[#4338CA] shadow-indigo-200"
              }`}
            >
              {isAdded ? (
                <>
                  <LuCheck className="w-3.5 h-3.5 text-white" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <span>Add to Bag</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
