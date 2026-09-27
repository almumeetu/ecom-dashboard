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

  const sizeConfig = {
    sm: {
      brand: "text-lg",
      tagline: "text-[7.5px] tracking-wide mt-[2px]",
      gap: "gap-[3px]",
      icon: "w-5 h-5 text-xs",
    },
    md: {
      brand: "text-[21px]",
      tagline: "text-[8.5px] tracking-wide mt-[2px]",
      gap: "gap-2",
      icon: "w-6 h-6 text-sm",
    },
    lg: {
      brand: "text-2xl sm:text-3xl",
      tagline: "text-[9.5px] tracking-wider mt-1",
      gap: "gap-2.5",
      icon: "w-8 h-8 text-base",
    },
  };

  const s = sizeConfig[size];

  return (
    <Link
      href="/"
      className={`inline-flex items-center ${s.gap} group select-none transition-opacity duration-200 hover:opacity-90 ${className}`}
      aria-label="Trust Point Home"
    >
      {/* Brand Icon Shield / Emblem */}
      <div className={`rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-white shadow-md shadow-emerald-600/20 shrink-0 ${s.icon}`}>
        TP
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1">
          <span
            className={`font-black tracking-tight leading-none ${s.brand} ${
              isLight ? "text-white" : "text-zinc-950"
            }`}
          >
            TRUST
          </span>
          <span
            className={`font-black tracking-tight leading-none ${s.brand} text-emerald-500`}
          >
            POINT
          </span>
        </div>

        {showTagline && (
          <span
            className={`font-bold leading-none ${s.tagline} ${
              isLight ? "text-emerald-400" : "text-emerald-700"
            }`}
          >
            সরাসরি বাগান থেকে আপনার বাড়ি
          </span>
        )}
      </div>
    </Link>
  );
}
