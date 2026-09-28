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
import { LuShoppingBag, LuCheck, LuStore, LuHeart } from "react-icons/lu";
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

  // Deterministic fallback rating and reviews based on name
  const ratingValue = useMemo(() => {
    if (rating) return rating.toFixed(1);
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % 100;
    return (4.5 + (hash % 5) * 0.1).toFixed(1);
  }, [rating, name]);

  const reviewCountValue = useMemo(() => {
    if (reviewCount) return reviewCount;
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 17 + name.charCodeAt(i)) % 100;
    return 12 + (hash % 45);
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
      toast.success(`Added "${name}" to cart!`);
      setTimeout(() => setIsAdded(false), 1500);
    } catch {
      // Error message is already displayed by cart provider
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
      toast.success(`Added to your wishlist!`);
    } else {
      toast.info(`Removed from wishlist`);
    }
  };

  const productUrl = `/products/${slug || id || ""}`;
  const vendorName = brand || vendor || (category ? `${category} Collection` : "Official Store");

  return (
    <div className="group relative flex flex-col justify-between w-full h-full bg-white rounded-xl sm:rounded-2xl border border-zinc-200/80 hover:border-emerald-500/40 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden mx-auto">
      {/* Whole Card Clickable Link */}
      {(slug || id) && (
        <Link
          href={productUrl}
          className="absolute inset-0 z-10 cursor-pointer"
          aria-label={`View details for ${name}`}
        />
      )}

      {/* Top Media Container */}
      <div className="relative w-full aspect-square bg-gradient-to-b from-stone-50 to-zinc-100 overflow-hidden flex items-center justify-center p-2 sm:p-3">
        {/* Floating Badges (Left) — constrained max-w to prevent overlapping wishlist */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-20 flex flex-col items-start gap-1 pointer-events-none max-w-[calc(100%-42px)] sm:max-w-[calc(100%-52px)]">
          {discountPercent > 0 && (
            <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-rose-500 text-white shadow-2xs">
              -{discountPercent}%
            </span>
          )}
          {badge ? (
            <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-emerald-600 text-white shadow-2xs truncate max-w-full">
              {badge}
            </span>
          ) : (category && category.toLowerCase().includes("grocery")) || (category && category.toLowerCase().includes("food")) ? (
            <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-emerald-600 text-white shadow-2xs truncate max-w-full">
              Fresh
            </span>
          ) : null}
        </div>

        {/* Floating Wishlist Button (Right) */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-20">
          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`w-7.5 h-7.5 sm:w-9 sm:h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${
              inWishlist
                ? "bg-rose-50 text-rose-500 border border-rose-200 shadow-rose-100"
                : "bg-white/90 text-zinc-500 hover:text-rose-500 border border-zinc-200/60 hover:bg-white"
            }`}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <LuHeart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWishlist ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>
        </div>

        {/* Product Image */}
        <div className="relative w-full h-full rounded-lg sm:rounded-xl overflow-hidden">
          <Image
            src={resolvedImage}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out transform-gpu"
            onError={() => setImageError(true)}
            unoptimized={resolvedImage.includes("unsplash.com")}
          />
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-2.5 sm:p-4.5 flex flex-col justify-between flex-grow min-w-0">
        <div>
          {/* Vendor / Brand & Category pill */}
          <div className="flex items-center justify-between gap-1 mb-1 sm:mb-1.5">
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-md truncate max-w-[62%] sm:max-w-[170px]">
              <LuStore className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0 text-emerald-600" />
              <span className="truncate">{vendorName}</span>
            </span>

            {category && (
              <span className="text-[9px] sm:text-[10px] font-medium text-zinc-400 uppercase tracking-wider truncate max-w-[36%] text-right">
                {category}
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-zinc-800 font-medium text-xs sm:text-[15px] leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors duration-200 min-h-[2rem] sm:min-h-[2.5rem]">
            {name}
          </h3>

          {/* Rating & Units */}
          <div className="flex items-center justify-between gap-1 mt-1 sm:mt-2">
            <div className="flex items-center gap-1 text-[11px] sm:text-xs">
              <div className="flex items-center text-amber-400">
                <IoStar className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400" />
              </div>
              <span className="font-bold text-zinc-700">{ratingValue}</span>
              <span className="text-zinc-400 text-[10px] sm:text-[11px]">({reviewCountValue})</span>
            </div>

            {unit && (
              <span className="text-[9px] sm:text-[10px] font-medium text-zinc-500 bg-zinc-100 px-1.5 sm:px-2 py-0.5 rounded shrink-0">
                {unit}
              </span>
            )}
          </div>
        </div>

        {/* Pricing and Quick Add to Cart CTA (Overlap-Proof) */}
        <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-zinc-100 flex items-center justify-between gap-1.5 sm:gap-2 z-20">
          <div className="flex flex-col min-w-0 pr-1">
            <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
              <span className="text-sm sm:text-lg font-bold text-zinc-900 tracking-tight whitespace-nowrap">
                {price}
              </span>
              {originalPrice && (
                <span className="text-[10px] sm:text-xs text-zinc-400 line-through whitespace-nowrap">
                  {originalPrice}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold truncate">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* 1-Click Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`relative z-20 shrink-0 h-8 sm:h-9 px-2 sm:px-3.5 rounded-lg sm:rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all duration-200 cursor-pointer shadow-2xs active:scale-95 ${
              isAdded
                ? "bg-emerald-600 text-white shadow-emerald-200"
                : "bg-zinc-900 hover:bg-emerald-600 text-white shadow-zinc-200 hover:shadow-md"
            }`}
            aria-label={`Add ${name} to cart`}
          >
            {isAdded ? (
              <>
                <LuCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white animate-scaleIn shrink-0" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <LuShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
