"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/sections/ui/product-card";
import OrderRibbon from "@/components/sections/order-ribbon";
import StoreHero from "@/components/sections/store-hero";
import BrowseCategories from "@/components/sections/browse-categories";
import {
  fetchShopProducts,
  fetchShopCategories,
  type ShopProduct,
  type ShopCategory,
  DEFAULT_NOVAMART_CATEGORIES,
} from "@/lib/shop-api";
import {
  LuSparkles,
  LuSearch,
  LuArrowRight,
  LuCheck,
  LuSlidersHorizontal,
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
          fetchShopProducts({ page: 1, limit: 30 }),
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
    const el = document.getElementById("featured-picks-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
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

  return (
    <div className="w-full min-h-screen bg-[#FDFDFD] font-sans text-zinc-900 pb-16">
      {/* ── 1. Order Notice Ribbon Strip (Direct Hotline Call & WhatsApp) ── */}
      <OrderRibbon />

      {/* ── 2. Hero Section: Category Sidebar + Dynamic Campaign Slider ── */}
      <StoreHero
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* ── 3. Browse Categories Section (Circular Cards matching Screenshot) ── */}
      <BrowseCategories
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* ── 4. Featured Picks (All Products Catalog with 5-Column Grid) ── */}
      <section id="featured-picks-section" className="py-6 sm:py-8 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-3 border-b border-zinc-200/80">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-widest">
              <LuSparkles className="w-3.5 h-3.5" />
              <span>Verified Authentic Catalog</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-zinc-950 tracking-tight mt-0.5">
              {selectedCategory === "All" ? "Featured Picks" : selectedCategory}
              <span className="text-xs sm:text-sm font-medium text-zinc-400 ml-2.5">
                ({displayedProducts.length} items)
              </span>
            </h2>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick in-page Search */}
            <div className="relative min-w-[200px] sm:min-w-[240px]">
              <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-zinc-200 bg-white placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5 bg-white border border-zinc-200 rounded-xl px-2.5 py-1.5">
              <LuSlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
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
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categoryTabs.map((tab) => {
            const isActive = selectedCategory === tab.slug;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.slug)}
                className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                  isActive
                    ? "bg-[#0D7053] text-white shadow-sm"
                    : "bg-white text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 border border-zinc-200/80"
                }`}
              >
                {isActive && <LuCheck className="w-3.5 h-3.5 text-emerald-200" />}
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* ── Products Grid (5 Columns matching Screenshot!) ── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-3 border border-zinc-200 animate-pulse space-y-3"
              >
                <div className="w-full aspect-square bg-zinc-100 rounded-lg" />
                <div className="h-3 bg-zinc-100 rounded-md w-3/4" />
                <div className="h-4 bg-zinc-100 rounded-md w-1/2" />
                <div className="h-9 bg-zinc-100 rounded-lg w-full" />
              </div>
            ))}
          </div>
        ) : displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {displayedProducts.map((product) => (
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
              className="mt-4 px-5 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-emerald-600 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* View Full Catalog Link */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0D7053] hover:bg-[#0B6046] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-800/20 active:scale-95 transition-all"
          >
            <span>Explore Complete NovaMart Catalog</span>
            <LuArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
