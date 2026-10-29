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
      <div className="grid grid-cols-1 items-stretch gap-3 lg:grid-cols-12 lg:gap-4">
        {/* ═══════════════ LEFT COLUMN: Shop by Category Sidebar ═══════════════ */}
        <div className="hidden h-[470px] flex-col overflow-hidden rounded-[24px] border border-store-border bg-white shadow-[0_12px_36px_rgba(20,38,56,0.05)] lg:col-span-3 lg:flex xl:h-[500px]">
          {/* Header */}
          <div className="flex shrink-0 items-center gap-3 border-b border-store-border px-5 py-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-store-deep text-store-orange">
              <LuMenu className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-store-deep">Shop by category</h2>
            </div>
          </div>

          {/* Categories List */}
          <div className="storefront-scroll-track min-h-0 flex-1 overflow-y-auto px-2 py-2">
            {sidebarCategories.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.name)}
                  aria-pressed={isSelected}
                  className={`group flex w-full cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-store-primary ${
                    isSelected
                      ? "bg-store-surface text-store-primary"
                      : "text-store-ink hover:bg-store-page hover:text-store-primary"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-store-surface text-xs">
                      {cat.imageUrl ? (
                        <Image
                          src={cat.imageUrl}
                          alt={cat.name}
                          fill
                          sizes="36px"
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          unoptimized={cat.imageUrl.includes("unsplash.com")}
                        />
                      ) : (
                        <span>🛍️</span>
                      )}
                    </div>
                    <span className="truncate text-xs font-semibold leading-tight xl:text-[13px]">
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
          <div className="shrink-0 border-t border-store-border px-5 py-4">
            <Link
              href="/products"
              className="group flex items-center justify-between text-xs font-semibold text-store-primary transition-colors hover:text-store-orange-ink"
            >
              <span>View all categories</span>
              <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* ═══════════════ RIGHT COLUMN: Hero Campaign Banner Slider ═══════════════ */}
        <div
          role="region"
          aria-label="Featured campaigns"
          aria-roledescription="carousel"
          ref={carouselRef}
          className="group relative h-[360px] w-full select-none overflow-hidden rounded-[20px] bg-store-deep shadow-[0_18px_50px_rgba(20,38,56,0.14)] sm:h-[460px] sm:rounded-[24px] lg:col-span-9 lg:h-[470px] xl:h-[500px]"
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
                <div className="absolute inset-0 bg-gradient-to-r from-[#102334]/95 via-[#102334]/75 to-[#102334]/30 sm:via-[#102334]/65 sm:to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102334]/85 via-transparent to-[#102334]/10" />
                <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-store-orange" />

                {/* Banner Content Container */}
                <div className="absolute inset-0 z-20 flex max-w-[680px] flex-col items-start justify-center px-5 pb-16 pt-5 text-white sm:px-12 sm:pb-20 sm:pt-6 lg:px-14">
                  {/* Campaign Title */}
                  <h1 className="mb-2 max-w-[600px] text-[clamp(1.6rem,6vw,2rem)] font-semibold leading-[1.16] tracking-[-0.035em] text-white sm:mb-4 sm:text-[clamp(1.8rem,3.6vw,3.4rem)]">
                    {camp.title}
                  </h1>
                  {camp.description?.trim() && (
                    <p className="mb-4 line-clamp-2 max-w-[480px] text-xs leading-5 text-white/80 sm:mb-6 sm:line-clamp-3 sm:text-base sm:leading-7">
                      {camp.description}
                    </p>
                  )}

                  {/* Campaign CTA */}
                  <Link
                    href={getCampaignHref(camp)}
                    tabIndex={isActive ? 0 : -1}
                    className="group/cta inline-flex min-h-10 w-fit items-center gap-3 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-store-deep transition hover:bg-store-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-12 sm:gap-4 sm:px-6 sm:py-3 sm:text-sm"
                  >
                    <span>{camp.ctaText || "Shop Now"}</span>
                    <LuArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" aria-hidden="true" />
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
                className="absolute bottom-5 left-7 z-30 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-store-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:bottom-7 sm:left-12 lg:left-14"
              >
                <LuChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Campaign"
                className="absolute bottom-5 left-[76px] z-30 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-store-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:bottom-7 sm:left-[96px] lg:left-[104px]"
              >
                <LuChevronRight className="w-5 h-5" />
              </button>

              {/* Slide Pagination Dots */}
              <div className="storefront-scroll-track absolute bottom-5 right-5 z-30 flex max-w-[45%] items-center gap-1 overflow-x-auto sm:bottom-7 sm:right-10">
                {campaigns.map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    type="button"
                    onClick={() => setCurrentSlide(dotIndex)}
                    aria-pressed={dotIndex === currentSlide}
                    className="grid h-10 w-7 shrink-0 cursor-pointer place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-white"
                    aria-label={`Go to campaign ${dotIndex + 1}`}
                  >
                    <span className={`h-1 rounded-full transition-all duration-300 ${dotIndex === currentSlide ? "w-6 bg-store-orange" : "w-2 bg-white/60"}`} />
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
