"use client";

import Image from "next/image";
import Link from "next/link";
import { type ShopCategory } from "@/lib/shop-api";
import { LuArrowRight } from "react-icons/lu";

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
  // Use all categories (e.g. 12-16 items)
  const displayCategories = categories.length > 0 ? categories : [];

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-4 sm:py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <h2 className="text-lg sm:text-xl md:text-2xl font-black text-zinc-950 tracking-tight">
          Browse Categories
        </h2>
        <Link
          href="/products"
          className="text-xs sm:text-sm font-bold text-[#4F46E5] hover:text-[#4338CA] flex items-center gap-1 group transition-colors"
        >
          <span>View all</span>
          <LuArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Categories Grid (Round Icon Cards matching Screenshot) */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 sm:gap-4">
        {displayCategories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                onSelectCategory(cat.name);
                const el = document.getElementById("all-products-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex flex-col items-center group cursor-pointer text-center select-none"
            >
              {/* Circular Card Container */}
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full sm:rounded-2xl p-2.5 flex items-center justify-center relative overflow-hidden transition-all duration-300 shadow-2xs group-hover:shadow-md group-hover:scale-105 ${
                  isSelected
                    ? "bg-[#EEF2FF] border-2 border-[#4F46E5] ring-4 ring-[#4F46E5]/10"
                    : "bg-white border border-zinc-200/80 group-hover:border-[#4F46E5]/50 group-hover:bg-[#EEF2FF]"
                }`}
              >
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={cat.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80"}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 25vw, 12vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized={cat.imageUrl?.includes("unsplash.com")}
                  />
                </div>
              </div>

              {/* Category Name Underneath */}
              <span
                className={`text-[11px] sm:text-xs font-semibold mt-2 line-clamp-1 max-w-[85px] sm:max-w-[105px] transition-colors leading-tight ${
                  isSelected
                    ? "text-[#4F46E5] font-bold"
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
