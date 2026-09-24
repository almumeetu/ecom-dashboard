"use client";

import Link from "next/link";

interface LogoProps {
  variant?: "dark" | "light";
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Logo({
  variant = "dark",
  className = "",
  showTagline = true,
  size = "md",
}: LogoProps) {
  const isLight = variant === "light";

  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  };

  const textClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 transition-all duration-200 hover:opacity-95 group select-none ${className}`}
      aria-label="NovaMart Home"
    >
      {/* Modern High-End Geometric Emblem */}
      <div className={`relative ${iconSizes[size]} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="emeraldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="emeraldGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="70%" stopColor="#065F46" />
              <stop offset="100%" stopColor="#022C22" />
            </linearGradient>
            <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Rounded Hexagon / Diamond Shield */}
          <rect
            x="4"
            y="4"
            width="40"
            height="40"
            rx="12"
            fill={isLight ? "#181A20" : "#F4F5F7"}
            stroke={isLight ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)"}
            strokeWidth="1.5"
          />

          {/* Stylized Dynamic 'N' Monogram with Origami / Nexus Fold */}
          {/* Left Pillar */}
          <path
            d="M13 34 L13 14 L19 14 L19 34 Z"
            fill="url(#emeraldGrad2)"
            rx="2"
          />
          {/* Diagonal Bridge */}
          <path
            d="M16 14 L32 34 L27 34 L13 16 Z"
            fill="url(#emeraldGrad1)"
          />
          {/* Right Pillar */}
          <path
            d="M29 34 L29 14 L35 14 L35 34 Z"
            fill="url(#accentGrad)"
            rx="2"
          />

          {/* Glowing Nexus Sparkle Accent */}
          <circle cx="35" cy="14" r="2.5" fill="#34D399" filter="url(#glow)" />
          <circle cx="35" cy="14" r="1.5" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Brand Name Typography */}
      <div className="flex flex-col text-left">
        <div className="flex items-baseline">
          <span
            className={`font-sans font-black tracking-tight leading-none ${textClasses[size]} ${
              isLight ? "text-white" : "text-zinc-900"
            }`}
          >
            NOVA
          </span>
          <span
            className={`font-sans font-black tracking-tight leading-none ${textClasses[size]} text-emerald-500 ml-0.5`}
          >
            MART
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1 mb-0.5 inline-block animate-pulse" />
        </div>
        {showTagline && (
          <span
            className={`font-sans font-bold tracking-[0.24em] text-[7.5px] sm:text-[8.5px] uppercase mt-1 leading-none ${
              isLight ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            Curated Marketplace
          </span>
        )}
      </div>
    </Link>
  );
}
