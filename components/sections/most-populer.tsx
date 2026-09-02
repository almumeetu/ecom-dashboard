'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from "./ui/product-card";
import { fetchShopProducts, ShopProduct } from "@/lib/shop-api";
import { LuArrowRight, LuFlame } from 'react-icons/lu';

export default function MostPopuler() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetchShopProducts({ limit: 16 });
        // Display popular products (middle slice or reversed to show variety)
        const popularList = res.data.length > 8 ? res.data.slice(4, 12) : res.data;
        setProducts(popularList);
      } catch (error) {
        console.error("Failed to fetch most popular products", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full py-14 sm:py-20 bg-white border-t border-stone-200/70 overflow-hidden">
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-[11px] font-bold uppercase tracking-wider mb-3">
            <LuFlame className="w-3.5 h-3.5 text-rose-600" />
            <span>Customer Favorites</span>
          </div>

          <h2 className="text-zinc-900 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight font-['Bembo_Std'] mb-3">
            Most Popular & Best Sellers
          </h2>

          <p className="max-w-2xl text-zinc-500 text-sm sm:text-base leading-relaxed">
            Highly rated across verified customer purchases — top fashion essentials, everyday pantry goods, footwear, and accessories.
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-stone-50 rounded-2xl border border-zinc-100 p-4 animate-pulse flex flex-col justify-between">
                <div className="w-full aspect-square bg-zinc-200/60 rounded-xl" />
                <div className="h-4 bg-zinc-200/60 rounded w-3/4 mt-4" />
                <div className="h-6 bg-zinc-200/60 rounded w-1/2 mt-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product) => (
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
                badge={product.badge || "HOT"}
              />
            ))}
          </div>
        )}

        {/* View All CTA */}
        <div className="pt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-zinc-900 hover:bg-emerald-600 text-white font-sans text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg hover:scale-103 cursor-pointer"
          >
            <span>View All Best Sellers</span>
            <LuArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
