"use client";

import Image from "next/image";
import Link from "next/link";
import {
  HiShieldCheck,
  HiTruck,
  HiBadgeCheck,
  HiOutlineSupport,
  HiLocationMarker,
  HiPhone,
  HiMail,
  HiCheckCircle,
} from "react-icons/hi";
import {
  FiArrowRight,
  FiShoppingBag,
  FiLayers,
  FiRefreshCw,
  FiClock,
} from "react-icons/fi";
import { FaWhatsapp, FaQuoteLeft } from "react-icons/fa6";
import ScrollAnimate from "@/components/ui/scroll-animate";

export default function About() {
  const departments = [
    {
      title: "Fresh Groceries & Farm Produce",
      desc: "Cold-pressed oils, pure natural honey, unadulterated spices, organic grains, and seasonal harvests sourced directly from growers.",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80",
      tag: "Pantry & Organic",
      link: "/products?search=grocery",
    },
    {
      title: "Men's Fashion & Apparel",
      desc: "Traditional panjabis, executive formal shirts, comfortable casual tees, denim, and modern everyday essentials.",
      image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80",
      tag: "Apparel",
      link: "/products?category=Men's+Fashion",
    },
    {
      title: "Women's Fashion & Lifestyle",
      desc: "Contemporary ethnic wear, festive kurtis, comfortable casuals, and modern lifestyle fashion accessories.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
      tag: "Fashion",
      link: "/products?category=Women's+Fashion",
    },
    {
      title: "Footwear & Daily Essentials",
      desc: "Handcrafted genuine leather footwear, comfortable walking sneakers, casual sandals, and formal shoes.",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
      tag: "Footwear",
      link: "/products?category=Footwear",
    },
    {
      title: "Electronics, Audio & Smart Gadgets",
      desc: "Smart wearables, high-fidelity wireless audio, fast-charging hubs, power accessories, and tech essentials.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      tag: "Electronics",
      link: "/products?category=Accessories",
    },
    {
      title: "Home, Kitchen & Living Essentials",
      desc: "Durable kitchenware, storage organizers, home utility goods, and essentials designed for modern family living.",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
      tag: "Home & Living",
      link: "/products",
    },
  ];

  const commitments = [
    {
      icon: HiShieldCheck,
      title: "100% Genuine & Verified Quality",
      desc: "Every product in our catalog is procured through verified channels and primary producers, guaranteeing absolute authenticity.",
    },
    {
      icon: FiLayers,
      title: "Direct Sourcing & Fair Pricing",
      desc: "By bypassing traditional multi-tier broker networks, we connect growers and manufacturers directly to consumers at transparent prices.",
    },
    {
      icon: HiTruck,
      title: "Nationwide Doorstep Delivery",
      desc: "Comprehensive logistics network servicing all 64 districts in Bangladesh with secure packaging and reliable tracking.",
    },
    {
      icon: FiRefreshCw,
      title: "Buyer Protection & 7-Day Returns",
      desc: "Transparent return and exchange policies paired with secure payment gateways and Cash on Delivery options.",
    },
  ];

  return (
    <div className="w-full bg-[#FAFAFA] text-zinc-900 font-sans">
      
      {/* ── 1. Our Story & Purpose Section ── */}
      <section className="py-12 sm:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <ScrollAnimate variant="fade-in-up">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Left Column: Mission & Narrative */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold tracking-wider uppercase">
                  <FiShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>About Trust Point Mart</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-950 tracking-tight leading-tight">
                  Direct Sourcing, Authentic Quality &amp; Transparent Commerce Across Bangladesh
                </h2>

                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">
                  <strong className="text-zinc-950 font-bold">Trust Point Mart</strong> is a dedicated multi-category online hypermarket and marketplace platform founded by entrepreneur <strong className="text-zinc-950 font-bold">Mohammad Abdullah</strong>, originating from <strong className="text-zinc-950 font-bold">Mohadevpur, Naogaon, Rajshahi Division</strong>.
                </p>

                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                  Our core mission is straightforward: to eliminate unnecessary middlemen markups, address counterfeit concerns in the retail market, and deliver genuine daily essentials—from pantry staples and farm-fresh produce to lifestyle fashion, footwear, and consumer goods—directly to families across all 64 districts.
                </p>

                {/* 4 Feature Badges Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-zinc-200/80 shadow-xs">
                    <HiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-900">Direct From Source</h4>
                      <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                        Connecting primary producers with households at fair prices.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-zinc-200/80 shadow-xs">
                    <HiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-900">Verified Quality</h4>
                      <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                        Carefully checked and packaged before nationwide dispatch.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-zinc-200/80 shadow-xs">
                    <HiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-900">All 64 Districts</h4>
                      <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                        Reliable courier delivery with end-to-end tracking updates.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-zinc-200/80 shadow-xs">
                    <HiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-zinc-900">Customer Support</h4>
                      <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                        Direct executive desk and 24/7 customer care helpline.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    <span>Explore Products</span>
                    <FiArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href="tel:01707819676"
                    className="inline-flex items-center gap-2 bg-white hover:bg-zinc-100 active:scale-95 text-zinc-800 font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl border border-zinc-300 shadow-xs transition-all cursor-pointer"
                  >
                    <HiPhone className="w-4 h-4 text-emerald-600" />
                    <span>Executive Desk: 01707819676</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Visual Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-zinc-200 bg-zinc-900 aspect-[4/5] sm:aspect-square lg:aspect-[4/5] group">
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80"
                    alt="Trust Point Mart Products & Operations"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />

                  {/* Bottom Info Card */}
                  <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-white/40 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-xs">
                        TP
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-950 leading-tight">
                          Trust Point Mart
                        </h4>
                        <p className="text-xs text-zinc-600 mt-0.5">
                          Multi-Category E-Commerce &amp; Hypermarket
                        </p>
                        <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                          Headquarters: Mohadevpur, Naogaon, Rajshahi Division
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* ── 2. Executive Leadership: Founder & CEO ── */}
      <section className="py-14 sm:py-20 bg-[#0B0F17] text-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-6 sm:p-10 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Portrait & Contact */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="relative w-full max-w-xs sm:max-w-sm rounded-2xl overflow-hidden bg-zinc-950 border border-white/20 aspect-square shadow-xl">
                  <Image
                    src="/images/team/Abdullah.jpg"
                    alt="Mohammad Abdullah - Founder & CEO of Trust Point Mart"
                    width={960}
                    height={957}
                    priority
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-left">
                    <div className="text-white font-bold text-base sm:text-lg leading-snug">
                      Mohammad Abdullah
                    </div>
                    <div className="text-emerald-400 text-xs font-medium flex items-center gap-1 mt-0.5">
                      <HiLocationMarker className="w-3.5 h-3.5 shrink-0" />
                      <span>Mohadevpur, Naogaon, Rajshahi Division</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 w-full max-w-xs sm:max-w-sm mt-4">
                  <a
                    href="tel:01707819676"
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    <HiPhone className="w-4 h-4 shrink-0" />
                    <span>Call Desk</span>
                  </a>

                  <a
                    href="https://wa.me/8801707819676?text=Hello%20Mohammad%20Abdullah%2C%20I%20am%20contacting%20you%20from%20Trust%20Point%20Mart."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    <FaWhatsapp className="w-4 h-4 shrink-0 text-white" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Founder Profile & Governance */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <HiBadgeCheck className="w-4 h-4 text-emerald-400" />
                    <span>Executive Leadership</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Mohammad Abdullah
                  </h3>
                  <p className="text-emerald-400 text-xs sm:text-sm font-medium mt-0.5">
                    Founder &amp; Chief Executive Officer • Trust Point Mart
                  </p>
                </div>

                {/* Quote Block */}
                <div className="bg-zinc-950/60 border-l-4 border-emerald-500 rounded-r-xl p-4 sm:p-5">
                  <FaQuoteLeft className="w-5 h-5 text-emerald-500/30 mb-1.5" />
                  <p className="text-xs sm:text-sm text-zinc-200 italic leading-relaxed">
                    &ldquo;Commerce is an enduring covenant of trust. Whether we are packing daily groceries, fresh regional harvests, or contemporary lifestyle fashion, our standard is absolute honesty. By connecting sources directly to homes, we ensure families across Bangladesh receive genuine products at fair prices.&rdquo;
                  </p>
                </div>

                {/* 3 Core Points */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="bg-zinc-800/60 border border-white/5 rounded-xl p-3.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-2">
                      <HiShieldCheck className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wide">
                      Authenticity
                    </h5>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                      Zero tolerance for counterfeits or adulteration.
                    </p>
                  </div>

                  <div className="bg-zinc-800/60 border border-white/5 rounded-xl p-3.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold mb-2">
                      <HiLocationMarker className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wide">
                      Northern Hub
                    </h5>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                      Headquarters in Mohadevpur, Naogaon.
                    </p>
                  </div>

                  <div className="bg-zinc-800/60 border border-white/5 rounded-xl p-3.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold mb-2">
                      <HiPhone className="w-4 h-4" />
                    </div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wide">
                      Direct Access
                    </h5>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                      Direct desk: 01707819676 for corporate orders.
                    </p>
                  </div>
                </div>

                {/* Contact desk details */}
                <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-zinc-300">
                  <span>Founder Desk: <a href="tel:01707819676" className="text-white font-bold hover:text-emerald-400">01707819676</a></span>
                  <span className="hidden sm:inline">•</span>
                  <span>WhatsApp Direct: <a href="https://wa.me/8801707819676" className="text-emerald-400 font-semibold hover:underline">01707819676</a></span>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Marketplace Departments ── */}
      <section className="py-14 sm:py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Product Departments
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight mt-1">
                Explore Our Core Categories
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Curated everyday essentials, pantry goods, fashion, footwear, and consumer technology.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors shrink-0"
            >
              <span>View All Products</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((d, idx) => (
              <Link
                key={idx}
                href={d.link}
                className="group rounded-2xl overflow-hidden bg-white border border-zinc-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-zinc-100">
                  <img
                    src={d.image}
                    alt={d.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-zinc-900/85 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {d.tag}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">
                      {d.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                      {d.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-emerald-600">
                    <span>Browse Department</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Our Commitments ── */}
      <section className="py-14 sm:py-20 bg-white border-y border-zinc-200/80">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Why Trust Point Mart
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight mt-1">
              Our Core Service Commitments
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 leading-relaxed">
              Built on transparency, verified supply chains, and customer-first accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {commitments.map((c, idx) => {
              const Icon = c.icon;
              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-zinc-50/70 border border-zinc-200/70 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900 leading-snug mb-1.5">
                      {c.title}
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {c.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. Operations & Customer Support Hub ── */}
      <section className="py-14 sm:py-18 bg-[#101318] text-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-3 py-1 rounded-full">
                Operations &amp; Logistics
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Central Operations in Mohadevpur, Naogaon
              </h2>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Trust Point Mart operates its central logistics and procurement hub in Mohadevpur, Naogaon, Rajshahi Division. From here, our team oversees direct sourcing partnerships with regional agricultural hubs, quality inspection, parcel packaging, and nationwide courier routing.
              </p>

              <div className="space-y-3 pt-2 text-xs text-zinc-300">
                <div className="flex items-start gap-3">
                  <HiLocationMarker className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Central Logistics Hub:</strong>
                    <span>Mohadevpur, Naogaon, Rajshahi Division, Bangladesh</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <HiPhone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Direct Founder &amp; Executive Desk:</strong>
                    <span>Call / WhatsApp: <a href="tel:01707819676" className="text-emerald-400 font-bold hover:underline">01707819676</a></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Schedule Card */}
            <div className="lg:col-span-6 bg-zinc-900/90 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <FiClock className="w-4 h-4 text-emerald-400" />
                <span>Ordering &amp; Customer Care Schedule</span>
              </div>

              <div className="space-y-2.5 text-xs text-zinc-300">
                <div className="flex justify-between py-1.5 border-b border-white/10">
                  <span>Saturday – Thursday (Support Desk)</span>
                  <span className="font-semibold text-white">9:00 AM – 10:00 PM</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/10">
                  <span>Friday (Customer Desk)</span>
                  <span className="font-semibold text-white">2:00 PM – 10:00 PM</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>Online Store Ordering</span>
                  <span className="font-semibold text-emerald-400">Open 24 Hours / 365 Days</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/8801707819676?text=Hello%20Trust%20Point%20Mart%2C%20I%20would%20like%20to%20inquire%20about%20an%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center text-xs tracking-wider transition-colors cursor-pointer"
                >
                  WhatsApp Support
                </a>
                <Link
                  href="/contact"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-center text-xs tracking-wider transition-colors cursor-pointer"
                >
                  Contact Page
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 6. Call to Action Banner ── */}
      <section className="py-12 sm:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="bg-gradient-to-r from-emerald-900 to-zinc-950 rounded-2xl p-8 sm:p-12 text-white text-center shadow-lg border border-emerald-800/30">
            <div className="max-w-xl mx-auto space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Shop with Confidence at Trust Point Mart
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Discover verified groceries, fashion, footwear, and consumer goods backed by our direct-sourcing guarantee.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <Link
                  href="/products"
                  className="bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Start Shopping
                </Link>
                <Link
                  href="/contact"
                  className="bg-emerald-950/70 hover:bg-emerald-950 text-white border border-emerald-400/30 font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Customer Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
