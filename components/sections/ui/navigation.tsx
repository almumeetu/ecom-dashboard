'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiArrowDownSLine } from "react-icons/ri";
import { LuLayoutGrid } from "react-icons/lu";
import { fetchShopCategories, type ShopCategory } from "@/lib/shop-api";

const initialFallbackCats: ShopCategory[] = [
  { id: 'cat-skincare', name: 'Skin Care & Beauty', slug: 'skin-care' },
  { id: 'cat-electronics', name: 'Digital Electronics', slug: 'digital-electronics' },
  { id: 'cat-perfume', name: 'Perfumes & Fragrances', slug: 'perfume' },
  { id: 'cat-clothing', name: 'Clothing & Fashion', slug: 'clothing' },
  { id: 'cat-baby', name: 'Baby & Kids', slug: 'baby-products' },
  { id: 'cat-home', name: 'Home & Living', slug: 'home-living' },
];

export interface NavLinkItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export default function Navigation() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<ShopCategory[]>(initialFallbackCats);
  const [activeCategory, setActiveCategory] = useState<string>("cat-skincare");
  const [isTeasHovered, setIsTeasHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on pathname change
  useEffect(() => {
    setIsTeasHovered(false);
  }, [pathname]);

  // Close dropdown on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsTeasHovered(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function loadCategories() {
      try {
        const fetched = await fetchShopCategories();
        const mainCategories = fetched.filter(c => !c.parentId);
        const allCats = mainCategories.length > 0 ? mainCategories : initialFallbackCats;
        setCategories(allCats);
        if (allCats.length > 0) {
          setActiveCategory(allCats[0].id);
        }
      } catch (err) {
        console.error("Failed to load categories for menu:", err);
      }
    }
    loadCategories();
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsTeasHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsTeasHovered(false);
    }, 250);
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const currentCategoryData = categories.find((cat) => cat.id === activeCategory) || categories[0] || null;

  // Dynamically take the first 3 categories for the top navigation bar
  const top3Categories = categories.slice(0, 3);
  const dynamicCategoryNavItems: NavLinkItem[] = top3Categories.map((cat) => ({
    label: cat.name.toUpperCase(),
    href: `/products?category=${encodeURIComponent(cat.slug || cat.name)}`,
    hasDropdown: false,
  }));

  const allNavItems: NavLinkItem[] = [
    { label: "HOME", href: "/", hasDropdown: false },
    { label: "CATEGORIES", href: "/products", hasDropdown: true },
    ...dynamicCategoryNavItems,
    { label: "ABOUT US", href: "/about", hasDropdown: false },
    { label: "CONTACT", href: "/contact", hasDropdown: false },
  ];

  const renderNavItem = (item: NavLinkItem) => (
    <div 
      key={item.label} 
      className={item.hasDropdown ? "" : "relative"}
      onMouseEnter={item.hasDropdown ? handleMouseEnter : undefined}
      onMouseLeave={item.hasDropdown ? handleMouseLeave : undefined}
    >
      <Link
        href={item.href}
        className="block"
      >
        {item.hasDropdown ? (
          <span className="inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs uppercase tracking-wide px-3.5 py-1.5 rounded-lg transition-all shadow-2xs">
            <LuLayoutGrid className="w-3.5 h-3.5 text-indigo-200" />
            <span>{item.label}</span>
            <RiArrowDownSLine className={`text-base transition-transform duration-200 ${isTeasHovered ? 'rotate-180' : ''}`} />
          </span>
        ) : (
          <span
            className={`text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap transition-colors flex items-center gap-0.5 py-2.5 ${
              isActive(item.href)
                ? "text-[#818CF8] font-bold"
                : "text-slate-300 hover:text-white"
            }`}
          >
            {item.label}
          </span>
        )}
      </Link>

      {item.hasDropdown && (
        <div 
          className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50 transition-all duration-300 ease-out ${
            isTeasHovered
              ? "opacity-100 translate-y-0 visible pointer-events-auto"
              : "opacity-0 -translate-y-2 invisible pointer-events-none"
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="w-[92vw] max-w-[1300px] bg-white shadow-[0px_16px_48px_0px_rgba(0,0,0,0.12)] rounded-xl border border-zinc-100 overflow-hidden">
            <div className="px-10 py-10 flex justify-start items-start gap-12 text-zinc-800">
              
              <div className="flex-1 flex justify-start items-start gap-12">
                <div className="w-[280px] xl:w-[320px] shrink-0 flex flex-col justify-start items-start">
                  <Link
                    href="/products"
                    onClick={() => setIsTeasHovered(false)}
                    className="w-full pb-3 mb-3 border-b border-zinc-100 flex items-center justify-between text-left text-zinc-900 hover:text-[#4F46E5] text-lg font-bold transition-all duration-200"
                  >
                    <span>All Categories</span>
                    <span className="text-xs text-[#4F46E5] font-semibold">View All →</span>
                  </Link>

                  {categories.map((category) => {
                    const isCatActive = category.id === activeCategory;
                    return (
                      <Link
                        key={category.id}
                        href={`/products?category=${encodeURIComponent(category.name)}`}
                        onMouseEnter={() => setActiveCategory(category.id)}
                        onClick={() => setIsTeasHovered(false)}
                        className={`w-full py-2.5 flex items-center justify-between text-left transition-all duration-200 cursor-pointer border-none bg-transparent ${
                          isCatActive
                            ? "text-[#4F46E5] text-base font-semibold translate-x-1 bg-[#EEF2FF] px-3 rounded-lg"
                            : "text-zinc-600 text-base font-medium hover:text-[#4F46E5] hover:bg-[#EEF2FF] hover:translate-x-1 px-3 rounded-lg"
                        }`}
                      >
                        <span>{category.name}</span>
                        {isCatActive && (
                          <span className="text-[#4F46E5] text-sm font-semibold">→</span>
                        )}
                      </Link>
                    );
                  })}
                </div>

                <div className="flex-1 pt-2 flex flex-col justify-start items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    Subcategories
                  </span>
                  {currentCategoryData?.children && currentCategoryData.children.length > 0 ? (
                    currentCategoryData.children.map((subItem) => (
                      <Link
                        key={subItem.id}
                        href={`/products?category=${encodeURIComponent(subItem.name)}`}
                        onClick={() => setIsTeasHovered(false)}
                        className="group/sub py-1.5 flex items-center gap-2 text-zinc-600 hover:text-[#4F46E5] text-sm font-medium transition-all duration-200 hover:translate-x-1.5"
                      >
                        <span className="transition-transform duration-200">{subItem.name}</span>
                        <span className="opacity-0 -translate-x-2 text-xs transition-all duration-200 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 text-[#4F46E5]">→</span>
                      </Link>
                    ))
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link href="/products?search=grocery" onClick={() => setIsTeasHovered(false)} className="text-zinc-600 hover:text-[#4F46E5] text-sm">🥦 Organic Fruits & Fresh Vegetables</Link>
                      <Link href="/products?search=food" onClick={() => setIsTeasHovered(false)} className="text-zinc-600 hover:text-[#4F46E5] text-sm">🥐 Bakery, Snacks & Beverages</Link>
                      <Link href="/products?category=Fashion" onClick={() => setIsTeasHovered(false)} className="text-zinc-600 hover:text-[#4F46E5] text-sm">👗 Women&apos;s &amp; Men&apos;s Apparel</Link>
                      <Link href="/products?category=Footwear" onClick={() => setIsTeasHovered(false)} className="text-zinc-600 hover:text-[#4F46E5] text-sm">👟 Footwear & Casual Sneakers</Link>
                      <Link href="/products?category=Accessories" onClick={() => setIsTeasHovered(false)} className="text-zinc-600 hover:text-[#4F46E5] text-sm">⌚ Watches, Bags & Sunglasses</Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-px self-stretch bg-zinc-200"></div>

              {/* Promo Cards inside Mega-Menu */}
              <div className="flex-1 flex justify-start items-center gap-6">
                <Link 
                  href="/products?search=grocery" 
                  onClick={() => setIsTeasHovered(false)}
                  className="flex-1 flex flex-col justify-center items-start gap-2.5 group/promo"
                >
                  <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-xs">
                    <img 
                      src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80" 
                      alt="Fresh Grocery Deals" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/promo:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 text-white text-xs font-bold bg-[#4F46E5] px-2 py-0.5 rounded">
                      Fresh Daily
                    </span>
                  </div>
                  <div className="text-zinc-800 group-hover/promo:text-[#4F46E5] font-semibold text-sm transition-colors">
                    Daily Groceries & Pantry →
                  </div>
                </Link>

                <Link 
                  href="/products?category=Fashion" 
                  onClick={() => setIsTeasHovered(false)}
                  className="flex-1 flex flex-col justify-center items-start gap-2.5 group/promo"
                >
                  <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-xs">
                    <img 
                      src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format&fit=crop&q=80" 
                      alt="Trending Fashion" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/promo:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 text-white text-xs font-bold bg-[#EA580C] px-2 py-0.5 rounded">
                      Top Brands
                    </span>
                  </div>
                  <div className="text-zinc-800 group-hover/promo:text-[#4F46E5] font-semibold text-sm transition-colors">
                    Trending Fashion Drops →
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <nav className="relative hidden xl:flex items-center justify-between w-full h-11">
      <div className="flex items-center gap-5 xl:gap-7">
        {allNavItems.map(renderNavItem)}
      </div>

      <div className="flex items-center gap-4 text-xs font-semibold">
        <Link
          href="/products"
          className="flex items-center gap-1.5 text-[#F97316] hover:text-[#EA580C] transition-colors uppercase tracking-wider text-[11px] font-bold"
        >
          <span>⚡ Daily Offers</span>
        </Link>
        <span className="text-slate-600">|</span>
        <span className="text-slate-300 text-[11px] font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-pulse"></span>
          Free Shipping ৳999+
        </span>
      </div>
    </nav>
  );
}
