"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface LogoProps {
  variant?: "dark" | "light";
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  tagline?: string;
}

export default function Logo({
  variant = "dark",
  className = "",
  showTagline = true,
  size = "md",
  tagline = "PREMIER MULTI-CATEGORY MART",
}: LogoProps) {
  const isLight = variant === "light";
  const [imageError, setImageError] = useState(false);

  const sizeConfig = {
    sm: {
      brand: "text-lg",
      tagline: "text-[7px] tracking-wider mt-[2px]",
      gap: "gap-1.5",
      icon: "w-7 h-7 text-xs rounded-lg",
      imgH: 26,
      imgW: 105,
    },
    md: {
      brand: "text-[21px]",
      tagline: "text-[8px] tracking-widest mt-[2px]",
      gap: "gap-2",
      icon: "w-8.5 h-8.5 text-sm rounded-xl",
      imgH: 34,
      imgW: 135,
    },
    lg: {
      brand: "text-2xl sm:text-3xl",
      tagline: "text-[9px] tracking-widest mt-1",
      gap: "gap-2.5",
      icon: "w-10 h-10 text-base rounded-2xl",
      imgH: 42,
      imgW: 165,
    },
  };

  const s = sizeConfig[size];

  return (
    <Link
      href="/"
      className={`inline-flex items-center ${s.gap} group select-none transition-opacity duration-200 hover:opacity-95 ${className}`}
      aria-label="NovaMart Home"
    >
      {/* Dynamic Brand Logo: attempts official image first, falls back to crisp badge */}
      {!imageError ? (
        <div className="relative flex items-center shrink-0">
          <Image
            src="/images/logo/novamart-logo-main.png"
            alt="NovaMart"
            width={s.imgW}
            height={s.imgH}
            className={`object-contain transition-transform duration-300 group-hover:scale-102 ${
              isLight ? "brightness-0 invert drop-shadow-sm" : ""
            }`}
            priority
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <>
          {/* Brand Icon Shield / Emblem */}
          <div
            className={`bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 flex items-center justify-center font-black text-white shadow-md shadow-emerald-600/20 shrink-0 tracking-tighter ${s.icon}`}
          >
            NM
          </div>

          {/* Brand Text */}
          <div className="flex flex-col leading-none">
            <div className="flex items-baseline gap-1">
              <span
                className={`font-black tracking-tight leading-none ${s.brand} ${
                  isLight ? "text-white" : "text-zinc-950"
                }`}
              >
                NOVA
              </span>
              <span
                className="font-black tracking-tight leading-none text-emerald-500"
              >
                MART
              </span>
            </div>

            {showTagline && (
              <span
                className={`font-bold uppercase leading-none ${s.tagline} ${
                  isLight ? "text-emerald-400" : "text-emerald-700"
                }`}
              >
                {tagline}
              </span>
            )}
          </div>
        </>
      )}
    </Link>
  );
}
