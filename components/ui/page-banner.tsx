"use client";

import Link from "next/link";
import { FiCheck, FiChevronRight, FiMessageCircle, FiRefreshCw, FiTruck } from "react-icons/fi";
import { LuHouse } from "react-icons/lu";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageBannerProps {
  title?: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
  showTrustChips?: boolean;
  className?: string;
}

const trustPoints = [
  { label: "Delivery details at checkout", icon: FiTruck },
  { label: "7-day returns", icon: FiRefreshCw },
  { label: "Customer support", icon: FiMessageCircle },
];

export default function PageBanner({
  title,
  subtitle,
  breadcrumbs,
  showTrustChips = false,
  className = "",
}: PageBannerProps) {
  return (
    <section
      className={`relative isolate w-full overflow-hidden border-b border-store-border/80 bg-[linear-gradient(115deg,#ffffff_0%,#ffffff_58%,#f5f1e9_100%)] ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-store-surface/70 blur-3xl sm:h-72 sm:w-72"
      />

      <div className="relative mx-auto max-w-[1440px] px-4 py-5 sm:px-6 sm:py-7 md:px-10 lg:px-16 lg:py-9">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-1.5 overflow-x-auto text-xs font-medium text-zinc-500 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-1 text-zinc-500 transition-colors hover:text-store-primary"
          >
            <LuHouse aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            <span>Home</span>
          </Link>

          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <span key={`${item.label}-${index}`} className="inline-flex shrink-0 items-center gap-1.5">
                <FiChevronRight aria-hidden="true" className="h-3 w-3 shrink-0 text-zinc-300" />
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="max-w-[140px] truncate text-zinc-500 transition-colors hover:text-store-primary sm:max-w-[200px]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="max-w-[180px] truncate font-semibold text-store-ink sm:max-w-xs">
                    {item.label}
                  </span>
                )}
              </span>
            );
          })}
        </nav>

        <div className="max-w-4xl">
          {title && (
            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-store-ink sm:text-3xl lg:text-4xl">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600 sm:mt-3 sm:text-base sm:leading-7">
              {subtitle}
            </p>
          )}

          {showTrustChips && (
            <ul aria-label="NovaMart service highlights" className="mt-4 flex flex-wrap gap-2 sm:mt-5">
              {trustPoints.map(({ label, icon: Icon }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-store-border/80 bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-zinc-600 shadow-[0_2px_8px_rgba(20,38,56,0.035)] sm:text-xs"
                >
                  <Icon aria-hidden="true" className="h-3.5 w-3.5 text-store-primary" />
                  <span>{label}</span>
                  <FiCheck aria-hidden="true" className="h-3 w-3 text-emerald-600" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
