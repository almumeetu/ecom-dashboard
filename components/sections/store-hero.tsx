"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Campaign, resolveImageUrl } from "@/lib/admin-api";
import {
  fetchActiveHeroCampaigns,
  CAMPAIGNS_UPDATED_EVENT,
  DEFAULT_HERO_CAMPAIGNS,
} from "@/lib/campaign-store";
import { type ShopCategory } from "@/lib/shop-api";
import {
  LuMenu,
  LuChevronRight,
  LuChevronLeft,
  LuSparkles,
  LuArrowRight,
  LuShieldCheck,
} from "react-icons/lu";

interface StoreHeroProps {
  categories: ShopCategory[];
  selectedCategory: string;
  onSelectCategory: (name: string) => void;
}

export default function StoreHero({
  categories,
  selectedCategory,
  onSelectCategory,
}: StoreHeroProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(DEFAULT_HERO_CAMPAIGNS);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load active campaigns (from DB + localStorage store)
  useEffect(() => {
    async function loadCampaigns() {
      try {
        const active = await fetchActiveHeroCampaigns();
        if (active && active.length > 0) {
          setCampaigns(active);
        }
      } catch (err) {
        console.error("Failed to load hero campaigns:", err);
      }
    }

    loadCampaigns();

    // Listen for live updates from Admin Settings -> Campaigns
    const handleCampaignsUpdated = () => {
      loadCampaigns();
    };

    window.addEventListener(CAMPAIGNS_UPDATED_EVENT, handleCampaignsUpdated);
    window.addEventListener("storage", handleCampaignsUpdated);

    return () => {
      window.removeEventListener(CAMPAIGNS_UPDATED_EVENT, handleCampaignsUpdated);
      window.removeEventListener("storage", handleCampaignsUpdated);
    };
  }, []);

  // Auto-advance slides every 5 seconds unless hovered
  useEffect(() => {
    if (campaigns.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % campaigns.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [campaigns.length, isPaused]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + campaigns.length) % campaigns.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % campaigns.length);
  };

  // Safe image resolver for campaign slide
  const getSlideImage = (campaign: Campaign) => {
    if (campaign.images && campaign.images.length > 0 && campaign.images[0].images.length > 0) {
      return resolveImageUrl(campaign.images[0].images[0]);
    }
    return "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80";
  };

  // Display top 8-10 core categories in the sidebar
  const sidebarCategories = categories.slice(0, 10);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-3 pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
        {/* ═══════════════ LEFT COLUMN: Shop by Category Sidebar ═══════════════ */}
        <div className="hidden lg:flex lg:col-span-3 flex-col bg-white rounded-2xl border border-zinc-200/90 shadow-2xs overflow-hidden h-[420px] xl:h-[450px]">
          {/* Header */}
          <div className="bg-[#1E1B4B] text-white px-4 py-3 flex items-center justify-between font-bold text-sm tracking-wide shrink-0">
            <div className="flex items-center gap-2">
              <LuMenu className="w-4 h-4 text-[#A5B4FC]" />
              <span>Shop By Category</span>
            </div>
            <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full font-bold">
              {sidebarCategories.length} Depts
            </span>
          </div>

          {/* Categories List */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100/80 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sidebarCategories.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onSelectCategory(cat.name);
                    const el = document.getElementById("featured-picks-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left transition-all duration-200 group cursor-pointer ${
                    isSelected
                      ? "bg-[#EEF2FF] text-[#4F46E5] font-bold"
                      : "text-zinc-700 hover:bg-[#EEF2FF]/80 hover:text-[#4F46E5]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="w-8 h-8 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-50 to-zinc-100 shrink-0 relative border border-zinc-200/80 shadow-2xs group-hover:scale-105 transition-transform flex items-center justify-center text-xs">
                      {cat.imageUrl ? (
                        <Image
                          src={cat.imageUrl}
                          alt={cat.name}
                          fill
                          sizes="32px"
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          unoptimized={cat.imageUrl.includes("unsplash.com")}
                        />
                      ) : (
                        <span>🛍️</span>
                      )}
                    </div>
                    <span className="text-xs font-semibold truncate leading-tight">
                      {cat.name}
                    </span>
                  </div>

                  <LuChevronRight
                    className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                      isSelected
                        ? "text-[#4F46E5] translate-x-1"
                        : "text-zinc-400 group-hover:text-[#4F46E5] group-hover:translate-x-1"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Bottom All Categories Link */}
          <div className="p-2.5 bg-zinc-50 border-t border-zinc-100 shrink-0 text-center">
            <Link
              href="/products"
              className="text-[11px] font-bold text-[#4F46E5] hover:text-[#4338CA] inline-flex items-center gap-1 transition-colors"
            >
              <span>View All Categories</span>
              <LuArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* ═══════════════ RIGHT COLUMN: Hero Campaign Banner Slider ═══════════════ */}
        <div
          className="lg:col-span-9 relative w-full h-[260px] sm:h-[340px] md:h-[400px] lg:h-[420px] xl:h-[450px] rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-950 shadow-sm group select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slides */}
          {campaigns.map((camp, index) => {
            const isActive = index === currentSlide;
            const bannerImg = getSlideImage(camp);

            return (
              <div
                key={camp.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={bannerImg}
                    alt={camp.title}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1024px) 100vw, 75vw"
                    className="object-cover"
                    unoptimized={bannerImg.includes("unsplash.com")}
                  />
                </div>

                {/* Rich Gradient Overlay for High Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B132B]/95 via-[#1E1B4B]/80 to-transparent sm:w-[75%] lg:w-[65%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent sm:hidden" />

                {/* Banner Content Container */}
                <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-10 md:px-14 max-w-xl text-white">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-2 sm:mb-3 w-fit">
                    <LuSparkles className="w-3 h-3 text-[#F97316]" />
                    <span>{camp.badge || "NovaMart Campaign"}</span>
                  </div>

                  {/* Campaign Title */}
                  <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-[40px] font-black tracking-tight leading-[1.15] text-white mb-2 sm:mb-3 drop-shadow-md">
                    {camp.title}
                  </h2>

                  {/* Campaign Description */}
                  {camp.description && (
                    <p className="text-xs sm:text-sm md:text-base text-zinc-200 line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-6 font-light leading-relaxed drop-shadow-sm max-w-md">
                      {camp.description}
                    </p>
                  )}

                  {/* Trust Highlights & CTA */}
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={camp.linkUrl || "/products"}
                      className="px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] active:scale-95 text-white font-bold text-xs sm:text-sm tracking-wide uppercase shadow-lg shadow-indigo-950/40 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>{camp.ctaText || "Shop Now"}</span>
                      <LuArrowRight className="w-4 h-4" />
                    </Link>

                    <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-zinc-300 text-xs font-medium">
                      <LuShieldCheck className="w-3.5 h-3.5 text-[#818CF8]" />
                      <span>১০০% অরিজিনাল পণ্য</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Slider Prev / Next Arrow Controls */}
          {campaigns.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Campaign"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-zinc-800 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <LuChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Campaign"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-zinc-800 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <LuChevronRight className="w-5 h-5" />
              </button>

              {/* Slide Pagination Dots */}
              <div className="absolute bottom-3.5 right-6 sm:right-10 z-30 flex items-center gap-1.5">
                {campaigns.map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    type="button"
                    onClick={() => setCurrentSlide(dotIndex)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      dotIndex === currentSlide
                        ? "w-6 bg-[#4F46E5]"
                        : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`Go to slide ${dotIndex + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
