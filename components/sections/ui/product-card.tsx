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
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: id || slug || name,
      productId: id,
      slug: slug || id || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name,
      price: priceNum,
      image: resolvedImage,
      color: "",
      size: "",
      quantity: 1,
    });

    setIsAdded(true);
    toast.success(`Added "${name}" to cart!`);
    setTimeout(() => setIsAdded(false), 1500);
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
    <div className="group relative flex flex-col justify-between w-full h-full bg-white rounded-2xl border border-zinc-200/80 hover:border-emerald-500/40 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden mx-auto">
      {/* Whole Card Clickable Link */}
      {(slug || id) && (
        <Link
          href={productUrl}
          className="absolute inset-0 z-10 cursor-pointer"
          aria-label={`View details for ${name}`}
        />
      )}

      {/* Top Media Container */}
      <div className="relative w-full aspect-square bg-gradient-to-b from-stone-50 to-zinc-100 overflow-hidden flex items-center justify-center p-3">
        {/* Floating Badges (Left) */}
        <div className="absolute top-3 left-3 z-20 flex flex-col items-start gap-1.5 pointer-events-none">
          {discountPercent > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white shadow-xs">
              -{discountPercent}%
            </span>
          )}
          {badge ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-600 text-white shadow-xs">
              {badge}
            </span>
          ) : (category && category.toLowerCase().includes("grocery")) || (category && category.toLowerCase().includes("food")) ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-600 text-white shadow-xs">
              Fresh
            </span>
          ) : null}
        </div>

        {/* Floating Wishlist Button (Right) */}
        <div className="absolute top-3 right-3 z-20">
          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer shadow-sm hover:scale-110 ${
              inWishlist
                ? "bg-rose-50 text-rose-500 border border-rose-200 shadow-rose-100"
                : "bg-white/90 text-zinc-500 hover:text-rose-500 border border-zinc-200/60 hover:bg-white"
            }`}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <LuHeart className={`w-4 h-4 ${inWishlist ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>
        </div>

        {/* Product Image */}
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          <Image
            src={resolvedImage}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out transform-gpu"
            onError={() => setImageError(true)}
            unoptimized={resolvedImage.includes("unsplash.com")}
          />
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow">
        <div>
          {/* Vendor / Brand & Category pill */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md truncate max-w-[170px]">
              <LuStore className="w-3 h-3 shrink-0 text-emerald-600" />
              <span className="truncate">{vendorName}</span>
            </span>

            {category && (
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider truncate">
                {category}
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-zinc-800 font-medium text-sm sm:text-[15px] leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors duration-200">
            {name}
          </h3>

          {/* Rating & Units */}
          <div className="flex items-center justify-between gap-2 mt-2">
            <div className="flex items-center gap-1 text-xs">
              <div className="flex items-center text-amber-400">
                <IoStar className="w-3.5 h-3.5 fill-amber-400" />
              </div>
              <span className="font-bold text-zinc-700 text-xs">{ratingValue}</span>
              <span className="text-zinc-400 text-[11px]">({reviewCountValue})</span>
            </div>

            {unit && (
              <span className="text-[11px] font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                {unit}
              </span>
            )}
          </div>
        </div>

        {/* Pricing and Quick Add to Cart CTA */}
        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between gap-2 z-20">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
                {price}
              </span>
              {originalPrice && (
                <span className="text-xs text-zinc-400 line-through">
                  {originalPrice}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[10px] text-emerald-600 font-semibold">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* 1-Click Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`relative z-20 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
              isAdded
                ? "bg-emerald-600 text-white shadow-emerald-200"
                : "bg-zinc-900 hover:bg-emerald-600 text-white shadow-zinc-200 hover:shadow-md"
            }`}
            aria-label={`Add ${name} to cart`}
          >
            {isAdded ? (
              <>
                <LuCheck className="w-4 h-4 text-white animate-scaleIn" />
                <span>Added</span>
              </>
            ) : (
              <>
                <LuShoppingBag className="w-4 h-4" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
