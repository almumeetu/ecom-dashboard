'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import ProductCard from "./ui/product-card";
import { fetchShopProducts, fetchShopCategories, ShopProduct, ShopCategory } from "@/lib/shop-api";
import { LuArrowRight, LuSparkles } from 'react-icons/lu';

export default function NewArrival() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetchShopProducts({ limit: 16 }),
          fetchShopCategories(),
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.filter(c => !c.parentId));
      } catch (error) {
        console.error("Failed to fetch new arrivals", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const categoryTabs = useMemo(() => {
    const list = ["All"];
    categories.forEach(c => {
      if (c.name && !list.includes(c.name)) list.push(c.name);
    });
    // Add fallback popular multi-category tabs if categories are few
    ["Groceries", "Food & Beverage", "Fashion"].forEach(name => {
      if (!list.includes(name) && list.length < 8) list.push(name);
    });
    return list;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products.slice(0, 8);
    const lower = selectedCategory.toLowerCase();
    const matched = products.filter(p => 
      p.category?.toLowerCase().includes(lower) || 
      p.name?.toLowerCase().includes(lower)
    );
    return matched.length > 0 ? matched.slice(0, 8) : products.slice(0, 8);
  }, [products, selectedCategory]);

  return (
    <section className="relative w-full py-14 sm:py-20 bg-stone-50/60 border-t border-stone-200/70 overflow-hidden">
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-3">
            <LuSparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Curated Marketplace</span>
          </div>

          <h2 className="text-zinc-900 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight font-['Bembo_Std'] mb-3">
            Fresh Arrivals & Trending Drops
          </h2>

          <p className="max-w-2xl text-zinc-500 text-sm sm:text-base leading-relaxed">
            Browse newly added grocery produce, everyday food staples, designer apparel, footwear, and accessories from certified top-rated vendors.
          </p>

          {/* Interactive Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap mt-6 max-w-4xl">
            {categoryTabs.map((tab) => {
              const isActive = selectedCategory === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedCategory(tab)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-zinc-900 text-white shadow-sm scale-102"
                      : "bg-white text-zinc-600 hover:text-zinc-900 hover:bg-stone-100 border border-zinc-200/80"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-white rounded-2xl border border-zinc-100 p-4 animate-pulse flex flex-col justify-between">
                <div className="w-full aspect-square bg-zinc-100 rounded-xl" />
                <div className="h-4 bg-zinc-100 rounded w-3/4 mt-4" />
                <div className="h-6 bg-zinc-100 rounded w-1/2 mt-2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={`৳${product.price.toLocaleString()}`}
                originalPrice={product.originalPrice ? `৳${product.originalPrice.toLocaleString()}` : ''}
                image={product.image}
                slug={product.slug}
                category={product.category}
                brand={product.team}
                unit={product.unit}
                badge={product.badge || "NEW"}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200/60 p-8">
            <p className="text-zinc-500 text-sm">No products found in this category.</p>
            <Link href="/products" className="mt-4 inline-block text-emerald-600 font-semibold text-sm hover:underline">
              View All Products →
            </Link>
          </div>
        )}

        {/* Discover All CTA */}
        <div className="pt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-zinc-900 hover:bg-emerald-600 text-white font-sans text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg hover:scale-103 cursor-pointer"
          >
            <span>Explore All Marketplace Products</span>
            <LuArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
