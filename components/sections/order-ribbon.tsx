"use client";

import { IoCall } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa";

export default function OrderRibbon() {
  const hotline = "+880 1712-345678";
  const hotlineClean = "01712345678";

  return (
    <div className="w-full bg-[#FFF9E6] border-b border-[#FEE29A]/80 py-2 sm:py-2.5 px-4 text-center select-none shadow-2xs">
      <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-zinc-800 flex-wrap">
        <span className="flex items-center gap-1.5 text-amber-700">
          <IoCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 animate-pulse" />
          <span>সরাসরি ফোন বা WhatsApp-এ অর্ডার করুন:</span>
        </span>
        <div className="inline-flex items-center gap-2">
          <a
            href={`tel:${hotlineClean}`}
            className="font-black text-emerald-800 hover:text-emerald-950 underline decoration-emerald-500/50 underline-offset-2 tracking-wide"
          >
            {hotline}
          </a>
          <span className="text-zinc-400">/</span>
          <a
            href={`https://wa.me/8801712345678?text=Hello%20NovaMart,%20I%20would%20like%20to%20place%20an%20order`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-2xs transition-colors"
          >
            <FaWhatsapp className="w-3 h-3" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
