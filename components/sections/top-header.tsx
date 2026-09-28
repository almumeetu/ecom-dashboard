"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IoCallOutline, IoLocationOutline } from "react-icons/io5";
import { LuTruck } from "react-icons/lu";
import TopSlider from "./ui/topslider";
import { fetchShopSettings } from "@/lib/shop-api";
import data from "@/data/data.json";

export default function TopHeader() {
  const { help } = data;
  const [shopSettings, setShopSettings] = useState<any>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await fetchShopSettings();
        if (settings) {
          setShopSettings(settings);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }
    loadSettings();
  }, []);

  // contactNumber comes as { entries: [{title, value}] } from the API
  const rawContactEntries: { title: string; value: string }[] =
    Array.isArray(shopSettings?.contactNumber?.entries)
      ? shopSettings.contactNumber.entries
      : Array.isArray(shopSettings?.contactNumber)
      ? shopSettings.contactNumber
      : [];

  const contactEntries = rawContactEntries.filter(
    (c) => !c.value.includes("01722301927") && !c.title.includes("01722301927")
  );

  const primaryPhone = contactEntries[0]?.value || "01707819676";
  const primaryPhoneClean = primaryPhone.replace(/[^\d+]/g, "") || "01707819676";

  return (
    <section className="w-full bg-[#111317] text-zinc-300 text-xs border-b border-white/[0.08] relative z-40 select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        {/* Desktop & Tablet bar (single clean row) */}
        <div className="hidden md:flex items-center justify-between h-9 gap-4">
          {/* Left: Hotline & Help */}
          <div className="flex items-center gap-3 shrink-0 text-xs font-normal">
            <a
              href={`tel:${primaryPhoneClean}`}
              className="flex items-center gap-1.5 text-zinc-300 hover:text-emerald-400 transition-colors"
            >
              <IoCallOutline className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Hotline: <strong className="text-white font-medium">{primaryPhone}</strong>
              </span>
            </a>
            <span className="text-zinc-700">|</span>
            <Link
              href="/contact"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              {help.text || "Help & Support"}
            </Link>
          </div>

          {/* Center: Announcement Slider */}
          <div className="flex-1 max-w-xl mx-4 overflow-hidden">
            <TopSlider slogan={shopSettings?.slogan} />
          </div>

          {/* Right: Track Order & Location */}
          <div className="flex items-center gap-3.5 shrink-0 text-xs font-normal">
            <Link
              href="/profile?tab=track"
              className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors"
            >
              <LuTruck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Track Order</span>
            </Link>
            <span className="text-zinc-700">|</span>
            <Link
              href="/contact"
              className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors"
            >
              <IoLocationOutline className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mohadevpur, Naogaon</span>
            </Link>
          </div>
        </div>

        {/* Mobile bar (single clean compact row) */}
        <div className="md:hidden flex items-center justify-between py-1.5 gap-2">
          <a
            href={`tel:${primaryPhoneClean}`}
            className="flex items-center gap-1 text-[11px] text-zinc-300 hover:text-emerald-400 shrink-0 font-medium"
            aria-label="Hotline call"
          >
            <IoCallOutline className="w-3.5 h-3.5 text-emerald-400" />
            <span>{primaryPhone}</span>
          </a>

          <div className="flex-1 overflow-hidden px-1">
            <TopSlider slogan={shopSettings?.slogan} />
          </div>

          <Link
            href="/profile?tab=track"
            className="flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white shrink-0 font-medium"
            aria-label="Track order"
          >
            <LuTruck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xs:inline">Track</span>
          </Link>
        </div>
      </div>
    </section>
  );
}


