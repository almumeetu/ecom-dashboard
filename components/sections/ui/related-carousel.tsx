'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from './product-card';
import { fetchShopProducts, type ShopProduct } from '@/lib/shop-api';

interface RelatedProductsProps {
  currentCategory?: string;
  currentProductId?: string;
}

export default function RelatedCarousel({
  currentCategory,
  currentProductId,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetchShopProducts({
          limit: 20,
        });
        let filtered = (res.data || []).filter((p) => p.id !== currentProductId);
        if (currentCategory) {
          const catMatches = filtered.filter(
            (p) => (p.category || '').toLowerCase() === currentCategory.toLowerCase()
          );
          if (catMatches.length >= 4) {
            filtered = catMatches;
          }
        }
        setProducts(filtered.slice(0, 10));
      } catch (err) {
        console.error('Failed to fetch related products', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, [currentCategory, currentProductId]);

  if (isLoading) {
    return (
      <section className="w-full bg-[#FAF9F5] py-10 sm:py-14 border-t border-zinc-200/80">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="flex items-center justify-between mb-6">
            <div className="w-44 h-7 bg-zinc-200 animate-pulse rounded-lg" />
            <div className="w-20 h-5 bg-zinc-200 animate-pulse rounded-lg" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-80 bg-zinc-100 animate-pulse rounded-xl border border-zinc-200/60" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#FAF9F5] py-10 sm:py-14 border-t border-zinc-200/80 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        {/* Header matching Screenshot: "You may also like" with "Browse all" link */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
            You may also like
          </h2>

          <Link
            href="/products"
            className="text-xs sm:text-sm font-bold text-[#4F46E5] hover:text-[#4338CA] hover:underline transition-colors shrink-0"
          >
            Browse all
          </Link>
        </div>

        {/* 5-Column Grid matching Screenshot */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
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
              variantId={product.variantId}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
