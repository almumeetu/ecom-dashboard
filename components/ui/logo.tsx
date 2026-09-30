"use client";

import Link from "next/link";

interface LogoProps {
  variant?: "dark" | "light";
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  tagline?: string;
  href?: string;
}

export default function Logo({
  variant = "dark",
  className = "",
  showTagline = true,
  size = "md",
  tagline = "BANGLADESH'S TRUSTED MART",
  href = "/",
}: LogoProps) {
  const isLight = variant === "light";

  const sizeConfig = {
    sm: {
      brand: "text-lg",
      mart: "text-lg",
      dot: "w-1.5 h-1.5",
      tagline: "text-[7px] tracking-[0.18em]",
      gap: "gap-2",
      iconSize: "w-7 h-7",
    },
    md: {
      brand: "text-[22px]",
      mart: "text-[22px]",
      dot: "w-2 h-2",
      tagline: "text-[8px] tracking-[0.2em]",
      gap: "gap-2.5",
      iconSize: "w-9 h-9",
    },
    lg: {
      brand: "text-2xl sm:text-3xl",
      mart: "text-2xl sm:text-3xl",
      dot: "w-2.5 h-2.5",
      tagline: "text-[9.5px] tracking-[0.22em]",
      gap: "gap-3",
      iconSize: "w-11 h-11",
    },
  };

  const s = sizeConfig[size];

  return (
    <Link
      href={href}
      className={`inline-flex items-center ${s.gap} group select-none transition-all duration-200 hover:opacity-95 ${className}`}
      aria-label="NovaMart - Home"
    >
      {/* ── Custom Vector Brand Emblem (Zero image dependency, 100% crisp SVG) ── */}
      <div className={`relative shrink-0 ${s.iconSize} transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="novamart-base-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0D8A68" />
              <stop offset="50%" stopColor="#0B7053" />
              <stop offset="100%" stopColor="#044D38" />
            </linearGradient>
            <linearGradient id="novamart-spark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#E87A18" />
            </linearGradient>
          </defs>

          {/* Rounded Squircle Container */}
          <rect
            width="44"
            height="44"
            rx="12"
            fill="url(#novamart-base-grad)"
          />

          {/* Subtle Inner Glow Stroke */}
          <rect
            x="1"
            y="1"
            width="42"
            height="42"
            rx="11"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="1.2"
          />

          {/* Stylized Modern 'N' Monogram */}
          <path
            d="M13 31V13L24 27V13"
            stroke="#FFFFFF"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dynamic 'M' Right Pillar & Flourish */}
          <path
            d="M24 31V18L31 26.5V31"
            stroke="#A7F3D0"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 4-Point Golden Nova Star Spark at Top Right */}
          <path
            d="M32 7C32 9.5 34 10.5 35.5 10.5C34 10.5 32 11.5 32 14C32 11.5 30 10.5 28.5 10.5C30 10.5 32 9.5 32 7Z"
            fill="url(#novamart-spark-grad)"
          />
        </svg>
      </div>

      {/* ── Brand Typography ── */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline">
          <span
            className={`font-black tracking-tight leading-none ${s.brand} ${
              isLight ? "text-white" : "text-zinc-950"
            }`}
          >
            NOVA
          </span>
          <span
            className={`font-black tracking-tight leading-none ml-1 ${s.mart} ${
              isLight ? "text-emerald-300" : "text-[#0D7053]"
            }`}
          >
            MART
          </span>
          {/* Amber Accent Dot */}
          <span
            className={`rounded-full bg-[#E87A18] ml-1 mb-0.5 shrink-0 ${s.dot}`}
            aria-hidden="true"
          />
        </div>

        {showTagline && (
          <span
            className={`font-extrabold uppercase mt-1 leading-none ${s.tagline} ${
              isLight ? "text-emerald-300/90" : "text-emerald-800"
            }`}
          >
            {tagline}
          </span>
        )}
      </div>
    </Link>
  );
}
