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
import { LuShoppingBag, LuCheck, LuHeart } from "react-icons/lu";

const IMAGE_FRAME_HEIGHT = "h-44 sm:h-48 lg:h-52";

export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true" className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-store-border bg-white animate-pulse">
      <div className={`${IMAGE_FRAME_HEIGHT} flex shrink-0 items-center justify-center border-b border-store-surface px-5 py-5 sm:px-6 sm:py-6`}>
        <div className="h-full w-full max-w-[190px] rounded-md bg-zinc-100" />
      </div>
      <div className="p-3 sm:p-3.5">
        <div className="flex h-10 flex-col gap-2">
        <div className="h-3 w-full rounded bg-zinc-100" />
          <div className="h-3 w-3/4 rounded bg-zinc-100" />
        </div>
        <div className="mt-3 flex min-h-11 items-start justify-between gap-2">
          <div className="flex flex-col gap-2">
            <div className="h-4 w-16 rounded bg-zinc-100" />
            <div className="h-3 w-12 rounded bg-zinc-100" />
          </div>
          <div className="h-9 w-9 rounded-md bg-zinc-100" />
        </div>
      </div>
    </div>
  );
}

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
  variantId,
}: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { isAuthenticated, setShowAuthModal } = useAuth();

  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const inWishlist = !!id && isInWishlist(id);
  const priceNum = useMemo(() => parseFloat(price.replace(/[^0-9.-]/g, "")) || 0, [price]);

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
    // Products with options open their details before adding to the bag.
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

  return (
    <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-store-border bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-store-light hover:shadow-[0_12px_32px_rgba(20,38,56,0.08)]">
      <div className={`${IMAGE_FRAME_HEIGHT} relative w-full shrink-0 overflow-hidden border-b border-store-surface bg-store-page`}>
        <Link href={productUrl} aria-label={`View ${name}`} className="flex h-full w-full items-center justify-center px-5 py-5 sm:px-6 sm:py-6">
          <div className="relative h-full w-full max-w-[190px]">
            <Image
              src={resolvedImage}
              alt={name}
              fill
              sizes="(max-width: 639px) 140px, 190px"
              className="object-contain object-center"
              onError={() => setImageError(true)}
              unoptimized={resolvedImage.includes("unsplash.com")}
            />
          </div>
        </Link>
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={inWishlist ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
          aria-pressed={inWishlist}
          className={`absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-store-accent ${
            inWishlist
              ? "border-rose-100 bg-rose-50 text-rose-500"
              : "border-zinc-200/80 bg-white/95 text-zinc-400 hover:border-rose-100 hover:text-rose-500"
          }`}
        >
          <LuHeart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-3.5">
        <Link href={productUrl} title={name} className="block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-store-accent">
          <h3 className="h-10 line-clamp-2 break-words text-[13px] font-medium leading-5 text-zinc-800 transition-colors hover:text-store-accent sm:text-sm">
            {name}
          </h3>
        </Link>

        <div className="mt-3 flex min-h-11 items-start justify-between gap-2">
          <div className="min-w-0 tabular-nums">
            <span className="block text-sm font-semibold leading-5 text-store-price sm:text-base [overflow-wrap:anywhere]">
              {price}
            </span>
            {originalPrice && (
              <span className="mt-0.5 block text-[11px] leading-4 text-zinc-500 line-through sm:text-xs">
                {originalPrice}
              </span>
            )}
          </div>
          {isVariantProduct ? (
            <Link
              href={productUrl}
              aria-label={`Choose options for ${name}`}
              title="Choose options"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-store-primary bg-white text-store-primary transition-colors hover:bg-store-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-store-accent"
            >
              <LuShoppingBag className="h-4 w-4" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              aria-label={isAdded ? `${name} added to bag` : `Add ${name} to bag`}
              title={isAdded ? "Added to bag" : "Add to bag"}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-store-accent ${
                isAdded
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-store-primary bg-store-primary text-white hover:border-store-hover hover:bg-store-hover"
              }`}
            >
              {isAdded ? <LuCheck className="h-4 w-4" /> : <LuShoppingBag className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
