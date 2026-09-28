"use client";

import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { LuHouse } from "react-icons/lu";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageBannerProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  breadcrumbs: BreadcrumbItem[];
  showTrustChips?: boolean;
  className?: string;
}

export default function PageBanner({
  title,
  subtitle,
  breadcrumbs,
  showTrustChips = false,
  className = "",
}: PageBannerProps) {
  return (
    <div
      className={`w-full bg-[#FAF9F6]/90 backdrop-blur-xs border-b border-stone-200/60 transition-all ${className}`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-2 sm:py-2.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4">
          
          {/* Left Column: Breadcrumb Path + Clean Heading */}
          <div className="min-w-0">
            {/* Breadcrumb strip */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-stone-400 font-medium overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mb-0.5"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-stone-400 hover:text-stone-800 transition-colors shrink-0"
              >
                <LuHouse className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="hidden xs:inline">Home</span>
              </Link>

              {breadcrumbs.map((item, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <span key={idx} className="inline-flex items-center gap-1.5 shrink-0">
                    <FiChevronRight className="w-3 h-3 text-stone-300 shrink-0" />
                    {item.href && !isLast ? (
                      <Link
                        href={item.href}
                        className="text-stone-500 hover:text-stone-900 transition-colors truncate max-w-[140px] sm:max-w-[200px]"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-stone-700 font-medium truncate max-w-[180px] sm:max-w-xs">
                        {item.label}
                      </span>
                    )}
                  </span>
                );
              })}
            </nav>

            {/* Page title */}
            {title && (
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-stone-900 leading-tight">
                {title}
              </h1>
            )}

            {/* Subtitle for small screens (< md) */}
            {subtitle && (
              <p className="text-xs text-stone-500 mt-0.5 line-clamp-1 md:hidden">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right Column: Subtitle / Trust info for desktop (md+) */}
          {(subtitle || showTrustChips) && (
            <div className="hidden md:flex flex-col items-end justify-center shrink-0 max-w-sm lg:max-w-md text-right">
              {showTrustChips && (
                <div className="flex items-center gap-3.5 text-[11px] font-medium text-stone-500 mb-0.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Free Shipping 999+
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    100% Authentic
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Easy Returns
                  </span>
                </div>
              )}
              {subtitle && (
                <p className="text-xs text-stone-500 line-clamp-1 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
