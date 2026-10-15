"use client";

import { IoCall } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa";

export default function OrderRibbon() {
  const hotline = "+880 1722-301927";
  const hotlineClean = "01722301927";

  return (
    <div className="w-full bg-store-page border-b border-store-border py-2 sm:py-2.5 px-4 text-center select-none shadow-2xs">
      <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-zinc-800 flex-wrap">
        <span className="flex items-center gap-1.5 text-store-accent">
          <IoCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-store-primary" />
          <span>সরাসরি ফোন বা WhatsApp-এ অর্ডার করুন:</span>
        </span>
        <div className="inline-flex items-center gap-2">
          <a
            href={`tel:${hotlineClean}`}
            className="font-black text-store-deep hover:text-store-primary underline decoration-store-light underline-offset-2 tracking-wide transition-colors"
          >
            {hotline}
          </a>
          <span className="text-zinc-400">/</span>
          <a
            href={`https://wa.me/8801722301927?text=Hello%20NovaMart,%20I%20would%20like%20to%20place%20an%20order`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#25D366] hover:bg-[#1DA851] text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <FaWhatsapp className="w-3 h-3" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
