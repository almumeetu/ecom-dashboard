'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchShopCategories, type ShopCategory } from '@/lib/shop-api';
import { LuArrowRight, LuLayoutGrid } from 'react-icons/lu';

const DEFAULT_CATEGORY_CARDS = [
  {
    id: 'groceries',
    name: 'Fresh Groceries',
    tag: 'Daily Harvest & Pantry',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    href: '/products?search=grocery',
    color: 'from-emerald-900/80 via-emerald-950/40 to-transparent',
    accent: 'bg-emerald-500',
  },
  {
    id: 'womens-fashion',
    name: "Women's Fashion",
    tag: 'Chic Styles & Trends',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80',
    href: '/products?category=Women\'s+Fashion',
    color: 'from-rose-900/80 via-rose-950/40 to-transparent',
    accent: 'bg-rose-500',
  },
  {
    id: 'mens-fashion',
    name: "Men's Fashion",
    tag: 'Classic & Modern Apparel',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    href: '/products?category=Men\'s+Fashion',
    color: 'from-blue-900/80 via-blue-950/40 to-transparent',
    accent: 'bg-blue-500',
  },
  {
    id: 'footwear',
    name: 'Shoes & Footwear',
    tag: 'Sneakers, Loafers & Boots',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
    href: '/products?category=Footwear',
    color: 'from-indigo-900/80 via-indigo-950/40 to-transparent',
    accent: 'bg-indigo-500',
  },
  {
    id: 'accessories',
    name: 'Bags & Accessories',
    tag: 'Watches, Shades & Belts',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    href: '/products?category=Accessories',
    color: 'from-purple-900/80 via-purple-950/40 to-transparent',
    accent: 'bg-purple-500',
  },
  {
    id: 'food',
    name: 'Artisan Food & Drinks',
    tag: 'Bakery, Gourmet & Snacks',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    href: '/products?search=food',
    color: 'from-amber-900/80 via-amber-950/40 to-transparent',
    accent: 'bg-amber-500',
  },
];

export default function TheCollection() {
  const [categories, setCategories] = useState<ShopCategory[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const fetched = await fetchShopCategories();
        setCategories(fetched.filter(c => !c.parentId));
      } catch (err) {
        console.error('Failed to load categories for collection:', err);
      }
    }
    loadCategories();
  }, []);

  return (
    <section className="relative w-full py-16 md:py-24 bg-white overflow-hidden border-t border-stone-200/70">
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 flex flex-col justify-start items-center gap-10 md:gap-14">
        {/* Header */}
        <div className="flex flex-col justify-center items-center text-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-[11px] font-bold uppercase tracking-wider">
            <LuLayoutGrid className="w-3.5 h-3.5 text-zinc-600" />
            <span>Marketplace Categories</span>
          </div>

          <h2 className="text-zinc-900 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight font-['Bembo_Std']">
            Shop By Department
          </h2>

          <p className="max-w-[700px] text-zinc-500 text-sm sm:text-base leading-relaxed mx-auto">
            Explore diverse product lines from top global and local vendors — from everyday farm-fresh groceries to signature fashion apparel and luxury accessories.
          </p>
        </div>

        {/* Multi-Category Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {DEFAULT_CATEGORY_CARDS.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group relative h-[260px] sm:h-[300px] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 cursor-pointer block"
            >
              {/* Image Background */}
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                unoptimized
              />

              {/* Dynamic Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} transition-opacity duration-300`} />

              {/* Card Text Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-10">
                <span className={`inline-block w-8 h-1 rounded-full ${cat.accent} mb-3`} />
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-300">
                  {cat.tag}
                </span>
                <h3 className="text-2xl font-bold font-['Bembo_Std'] tracking-wide text-white mt-1 group-hover:text-emerald-300 transition-colors">
                  {cat.name}
                </h3>
                <div className="flex items-center gap-2 mt-3 text-xs font-semibold tracking-wider uppercase text-white/90 group-hover:text-white transition-all">
                  <span>Browse Category</span>
                  <LuArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
