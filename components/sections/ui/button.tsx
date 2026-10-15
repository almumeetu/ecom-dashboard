import Link from "next/link";
import { LuArrowRight, LuSparkles } from "react-icons/lu";
import type { ButtonProps } from "@/data/types";

/**
 * Modern Store CTA Button
 *
 * Designed with a quiet, premium storefront look:
 * - Deep sapphire fill and restrained shadows
 * - A small animated arrow for clear feedback
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
    // Primary: deep sapphire
    primary: {
      btn: "bg-store-primary hover:bg-store-hover text-white shadow-[0_4px_16px_rgba(20,38,56,0.14)] hover:shadow-[0_8px_24px_rgba(20,38,56,0.18)] border border-store-primary",
      arrowBg: "bg-white/20 text-white group-hover:bg-white group-hover:text-[#174A76]",
      glow: "from-store-primary/10 to-store-orange/10",
    },
    // Secondary: Sleek Midnight Navy / Ink
    secondary: {
      btn: "bg-store-deep hover:bg-store-primary text-white shadow-md hover:shadow-store-deep/20 border border-store-deep",
      arrowBg: "bg-white/10 text-white group-hover:bg-white group-hover:text-[#142638]",
      glow: "from-store-deep/10 to-store-primary/10",
    },
    // Outline: Clean Bordered Pill
    outline: {
      btn: "bg-white text-store-ink border border-store-border hover:border-store-primary hover:text-store-primary hover:bg-store-surface shadow-sm",
      arrowBg: "bg-zinc-100 text-zinc-600 group-hover:bg-[#174A76] group-hover:text-white",
      glow: "from-store-surface to-store-orange-soft/60",
    },
  };

  const selectedVariant = variants[variant] ?? variants.primary;

  return (
    <div className="flex justify-center px-4 w-full">
      <Link
        href={href}
        className={`group relative w-full sm:w-auto max-w-sm sm:max-w-none inline-flex items-center justify-center font-sans font-bold uppercase tracking-wider rounded-full transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer overflow-hidden ${sizes[size]} ${selectedVariant.btn}`}
      >
        {/* Optional Sparkle Icon */}
        <LuSparkles className="w-4 h-4 text-[#E88443] group-hover:rotate-12 transition-transform duration-300 shrink-0" />

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
