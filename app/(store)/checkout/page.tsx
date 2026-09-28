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

  // Collapsible sidebar accordion states
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
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
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] shadow-xs">
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200/80 transition-colors cursor-pointer"
                  >
                    <LuMapPin className="w-3.5 h-3.5" />
                    <span>Choose Saved Address ({savedAddresses.length})</span>
                  </button>
                )}
              </div>

              {/* Login Callout for Guests */}
              {!isAuthenticated && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <LuUser className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900">Already registered with Trust Point?</p>
                      <p className="text-zinc-500 text-[11px]">Log in now for faster checkout with saved addresses.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(true)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                  >
                    Log In
                  </button>
                </div>
              )}

              {/* Step 1: Customer Contact Info Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
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
                        className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50/70 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all"
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
                        className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50/70 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all"
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
                        className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50/70 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping & Delivery Address Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
                      2
                    </span>
                    <h2 className="text-base font-bold text-zinc-900 tracking-tight">
                      Shipping & Delivery Address
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMapPickerOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200/80 transition-colors cursor-pointer"
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
                      className="w-full px-3.5 py-2.5 bg-zinc-50/70 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all"
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
                      className="w-full px-3.5 py-2.5 bg-zinc-50/70 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all"
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
                      className="w-full px-3.5 py-2.5 bg-zinc-50/70 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all"
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
                    className="w-full px-3.5 py-2.5 bg-zinc-50/70 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all"
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
                    className="w-full px-3.5 py-2.5 bg-zinc-50/70 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all"
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

              {/* Step 3: Optional Order Instructions */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
                      3
                    </span>
                    <h2 className="text-base font-bold text-zinc-900 tracking-tight">
                      Order Note / Delivery Instructions <span className="text-zinc-400 text-xs font-normal">(Optional)</span>
                    </h2>
                  </div>
                </div>
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-zinc-50/70 border border-zinc-200 rounded-2xl text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all resize-none"
                  placeholder="Any special instructions (e.g. call before delivery, leave with concierge, preferred delivery time)..."
                />
              </div>
            </div>

            {/* ── Right Column: Modern Sticky Order Summary ── */}
            <div className="w-full lg:w-[420px] lg:sticky lg:top-24 space-y-5">
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200/80 shadow-xl space-y-4">
                {/* ── Collapsible Order Summary Header ── */}
                <div className="pb-3 border-b border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setIsItemsOpen(!isItemsOpen)}
                    className="w-full flex items-center justify-between text-left cursor-pointer group select-none"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-zinc-950 tracking-tight">Order Items</h3>
                      <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70">
                        {checkoutItems.length} {checkoutItems.length === 1 ? "Item" : "Items"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 group-hover:text-emerald-800 transition-colors">
                      <span>{isItemsOpen ? "Hide Details" : "View Details"}</span>
                      <LuChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isItemsOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Items List */}
                  {isItemsOpen && (
                    <div className="mt-3 space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {checkoutItems.map((item, idx) => (
                        <div
                          key={item.id ?? item.variantId ?? `${item.slug}-${idx}`}
                          className="flex items-center gap-3 p-2 rounded-2xl bg-zinc-50/80 border border-zinc-100"
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
                            <span className="absolute -top-1 -right-1 bg-zinc-900 text-white text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-zinc-900 truncate leading-tight">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-zinc-400 mt-0.5">
                              {formatCurrency(item.price)} × {item.quantity}
                            </p>
                          </div>
                          <p className="text-xs font-extrabold text-zinc-950 whitespace-nowrap">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Standard Collapsible Delivery Destination Widget ── */}
                <div className="rounded-2xl border border-zinc-200/90 bg-white overflow-hidden transition-all shadow-2xs">
                  {/* Summary / Toggle Bar */}
                  <button
                    type="button"
                    onClick={() => setIsDeliveryOpen(!isDeliveryOpen)}
                    className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-zinc-50/80 transition-colors group select-none"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/60">
                        <LuTruck className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-zinc-900">Delivery Destination</span>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                            {deliveryZone === "dhaka" ? "Inside Dhaka" : "All Bangladesh"}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          {deliveryZone === "dhaka"
                            ? `Next Day • ${isDhakaFree ? "FREE Delivery" : formatCurrency(insideRate)}`
                            : `2 - 4 Days • ${outsideRate === 0 ? "FREE Delivery" : formatCurrency(outsideRate)}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 group-hover:text-emerald-800 shrink-0 ml-2">
                      <span>{isDeliveryOpen ? "Done" : "Change"}</span>
                      <LuChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isDeliveryOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Collapsible Content */}
                  {isDeliveryOpen && (
                    <div className="p-3.5 pt-0 border-t border-zinc-100 bg-zinc-50/40">
                      <p className="text-[11px] text-zinc-500 mb-2.5">
                        Select your preferred delivery speed and courier coverage:
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setDeliveryZone("dhaka");
                            setIsDeliveryOpen(false);
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                            deliveryZone === "dhaka"
                              ? "border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-1 ring-emerald-500/20 shadow-2xs"
                              : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="text-xs font-bold">Inside Dhaka</span>
                            <div
                              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                                deliveryZone === "dhaka"
                                  ? "bg-emerald-600 text-white font-bold"
                                  : "border border-zinc-300 bg-white"
                              }`}
                            >
                              {deliveryZone === "dhaka" && "✓"}
                            </div>
                          </div>
                          <p className="text-[10px] text-zinc-500">Next Day Delivery</p>
                          <div className="mt-1.5 flex items-center justify-between text-[11px]">
                            <span className="font-extrabold text-emerald-700">
                              {isDhakaFree ? "FREE" : formatCurrency(insideRate)}
                            </span>
                            <span className="text-[10px] text-zinc-400">1 Day</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setDeliveryZone("outside");
                            setIsDeliveryOpen(false);
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                            deliveryZone === "outside"
                              ? "border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-1 ring-emerald-500/20 shadow-2xs"
                              : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="text-xs font-bold">All Bangladesh</span>
                            <div
                              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                                deliveryZone === "outside"
                                  ? "bg-emerald-600 text-white font-bold"
                                  : "border border-zinc-300 bg-white"
                              }`}
                            >
                              {deliveryZone === "outside" && "✓"}
                            </div>
                          </div>
                          <p className="text-[10px] text-zinc-500">All 64 Districts</p>
                          <div className="mt-1.5 flex items-center justify-between text-[11px]">
                            <span className="font-bold text-zinc-900">
                              {outsideRate === 0 ? "FREE" : formatCurrency(outsideRate)}
                            </span>
                            <span className="text-[10px] text-zinc-400">2-4 Days</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Standard Collapsible Payment Method Widget ── */}
                <div className="rounded-2xl border border-zinc-200/90 bg-white overflow-hidden transition-all shadow-2xs">
                  {/* Summary / Toggle Bar */}
                  <button
                    type="button"
                    onClick={() => setIsPaymentOpen(!isPaymentOpen)}
                    className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-zinc-50/80 transition-colors group select-none"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/60">
                        <LuShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-zinc-900">Payment Method</span>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                            Verified
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          Cash on Delivery • Pay upon doorstep inspection
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 group-hover:text-emerald-800 shrink-0 ml-2">
                      <span>{isPaymentOpen ? "Close" : "Change"}</span>
                      <LuChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isPaymentOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Collapsible Content */}
                  {isPaymentOpen && (
                    <div className="p-3.5 pt-0 border-t border-zinc-100 bg-zinc-50/40 space-y-2">
                      <p className="text-[11px] text-zinc-500 mb-2">
                        Select your preferred payment method:
                      </p>

                      {/* Cash on Delivery option */}
                      <label
                        className={`flex items-start gap-2.5 p-3 rounded-xl border-2 transition-all cursor-pointer relative ${
                          paymentMethod === "cod"
                            ? "border-emerald-600 bg-emerald-50/70 shadow-2xs"
                            : "border-zinc-200 bg-white hover:border-zinc-300"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                              paymentMethod === "cod"
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : "border-zinc-300 bg-white"
                            }`}
                          >
                            {paymentMethod === "cod" && <LuCheck className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="collapsible-payment"
                          value="cod"
                          checked={paymentMethod === "cod"}
                          onChange={() => {
                            setPaymentMethod("cod");
                            setIsPaymentOpen(false);
                          }}
                          className="sr-only"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between flex-wrap gap-1">
                            <span className="text-xs font-bold text-zinc-900">
                              Cash on Delivery
                            </span>
                            <span className="text-[9px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                              Zero Prepayment
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-600 mt-0.5 leading-relaxed">
                            Pay with cash upon receiving and inspecting items at your doorstep. Zero advance payment required.
                          </p>
                        </div>
                      </label>

                      {/* Digital Payment (Coming Soon) */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-200/80 bg-white opacity-75 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 rounded-full border border-zinc-300 bg-zinc-100 shrink-0" />
                          <div>
                            <span className="text-[11px] font-semibold text-zinc-700 block">
                              Cards & Mobile Banking
                            </span>
                            <span className="text-[9px] text-zinc-400">bKash, Nagad, Visa, Mastercard</span>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md shrink-0">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Promo Code / Coupon Section ── */}
                <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/60 p-3 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-800 flex items-center gap-1.5">
                      <LuTag className="w-3.5 h-3.5 text-emerald-600" />
                      Promo Code or Voucher
                    </span>
                    {appliedCoupon && (
                      <span className="text-[10px] font-extrabold uppercase text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                        Applied
                      </span>
                    )}
                  </div>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                      <div>
                        <span className="font-extrabold text-emerald-800 tracking-wider text-xs block">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-[10px] text-emerald-600">
                          {appliedCoupon.type === "percentage" ? `${appliedCoupon.value}% OFF` : `৳${appliedCoupon.value} OFF`} discount applied
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
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
                        placeholder="Enter promo code"
                        className="flex-1 px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs uppercase placeholder:normal-case placeholder:text-zinc-400 focus:outline-none focus:border-emerald-600"
                      />
                      <button
                        type="button"
                        disabled={applyingCoupon || !couponInput.trim()}
                        onClick={handleApplyCoupon}
                        className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
                      >
                        {applyingCoupon ? <LuLoader className="w-3.5 h-3.5 animate-spin" /> : "Apply"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Cost Breakdown */}
                <div className="border-t border-zinc-100 pt-3 space-y-2 text-xs">
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
                        <span className="text-emerald-700 font-extrabold uppercase">FREE</span>
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

                  <div className="pt-2.5 border-t border-zinc-200 flex justify-between items-baseline">
                    <div>
                      <span className="text-base font-black text-zinc-950 block">Total Amount</span>
                      <span className="text-[10px] text-zinc-400">Cash on Delivery</span>
                    </div>
                    <span className="text-2xl font-black text-emerald-700">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                {/* Terms Agreement Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input
                        type="checkbox"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-4 h-4 border border-zinc-300 rounded-md peer-checked:bg-emerald-600 peer-checked:border-emerald-600 flex items-center justify-center transition-colors">
                        {agreeToTerms && <LuCheck className="w-3 h-3 text-white stroke-[3]" />}
                      </div>
                    </div>
                    <span className="text-[11px] text-zinc-500 leading-relaxed">
                      I have read and agree to the{" "}
                      <Link
                        href="/terms"
                        target="_blank"
                        className="text-emerald-700 underline font-semibold hover:text-emerald-800"
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
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <LuLoader className="w-4 h-4 animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <>
                      <LuLock className="w-4 h-4" />
                      <span>Place Order (Cash on Delivery)</span>
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="pt-3 border-t border-zinc-100 grid grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <LuShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-[10px] font-bold text-zinc-500">256-Bit SSL</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <LuTruck className="w-4 h-4 text-emerald-600" />
                    <span className="text-[10px] font-bold text-zinc-500">Doorstep COD</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <LuCheck className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span className="text-[10px] font-bold text-zinc-500">100% Authentic</span>
                  </div>
                </div>

                {/* Help & Support Callout */}
                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <IoCallOutline className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      Need help? <strong className="text-zinc-900">01707819676</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaWhatsapp className="w-3.5 h-3.5 text-green-600 shrink-0" />
                    <a
                      href="https://wa.me/8801707819676"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-700 hover:underline font-semibold"
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
