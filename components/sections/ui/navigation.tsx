'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { RiArrowDownSLine } from "react-icons/ri";
import { fetchShopCategories, type ShopCategory } from "@/lib/shop-api";
import Logo from "@/components/ui/logo";

const leftNavItems = [
  { label: "HOME", href: "/" },
  { label: "CATEGORIES", href: "/products", hasDropdown: true },
  { label: "GROCERIES", href: "/products?search=grocery" },
  { label: "FASHION", href: "/products?category=Fashion" },
];

const rightNavItems = [
  { label: "FOOTWEAR", href: "/products?category=Footwear" },
  { label: "ACCESSORIES", href: "/products?category=Accessories" },
  { label: "ABOUT US", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
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
        const fallbackMarketplaceCats: ShopCategory[] = [
          { id: 'cat-grocery', name: 'Groceries & Produce', slug: 'groceries' },
          { id: 'cat-food', name: 'Food & Bakery', slug: 'food' },
          { id: 'cat-wfash', name: "Women's Fashion", slug: 'womens-fashion' },
          { id: 'cat-mfash', name: "Men's Fashion", slug: 'mens-fashion' },
          { id: 'cat-foot', name: 'Footwear & Shoes', slug: 'footwear' },
          { id: 'cat-acc', name: 'Bags & Accessories', slug: 'accessories' },
        ];
        const allCats = mainCategories.length > 0 ? mainCategories : fallbackMarketplaceCats;
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

  const renderNavItem = (item: typeof leftNavItems[0]) => (
    <div 
      key={item.label} 
      className={item.hasDropdown ? "" : "relative"}
      onMouseEnter={item.hasDropdown ? handleMouseEnter : undefined}
      onMouseLeave={item.hasDropdown ? handleMouseLeave : undefined}
    >
      <Link
        href={item.href}
        className={`font-gotham text-[10.5px] font-semibold uppercase tracking-wide whitespace-nowrap transition-colors flex items-center gap-1 py-2 relative group ${
          isActive(item.href)
            ? "text-emerald-400"
            : "text-white hover:text-emerald-300"
        }`}
      >
        {item.label}

        {item.hasDropdown && (
          <RiArrowDownSLine className="text-lg text-zinc-400 group-hover:text-emerald-300 transition-colors" />
        )}

        {item.label === "CATEGORIES" && (
          <span className="absolute top-[85%] left-1/2 -translate-x-1/2 hidden group-hover:block bg-zinc-900 border border-zinc-700 text-white text-[10px] font-semibold tracking-wider uppercase py-1 px-2.5 rounded shadow-lg z-[60] whitespace-nowrap">
            Explore All
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
          <div className="w-[92vw] max-w-[1300px] bg-white shadow-[0px_16px_48px_0px_rgba(0,0,0,0.12)] rounded-2xl border border-zinc-100 overflow-hidden">
            <div className="px-10 py-10 flex justify-start items-start gap-12 text-zinc-800">
              
              <div className="flex-1 flex justify-start items-start gap-12">
                <div className="w-[280px] xl:w-[320px] shrink-0 flex flex-col justify-start items-start">
                  <Link
                    href="/products"
                    onClick={() => setIsTeasHovered(false)}
                    className="w-full pb-3 mb-3 border-b border-zinc-100 flex items-center justify-between text-left font-['Bembo_Std'] text-zinc-900 hover:text-emerald-600 text-xl font-bold transition-all duration-200"
                  >
                    <span>All Marketplace Categories</span>
                    <span className="text-xs text-emerald-600 font-sans font-semibold">View All →</span>
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
                            ? "text-emerald-700 text-base xl:text-lg font-bold flex items-center gap-2 translate-x-1 bg-emerald-50/50 px-3 rounded-lg"
                            : "text-zinc-600 text-base xl:text-lg font-medium hover:text-emerald-700 hover:translate-x-1 px-3"
                        }`}
                      >
                        <span>{category.name}</span>
                        {isCatActive && (
                          <span className="text-emerald-600 text-sm font-semibold">→</span>
                        )}
                      </Link>
                    );
                  })}
                </div>

                <div className="flex-1 pt-2 flex flex-col justify-start items-start">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    Subcategories & Highlights
                  </span>
                  {currentCategoryData?.children && currentCategoryData.children.length > 0 ? (
                    currentCategoryData.children.map((subItem) => (
                      <Link
                        key={subItem.id}
                        href={`/products?category=${encodeURIComponent(subItem.name)}`}
                        onClick={() => setIsTeasHovered(false)}
                        className="group/sub py-1.5 flex items-center gap-2 text-zinc-600 hover:text-emerald-700 text-sm font-medium transition-all duration-200 hover:translate-x-1.5"
                      >
                        <span className="transition-transform duration-200">{subItem.name}</span>
                        <span className="opacity-0 -translate-x-2 text-xs transition-all duration-200 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 text-emerald-600">→</span>
                      </Link>
                    ))
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link href="/products?search=grocery" onClick={() => setIsTeasHovered(false)} className="text-zinc-600 hover:text-emerald-600 text-sm">🥦 Organic Fruits & Fresh Vegetables</Link>
                      <Link href="/products?search=food" onClick={() => setIsTeasHovered(false)} className="text-zinc-600 hover:text-emerald-600 text-sm">🥐 Bakery, Snacks & Beverages</Link>
                      <Link href="/products?category=Fashion" onClick={() => setIsTeasHovered(false)} className="text-zinc-600 hover:text-emerald-600 text-sm">👗 Women's & Men's Apparel</Link>
                      <Link href="/products?category=Footwear" onClick={() => setIsTeasHovered(false)} className="text-zinc-600 hover:text-emerald-600 text-sm">👟 Footwear & Casual Sneakers</Link>
                      <Link href="/products?category=Accessories" onClick={() => setIsTeasHovered(false)} className="text-zinc-600 hover:text-emerald-600 text-sm">⌚ Watches, Bags & Sunglasses</Link>
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
                    <span className="absolute bottom-3 left-3 text-white text-xs font-bold bg-emerald-600 px-2 py-0.5 rounded">
                      Fresh Daily
                    </span>
                  </div>
                  <div className="text-zinc-800 group-hover/promo:text-emerald-600 font-semibold text-sm transition-colors">
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
                    <span className="absolute bottom-3 left-3 text-white text-xs font-bold bg-rose-600 px-2 py-0.5 rounded">
                      Top Brands
                    </span>
                  </div>
                  <div className="text-zinc-800 group-hover/promo:text-emerald-600 font-semibold text-sm transition-colors">
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
    <nav className="relative hidden xl:flex items-center justify-center w-full">
      {/* Left nav group */}
      <div className="flex items-center justify-end gap-3 xl:gap-5 flex-1">
        {leftNavItems.map(renderNavItem)}
      </div>

      <div className="px-4 xl:px-8 shrink-0 flex items-center justify-center">
        <Logo variant="light" size="md" />
      </div>

      {/* Right nav group */}
      <div className="flex items-center justify-start gap-3 xl:gap-5 flex-1">
        {rightNavItems.map(renderNavItem)}
      </div>
    </nav>
  );
}
