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
        trackClassName="items-stretch px-1 pt-1"
        heading={
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-store-orange-ink">
              Made for your everyday
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-store-ink sm:text-3xl">
              Shop by category
            </h2>
            <p className="mt-1 text-xs text-store-accent sm:text-sm">
              Explore what you love, one category at a time.
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
              className={`group relative flex w-[156px] shrink-0 snap-start flex-col overflow-hidden rounded-[22px] border bg-white text-left shadow-[0_6px_22px_rgba(20,38,56,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(20,38,56,0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-store-primary sm:w-[186px] ${
                isSelected ? "border-store-primary ring-2 ring-store-primary/10" : "border-store-border hover:border-store-light"
              }`}
            >
              {/* Category image */}
              <div className="relative h-28 w-full overflow-hidden bg-store-surface sm:h-36">
                <Image
                  src={
                    cat.imageUrl ||
                    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80"
                  }
                  alt=""
                  fill
                  sizes="(max-width: 640px) 156px, 186px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  unoptimized={cat.imageUrl?.includes("unsplash.com")}
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-store-deep/20 via-transparent to-transparent" />

                {isSelected && (
                  <div className="absolute right-3 top-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-store-primary text-white shadow-md ring-2 ring-white">
                      <LuCheck className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  </div>
                )}
              </div>

              <span
                className={`flex min-h-[60px] items-center justify-between gap-2 px-3.5 py-3 text-[13px] font-semibold leading-5 transition-colors duration-200 sm:text-sm ${
                  isSelected
                    ? "text-store-primary"
                    : "text-zinc-800 group-hover:text-store-primary"
                }`}
              >
                <span className="line-clamp-2">{cat.name}</span>
                <LuArrowRight className="h-4 w-4 shrink-0 text-store-accent transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </button>
          );
        })}
      </HorizontalScroller>
    </section>
  );
}
