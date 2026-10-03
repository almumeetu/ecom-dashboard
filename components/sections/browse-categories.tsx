"use client";

import Image from "next/image";
import Link from "next/link";
import { type ShopCategory, DEFAULT_NOVAMART_CATEGORIES } from "@/lib/shop-api";
import { LuArrowRight, LuSparkles, LuCheck } from "react-icons/lu";

interface BrowseCategoriesProps {
  categories: ShopCategory[];
  selectedCategory: string;
  onSelectCategory: (name: string) => void;
}

export default function BrowseCategories({
  categories,
  selectedCategory,
  onSelectCategory,
}: BrowseCategoriesProps) {
  // Ensure all categories are always shown (uses fallback catalog if API list is empty)
  const displayCategories =
    categories && categories.length > 0 ? categories : DEFAULT_NOVAMART_CATEGORIES;

  const handleCategoryClick = (catName: string) => {
    onSelectCategory(catName);
    const el = document.getElementById("featured-picks-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-8">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-[#4F46E5] text-[11px] font-medium uppercase tracking-wider mb-1">
            <LuSparkles className="w-3 h-3 text-[#F97316]" />
            <span>Shop By Category</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-medium text-zinc-900 tracking-tight">
            Browse All Categories
          </h2>
        </div>

        <Link
          href="/products"
          className="text-xs sm:text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] flex items-center gap-1 group transition-colors"
        >
          <span>View all</span>
          <LuArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* ── 100% Rounded Circular Categories Grid (All Categories Showing) ── */}
      <div className="grid grid-cols-3 min-[480px]:grid-cols-4 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-10 gap-4 sm:gap-5 lg:gap-4 items-start justify-items-center">
        {displayCategories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat.name)}
              className="group flex flex-col items-center cursor-pointer select-none text-center w-full max-w-[110px]"
            >
              {/* 100% Rounded Circle Frame */}
              <div
                className={`relative w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 lg:w-24 lg:h-24 rounded-full overflow-hidden transition-all duration-300 ease-out ${
                  isSelected
                    ? "ring-4 ring-[#4F46E5] ring-offset-2 ring-offset-white shadow-lg shadow-indigo-500/25 scale-105"
                    : "ring-2 ring-zinc-200/90 hover:ring-[#4F46E5] ring-offset-2 ring-offset-white shadow-2xs hover:shadow-xl hover:scale-105"
                }`}
              >
                {/* Full Circle Image */}
                <Image
                  src={
                    cat.imageUrl ||
                    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80"
                  }
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 90px, (max-width: 1024px) 100px, 110px"
                  className="object-cover w-full h-full group-hover:scale-115 transition-transform duration-500 ease-out"
                  unoptimized={cat.imageUrl?.includes("unsplash.com")}
                />

                {/* Subtle depth vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />

                {/* Active Selection Checkmark Badge */}
                {isSelected && (
                  <div className="absolute inset-0 bg-[#4F46E5]/20 flex items-center justify-center">
                    <span className="w-6 h-6 rounded-full bg-[#4F46E5] text-white flex items-center justify-center shadow-md ring-2 ring-white">
                      <LuCheck className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  </div>
                )}
              </div>

              {/* Just Category Name Underneath */}
              <span
                className={`text-[11px] sm:text-xs font-medium mt-2.5 line-clamp-2 leading-tight transition-colors duration-200 ${
                  isSelected
                    ? "text-[#4F46E5]"
                    : "text-zinc-800 group-hover:text-[#4F46E5]"
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
