"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import Link from "next/link";
import { HeroSliderProps } from "@/data/types";
import { LuArrowRight } from "react-icons/lu";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const QUICK_CATEGORIES = [
  { label: "Groceries", icon: "🥦", href: "/products?search=grocery", color: "from-emerald-500/10 to-emerald-500/5 hover:border-emerald-500/40 text-emerald-800" },
  { label: "Food & Bakery", icon: "🥐", href: "/products?search=food", color: "from-amber-500/10 to-amber-500/5 hover:border-amber-500/40 text-amber-900" },
  { label: "Women's Fashion", icon: "👗", href: "/products?category=Women's+Fashion", color: "from-rose-500/10 to-rose-500/5 hover:border-rose-500/40 text-rose-900" },
  { label: "Men's Fashion", icon: "👔", href: "/products?category=Men's+Fashion", color: "from-blue-500/10 to-blue-500/5 hover:border-blue-500/40 text-blue-900" },
  { label: "Footwear", icon: "👟", href: "/products?category=Footwear", color: "from-indigo-500/10 to-indigo-500/5 hover:border-indigo-500/40 text-indigo-900" },
  { label: "Accessories", icon: "⌚", href: "/products?category=Accessories", color: "from-purple-500/10 to-purple-500/5 hover:border-purple-500/40 text-purple-900" },
  { label: "Organic Deals", icon: "🌿", href: "/products?search=organic", color: "from-teal-500/10 to-teal-500/5 hover:border-teal-500/40 text-teal-900" },
];

export default function HeroSlider({ slides }: HeroSliderProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="relative w-full overflow-hidden bg-zinc-950">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        pagination={{
          clickable: true,
          bulletClass: "hero-bullet",
          bulletActiveClass: "hero-bullet-active",
          renderBullet: (index, className) => {
            return `<span class="${className}">
              <svg class="hero-svg-loader" width="24" height="24" viewBox="0 0 24 24">
                <circle class="bg-path" cx="12" cy="12" r="8" fill="none"></circle>
                <circle class="path" cx="12" cy="12" r="8" fill="none" transform="rotate(-90 12 12)"></circle>
                <circle class="dot" cx="12" cy="12" r="3"></circle>
              </svg>
            </span>`;
          },
        }}
        className="hero-slider"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-[480px] sm:h-[540px] md:h-[620px] lg:h-[680px]">
              {/* Media Background */}
              <div className="absolute inset-0 overflow-hidden bg-zinc-900">
                {slide.image ? (
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    unoptimized={slide.image.includes("unsplash.com")}
                  />
                ) : slide.videoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${slide.videoId}?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&enablejsapi=1`}
                    className="absolute left-1/2 top-1/2 w-[300%] h-[300%] md:w-[200%] md:h-[200%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    allow="autoplay; encrypted-media"
                    title={slide.title}
                  />
                ) : null}
              </div>

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/50 to-zinc-950/30 z-10" />

              {/* Content Box */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-12 max-w-5xl mx-auto">
                {/* Badge */}
                {slide.badge && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-semibold tracking-widest uppercase mb-4 animate-fadeIn">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {slide.badge}
                  </div>
                )}

                {/* Main Heading */}
                <h1 className="text-white leading-[1.1] mb-4 drop-shadow-md">
                  <span className="font-['Bembo_Std'] font-medium text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight block sm:inline">
                    {slide.title}{" "}
                  </span>
                  {slide.titleItalic && (
                    <span className="font-['Snell_Roundhand_LT_Std'] italic text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-emerald-300 block sm:inline">
                      {slide.titleItalic}
                    </span>
                  )}
                </h1>

                {/* Subtitle */}
                <p className="max-w-2xl text-zinc-200 text-sm sm:text-base md:text-lg font-light leading-relaxed mb-8 drop-shadow-sm">
                  {slide.subtitle}
                </p>

                {/* CTA Buttons */}
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
                  <Link
                    href={slide.ctaHref || "/products"}
                    className="px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-2.5 shadow-lg shadow-emerald-900/30 hover:shadow-emerald-700/50 hover:scale-105 cursor-pointer"
                  >
                    <span>{slide.ctaText || "SHOP NOW"}</span>
                    <LuArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/products"
                    className="px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/25 font-sans text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    ALL PRODUCTS
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Multi-Category Quick Navigation Bar */}
      <div className="relative z-30 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200/80 py-3 sm:py-4 px-4 shadow-sm">
        <div className="max-w-[1440px] mx-auto flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-0.5">
          {QUICK_CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className={`shrink-0 flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r border border-zinc-200/70 ${cat.color} font-medium text-xs sm:text-[13px] transition-all duration-200 hover:shadow-xs hover:scale-103 cursor-pointer`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}