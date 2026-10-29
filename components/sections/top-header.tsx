"use client";

import Link from "next/link";
import { LuTruck } from "react-icons/lu";
import TopSlider from "./ui/topslider";

export default function TopHeader() {
  return (
    <section className="w-full bg-store-primary text-store-light text-xs border-b border-store-accent relative z-40 select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        {/* Desktop & Tablet bar (single clean row) */}
        <div className="hidden md:flex items-center justify-between h-9 gap-4">
          {/* Announcement Slider */}
          <div className="min-w-0 flex-1 max-w-xl overflow-hidden">
            <TopSlider />
          </div>

          {/* Track order shortcut */}
          <div className="flex shrink-0 items-center text-xs font-normal">
            <Link
              href="/profile?tab=track"
              className="flex items-center gap-1.5 text-store-light hover:text-white transition-colors font-medium"
            >
              <LuTruck className="w-3.5 h-3.5 text-white/80" />
              <span>Track Order</span>
            </Link>
          </div>
        </div>

        {/* Mobile bar (single clean compact row) */}
        <div className="md:hidden flex items-center justify-between py-1.5 gap-2">
          <div className="flex-1 overflow-hidden px-1">
            <TopSlider />
          </div>

          <Link
            href="/profile?tab=track"
            className="flex items-center gap-1 text-[11px] text-store-light hover:text-white shrink-0 font-medium"
            aria-label="Track order"
          >
            <LuTruck className="w-3.5 h-3.5 text-white/80" />
            <span className="hidden xs:inline">Track</span>
          </Link>
        </div>
      </div>
    </section>
  );
}


