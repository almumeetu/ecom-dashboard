"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, useMemo, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/app/_providers/cart-provider";
import { useAuth } from "@/app/_providers/auth-provider";
import { useCurrency } from "@/lib/currency-context";
import { usePlaceOrder } from "@/app/_hooks/use-place-order";
import {
  LuLoader,
  LuArrowLeft,
  LuLock,
  LuMapPin,
  LuCheck,
  LuPlus,
  LuShieldCheck,
  LuTruck,
  LuUser,
  LuPhone,
  LuMail,
  LuChevronRight,
  LuChevronDown,
  LuPackage,
  LuInfo,
  LuTag,
} from "react-icons/lu";
import { IoCallOutline } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa6";
import type { AddressForm, CartItem } from "@/lib/types";
import { getBuyNowItem, clearBuyNowItem } from "@/lib/buy-now";
import MapPickerModal from "./_components/map-picker-modal";
import AddressSelectModal from "./_components/address-select-modal";
import { getAddresses, createAddress, type SavedAddress } from "@/lib/storefront-api";
import { fetchShopSettings, applyCouponApi, type ShopSettings } from "@/lib/shop-api";
import { toast } from "sonner";
import PageBanner from "@/components/ui/page-banner";

const BD_DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
];

const emptyAddress: AddressForm = {
  email: "",
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "Dhaka",
  postalCode: "",
  country: "Bangladesh",
};

export default function CheckoutPage() {
  const { items } = useCart();
  const { user, isAuthenticated, setShowAuthModal } = useAuth();
  const { formatCurrency } = useCurrency();
  const router = useRouter();
  const { placeOrder, submitting } = usePlaceOrder();

  const [address, setAddress] = useState<AddressForm>(() => ({
    ...emptyAddress,
    email: user?.email || "",
    fullName: user?.name || "",
  }));
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | "new">("new");
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  const [deliveryZone, setDeliveryZone] = useState<"dhaka" | "outside">("dhaka");
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    type: "percentage" | "fixed";
    value: number;
    discount: number;
  } | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [agreeToTerms, setAgreeToTerms] = useState(true);
  const [orderNote, setOrderNote] = useState("");
  const [mapPickerOpen, setMapPickerOpen] = useState(false);
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [mounted, setMounted] = useState(false);

  const [isItemsOpen, setIsItemsOpen] = useState(true);

  useEffect(() => {
    setMounted(true);
    setBuyNowItem(getBuyNowItem());
  }, []);

  // Fetch saved addresses if logged in
  useEffect(() => {
    if (isAuthenticated) {
      setLoadingAddresses(true);
      getAddresses()
        .then((data) => {
          setSavedAddresses(data);
          if (data.length > 0) {
            const defaultAddress = data.find((a) => a.isDefault) || data[0];
            setSelectedAddressId(defaultAddress.id);
            setAddress({
              email: user?.email || "",
              fullName: defaultAddress.fullName,
              phone: defaultAddress.phone,
              addressLine1: defaultAddress.addressLine1,
              addressLine2: defaultAddress.addressLine2 || "",
              city: defaultAddress.city,
              state: defaultAddress.state,
              postalCode: defaultAddress.postalCode,
              country: defaultAddress.country,
            });
            if (defaultAddress.state.toLowerCase().includes("dhaka") || defaultAddress.city.toLowerCase().includes("dhaka")) {
              setDeliveryZone("dhaka");
            } else {
              setDeliveryZone("outside");
            }
          } else {
            setSelectedAddressId("new");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch addresses:", err);
        })
        .finally(() => {
          setLoadingAddresses(false);
        });
    } else {
      setSavedAddresses([]);
      setSelectedAddressId("new");
    }
  }, [isAuthenticated, user]);

  const checkoutItems = buyNowItem ? [buyNowItem] : items;

  const updateAddressField = (field: keyof AddressForm, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    setSelectedAddressId("new");

    // Automatically update delivery zone if state/division changes
    if (field === "state") {
      if (value.toLowerCase().includes("dhaka")) {
        setDeliveryZone("dhaka");
      } else {
        setDeliveryZone("outside");
      }
    }
  };

  const handleMapSelect = useCallback(
    (data: { addressLine1: string; city: string; state: string; postalCode: string; country: string }) => {
      setAddress((prev) => ({ ...prev, ...data }));
      setSelectedAddressId("new");
      if (data.state.toLowerCase().includes("dhaka") || data.city.toLowerCase().includes("dhaka")) {
        setDeliveryZone("dhaka");
      } else {
        setDeliveryZone("outside");
      }
      setMapPickerOpen(false);
      toast.success("Location set from map!");
    },
    []
  );

  useEffect(() => {
    if (user && selectedAddressId === "new") {
      setAddress((prev) => ({
        ...prev,
        email: user.email || prev.email,
        fullName: user.name || prev.fullName,
      }));
    }
  }, [user, selectedAddressId]);

  // Load shop settings & coupon from session
  useEffect(() => {
    fetchShopSettings().then((s) => {
      if (s) setSettings(s);
    });

    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("applied_coupon");
        if (stored) {
          setAppliedCoupon(JSON.parse(stored));
        }
      } catch {}
    }
  }, []);

  // Pricing calculations
  const subtotal = checkoutItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const insideRate = Number(settings?.deliveryChargeInside ?? 60);
  const outsideRate = Number(settings?.deliveryChargeOutside ?? 120);
  const isDhakaFree = insideRate === 0 || subtotal >= 1999;
  const shipping = deliveryZone === "dhaka" ? (isDhakaFree ? 0 : insideRate) : outsideRate;

  const promoDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === "percentage") {
      return Math.round(subtotal * (Number(appliedCoupon.value) / 100));
    }
    return Math.min(Number(appliedCoupon.value), subtotal);
  }, [appliedCoupon, subtotal]);

  const total = Math.max(0, subtotal + shipping - promoDiscount);

  async function handleAddAddress() {
    if (!address.fullName || !address.phone || !address.addressLine1 || !address.city) {
      toast.error("Please fill in your name, phone, city, and address to save.");
      return;
    }

    setAddingAddress(true);
    try {
      const newAddr = await createAddress({
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || null,
        city: address.city,
        state: address.state || "Dhaka",
        postalCode: address.postalCode || "1200",
        country: address.country || "Bangladesh",
      });
      toast.success("Address saved to your profile!");
      setSavedAddresses((prev) => [newAddr, ...prev]);
      setSelectedAddressId(newAddr.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add address");
    } finally {
      setAddingAddress(false);
    }
  }

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setApplyingCoupon(true);
    try {
      const res = await applyCouponApi(couponInput.trim(), subtotal);
      if (res.success && res.data) {
        const item = res.data.coupon;
        const discountAmount = res.data.discount;
        const couponState = {
          code: item.code,
          type: item.type,
          value: Number(item.value),
          discount: discountAmount,
        };
        setAppliedCoupon(couponState);
        sessionStorage.setItem("applied_coupon", JSON.stringify(couponState));
        toast.success(`Coupon "${item.code}" applied!`);
        setCouponInput("");
      } else {
        toast.error(res.message || "Invalid coupon code");
      }
    } catch {
      toast.error("Failed to apply coupon");
    } finally {
      setApplyingCoupon(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    sessionStorage.removeItem("applied_coupon");
    toast.info("Coupon removed");
  }

  async function handlePlaceOrder(e: FormEvent) {
    e.preventDefault();
    if (!agreeToTerms) {
      toast.error("Please accept the terms and conditions to proceed.");
      return;
    }
    if (checkoutItems.length === 0) {
      toast.error("Your cart is empty. Please add items before placing an order.");
      return;
    }
    if (!address.fullName.trim() || !address.phone.trim() || !address.addressLine1.trim() || !address.city.trim()) {
      toast.error("Please fill in your name, phone number, city, and address.");
      return;
    }

    const selectedSavedAddress = savedAddresses.find((a) => a.id === selectedAddressId);
    const orderAddress: AddressForm = selectedSavedAddress
      ? {
          email: user?.email || address.email,
          fullName: selectedSavedAddress.fullName,
          phone: selectedSavedAddress.phone,
          addressLine1: selectedSavedAddress.addressLine1,
          addressLine2: selectedSavedAddress.addressLine2 || "",
          city: selectedSavedAddress.city,
          state: selectedSavedAddress.state,
          postalCode: selectedSavedAddress.postalCode,
          country: selectedSavedAddress.country,
        }
      : address;

    try {
      const result = await placeOrder(orderAddress, {
        paymentMethod,
        orderNote: orderNote || undefined,
        items: buyNowItem ? checkoutItems : undefined,
        addressId: selectedAddressId !== "new" ? selectedAddressId : undefined,
        couponCode: appliedCoupon?.code || undefined,
        shippingCost: shipping,
      });
      clearBuyNowItem();
      sessionStorage.setItem("orderResult", JSON.stringify(result));
      router.push("/confirmation");
    } catch {
      // error toast handled inside the placeOrder hook
    }
  }

  if (mounted && checkoutItems.length === 0) {
    return (
      <main className="flex-grow bg-zinc-50/50 w-full min-h-screen py-16 px-4">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-3xl border border-zinc-200/80 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4 text-zinc-400">
            <LuPackage className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-zinc-900 mb-2">Your checkout cart is empty</h1>
          <p className="text-xs text-zinc-500 mb-6">
            Explore our curated collections and add your favorite items to checkout.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/20"
          >
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-[#FAF9F6]/60 w-full min-h-screen pb-16">
      <PageBanner
        title="Secure Checkout"
        subtitle="Complete your shipping information and payment method to place your order."
        badge="100% ENCRYPTED CHECKOUT"
        breadcrumbs={[
          { label: "Products", href: "/products" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
        showTrustChips={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Progress Stepper Bar */}
        <div className="mb-8 flex items-center justify-between max-w-2xl mx-auto px-2">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-xs font-bold text-emerald-700 hover:underline"
          >
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-extrabold">
              ✓
            </span>
            <span>Cart</span>
          </Link>
          <div className="h-0.5 flex-1 mx-3 bg-emerald-600/30" />
          <div className="flex items-center gap-2 text-xs font-extrabold text-zinc-900">
            <span className="w-6 h-6 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-[11px] shadow-xs">
              2
            </span>
            <span>Shipping & Payment</span>
          </div>
          <div className="h-0.5 flex-1 mx-3 bg-zinc-200" />
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
            <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center text-[11px]">
              3
            </span>
            <span>Confirmation</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-10 items-start">
            {/* ── Left Column: Checkout Forms ── */}
            <div className="space-y-6">
              {/* Back to Cart link */}
              <div className="flex items-center justify-between">
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-emerald-700 transition-colors uppercase tracking-wider"
                >
                  <LuArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Cart</span>
                </Link>

                {isAuthenticated && savedAddresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setAddressModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#4F46E5] bg-[#EEF2FF] hover:bg-indigo-100 rounded-xl border border-emerald-200/80 transition-colors cursor-pointer"
                  >
                    <LuMapPin className="w-3.5 h-3.5" />
                    <span>Choose Saved Address ({savedAddresses.length})</span>
                  </button>
                )}
              </div>

              {/* Login Callout for Guests */}
              {!isAuthenticated && (
                <div className="p-4 rounded-2xl bg-[#EEF2FF]/70 border border-indigo-200/80 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center shrink-0">
                      <LuUser className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900">Already registered with NovaMart?</p>
                      <p className="text-zinc-500 text-[11px]">Log in now for faster checkout with saved addresses.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(true)}
                    className="px-3.5 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold rounded-xl text-[11px] uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                  >
                    Log In
                  </button>
                </div>
              )}

              {/* Step 1: Customer Contact Info Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#4F46E5] text-white text-xs font-black flex items-center justify-center">
                      1
                    </span>
                    <h2 className="text-base font-bold text-zinc-900 tracking-tight">
                      Customer Contact Information
                    </h2>
                  </div>
                  <span className="text-[11px] text-zinc-400">Order updates will be sent here</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <LuUser className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        required
                        value={address.fullName}
                        onChange={(e) => updateAddressField("fullName", e.target.value)}
                        placeholder="e.g. Tanvir Ahmed"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50/70 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <LuPhone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        required
                        type="tel"
                        value={address.phone}
                        onChange={(e) => updateAddressField("phone", e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50/70 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      Email Address <span className="text-zinc-400 text-[11px] font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <LuMail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={address.email}
                        onChange={(e) => updateAddressField("email", e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50/70 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping & Delivery Address Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#4F46E5] text-white text-xs font-black flex items-center justify-center">
                      2
                    </span>
                    <h2 className="text-base font-bold text-zinc-900 tracking-tight">
                      Shipping & Delivery Address
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMapPickerOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4F46E5] bg-[#EEF2FF] hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-emerald-200/80 transition-colors cursor-pointer"
                  >
                    <LuMapPin className="w-3.5 h-3.5" />
                    <span>Set from Map</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                  {/* Division / Region */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      Division / Region <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={address.state}
                      onChange={(e) => updateAddressField("state", e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-50/70 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 focus:outline-none transition-all"
                    >
                      {BD_DIVISIONS.map((div) => (
                        <option key={div} value={div}>
                          {div}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City / District */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      City / District <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      value={address.city}
                      onChange={(e) => updateAddressField("city", e.target.value)}
                      placeholder="e.g. Dhaka, Gulshan, or Mirpur"
                      className="w-full px-3.5 py-2.5 bg-zinc-50/70 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Area / Thana / Postal Code */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      Area / Thana / Postcode
                    </label>
                    <input
                      value={address.postalCode}
                      onChange={(e) => updateAddressField("postalCode", e.target.value)}
                      placeholder="e.g. Sector 3, 1230"
                      className="w-full px-3.5 py-2.5 bg-zinc-50/70 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Street Address Line 1 */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Street Address / House & Road <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    value={address.addressLine1}
                    onChange={(e) => updateAddressField("addressLine1", e.target.value)}
                    placeholder="House / Holding number, Road number, Block, Area landmark..."
                    className="w-full px-3.5 py-2.5 bg-zinc-50/70 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 focus:outline-none transition-all"
                  />
                </div>

                {/* Optional Address Line 2 */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Apartment / Flat / Floor Details <span className="text-zinc-400 text-[11px]">(Optional)</span>
                  </label>
                  <input
                    value={address.addressLine2 || ""}
                    onChange={(e) => updateAddressField("addressLine2", e.target.value)}
                    placeholder="e.g. Apt 4B, Level 4"
                    className="w-full px-3.5 py-2.5 bg-zinc-50/70 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 focus:outline-none transition-all"
                  />
                </div>

                {/* Save Address Button for authenticated users */}
                {isAuthenticated && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      disabled={addingAddress}
                      onClick={handleAddAddress}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {addingAddress ? (
                        <LuLoader className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <LuPlus className="w-3.5 h-3.5" />
                      )}
                      <span>Save Address to Profile</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Step 3: Delivery Options & Courier Speed */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#4F46E5] text-white text-xs font-black flex items-center justify-center">
                      3
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-zinc-900 tracking-tight">
                        Delivery Method &amp; Courier Speed
                      </h2>
                      <p className="text-xs text-zinc-400">Choose your delivery zone and transit speed</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-1 rounded-full border border-indigo-200/60">
                    {deliveryZone === "dhaka" ? "Next-Day Speed" : "Nationwide 2–4 Days"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {/* Option: Inside Dhaka */}
                  <button
                    type="button"
                    onClick={() => setDeliveryZone("dhaka")}
                    className={`p-4 rounded-2xl text-left transition-all duration-150 cursor-pointer relative flex flex-col justify-between ${
                      deliveryZone === "dhaka"
                        ? "border-2 border-[#4F46E5] bg-[#EEF2FF]/60 ring-2 ring-[#4F46E5]/10 shadow-xs"
                        : "border border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50"
                    }`}
                  >
                    <div className="flex items-start justify-between w-full mb-1.5">
                      <div>
                        <span className="text-sm font-bold text-zinc-950 block">Inside Dhaka</span>
                        <p className="text-xs text-zinc-500 font-medium">Next Day Express Doorstep</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all shrink-0 ${
                          deliveryZone === "dhaka"
                            ? "bg-[#4F46E5] text-white shadow-2xs"
                            : "border border-zinc-300 bg-white"
                        }`}
                      >
                        {deliveryZone === "dhaka" && <LuCheck className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2.5 border-t border-zinc-200/60 mt-2">
                      <span className={`font-extrabold ${isDhakaFree ? "text-emerald-700" : "text-[#1E1B4B]"}`}>
                        {isDhakaFree ? "FREE Delivery" : formatCurrency(insideRate)}
                      </span>
                      <span className="text-[10px] font-semibold text-zinc-500 bg-white px-2 py-0.5 rounded-full border border-zinc-200/80">
                        1 Business Day
                      </span>
                    </div>
                  </button>

                  {/* Option: All Bangladesh */}
                  <button
                    type="button"
                    onClick={() => setDeliveryZone("outside")}
                    className={`p-4 rounded-2xl text-left transition-all duration-150 cursor-pointer relative flex flex-col justify-between ${
                      deliveryZone === "outside"
                        ? "border-2 border-[#4F46E5] bg-[#EEF2FF]/60 ring-2 ring-[#4F46E5]/10 shadow-xs"
                        : "border border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50"
                    }`}
                  >
                    <div className="flex items-start justify-between w-full mb-1.5">
                      <div>
                        <span className="text-sm font-bold text-zinc-950 block">All Bangladesh</span>
                        <p className="text-xs text-zinc-500 font-medium">Nationwide 64 Districts</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all shrink-0 ${
                          deliveryZone === "outside"
                            ? "bg-[#4F46E5] text-white shadow-2xs"
                            : "border border-zinc-300 bg-white"
                        }`}
                      >
                        {deliveryZone === "outside" && <LuCheck className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2.5 border-t border-zinc-200/60 mt-2">
                      <span className={`font-extrabold ${outsideRate === 0 ? "text-emerald-700" : "text-[#1E1B4B]"}`}>
                        {outsideRate === 0 ? "FREE Delivery" : formatCurrency(outsideRate)}
                      </span>
                      <span className="text-[10px] font-semibold text-zinc-500 bg-white px-2 py-0.5 rounded-full border border-zinc-200/80">
                        2–4 Business Days
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 4: Payment Method */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#4F46E5] text-white text-xs font-black flex items-center justify-center">
                      4
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-zinc-900 tracking-tight">Payment Method</h2>
                      <p className="text-xs text-zinc-400">100% Secure doorstep inspection guarantee</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80">
                    Verified
                  </span>
                </div>

                {/* Cash on Delivery Primary Option */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    paymentMethod === "cod"
                      ? "border-[#4F46E5] bg-[#EEF2FF]/40 ring-2 ring-[#4F46E5]/10 shadow-xs"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                          paymentMethod === "cod"
                            ? "bg-[#4F46E5] text-white shadow-2xs"
                            : "border-2 border-zinc-300 bg-white"
                        }`}
                      >
                        {paymentMethod === "cod" && <LuCheck className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between flex-wrap gap-1.5 mb-1">
                        <span className="text-sm font-bold text-zinc-950">
                          Cash on Delivery (ক্যাশ অন ডেলিভারি)
                        </span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#EEF2FF] text-[#4F46E5] border border-indigo-200/60 px-2.5 py-0.5 rounded-full">
                          Zero Advance
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed mb-2.5">
                        Pay with cash or mobile banking (bKash/Nagad) upon receiving and inspecting items at your doorstep. Zero advance payment required.
                      </p>
                      <div className="flex items-center gap-3 text-[11px] font-semibold text-zinc-500 pt-2 border-t border-indigo-100/60">
                        <span className="flex items-center gap-1 text-[#4F46E5]">
                          <LuCheck className="w-3.5 h-3.5 stroke-[3]" /> Doorstep Inspection
                        </span>
                        <span>•</span>
                        <span>Pay Courier via Cash / bKash</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Digital Payment / Cards info option */}
                <div className="p-3.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-4 h-4 rounded-full border border-zinc-300 bg-white shrink-0" />
                    <div>
                      <span className="text-xs font-semibold text-zinc-800">Cards &amp; Mobile Banking</span>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Pay rider directly via bKash / Nagad QR upon delivery
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 pl-6 sm:pl-0">
                    <span className="px-2 py-0.5 bg-white border border-zinc-200 rounded text-[10px] font-extrabold text-[#E2136E]">bKash</span>
                    <span className="px-2 py-0.5 bg-white border border-zinc-200 rounded text-[10px] font-extrabold text-[#ED1C24]">Nagad</span>
                    <span className="px-2 py-0.5 bg-white border border-zinc-200 rounded text-[10px] font-black italic text-[#1A1F71]">VISA</span>
                    <span className="px-2 py-0.5 bg-white border border-zinc-200 rounded text-[10px] font-bold text-zinc-800">Mastercard</span>
                  </div>
                </div>
              </div>

              {/* Step 5: Optional Order Instructions */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#4F46E5] text-white text-xs font-black flex items-center justify-center">
                      5
                    </span>
                    <h2 className="text-base font-bold text-zinc-900 tracking-tight">
                      Order Note / Special Instructions <span className="text-zinc-400 text-xs font-normal">(Optional)</span>
                    </h2>
                  </div>
                </div>
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-zinc-50/70 border border-zinc-200 rounded-2xl text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 focus:outline-none transition-all resize-none"
                  placeholder="Any special instructions (e.g. call before delivery, leave with concierge, preferred delivery time)..."
                />
              </div>
            </div>

            {/* ── Right Column: Production-Ready Order Summary Sidebar ── */}
            <div className="w-full lg:w-[420px] lg:sticky lg:top-24 space-y-4">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/90 shadow-xl shadow-zinc-200/30 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-black text-zinc-950 tracking-tight">Order Summary</h3>
                    <span className="text-xs font-extrabold text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full border border-indigo-200/70">
                      {checkoutItems.length} {checkoutItems.length === 1 ? "Item" : "Items"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsItemsOpen(!isItemsOpen)}
                    className="flex items-center gap-1 text-xs font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors cursor-pointer select-none"
                  >
                    <span>{isItemsOpen ? "Hide Items" : "View Items"}</span>
                    <LuChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isItemsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Items List */}
                {isItemsOpen && (
                  <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
                    {checkoutItems.map((item, idx) => (
                      <div
                        key={item.id ?? item.variantId ?? `${item.slug}-${idx}`}
                        className="flex items-center gap-3 p-2.5 rounded-2xl bg-zinc-50/90 border border-zinc-100 hover:border-zinc-200 transition-colors"
                      >
                        <div className="w-12 h-12 relative bg-white rounded-xl shrink-0 overflow-hidden border border-zinc-200/80">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-contain p-1"
                            />
                          )}
                          <span className="absolute -top-1 -right-1 bg-zinc-900 text-white text-[9px] font-extrabold rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-xs">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-zinc-900 truncate leading-tight">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            {formatCurrency(item.price)} × {item.quantity}
                          </p>
                        </div>
                        <p className="text-xs font-black text-zinc-950 whitespace-nowrap">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Selected Shipping & Payment Summary */}
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-zinc-600">
                    <span className="flex items-center gap-1.5 font-medium text-zinc-700">
                      <LuTruck className="w-3.5 h-3.5 text-[#4F46E5]" />
                      <span>Delivery Option</span>
                    </span>
                    <span className="font-bold text-zinc-900 bg-white px-2.5 py-0.5 rounded-md border border-zinc-200/70 text-[11px]">
                      {deliveryZone === "dhaka" ? "Inside Dhaka (Next Day)" : "All Bangladesh (2–4 Days)"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-600">
                    <span className="flex items-center gap-1.5 font-medium text-zinc-700">
                      <LuShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Payment Method</span>
                    </span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/70 text-[11px]">
                      {paymentMethod === "cod" ? "Cash on Delivery" : "Cards / Mobile Banking"}
                    </span>
                  </div>
                </div>

                {/* Promo Code or Voucher Section */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-zinc-900 flex items-center gap-1.5">
                      <LuTag className="w-3.5 h-3.5 text-[#4F46E5]" />
                      <span>Promo Code / Voucher</span>
                    </span>
                    {appliedCoupon && (
                      <span className="text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Applied
                      </span>
                    )}
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <LuCheck className="w-3 h-3 stroke-[3]" />
                        </div>
                        <div className="truncate">
                          <span className="font-mono font-black text-xs text-emerald-950 tracking-wider uppercase block">
                            {appliedCoupon.code}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-semibold truncate block">
                            {appliedCoupon.type === "percentage" ? `${appliedCoupon.value}% OFF` : `৳${appliedCoupon.value} OFF`} applied
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer px-2 py-1 shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Enter promo code (e.g. NOVAMART)"
                        className="flex-1 px-3.5 py-2.5 bg-zinc-50/80 border border-zinc-200 rounded-xl text-xs font-semibold uppercase placeholder:normal-case placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all"
                      />
                      <button
                        type="button"
                        disabled={applyingCoupon || !couponInput.trim()}
                        onClick={handleApplyCoupon}
                        className="px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-xs shrink-0 flex items-center justify-center min-w-[70px]"
                      >
                        {applyingCoupon ? <LuLoader className="w-3.5 h-3.5 animate-spin" /> : "Apply"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Cost Breakdown */}
                <div className="border-t border-zinc-100 pt-3.5 space-y-2.5 text-xs">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-zinc-900">{formatCurrency(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-zinc-600">
                    <span>
                      Delivery ({deliveryZone === "dhaka" ? "Inside Dhaka" : "All Bangladesh"})
                    </span>
                    <span className="font-bold text-zinc-900">
                      {shipping === 0 ? (
                        <span className="text-emerald-700 font-extrabold uppercase bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">FREE</span>
                      ) : (
                        formatCurrency(shipping)
                      )}
                    </span>
                  </div>

                  {promoDiscount > 0 && appliedCoupon && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Coupon Discount ({appliedCoupon.code})</span>
                      <span>-{formatCurrency(promoDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-zinc-600">
                    <span>Estimated Tax / VAT</span>
                    <span className="font-semibold text-zinc-400">Included</span>
                  </div>

                  <div className="pt-3 border-t border-zinc-200 flex justify-between items-baseline">
                    <div>
                      <span className="text-base font-black text-zinc-950 block">Total Payable</span>
                      <span className="text-[10px] text-zinc-400">
                        {paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
                      </span>
                    </div>
                    <span className="text-2xl font-black text-[#1E1B4B]">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                {/* Terms Agreement Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input
                        type="checkbox"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-4 h-4 border border-zinc-300 rounded-md peer-checked:bg-[#4F46E5] peer-checked:border-[#4F46E5] flex items-center justify-center transition-colors">
                        {agreeToTerms && <LuCheck className="w-3 h-3 text-white stroke-[3]" />}
                      </div>
                    </div>
                    <span className="text-[11px] text-zinc-500 leading-relaxed">
                      I have read and agree to the{" "}
                      <Link
                        href="/terms"
                        target="_blank"
                        className="text-[#4F46E5] underline font-semibold hover:text-[#4338CA]"
                      >
                        terms & conditions
                      </Link>{" "}
                      and return policy.
                    </span>
                  </label>
                </div>

                {/* Place Order CTA Button */}
                <button
                  type="submit"
                  disabled={submitting || !agreeToTerms}
                  className="w-full py-4 bg-[#4F46E5] hover:bg-[#4338CA] active:scale-[0.98] text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <LuLoader className="w-4 h-4 animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <>
                      <LuLock className="w-4 h-4" />
                      <span>Place Order ({paymentMethod === "cod" ? "Cash on Delivery" : "Pay Now"})</span>
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="pt-3 border-t border-zinc-100 grid grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <LuShieldCheck className="w-4 h-4 text-[#4F46E5]" />
                    <span className="text-[10px] font-bold text-zinc-500">256-Bit SSL</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <LuTruck className="w-4 h-4 text-[#4F46E5]" />
                    <span className="text-[10px] font-bold text-zinc-500">Doorstep COD</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <LuCheck className="w-4 h-4 text-[#4F46E5] stroke-[3]" />
                    <span className="text-[10px] font-bold text-zinc-500">100% Authentic</span>
                  </div>
                </div>

                {/* Help & Support Callout */}
                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Customer Support</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">24/7 Live</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IoCallOutline className="w-4 h-4 text-[#EA580C] shrink-0" />
                    <span>
                      Hotline:{" "}
                      <a href="tel:01722301927" className="font-extrabold text-zinc-950 hover:text-[#4F46E5]">
                        01722301927
                      </a>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-zinc-200/60">
                    <FaWhatsapp className="w-4 h-4 text-emerald-600 shrink-0" />
                    <a
                      href="https://wa.me/8801722301927?text=Hello%20NovaMart%2C%20I%20need%20help%20with%20checkout"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline font-bold text-xs"
                    >
                      Chat with us on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <MapPickerModal
        open={mapPickerOpen}
        onClose={() => setMapPickerOpen(false)}
        onSelect={handleMapSelect}
      />

      <AddressSelectModal
        open={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        addresses={savedAddresses}
        selectedAddressId={selectedAddressId}
        onSelect={(addr) => {
          setAddress({
            email: user?.email || address.email,
            fullName: addr.fullName,
            phone: addr.phone,
            addressLine1: addr.addressLine1,
            addressLine2: addr.addressLine2 || "",
            city: addr.city,
            state: addr.state,
            postalCode: addr.postalCode,
            country: addr.country,
          });
          setSelectedAddressId(addr.id);
          if (addr.state.toLowerCase().includes("dhaka") || addr.city.toLowerCase().includes("dhaka")) {
            setDeliveryZone("dhaka");
          } else {
            setDeliveryZone("outside");
          }
        }}
        onAddNew={() => {
          setSelectedAddressId("new");
          setAddress({
            ...emptyAddress,
            email: user?.email || "",
            fullName: user?.name || "",
          });
        }}
        loading={loadingAddresses}
      />
    </main>
  );
}
