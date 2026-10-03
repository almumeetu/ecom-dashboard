"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LuPrinter,
  LuCheck,
  LuPackage,
  LuTruck,
  LuShieldCheck,
  LuArrowRight,
  LuCopy,
  LuMapPin,
  LuPhone,
  LuUser,
  LuClock,
  LuCircleCheck,
} from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa6";
import { IoCallOutline } from "react-icons/io5";
import type { OrderResult } from "@/lib/types";
import { useCurrency } from "@/lib/currency-context";
import InvoiceModal from "@/components/invoice-modal";

export default function ConfirmationPage() {
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [copied, setCopied] = useState(false);
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    setHasMounted(true);
    const stored = sessionStorage.getItem("orderResult");
    if (stored) {
      try {
        setOrder(JSON.parse(stored) as OrderResult);
      } catch {
        // Ignore JSON error
      }
    }
    const timer = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyOrderNumber = () => {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isDhakaAddress =
    order?.address?.state?.toLowerCase().includes("dhaka") ||
    order?.address?.city?.toLowerCase().includes("dhaka");

  const estimatedDelivery = isDhakaAddress
    ? "Tomorrow (Within 24 Hours)"
    : "Within 2-4 Business Days";

  const orderDateFormatted = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const whatsappInquiryUrl = order?.orderNumber
    ? `https://wa.me/8801722301927?text=${encodeURIComponent(
        `Hello NovaMart, I have placed Order #${order.orderNumber}. I would like to inquire about my delivery.`
      )}`
    : "https://wa.me/8801722301927";

  if (!hasMounted) {
    return (
      <main className="grow bg-[#FAF9F5] w-full min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-20 w-20 bg-stone-200 rounded-full" />
          <div className="h-7 w-52 bg-stone-200 rounded-full" />
          <div className="h-4 w-64 bg-stone-100 rounded-full" />
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="grow bg-[#FAF9F5] w-full min-h-screen flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-sm mx-auto bg-white p-10 rounded-2xl border border-zinc-200/70 shadow-lg">
          <div className="w-14 h-14 bg-zinc-100 rounded-xl flex items-center justify-center mx-auto mb-5 text-zinc-400">
            <LuPackage className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-medium text-zinc-900 tracking-tight mb-2">
            No Order Found
          </h1>
          <p className="text-xs text-zinc-500 mb-7 leading-relaxed">
            It looks like you haven&apos;t placed an order in this session, or your session has expired.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95"
          >
            <span>Explore Collections</span>
            <LuArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>
    );
  }

  const subtotal = order.subtotal ?? order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryCharge =
    order.shippingCost !== undefined
      ? order.shippingCost
      : Math.max(0, order.total - subtotal);
  const discountAmount = order.discount ?? Math.max(0, subtotal + deliveryCharge - order.total);

  const steps = [
    {
      icon: <LuCheck className="w-4 h-4 stroke-[3]" />,
      label: "Order Placed",
      sub: "Confirmed & Logged",
      state: "done" as const,
    },
    {
      icon: <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse block" />,
      label: "Quality Check",
      sub: "Packaging in progress",
      state: "active" as const,
    },
    {
      icon: <LuTruck className="w-4 h-4" />,
      label: "Courier Dispatch",
      sub: "Pathao / Steadfast",
      state: "pending" as const,
    },
    {
      icon: <LuShieldCheck className="w-4 h-4" />,
      label: "Doorstep Delivery",
      sub: "Inspect & Pay Cash",
      state: "pending" as const,
    },
  ];

  return (
    <main className="grow bg-[#FAF9F5] w-full min-h-screen pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16">

        {/* HERO */}
        <div
          className={`text-center mb-10 transition-all duration-700 ease-out ${
            animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative inline-flex items-center justify-center mb-7">
            <div
              className={`absolute w-28 h-28 rounded-full bg-emerald-100 transition-all duration-1000 ease-out ${
                animateIn ? "scale-100 opacity-60" : "scale-50 opacity-0"
              }`}
            />
            <div
              className={`absolute w-20 h-20 rounded-full bg-emerald-200/50 transition-all duration-700 delay-100 ease-out ${
                animateIn ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
            />
            <div
              className={`relative w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20 transition-all duration-500 delay-[250ms] ease-out ${
                animateIn ? "scale-100 opacity-100" : "scale-0 opacity-0"
              }`}
            >
              <LuCheck className="w-7 h-7 text-white stroke-[3]" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold uppercase tracking-widest mb-3">
            <LuCircleCheck className="w-3 h-3" />
            <span>Order Verified &amp; Confirmed</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-normal text-zinc-900 tracking-tight mb-2">
            Thank You for Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
            We&apos;ve received your order. Our team is preparing your package for express courier handover.
          </p>
        </div>

        {/* METADATA STRIP */}
        <div
          className={`bg-white rounded-2xl border border-zinc-200/80 shadow-sm mb-7 overflow-hidden transition-all duration-700 delay-100 ease-out ${
            animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-zinc-100">
            <div className="px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">Order ID</p>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-zinc-950 font-mono tracking-tight">
                  #{order.orderNumber}
                </span>
                <button
                  onClick={handleCopyOrderNumber}
                  className="p-1 rounded hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                  title="Copy Order ID"
                >
                  {copied ? (
                    <LuCheck className="w-3 h-3 text-emerald-600 stroke-[3]" />
                  ) : (
                    <LuCopy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

            <div className="px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">Order Date</p>
              <span className="text-sm font-semibold text-zinc-800 flex items-center gap-1.5">
                <LuClock className="w-3.5 h-3.5 text-zinc-400" />
                {orderDateFormatted}
              </span>
            </div>

            <div className="px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">Payment</p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                <LuShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Cash on Delivery
              </span>
            </div>

            <div className="px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">Est. Delivery</p>
              <span className="text-sm font-semibold text-zinc-800 flex items-center gap-1.5">
                <LuTruck className="w-3.5 h-3.5 text-emerald-600" />
                {estimatedDelivery}
              </span>
            </div>
          </div>
        </div>

        {/* ORDER STATUS TRACKER */}
        <div
          className={`bg-white rounded-2xl border border-zinc-200/80 shadow-sm p-6 mb-7 transition-all duration-700 delay-150 ease-out ${
            animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-zinc-900">Order Status</h2>
              <p className="text-[11px] text-zinc-400 mt-0.5">Track your parcel in real time</p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Processing
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <div key={i} className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs transition-all ${
                    step.state === "done"
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/30"
                      : step.state === "active"
                      ? "bg-white border-2 border-emerald-500 text-emerald-600"
                      : "bg-zinc-100 border border-zinc-200 text-zinc-400 opacity-60"
                  }`}
                >
                  {step.icon}
                </div>
                <div>
                  <p className={`text-xs font-bold ${step.state === "pending" ? "text-zinc-500" : "text-zinc-900"}`}>
                    {i + 1}. {step.label}
                  </p>
                  <p
                    className={`text-[11px] ${
                      step.state === "done"
                        ? "text-emerald-600 font-semibold"
                        : step.state === "active"
                        ? "text-zinc-500"
                        : "text-zinc-400"
                    }`}
                  >
                    {step.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TWO-COLUMN LAYOUT */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-6 transition-all duration-700 delay-200 ease-out ${
            animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* LEFT: Items + Address */}
          <div className="lg:col-span-7 space-y-5">

            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <LuPackage className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-zinc-900">Ordered Items</h3>
                </div>
                <span className="text-[11px] font-semibold text-zinc-500 bg-zinc-100 px-2.5 py-0.5 rounded-full">
                  {order.items.length} {order.items.length === 1 ? "Product" : "Products"}
                </span>
              </div>

              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100 hover:border-zinc-200 transition-colors"
                  >
                    <div className="w-12 h-12 relative bg-white rounded-lg shrink-0 overflow-hidden border border-zinc-200/70">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-contain p-1"
                        />
                      )}
                      <span className="absolute -top-1 -right-1 bg-zinc-900 text-white text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-900 truncate leading-snug">{item.name}</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {formatCurrency(item.price)} x {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-extrabold text-zinc-950 whitespace-nowrap">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {order.address && (
              <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <LuMapPin className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-zinc-900">Delivery Details</h3>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                    Doorstep Delivery
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">Recipient</span>
                    <p className="font-bold text-zinc-900 flex items-center gap-1.5">
                      <LuUser className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      {order.address.fullName}
                    </p>
                    {order.address.phone && (
                      <p className="text-zinc-600 flex items-center gap-1.5">
                        <LuPhone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        {order.address.phone}
                      </p>
                    )}
                    {order.address.email ? (
                      <p className="text-zinc-400 truncate">{order.address.email}</p>
                    ) : (
                      <p className="text-zinc-400 text-[11px] italic">Guest Customer (No email)</p>
                    )}
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-0.5">
                      Shipping Address
                    </span>
                    <p className="font-semibold text-zinc-800 leading-snug">{order.address.addressLine1}</p>
                    {order.address.addressLine2 && (
                      <p className="text-zinc-500">{order.address.addressLine2}</p>
                    )}
                    <p className="text-zinc-500">
                      {[order.address.city, order.address.state, order.address.postalCode]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    <p className="text-zinc-400">{order.address.country}</p>
                  </div>
                </div>

                {order.orderNote && (
                  <div className="mt-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200/60 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 block mb-1">
                      Delivery Instructions
                    </span>
                    <p className="text-zinc-700 italic leading-relaxed">&ldquo;{order.orderNote}&rdquo;</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Summary + Actions + Support */}
          <div className="lg:col-span-5 space-y-5">

            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm p-5 sm:p-6">
              <h3 className="text-sm font-bold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">
                Order Summary
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-zinc-800">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between text-zinc-500">
                  <span>Delivery ({isDhakaAddress ? "Inside Dhaka" : "Outside Dhaka"})</span>
                  <span className="font-semibold text-zinc-800">
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      formatCurrency(deliveryCharge)
                    )}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-500">
                  <span>VAT / Tax</span>
                  <span className="text-zinc-400">Included</span>
                </div>

                <div className="pt-3 border-t border-zinc-200 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-black text-zinc-950">Total Payable</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Cash on Delivery</p>
                  </div>
                  <span className="text-2xl font-black text-emerald-700 tracking-tight">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-start gap-2.5">
                <LuShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  <strong>Zero Upfront Risk:</strong> Inspect your parcel before handing cash to the courier.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm p-5 sm:p-6 space-y-2.5">
              <Link
                href={`/profile?tab=track&order=${encodeURIComponent(order.orderNumber)}`}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] shadow-md shadow-emerald-600/20"
              >
                <LuTruck className="w-4 h-4" />
                <span>Live Order Tracking</span>
              </Link>

              <button
                onClick={() => setInvoiceOpen(true)}
                className="w-full py-3.5 px-4 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <LuPrinter className="w-4 h-4" />
                <span>Download / Print Invoice</span>
              </button>

              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <FaWhatsapp className="w-4 h-4 text-green-600" />
                <span>Track on WhatsApp</span>
              </a>

              <Link
                href="/products"
                className="w-full py-3 px-4 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Continue Shopping</span>
                <LuArrowRight className="w-3.5 h-3.5 text-zinc-400" />
              </Link>
            </div>

            <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 shrink-0">
                  <IoCallOutline className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900">24/7 Priority Support</p>
                  <p className="text-[11px] text-zinc-500">Hotline: 01722301927</p>
                </div>
              </div>
              <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between text-[11px] text-zinc-400">
                <Link href="/terms" className="hover:text-zinc-700 transition-colors underline underline-offset-2">
                  Terms of Service
                </Link>
                <Link href="/contact" className="hover:text-zinc-700 transition-colors underline underline-offset-2">
                  Customer Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InvoiceModal
        order={order}
        open={invoiceOpen}
        onClose={() => setInvoiceOpen(false)}
      />
    </main>
  );
}
