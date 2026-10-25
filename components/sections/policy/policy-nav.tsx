'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiTruck,
  FiRefreshCw,
  FiFileText,
  FiShield,
  FiHelpCircle,
  FiInfo,
} from 'react-icons/fi';

interface PolicyNavProps {
  currentKey?: 'delivery' | 'returns' | 'terms' | 'privacy' | 'contact' | 'about';
}

const POLICY_TABS = [
  {
    key: 'delivery',
    label: 'Delivery & Shipping',
    href: '/delivery',
    icon: FiTruck,
    badge: '64 Districts',
  },
  {
    key: 'returns',
    label: 'Returns & Refunds',
    href: '/returns',
    icon: FiRefreshCw,
    badge: '7-Day Guarantee',
  },
  {
    key: 'terms',
    label: 'Terms & Conditions',
    href: '/terms',
    icon: FiFileText,
    badge: 'Consumer Rights',
  },
  {
    key: 'privacy',
    label: 'Privacy Policy',
    href: '/privacy',
    icon: FiShield,
    badge: 'SSL Secure',
  },
  {
    key: 'contact',
    label: 'Customer FAQs',
    href: '/contact',
    icon: FiHelpCircle,
    badge: '24/7 Care',
  },
  {
    key: 'about',
    label: 'About NovaMart',
    href: '/about',
    icon: FiInfo,
    badge: 'Our Story',
  },
];

export default function PolicyNav({ currentKey }: PolicyNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Customer care and policy pages"
      className="sticky top-[60px] z-30 w-full border-b border-store-border/80 bg-white/95 shadow-[0_4px_16px_rgba(20,38,56,0.035)] backdrop-blur-md sm:top-[68px]"
    >
      <div className="mx-auto max-w-[1440px] px-4 py-2.5 sm:px-6 md:px-10 lg:px-16">
        <div className="flex items-center gap-3">
          <span className="hidden shrink-0 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400 lg:inline">
            Help center
          </span>
          <div className="no-scrollbar flex min-w-0 items-center gap-1.5 overflow-x-auto scroll-smooth py-0.5 sm:gap-2">
            {POLICY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive =
                currentKey === tab.key ||
                (pathname ? pathname.startsWith(tab.href) : false);

              return (
                <Link
                  key={tab.key}
                  href={tab.href}
                  aria-label={tab.badge ? `${tab.label}, ${tab.badge}` : tab.label}
                  aria-current={isActive ? 'page' : undefined}
                  title={tab.badge ? `${tab.label} · ${tab.badge}` : tab.label}
                  className={`group flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-store-primary sm:px-4 ${
                    isActive
                      ? 'bg-store-primary text-white shadow-sm'
                      : 'border border-transparent bg-zinc-50 text-zinc-600 hover:border-store-border hover:bg-store-surface hover:text-store-ink'
                  }`}
                >
                  <Icon
                    aria-hidden="true"
                    className={`w-3.5 h-3.5 transition-colors ${
                      isActive ? 'text-white' : 'text-zinc-400 group-hover:text-store-primary'
                    }`}
                  />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
