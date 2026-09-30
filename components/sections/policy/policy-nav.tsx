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
    <div className="w-full bg-white border-b border-zinc-200/80 sticky top-[60px] sm:top-[68px] z-30 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
          {POLICY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              currentKey === tab.key ||
              (pathname ? pathname.startsWith(tab.href) : false);

            return (
              <Link
                key={tab.key}
                href={tab.href}
                className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#4F46E5] text-white shadow-sm ring-1 ring-[#4F46E5]'
                    : 'bg-zinc-50 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 border border-zinc-200/70'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 transition-colors ${
                    isActive ? 'text-white' : 'text-zinc-400 group-hover:text-[#4F46E5]'
                  }`}
                />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-zinc-200/70 text-zinc-600 group-hover:bg-indigo-50 group-hover:text-[#4F46E5]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
