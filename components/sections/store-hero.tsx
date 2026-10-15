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
  LuArrowRight,
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
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const isPaused = isHovered || isFocused || !isPageVisible || prefersReducedMotion;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load active campaigns (from DB + localStorage store)
  useEffect(() => {
    async function loadCampaigns() {
      try {
        const active = await fetchActiveHeroCampaigns();
        if (active && active.length > 0) {
          setCampaigns(active);
          setCurrentSlide(0);
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

  useEffect(() => {
    const updateVisibility = () => setIsPageVisible(document.visibilityState === "visible");
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setPrefersReducedMotion(motionPreference.matches);

    updateVisibility();
    updateMotionPreference();
    document.addEventListener("visibilitychange", updateVisibility);
    motionPreference.addEventListener("change", updateMotionPreference);

    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
      motionPreference.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  // Auto-advance only when the carousel is visible and the visitor is not interacting.
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

  const getCampaignHref = (campaign: Campaign) => {
    const href = campaign.linkUrl?.trim();
    if (!href) return "/products";
    if (href.startsWith("/") && !href.startsWith("//")) return href;
    try {
      const parsed = new URL(href);
      return parsed.protocol === "http:" || parsed.protocol === "https:" ? href : "/products";
    } catch {
      return "/products";
    }
  };

  // Display top 8-10 core categories in the sidebar
  const sidebarCategories = categories.slice(0, 10);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
        {/* ═══════════════ LEFT COLUMN: Shop by Category Sidebar ═══════════════ */}
        <div className="hidden lg:flex lg:col-span-3 flex-col bg-white rounded-xl border border-store-border overflow-hidden h-[420px] xl:h-[450px]">
          {/* Header */}
          <div className="bg-store-primary text-white px-4 py-3 flex items-center justify-between font-medium text-sm tracking-wide shrink-0">
            <div className="flex items-center gap-2">
              <LuMenu className="w-4 h-4 text-white/80" />
              <span>Shop By Category</span>
            </div>
          </div>

          {/* Categories List */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100/80 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sidebarCategories.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.name)}
                  className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left transition-all duration-200 group cursor-pointer ${
                    isSelected
                      ? "bg-store-surface text-store-primary font-bold"
                      : "text-zinc-700 hover:bg-store-surface/80 hover:text-store-primary"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="w-8 h-8 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-zinc-100 shrink-0 relative border border-zinc-200/80 shadow-2xs group-hover:scale-105 transition-transform flex items-center justify-center text-xs">
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
                        ? "text-store-primary translate-x-1"
                        : "text-zinc-400 group-hover:text-store-primary group-hover:translate-x-1"
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
              className="text-[11px] font-bold text-store-primary hover:text-store-accent inline-flex items-center gap-1 transition-colors"
            >
              <span>View All Categories</span>
              <LuArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* ═══════════════ RIGHT COLUMN: Hero Campaign Banner Slider ═══════════════ */}
        <div
          role="region"
          aria-label="Featured campaigns"
          aria-roledescription="carousel"
          className="group relative h-[300px] w-full select-none overflow-hidden rounded-2xl bg-store-deep shadow-lg shadow-store-deep/10 sm:h-[340px] md:h-[400px] lg:col-span-9 lg:h-[420px] xl:h-[450px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocusCapture={() => setIsFocused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setIsFocused(false);
            }
          }}
        >
          {/* Slides */}
          {campaigns.map((camp, index) => {
            const isActive = index === currentSlide;
            const bannerImg = getSlideImage(camp);

            return (
              <div
                key={camp.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${index + 1} of ${campaigns.length}`}
                aria-hidden={!isActive}
                className={`absolute inset-0 ${prefersReducedMotion ? "transition-none" : "transition-opacity duration-700 ease-in-out"} ${
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
                <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-store-deep/95 via-store-deep/75 to-store-deep/5 sm:w-[82%] lg:w-[70%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-store-deep/60 via-transparent to-transparent sm:hidden" />

                {/* Banner Content Container */}
                <div className="absolute inset-0 z-20 flex max-w-2xl flex-col items-start justify-center px-6 text-white sm:px-10 md:px-14">
                  <span className="mb-3 inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm">
                    {camp.badge?.trim() || (camp.hasDiscount ? "Special offer" : "Featured collection")}
                  </span>
                  {/* Campaign Title */}
                  <h2 className="mb-3 max-w-xl text-2xl font-semibold leading-tight tracking-tight text-white drop-shadow-md sm:text-3xl md:text-4xl lg:text-[40px]">
                    {camp.title}
                  </h2>
                  {camp.description?.trim() && (
                    <p className="mb-5 max-w-lg line-clamp-2 text-sm leading-6 text-white/85 drop-shadow-sm sm:mb-6 sm:text-base">
                      {camp.description}
                    </p>
                  )}

                  {/* Campaign CTA */}
                  <Link
                    href={getCampaignHref(camp)}
                    tabIndex={isActive ? 0 : -1}
                    className="inline-flex w-fit items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-store-deep shadow-sm transition hover:bg-store-surface active:scale-[0.98] sm:px-6"
                  >
                    <span>{camp.ctaText || "Shop Now"}</span>
                    <LuArrowRight className="w-4 h-4" />
                  </Link>

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
                className="absolute left-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-store-deep shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95 sm:h-11 sm:w-11 sm:opacity-0 sm:group-hover:opacity-100 group-focus-within:opacity-100"
              >
                <LuChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Campaign"
                className="absolute right-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-store-deep shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95 sm:h-11 sm:w-11 sm:opacity-0 sm:group-hover:opacity-100 group-focus-within:opacity-100"
              >
                <LuChevronRight className="w-5 h-5" />
              </button>

              {/* Slide Pagination Dots */}
              <div className="absolute bottom-4 right-5 z-30 flex items-center gap-1.5 sm:bottom-5 sm:right-8">
                {campaigns.map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    type="button"
                    onClick={() => setCurrentSlide(dotIndex)}
                    aria-pressed={dotIndex === currentSlide}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      dotIndex === currentSlide
                        ? "w-6 bg-white"
                        : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`Go to campaign ${dotIndex + 1}`}
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
