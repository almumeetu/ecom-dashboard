"use client";

import Link from "next/link";
import { FiHome, FiChevronRight, FiShield, FiTruck, FiLock } from "react-icons/fi";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageBannerProps {
  title: string;
  subtitle?: string;
  badge?: string;
  breadcrumbs: BreadcrumbItem[];
  showTrustChips?: boolean;
  className?: string;
}

export default function PageBanner({
  title,
  subtitle,
  badge,
  breadcrumbs,
  showTrustChips = false,
  className = "",
}: PageBannerProps) {
  return (
    <div
      className={`w-full bg-[#FAF9F5] border-b border-stone-200/70 py-6 sm:py-7 px-4 sm:px-6 md:px-10 lg:px-16 ${className}`}
    >
      <div className="max-w-[1440px] mx-auto flex flex-col items-start text-left gap-3">
        {/* Breadcrumb Trail - Clean & Accessible */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500 font-medium flex-wrap text-left"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <FiHome className="w-3.5 h-3.5 text-zinc-400" />
            <span>Home</span>
          </Link>

          {breadcrumbs.map((item, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <span key={idx} className="inline-flex items-center gap-2">
                <FiChevronRight className="w-3 h-3 text-zinc-300 shrink-0" />
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-zinc-500 hover:text-zinc-900 transition-colors truncate max-w-[160px] sm:max-w-[240px]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-zinc-900 font-semibold truncate max-w-[220px] sm:max-w-md">
                    {item.label}
                  </span>
                )}
              </span>
            );
          })}
        </nav>

        {/* Page Title & Badge */}
        <div className="flex items-center gap-3 flex-wrap text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-sans tracking-tight text-zinc-900 leading-tight">
            {title}
          </h1>

          {badge && (
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-stone-200/70 text-stone-800 border border-stone-300/60 shadow-2xs">
              {badge}
            </span>
          )}
        </div>

        {/* Optional Subtitle */}
        {subtitle && (
          <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed max-w-2xl text-left -mt-0.5">
            {subtitle}
          </p>
        )}

        {/* Optional Marketplace Trust Chips (Only when requested) */}
        {showTrustChips && (
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 text-xs font-medium text-zinc-600 pt-1 flex-wrap text-left">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-zinc-700 shadow-2xs">
              <FiTruck className="w-3.5 h-3.5 text-zinc-800" />
              <span>Fast Express Dispatch</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-zinc-700 shadow-2xs">
              <FiShield className="w-3.5 h-3.5 text-zinc-800" />
              <span>100% Authentic Products</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-zinc-700 shadow-2xs">
              <FiLock className="w-3.5 h-3.5 text-zinc-800" />
              <span>Buyer Protection Guaranteed</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
