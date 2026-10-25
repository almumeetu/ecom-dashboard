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
  const [isInView, setIsInView] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const isPaused = isHovered || isFocused || !isPageVisible || !isInView || prefersReducedMotion;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

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
    const element = carouselRef.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(element);
    return () => observer.disconnect();
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

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null || campaigns.length <= 1) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(distance) < 48) return;
    if (distance < 0) handleNext();
    else handlePrev();
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
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-store-orange-ink">Welcome to NovaMart</p>
          <p className="mt-1 text-sm text-store-accent sm:text-base">Your favourite finds, thoughtfully brought together.</p>
        </div>
        <Link href="/products" className="hidden items-center gap-2 text-sm font-semibold text-store-primary transition-colors hover:text-store-hover sm:inline-flex">
          Explore the store <LuArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12 lg:gap-5">
        {/* ═══════════════ LEFT COLUMN: Shop by Category Sidebar ═══════════════ */}
        <div className="hidden lg:col-span-3 lg:flex h-[470px] flex-col overflow-hidden rounded-[28px] border border-store-border bg-white shadow-[0_16px_40px_rgba(20,38,56,0.06)] xl:h-[500px]">
          {/* Header */}
          <div className="bg-store-deep px-5 py-5 text-white flex items-center justify-between text-sm font-semibold tracking-wide shrink-0">
            <div className="flex items-center gap-2">
              <LuMenu className="w-4 h-4 text-store-orange" />
              <span>Shop by category</span>
            </div>
          </div>

          {/* Categories List */}
          <div className="storefront-scroll-track flex-1 overflow-y-auto py-2">
            {sidebarCategories.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.name)}
                  aria-pressed={isSelected}
                  className={`mx-2 flex w-[calc(100%_-_1rem)] items-center justify-between rounded-xl px-3 py-1.5 text-left transition-colors duration-200 group cursor-pointer ${
                    isSelected
                      ? "bg-store-surface text-store-primary font-bold"
                      : "text-zinc-700 hover:bg-store-surface/80 hover:text-store-primary"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-store-border bg-store-page text-xs">
                      {cat.imageUrl ? (
                        <Image
                          src={cat.imageUrl}
                          alt={cat.name}
                          fill
                          sizes="32px"
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          unoptimized={cat.imageUrl.includes("unsplash.com")}
                        />
                      ) : (
                        <span>🛍️</span>
                      )}
                    </div>
                    <span className="truncate text-xs font-semibold leading-tight">
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
          <div className="shrink-0 border-t border-store-border bg-store-page p-3 text-center">
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
          ref={carouselRef}
          className="group relative h-[420px] w-full select-none overflow-hidden rounded-[28px] bg-store-deep shadow-[0_24px_60px_rgba(20,38,56,0.16)] sm:h-[450px] lg:col-span-9 lg:h-[470px] xl:h-[500px]"
          onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }}
          onTouchEnd={handleTouchEnd}
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
                inert={!isActive}
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
                    className={`object-cover transition-transform duration-[5000ms] ease-out ${isActive && !prefersReducedMotion ? "scale-[1.04]" : "scale-100"}`}
                    unoptimized={bannerImg.includes("unsplash.com")}
                  />
                </div>

                {/* Rich Gradient Overlay for High Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-store-deep/95 via-store-deep/75 to-store-deep/15 sm:from-store-deep/95 sm:via-store-deep/70 sm:to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-store-deep/70 via-transparent to-transparent" />

                {/* Banner Content Container */}
                <div className="absolute inset-0 z-20 flex max-w-[710px] flex-col items-start justify-center px-7 pb-10 text-white sm:px-12 md:px-14 lg:px-16">
                  <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm sm:text-[11px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-store-orange" aria-hidden="true" />
                    {camp.badge?.trim() || (camp.hasDiscount ? "Special offer" : "Featured collection")}
                  </span>
                  {/* Campaign Title */}
                  <h1 className="mb-4 max-w-[640px] text-[clamp(2rem,4vw,3.75rem)] font-semibold leading-[1.13] tracking-[-0.04em] text-white">
                    {camp.title}
                  </h1>
                  {camp.description?.trim() && (
                    <p className="mb-7 max-w-[490px] line-clamp-3 text-sm leading-6 text-white/85 sm:text-base sm:leading-7">
                      {camp.description}
                    </p>
                  )}

                  {/* Campaign CTA */}
                  <Link
                    href={getCampaignHref(camp)}
                    tabIndex={isActive ? 0 : -1}
                    className="inline-flex min-h-12 w-fit items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-store-deep shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-store-surface active:scale-[0.98] sm:px-7"
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
                className="absolute bottom-5 left-6 z-30 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-store-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95 sm:bottom-7 sm:left-12 sm:h-11 sm:w-11"
              >
                <LuChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Campaign"
                className="absolute bottom-5 left-[70px] z-30 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-store-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95 sm:bottom-7 sm:left-[100px] sm:h-11 sm:w-11"
              >
                <LuChevronRight className="w-5 h-5" />
              </button>

              {/* Slide Pagination Dots */}
              <div className="storefront-scroll-track absolute bottom-5 right-6 z-30 flex max-w-[45%] items-center gap-1 overflow-x-auto sm:bottom-8 sm:right-10">
                {campaigns.map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    type="button"
                    onClick={() => setCurrentSlide(dotIndex)}
                    aria-pressed={dotIndex === currentSlide}
                    className="grid h-10 w-7 shrink-0 cursor-pointer place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-white"
                    aria-label={`Go to campaign ${dotIndex + 1}`}
                  >
                    <span className={`h-2 rounded-full transition-all duration-300 ${dotIndex === currentSlide ? "w-6 bg-store-orange" : "w-2 bg-white/60"}`} />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
