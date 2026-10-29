"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard, { ProductCardSkeleton } from "@/components/sections/ui/product-card";
import StoreHero from "@/components/sections/store-hero";
import BrowseCategories from "@/components/sections/browse-categories";
import HorizontalScroller from "@/components/sections/ui/horizontal-scroller";
import BlogArticles from "@/components/sections/blog-articles";
import StorefrontCta from "@/components/sections/storefront-cta";
import {
  fetchShopProducts,
  fetchShopCategories,
  type ShopProduct,
  type ShopCategory,
  DEFAULT_NOVAMART_CATEGORIES,
} from "@/lib/shop-api";
import {
  LuBadgeCheck,
  LuRefreshCw,
  LuSearch,
  LuArrowRight,
  LuCheck,
  LuSlidersHorizontal,
  LuTruck,
  LuWalletCards,
} from "react-icons/lu";

export default function Home() {
  const [categories, setCategories] = useState<ShopCategory[]>(DEFAULT_NOVAMART_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc" | "rating">("featured");

  // Load Categories & Products on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [cats, prods] = await Promise.all([
          fetchShopCategories(),
          fetchShopProducts({ page: 1, limit: 200 }),
        ]);

        if (cats && cats.length > 0) {
          setCategories(cats);
        }
        if (prods && prods.data) {
          setProducts(prods.data);
        }
      } catch (err) {
        console.error("Failed to load homepage data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    requestAnimationFrame(() => {
      document.getElementById("featured-picks-section")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    });
  };

  // Filter and sort products
  const displayedProducts = useMemo(() => {
    let result = products;

    // Filter by selected category tab
    if (selectedCategory !== "All") {
      result = result.filter((p) => {
        const cat = (p.category || "").toLowerCase();
        const sel = selectedCategory.toLowerCase();
        return (
          cat === sel ||
          cat.includes(sel) ||
          sel.includes(cat) ||
          (sel === "clothing & fashion" && (cat.includes("cloth") || cat.includes("fashion"))) ||
          (sel === "skin care & beauty" && (cat.includes("skin") || cat.includes("beauty"))) ||
          (sel === "digital electronics" && (cat.includes("electr") || cat.includes("tech") || cat.includes("gadget"))) ||
          (sel === "perfumes & fragrances" && (cat.includes("perfume") || cat.includes("fragrance"))) ||
          (sel === "baby & kids products" && (cat.includes("baby") || cat.includes("kid"))) ||
          (sel === "home & living" && (cat.includes("home") || cat.includes("living")))
        );
      });
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.team?.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === "price_asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => (b.rating || 4.7) - (a.rating || 4.7));
    }

    return result;
  }, [products, selectedCategory, searchTerm, sortBy]);

  // Quick category list for tabs
  const categoryTabs = useMemo(() => {
    return [
      { id: "all", name: "All Products", slug: "All" },
      ...categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.name,
      })),
    ];
  }, [categories]);

  const featuredProducts = useMemo(() => {
    const discounted = products.filter(
      (product) => product.originalPrice && product.originalPrice > product.price
    );
    const preferredProducts = [...discounted, ...products.filter((product) => !discounted.includes(product))];
    return preferredProducts.slice(0, 6);
  }, [products]);

  const hasSpecialOffers = featuredProducts.filter(
    (product) => product.originalPrice && product.originalPrice > product.price
  ).length >= 3;

  const categoryProductGroups = useMemo(() => {
    const groups = new Map<string, ShopProduct[]>();
    for (const product of products) {
      const category = product.category?.trim();
      if (!category) continue;
      const group = groups.get(category) ?? [];
      group.push(product);
      groups.set(category, group);
    }

    return [...groups.entries()]
      .filter(([, items]) => items.length >= 3)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 3);
  }, [products]);

  const renderProductCard = (product: ShopProduct) => (
    <ProductCard
      key={product.id}
      id={product.id}
      name={product.name}
      price={`৳ ${product.price.toLocaleString()}`}
      originalPrice={
        product.originalPrice
          ? `৳ ${product.originalPrice.toLocaleString()}`
          : undefined
      }
      image={product.image}
      slug={product.slug}
      category={product.category}
      brand={product.team}
      rating={product.rating}
      badge={product.badge}
      unit={product.unit}
      variantId={product.variantId}
    />
  );

  const categoryTones = [
    "bg-[#F2EEE7] text-[#354A5E]",
    "bg-[#FAEEE4] text-[#8B4F2B]",
    "bg-[#ECE8DF] text-[#465E52]",
  ];

  const showStorefrontHighlights =
    !loading && selectedCategory === "All" && searchTerm.trim() === "";
  const visibleProducts = displayedProducts.slice(0, 18);
  const shoppingBenefits = [
    {
      icon: LuBadgeCheck,
      title: "Genuine products",
      description: "Sourced from verified suppliers",
    },
    {
      icon: LuTruck,
      title: "Delivery options",
      description: "Available details are shown at checkout",
    },
    {
      icon: LuWalletCards,
      title: "Cash on delivery",
      description: "Pay when your order arrives",
    },
    {
      icon: LuRefreshCw,
      title: "After-purchase support",
      description: "Help when you need it",
    },
  ];

  return (
    <main className="w-full min-h-screen bg-store-page font-sans text-zinc-900 pb-16 sm:pb-20">
      <div className="space-y-12 pt-7 sm:space-y-16 sm:pt-10 lg:space-y-20">
        {/* ── 2. Hero Section: Category Sidebar + Dynamic Campaign Slider ── */}
        <StoreHero
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        <section
          aria-label="Shop with confidence"
          className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-10 lg:px-16"
        >
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            {shoppingBenefits.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex min-w-0 flex-col items-start gap-3 rounded-2xl border border-store-border bg-white px-4 py-4 shadow-[0_6px_24px_rgba(20,38,56,0.035)] sm:flex-row sm:items-center sm:gap-3 sm:px-5 sm:py-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-store-surface text-store-primary">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold leading-5 text-store-ink sm:text-sm">
                    {title}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-4 text-store-accent sm:text-xs">
                    {description}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. Browse Categories Section (Circular Cards matching Screenshot) ── */}
        <BrowseCategories
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        <StorefrontCta featuredProduct={featuredProducts[0]} />

        {showStorefrontHighlights && products.length > 0 && (
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 space-y-12 sm:space-y-16 lg:space-y-20">
            <section>
              <div className="flex items-center justify-between gap-4 mb-5 sm:mb-6">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-store-ink sm:text-3xl">
                    {hasSpecialOffers ? "Special offers" : "Popular picks"}
                  </h2>
                  <p className="mt-1 text-xs text-store-accent sm:text-sm">
                    Everyday finds chosen to make your next order easier.
                  </p>
                </div>
                <Link
                  href="/products"
                  className="shrink-0 text-xs sm:text-sm font-medium text-store-accent hover:text-store-accent transition-colors"
                >
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {featuredProducts.map((product) => (
                  <div key={product.id}>{renderProductCard(product)}</div>
                ))}
              </div>
            </section>

            {categoryProductGroups.map(([categoryName, items], index) => (
              <section
                key={categoryName}
                className="grid grid-cols-1 md:grid-cols-[176px_minmax(0,1fr)] xl:grid-cols-[192px_minmax(0,1fr)] gap-4 sm:gap-6"
              >
                <div className={`relative min-h-[112px] overflow-hidden rounded-xl p-5 sm:p-6 ${categoryTones[index]}`}>
                  <div className="relative z-10 flex h-full flex-row md:flex-col items-start justify-between gap-4">
                    <h2 className="max-w-[180px] text-lg sm:text-xl font-medium leading-snug">{categoryName}</h2>
                    <Link
                      href={`/products?category=${encodeURIComponent(categoryName)}`}
                      className="inline-flex shrink-0 items-center rounded-md bg-white/90 px-3 py-2 text-xs font-medium hover:bg-white transition-colors"
                    >
                      View all
                    </Link>
                  </div>
                  {items[0]?.image && (
                    <div className="absolute bottom-2 right-2 h-24 w-24 md:bottom-16 md:right-4 md:h-36 md:w-36 opacity-20">
                      <Image
                        src={items[0].image}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 144px, 96px"
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
                <HorizontalScroller
                  label={`${categoryName} products`}
                  controlsPosition="footer"
                >
                  {items.slice(0, 12).map((product) => (
                    <div key={product.id} className="w-[168px] shrink-0 snap-start sm:w-[188px] lg:w-[204px]">
                      {renderProductCard(product)}
                    </div>
                  ))}
                </HorizontalScroller>
              </section>
            ))}
          </div>
        )}

        {/* ── 4. Featured Picks and Product Catalog ── */}
        <section id="featured-picks-section" className="scroll-mt-44 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 sm:scroll-mt-48">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-6 sm:mb-7">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-store-ink tracking-tight">
                {selectedCategory === "All" ? "Explore all products" : selectedCategory}
              </h2>
              <p className="mt-1 text-xs text-store-accent sm:text-sm">Find the right product for every moment.</p>
            </div>

            {/* Search & Sort Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Quick in-page Search */}
              <div className="relative flex-1 min-w-[180px] sm:min-w-[240px]">
                <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  aria-label="Search homepage products"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 w-full pl-9 pr-8 text-xs sm:text-sm rounded-lg border border-zinc-200 bg-white placeholder:text-zinc-400 focus:outline-none focus:border-store-primary focus:ring-2 focus:ring-store-primary/15 transition-all"
                />
                {searchTerm && (
                  <button
                    type="button"
                    aria-label="Clear product search"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-700"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Sort Select */}
              <div className="flex h-10 items-center gap-2 bg-white border border-zinc-200 rounded-lg px-3">
                <LuSlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                <select
                  aria-label="Sort products"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="text-xs sm:text-sm font-medium text-zinc-700 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured Items</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Category Filter Tabs (Pill Buttons) ── */}
          <div className="storefront-scroll-track flex items-center gap-2.5 overflow-x-auto pb-3 mb-6 sm:mb-7">
            {categoryTabs.map((tab) => {
              const isActive = selectedCategory === tab.slug;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedCategory(tab.slug)}
                  className={`shrink-0 px-4 py-2.5 rounded-full text-xs sm:text-[13px] font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-store-primary text-white"
                      : "bg-white text-zinc-700 hover:bg-store-surface hover:text-store-accent border border-zinc-200/80"
                  }`}
                >
                  {isActive && <LuCheck className="w-3.5 h-3.5 text-blue-100" />}
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Responsive product grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : displayedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {visibleProducts.map((product) => (
                <div key={product.id}>{renderProductCard(product)}</div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white rounded-2xl border border-zinc-200/80 p-8">
              <p className="text-zinc-500 text-sm">
                No products found matching your filter or search.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchTerm("");
                }}
                className="mt-4 px-5 py-2 rounded-lg bg-store-accent text-white text-xs font-medium hover:bg-store-hover transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* View Full Catalog Link */}
          <div className="mt-8 sm:mt-10 flex flex-col items-center gap-3 text-center">
            {displayedProducts.length > visibleProducts.length && (
              <p className="text-[11px] text-zinc-500">
                Showing {visibleProducts.length} of {displayedProducts.length} products
              </p>
            )}
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-store-primary bg-white hover:bg-store-primary text-store-accent hover:text-white font-medium text-sm active:scale-95 transition-all"
            >
              <span>Explore All Products</span>
              <LuArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
        <BlogArticles variant="preview" />
      </div>
    </main>
  );
}
