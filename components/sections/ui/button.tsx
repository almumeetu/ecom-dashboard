import Link from "next/link";
import { LuArrowRight, LuSparkles } from "react-icons/lu";
import type { ButtonProps } from "@/data/types";

/**
 * Modern Store CTA Button
 *
 * Designed with luxury aesthetics:
 * - Ambient gradient glow and subtle glass reflection
 * - Dynamic animated arrow on hover
 * - Responsive mobile-first sizing
 */
export default function Button({
  href,
  label   = "DISCOVER ALL PRODUCTS",
  variant = "primary",
  size    = "lg",
}: ButtonProps) {
  const sizes = {
    sm: "px-5 py-2.5 text-xs sm:text-sm gap-2",
    lg: "px-7 sm:px-9 py-3.5 sm:py-4 text-xs sm:text-sm gap-2.5",
  };

  const variants: Record<string, { btn: string; arrowBg: string; glow: string }> = {
    // Primary: Luxury Emerald & Teal Gradient
    primary: {
      btn: "bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-500 text-white shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.45)] border border-emerald-400/30",
      arrowBg: "bg-white/20 text-white group-hover:bg-white group-hover:text-emerald-700",
      glow: "from-emerald-400/20 to-teal-400/20",
    },
    // Secondary: Sleek Midnight Black
    secondary: {
      btn: "bg-zinc-900 hover:bg-emerald-600 text-white shadow-md hover:shadow-emerald-600/30 border border-zinc-800",
      arrowBg: "bg-white/10 text-white group-hover:bg-white group-hover:text-zinc-900",
      glow: "from-zinc-700/20 to-zinc-900/20",
    },
    // Outline: Clean Bordered Pill
    outline: {
      btn: "bg-white text-zinc-900 border-2 border-zinc-200 hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 shadow-2xs",
      arrowBg: "bg-zinc-100 text-zinc-600 group-hover:bg-emerald-600 group-hover:text-white",
      glow: "from-emerald-100/30 to-teal-100/30",
    },
  };

  const selectedVariant = variants[variant] ?? variants.primary;

  return (
    <div className="flex justify-center px-4 w-full">
      <Link
        href={href}
        className={`group relative w-full sm:w-auto max-w-sm sm:max-w-none inline-flex items-center justify-center font-sans font-bold uppercase tracking-wider rounded-full transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer overflow-hidden ${sizes[size]} ${selectedVariant.btn}`}
      >
        {/* Subtle Shimmer Effect on Hover */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

        {/* Optional Sparkle Icon */}
        <LuSparkles className="w-4 h-4 text-emerald-200 group-hover:rotate-12 transition-transform duration-300 shrink-0" />

        {/* Button Label */}
        <span className="relative z-10 truncate">{label}</span>

        {/* Micro-animated Arrow in pill icon container */}
        <span
          className={`relative z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${selectedVariant.arrowBg}`}
        >
          <LuArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
        </span>
      </Link>
    </div>
  );
}
