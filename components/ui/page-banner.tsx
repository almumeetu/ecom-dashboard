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
  breadcrumbs,
  className = "",
}: PageBannerProps) {
  return (
    <div
      className={`w-full bg-white border-b border-[#e8edf1] ${className}`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-5 sm:py-7">
        {/* Breadcrumb strip */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mb-3"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-stone-400 hover:text-stone-800 transition-colors shrink-0"
          >
            <LuHouse className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>Home</span>
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
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-zinc-900 leading-snug break-words">
            {title}
          </h1>
        )}

      </div>
    </div>
  );
}
