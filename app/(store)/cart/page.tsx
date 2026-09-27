"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/_providers/cart-provider";
import { useWishlist } from "@/app/_providers/wishlist-provider";
import { useAuth } from "@/app/_providers/auth-provider";
import { useCurrency } from "@/lib/currency-context";
import {
  LuMinus,
  LuPlus,
  LuArrowLeft,
  LuLock,
  LuChevronUp,
  LuTrash2,
  LuLoader,
  LuTag,
  LuTruck,
  LuCheck,
} from "react-icons/lu";
import {
  IoHeartOutline,
  IoHeart,
  IoChevronDownOutline,
  IoAlertCircleOutline,
  IoCallOutline,
} from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa6";
import { toast } from "sonner";
import type { WishlistProduct, CartItem } from "@/lib/types";
import { clearBuyNowItem } from "@/lib/buy-now";
import { fetchShopProductById } from "@/lib/shop-api";
import { resolveImageUrl } from "@/lib/admin-api";
import type { Product as AdminProduct } from "@/lib/admin-api";
import PageBanner from "@/components/ui/page-banner";

export default function CartPage() {
  const { items, updateQuantity, removeItem, addItem, updateCartItem, initialised } = useCart();
  const { isAuthenticated, setShowAuthModal } = useAuth();
  const { formatCurrency } = useCurrency();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const router = useRouter();

  const [promoOpen, setPromoOpen] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [deliveryZone, setDeliveryZone] = useState<"dhaka" | "outside">("dhaka");

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [cartProducts, setCartProducts] = useState<Record<string, AdminProduct>>({});
  const [loadingProducts, setLoadingProducts] = useState<Record<string, boolean>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const handleDropdownToggle = useCallback(
    async (itemId: string, productId: string, currentItem: CartItem) => {
      if (openDropdownId === itemId) {
        setOpenDropdownId(null);
        return;
      }
      setOpenDropdownId(itemId);

      const initialOptions: Record<string, string> = {};
      if (currentItem.color) initialOptions["Color"] = currentItem.color;
      if (currentItem.size) initialOptions["Size"] = currentItem.size;
      if (currentItem.attributes) {
        Object.assign(initialOptions, currentItem.attributes);
      }
      setSelectedOptions(initialOptions);

      if (productId && !cartProducts[productId] && !loadingProducts[productId]) {
        setLoadingProducts((prev) => ({ ...prev, [productId]: true }));
        try {
          const prod = await fetchShopProductById(productId);
          if (prod) {
            setCartProducts((prev) => ({ ...prev, [productId]: prod }));
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingProducts((prev) => ({ ...prev, [productId]: false }));
        }
      }
    },
    [openDropdownId, cartProducts, loadingProducts]
  );

  const getProductVariants = useCallback(
    (productId: string) => {
      const prod = cartProducts[productId];
      if (!prod) return [];
      return (prod.variants ?? []).map((v) => {
        const priceNum = Number(v.price ?? 0);
        const discountNum = prod.discountPrice ? Number(prod.discountPrice) : 0;
        const showOriginal = discountNum > 0 && discountNum < priceNum;
        const activePrice = showOriginal ? discountNum : priceNum;

        const attributesMap: Record<string, string> = {};
        (v as any).attributes?.forEach((attr: any) => {
          const attrName = attr.attributeValue?.attribute?.name;
          const attrVal = attr.attributeValue?.value;
          if (attrName && attrVal) {
            attributesMap[attrName] = attrVal;
          }
        });
        const optionNames = Object.values(attributesMap).filter(Boolean).join(" / ");

        const variantImages = (v as any).media
          ? ((v as any).media as any[])
              .slice()
              .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
              .map((m) => resolveImageUrl(m.media?.url))
              .filter(Boolean) as string[]
          : [];
        const variantImage = variantImages[0] ?? undefined;

        return {
          id: v.id,
          name: optionNames || "Default",
          price: activePrice,
          image: variantImage,
          attributes: attributesMap,
          stockQuantity: v.stockQuantity,
        };
      });
    },
    [cartProducts]
  );

  const getMatchedVariant = useCallback(
    (productId: string) => {
      const variantsList = getProductVariants(productId);
      if (variantsList.length === 0) return null;
      return (
        variantsList.find((v) => {
          return Object.entries(selectedOptions).every(
            ([k, selectVal]) => v.attributes[k] === selectVal
          );
        }) ?? null
      );
    },
    [getProductVariants, selectedOptions]
  );

  const getUniqueAttributes = useCallback(
    (productId: string) => {
      const variantsList = getProductVariants(productId);
      const attrs: Record<string, Set<string>> = {};
      variantsList.forEach((v) => {
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
    },
    [getProductVariants]
  );

  const getMatchedVariantImage = useCallback(
    (item: CartItem) => {
      const matched = getMatchedVariant(item.productId || "");
      return matched?.image || item.image;
    },
    [getMatchedVariant]
  );

  const getMatchedVariantPrice = useCallback(
    (item: CartItem) => {
      const matched = getMatchedVariant(item.productId || "");
      return matched ? formatCurrency(matched.price) : formatCurrency(item.price);
    },
    [getMatchedVariant, formatCurrency]
  );

  const isMatchedVariantOutOfStock = useCallback(
    (item: CartItem) => {
      const matched = getMatchedVariant(item.productId || "");
      return matched ? matched.stockQuantity <= 0 : false;
    },
    [getMatchedVariant]
  );

  const isApplyDisabled = useCallback(
    (item: CartItem) => {
      const matched = getMatchedVariant(item.productId || "");
      if (!matched) return true;
      if (matched.stockQuantity <= 0) return true;
      return matched.id === item.variantId;
    },
    [getMatchedVariant]
  );

  const handleUpdateVariant = useCallback(
    async (
      oldItem: CartItem,
      newVariantId: string,
      newPrice: number,
      newImage: string,
      newAttributes: Record<string, string>
    ) => {
      const nameWithoutOptions = oldItem.name.replace(/\s*\([^)]+\)$/, "");
      const optionNames = Object.values(newAttributes).filter(Boolean).join(", ");
      const newDisplayName = optionNames ? `${nameWithoutOptions} (${optionNames})` : nameWithoutOptions;

      const newColor = newAttributes.Color || newAttributes.Colour || newAttributes.color || "";
      const newSize = newAttributes.Size || newAttributes.size || "";

      await updateCartItem(oldItem.id ?? oldItem.variantId ?? oldItem.slug, {
        variantId: newVariantId,
        name: newDisplayName,
        price: newPrice,
        image: newImage,
        color: newColor,
        size: newSize,
        attributes: newAttributes,
      });
      setOpenDropdownId(null);
      toast.success("Item options updated!");
    },
    [updateCartItem]
  );

  const handleApplyChange = useCallback(
    async (item: CartItem) => {
      const matched = getMatchedVariant(item.productId || "");
      if (!matched) return;
      try {
        await handleUpdateVariant(
          item,
          matched.id,
          matched.price,
          matched.image || item.image,
          matched.attributes
        );
      } catch (err) {
        console.error(err);
      }
    },
    [getMatchedVariant, handleUpdateVariant]
  );

  const handleDecrement = useCallback(
    (itemId: string, currentQty: number) => {
      if (currentQty <= 1) {
        removeItem(itemId);
        toast.info("Item removed from cart");
      } else {
        updateQuantity(itemId, currentQty - 1);
      }
    },
    [removeItem, updateQuantity]
  );

  const handleToggleWishlist = useCallback(
    (item: (typeof items)[0]) => {
      const productId = item.productId || item.id || item.slug;
      const wishlistItem: WishlistProduct = {
        id: productId,
        name: item.name,
        slug: item.slug,
        price: item.price,
        image: item.image,
        color: item.color || "",
        size: item.size || "",
        category: "",
        team: "",
        variantId: item.variantId,
      };
      toggleWishlist(wishlistItem);
    },
    [toggleWishlist]
  );

  // Price & Delivery Calculations
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  // Free delivery threshold: ৳1,999 for Dhaka / Uttara
  const isDhakaFree = deliveryZone === "dhaka" && subtotal >= 1999;
  const baseShipping = deliveryZone === "dhaka" ? (isDhakaFree ? 0 : 60) : 120;

  // Active Promo Code calculation
  const promoDiscount = useMemo(() => {
    if (!appliedPromo) return 0;
    const code = appliedPromo.toUpperCase();
    if (code === "WEBDEV10") {
      return Math.round(subtotal * 0.1); // 10% off
    }
    if (code === "UTTARA") {
      return deliveryZone === "dhaka" ? (isDhakaFree ? 0 : 60) : 60; // Free Dhaka shipping equivalent
    }
    if (code === "WELCOME50") {
      return Math.min(50, subtotal);
    }
    return 0;
  }, [appliedPromo, subtotal, deliveryZone, isDhakaFree]);

  const total = Math.max(0, subtotal + baseShipping - promoDiscount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoInput.trim().toUpperCase();
    if (!clean) return;

    if (clean === "WEBDEV10" || clean === "UTTARA" || clean === "WELCOME50") {
      setAppliedPromo(clean);
      toast.success(`Coupon "${clean}" applied successfully!`);
      setPromoInput("");
    } else {
      toast.error("Invalid coupon code. Try 'WEBDEV10' for 10% off or 'UTTARA' for free delivery!");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    toast.info("Coupon removed.");
  };

  return (
    <main className="flex-grow bg-[#FAFAFA] w-full min-h-screen font-sans">
      <PageBanner
        title="Your Shopping Cart"
        subtitle={
          items.length > 0
            ? `Review your ${items.length} selected item${items.length === 1 ? "" : "s"} before secure checkout.`
            : "Your shopping bag is empty. Explore our verified marketplace for fresh deals!"
        }
        badge="A PRODUCT OF WEBDEV SOFTWARE SOLUTIONS"
        breadcrumbs={[
          { label: "Products", href: "/products" },
          { label: "Shopping Cart" },
        ]}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {!initialised ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 animate-pulse">
            <div className="space-y-4">
              <div className="h-8 bg-zinc-200 rounded w-1/4" />
              <div className="h-32 bg-white rounded-2xl border border-zinc-200" />
              <div className="h-32 bg-white rounded-2xl border border-zinc-200" />
            </div>
            <div className="h-96 bg-white rounded-2xl border border-zinc-200" />
          </div>
        ) : items.length === 0 ? (
          /* ── Modern Empty Cart State ── */
          <div className="max-w-2xl mx-auto text-center py-16 px-4">
            <div className="w-24 h-24 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
              <LuTruck className="w-12 h-12" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
              Your Shopping Cart is Empty
            </h2>
            <p className="text-sm text-zinc-500 mt-2 max-w-md mx-auto leading-relaxed">
              Looks like you haven&apos;t added any items to your bag yet. Discover fresh groceries, trending fashion, and authentic lifestyle products dispatched from our Uttara hub.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/products"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                Browse Marketplace
              </Link>
              <Link
                href="/products?search=grocery"
                className="bg-white hover:bg-zinc-100 text-zinc-800 font-semibold text-sm px-6 py-3.5 rounded-full border border-zinc-200 transition-all"
              >
                Fresh Groceries
              </Link>
              <Link
                href="/products?category=Fashion"
                className="bg-white hover:bg-zinc-100 text-zinc-800 font-semibold text-sm px-6 py-3.5 rounded-full border border-zinc-200 transition-all"
              >
                Fashion Drops
              </Link>
            </div>

            {/* Helpline Callout */}
            <div className="mt-12 p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs inline-flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <IoCallOutline className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Need Help Finding Something?
                </p>
                <a
                  href="tel:01722301927"
                  className="text-sm font-extrabold text-zinc-900 hover:text-emerald-600 transition-colors"
                >
                  Call Hotline: 01722301927 (Uttara Support)
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 items-start">
            
            {/* ── Left Column: Cart Items List ── */}
            <div className="space-y-6">
              {/* Back to Shop & Total Count */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                <div className="flex items-center gap-3">
                  <Link
                    href="/products"
                    className="p-2 rounded-full hover:bg-zinc-100 text-zinc-600 transition-colors"
                    aria-label="Back to products"
                  >
                    <LuArrowLeft className="w-5 h-5" />
                  </Link>
                  <div>
                    <h1 className="text-2xl font-black text-zinc-950 tracking-tight">
                      Cart Items ({items.length})
                    </h1>
                    <p className="text-xs text-zinc-500">
                      Dispatched from Central Hub: Uttara, Dhaka
                    </p>
                  </div>
                </div>

                <Link
                  href="/products"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  + Add More Items
                </Link>
              </div>

              {/* Free Shipping Alert Banner */}
              {deliveryZone === "dhaka" && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <LuTruck className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-xs">
                    {subtotal >= 1999 ? (
                      <span className="font-bold text-emerald-800">
                        🎉 Congratulations! You unlocked FREE Next-Day Delivery across Uttara & Dhaka!
                      </span>
                    ) : (
                      <span>
                        Add <strong className="font-bold">৳{(1999 - subtotal).toLocaleString()}</strong> more to your cart to qualify for <strong>FREE Delivery in Uttara & Dhaka</strong>!
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Items Card List */}
              <div className="space-y-4">
                {items.map((item) => {
                  const itemId = item.id ?? item.variantId ?? item.slug;
                  const inWishlist = isInWishlist(item.productId || item.id || item.slug);
                  const productUrl = item.slug ? `/products/${item.slug}` : `/products`;

                  const match = item.name.match(/^(.*?)\s*\(([^)]+)\)$/);
                  const displayName = match ? match[1] : item.name;
                  const optionSummary = match ? match[2] : (item.color || item.size || "");

                  return (
                    <div
                      key={itemId}
                      className={`p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover:border-zinc-300 transition-all ${
                        openDropdownId === itemId ? "relative z-30" : ""
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
                        {/* Product Thumbnail */}
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-zinc-50 border border-zinc-100 shrink-0">
                          <Image
                            src={item.image || "/images/no-image-icon-6.png"}
                            alt={item.name}
                            fill
                            sizes="120px"
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Middle Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Link
                                href={productUrl}
                                className="text-base font-bold text-zinc-900 hover:text-emerald-600 transition-colors line-clamp-1"
                              >
                                {displayName}
                              </Link>
                              
                              {/* Option Selector Toggle */}
                              {optionSummary && (
                                <div className="mt-1 relative inline-block">
                                  <button
                                    type="button"
                                    onClick={() => handleDropdownToggle(itemId, item.productId || "", item)}
                                    className="inline-flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer"
                                  >
                                    <span>Variant: {optionSummary}</span>
                                    <IoChevronDownOutline className="w-3 h-3 text-zinc-400" />
                                  </button>

                                  {/* Dropdown for Variants */}
                                  {openDropdownId === itemId && (
                                    <>
                                      <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setOpenDropdownId(null)}
                                      />
                                      <div className="absolute left-0 mt-2 w-80 bg-white border border-zinc-200 rounded-2xl shadow-2xl z-50 p-4 space-y-4">
                                        {loadingProducts[item.productId || ""] ? (
                                          <div className="p-4 text-xs text-zinc-500 flex items-center gap-2 justify-center">
                                            <LuLoader className="w-4 h-4 animate-spin text-emerald-600" />
                                            <span>Loading available variants...</span>
                                          </div>
                                        ) : (
                                          <div className="space-y-4">
                                            <div className="flex gap-3 items-center border-b border-zinc-100 pb-3">
                                              <div className="w-12 h-12 relative bg-zinc-50 rounded-lg overflow-hidden shrink-0 border border-zinc-200">
                                                <Image
                                                  src={getMatchedVariantImage(item) || item.image}
                                                  alt={item.name}
                                                  fill
                                                  sizes="48px"
                                                  className="object-cover"
                                                />
                                              </div>
                                              <div>
                                                <h4 className="text-xs font-bold text-zinc-800 truncate w-48">
                                                  {displayName}
                                                </h4>
                                                <p className="text-xs text-emerald-600 font-bold mt-0.5">
                                                  {getMatchedVariantPrice(item)}
                                                </p>
                                              </div>
                                            </div>

                                            {/* Attribute Groups */}
                                            <div className="space-y-3">
                                              {Object.entries(getUniqueAttributes(item.productId || "")).map(([attrName, values]) => (
                                                <div key={attrName} className="space-y-1">
                                                  <p className="text-[10px] uppercase font-bold text-zinc-400">
                                                    {attrName}
                                                  </p>
                                                  <div className="flex flex-wrap gap-1.5">
                                                    {values.map((val) => {
                                                      const isSelected = selectedOptions[attrName] === val;
                                                      return (
                                                        <button
                                                          key={val}
                                                          type="button"
                                                          onClick={() => setSelectedOptions((prev) => ({ ...prev, [attrName]: val }))}
                                                          className={`px-2.5 py-1 text-xs rounded-md border transition-all cursor-pointer ${
                                                            isSelected
                                                              ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-bold"
                                                              : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                                                          }`}
                                                        >
                                                          {val}
                                                        </button>
                                                      );
                                                    })}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>

                                            {/* Stock warning */}
                                            {isMatchedVariantOutOfStock(item) && (
                                              <div className="flex items-center gap-1.5 p-2 bg-amber-50 text-amber-700 text-xs rounded-lg">
                                                <IoAlertCircleOutline className="w-4 h-4 shrink-0" />
                                                <span>Sold out in this combination</span>
                                              </div>
                                            )}

                                            <div className="flex gap-2 pt-2 border-t border-zinc-100">
                                              <button
                                                type="button"
                                                onClick={() => setOpenDropdownId(null)}
                                                className="flex-1 py-2 text-xs border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-50"
                                              >
                                                Cancel
                                              </button>
                                              <button
                                                type="button"
                                                disabled={isApplyDisabled(item)}
                                                onClick={() => handleApplyChange(item)}
                                                className="flex-1 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg disabled:opacity-50"
                                              >
                                                Apply
                                              </button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Line Price */}
                            <div className="text-right">
                              <p className="text-base font-extrabold text-zinc-950">
                                {formatCurrency(item.price * item.quantity)}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-[11px] text-zinc-400">
                                  {formatCurrency(item.price)} each
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Quantity & Actions Row */}
                          <div className="flex items-center justify-between gap-4 mt-5 pt-3 border-t border-zinc-100">
                            {/* Quantity Stepper */}
                            <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl">
                              <button
                                onClick={() => handleDecrement(itemId, item.quantity)}
                                className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-zinc-700 hover:bg-zinc-200 transition-colors cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <LuMinus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold text-zinc-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(itemId, item.quantity + 1)}
                                className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-zinc-700 hover:bg-zinc-200 transition-colors cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <LuPlus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Wishlist & Remove */}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleToggleWishlist(item)}
                                className={`text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                                  inWishlist ? "text-red-600" : "text-zinc-500 hover:text-zinc-900"
                                }`}
                              >
                                {inWishlist ? (
                                  <>
                                    <IoHeart className="w-4 h-4 text-red-500" />
                                    <span>Saved</span>
                                  </>
                                ) : (
                                  <>
                                    <IoHeartOutline className="w-4 h-4" />
                                    <span className="hidden sm:inline">Save to Wishlist</span>
                                  </>
                                )}
                              </button>

                              <span className="text-zinc-300">|</span>

                              <button
                                onClick={() => {
                                  removeItem(itemId);
                                  toast.info("Item removed from cart");
                                }}
                                className="text-xs font-semibold text-zinc-400 hover:text-red-600 inline-flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <LuTrash2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Right Column: Order Summary ── */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xl space-y-6 sticky top-24">
              <h2 className="text-xl font-black text-zinc-950 tracking-tight">
                Order Summary
              </h2>

              {/* Delivery Destination Toggle */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">
                  Delivery Destination
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryZone("dhaka")}
                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      deliveryZone === "dhaka"
                        ? "border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs"
                        : "border-zinc-200 bg-zinc-50/60 text-zinc-600 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Inside Dhaka / Uttara</span>
                      {deliveryZone === "dhaka" && <LuCheck className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] font-normal text-zinc-500 mt-1">
                      {isDhakaFree ? "FREE Delivery" : "৳60 (Next Day)"}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryZone("outside")}
                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      deliveryZone === "outside"
                        ? "border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs"
                        : "border-zinc-200 bg-zinc-50/60 text-zinc-600 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Outside Dhaka</span>
                      {deliveryZone === "outside" && <LuCheck className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] font-normal text-zinc-500 mt-1">
                      ৳120 (2-4 Days)
                    </p>
                  </button>
                </div>
              </div>

              {/* Promo Code Accordion */}
              <div className="border-t border-b border-zinc-100 py-4">
                <button
                  type="button"
                  onClick={() => setPromoOpen(!promoOpen)}
                  className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-700 hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <LuTag className="w-4 h-4 text-emerald-600" />
                    <span>Have A Promo Code?</span>
                  </span>
                  {promoOpen ? <LuChevronUp className="w-4 h-4" /> : <IoChevronDownOutline className="w-4 h-4" />}
                </button>

                {appliedPromo ? (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block">
                        Coupon "{appliedPromo}" Applied
                      </span>
                      <span className="text-[11px] text-emerald-700">
                        Saved {formatCurrency(promoDiscount)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className={`overflow-hidden transition-all duration-300 ${promoOpen ? "max-h-24 mt-3" : "max-h-0"}`}>
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="e.g. WEBDEV10 or UTTARA"
                        className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-semibold uppercase text-zinc-900 focus:outline-none focus:border-emerald-600"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold tracking-wider transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                    <p className="text-[10px] text-zinc-400 mt-1.5">
                      Hint: Use <strong>WEBDEV10</strong> for 10% off or <strong>UTTARA</strong> for free delivery!
                    </p>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal ({items.length} item{items.length === 1 ? "" : "s"})</span>
                  <span className="font-semibold text-zinc-900">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between text-zinc-600">
                  <span>Delivery ({deliveryZone === "dhaka" ? "Uttara & Dhaka Metro" : "Nationwide"})</span>
                  <span className="font-semibold text-zinc-900">
                    {baseShipping === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase text-xs">FREE</span>
                    ) : (
                      formatCurrency(baseShipping)
                    )}
                  </span>
                </div>

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-{formatCurrency(promoDiscount)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-zinc-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-lg font-black text-zinc-950 block">Grand Total</span>
                    <span className="text-[11px] text-zinc-400">Inclusive of all applicable VAT/Taxes</span>
                  </div>
                  <span className="text-2xl font-black text-emerald-700">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) {
                    setShowAuthModal(true);
                    return;
                  }
                  clearBuyNowItem();
                  router.push("/checkout");
                }}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Proceed To Secure Checkout</span>
                <LuLock className="w-4 h-4" />
              </button>

              {/* Payment Methods */}
              <div className="pt-4 border-t border-zinc-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
                  100% Safe Payment Methods
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {["bKash", "Nagad", "Rocket", "VISA", "Mastercard", "Cash on Delivery"].map((method, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-zinc-100 text-[11px] font-bold text-zinc-700 rounded-md border border-zinc-200"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>

              {/* Support Callout */}
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 space-y-2">
                <div className="flex items-center gap-2">
                  <IoCallOutline className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Helpline: <strong className="text-zinc-900">01722301927</strong> (9 AM – 9 PM)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaWhatsapp className="w-4 h-4 text-green-600 shrink-0" />
                  <a
                    href="https://wa.me/8801722301927"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 hover:underline font-semibold"
                  >
                    Quick assistance via WhatsApp
                  </a>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
