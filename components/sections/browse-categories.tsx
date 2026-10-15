"use client";

import Image from "next/image";
import Link from "next/link";
import HorizontalScroller from "@/components/sections/ui/horizontal-scroller";
import { type ShopCategory, DEFAULT_NOVAMART_CATEGORIES } from "@/lib/shop-api";
import { LuArrowRight, LuCheck } from "react-icons/lu";

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

  return (
    <section id="shop-by-category" className="w-full max-w-[1440px] mx-auto scroll-mt-32 px-4 sm:px-6 md:px-10 lg:px-16">
      <HorizontalScroller
        label="Categories"
        trackClassName="items-start px-1 pt-1"
        heading={
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-store-primary">
              Explore the store
            </p>
            <h2 className="text-xl font-semibold tracking-tight text-store-ink sm:text-2xl">
              Shop by category
            </h2>
            <p className="mt-1 text-xs text-store-accent sm:text-sm">
              Find the right thing, faster.
            </p>
          </div>
        }
        action={
          <Link
            href="/products"
            className="text-xs sm:text-sm font-medium text-store-primary hover:text-store-accent flex items-center gap-1 group transition-colors"
          >
            <span>View all</span>
            <LuArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        }
      >
        {displayCategories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.name)}
              aria-pressed={isSelected}
              className="group flex w-[92px] shrink-0 snap-start flex-col items-center rounded-lg py-1 cursor-pointer select-none text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-store-primary sm:w-[104px]"
            >
              {/* Category image */}
              <div
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden transition-all duration-200 ease-out ${
                  isSelected
                    ? "ring-2 ring-store-primary ring-offset-2 ring-offset-white"
                    : "ring-1 ring-zinc-200 hover:ring-store-primary ring-offset-2 ring-offset-white group-hover:scale-105"
                }`}
              >
                <Image
                  src={
                    cat.imageUrl ||
                    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80"
                  }
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 56px, 64px"
                  className="object-cover w-full h-full group-hover:scale-115 transition-transform duration-500 ease-out"
                  unoptimized={cat.imageUrl?.includes("unsplash.com")}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />

                {isSelected && (
                  <div className="absolute inset-0 bg-store-primary/20 flex items-center justify-center">
                    <span className="w-6 h-6 rounded-full bg-store-primary text-white flex items-center justify-center shadow-md ring-2 ring-white">
                      <LuCheck className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  </div>
                )}
              </div>

              <span
                className={`text-xs sm:text-[13px] font-medium mt-3 min-h-10 line-clamp-2 leading-5 transition-colors duration-200 ${
                  isSelected
                    ? "text-store-accent"
                    : "text-zinc-800 group-hover:text-store-primary"
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </HorizontalScroller>
    </section>
  );
}
