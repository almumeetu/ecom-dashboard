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
    { label: "JOURNAL", href: "/blog", hasDropdown: false },
    { label: "CONTACT", href: "/contact", hasDropdown: false },
  ];

  const renderNavItem = (item: NavLinkItem) => (
    <div 
      key={item.label} 
      className={item.hasDropdown ? "" : "relative"}
      onMouseEnter={item.hasDropdown ? handleMouseEnter : undefined}
      onMouseLeave={item.hasDropdown ? handleMouseLeave : undefined}
      onFocusCapture={item.hasDropdown ? handleMouseEnter : undefined}
      onBlurCapture={item.hasDropdown ? (event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) handleMouseLeave();
      } : undefined}
      onKeyDown={item.hasDropdown ? (event) => {
        if (event.key === "Escape") {
          setIsTeasHovered(false);
          (event.currentTarget.querySelector("a") as HTMLElement | null)?.focus();
        }
      } : undefined}
    >
      <Link
        href={item.href}
        className="block"
        aria-expanded={item.hasDropdown ? isTeasHovered : undefined}
      >
        {item.hasDropdown ? (
          <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3.5 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-white/20">
            <LuLayoutGrid className="w-3.5 h-3.5 text-amber-200" />
            <span>{item.label}</span>
            <RiArrowDownSLine className={`text-base transition-transform duration-200 ${isTeasHovered ? 'rotate-180' : ''}`} />
          </span>
        ) : (
          <span
            className={`flex items-center gap-0.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
              isActive(item.href)
                ? "bg-white/10 text-white font-bold"
                : "text-slate-200 hover:bg-white/10 hover:text-white"
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
          <div className="w-[min(90vw,760px)] rounded-2xl border border-store-border bg-white shadow-[0_24px_60px_rgba(20,38,56,0.16)] overflow-hidden">
            <div className="flex items-start gap-8 px-7 py-7 text-zinc-800">
              
              <div className="flex min-w-0 flex-1 items-start gap-8">
                <div className="flex w-[min(44%,280px)] shrink-0 flex-col items-start">
                  <Link
                    href="/products"
                    onClick={() => setIsTeasHovered(false)}
                    className="w-full pb-3 mb-3 border-b border-zinc-100 flex items-center justify-between text-left text-zinc-900 hover:text-store-primary text-lg font-bold transition-all duration-200"
                  >
                    <span>All Categories</span>
                    <span className="text-xs text-store-primary font-semibold">View All →</span>
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
                            ? "text-store-primary text-base font-semibold translate-x-1 bg-store-surface px-3 rounded-lg"
                            : "text-zinc-600 text-base font-medium hover:text-store-primary hover:bg-store-surface hover:translate-x-1 px-3 rounded-lg"
                        }`}
                      >
                        <span>{category.name}</span>
                        {isCatActive && (
                          <span className="text-store-primary text-sm font-semibold">→</span>
                        )}
                      </Link>
                    );
                  })}
                </div>

                <div className="flex min-w-0 flex-1 flex-col items-start border-l border-store-border pl-8 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    Subcategories
                  </span>
                  {currentCategoryData?.children && currentCategoryData.children.length > 0 ? (
                    currentCategoryData.children.map((subItem) => (
                      <Link
                        key={subItem.id}
                        href={`/products?category=${encodeURIComponent(subItem.name)}`}
                        onClick={() => setIsTeasHovered(false)}
                        className="group/sub py-1.5 flex items-center gap-2 text-zinc-600 hover:text-store-primary text-sm font-medium transition-all duration-200 hover:translate-x-1.5"
                      >
                        <span className="transition-transform duration-200">{subItem.name}</span>
                        <span className="opacity-0 -translate-x-2 text-xs transition-all duration-200 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 text-store-primary">→</span>
                      </Link>
                    ))
                  ) : (
                    <Link href="/products" onClick={() => setIsTeasHovered(false)} className="text-sm font-medium text-store-primary hover:text-store-hover">Explore all products →</Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <nav className="relative hidden h-12 w-full items-center justify-between xl:flex">
      <div className="flex items-center gap-1 xl:gap-2">
        {allNavItems.map(renderNavItem)}
      </div>

      <div className="flex items-center gap-3 text-xs font-semibold">
        <Link
          href="/products"
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-amber-200 transition-colors hover:bg-white/10 hover:text-amber-100"
        >
          <span aria-hidden="true">⚡</span>
          <span>Daily Offers</span>
        </Link>
        <span className="h-5 w-px bg-white/15" aria-hidden="true" />
        <span className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-medium text-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-store-primary animate-pulse"></span>
          Delivery information
        </span>
      </div>
    </nav>
  );
}
