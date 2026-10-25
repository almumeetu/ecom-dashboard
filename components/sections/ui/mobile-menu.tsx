"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineBars3BottomRight } from "react-icons/hi2";
import { LuArrowRight, LuChevronDown, LuX } from "react-icons/lu";
import type { NavigationProps } from "@/data/types";
import { DEFAULT_NOVAMART_CATEGORIES, type ShopCategory } from "@/lib/shop-api";

type MobileMenuProps = NavigationProps & { categories?: ShopCategory[] };

export default function MobileMenu({ navItems, categories = [] }: MobileMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const visibleCategories = categories.length ? categories : DEFAULT_NOVAMART_CATEGORIES;

  useEffect(() => {
    setOpen(false);
    setCategoriesOpen(false);
    setExpandedCategory(null);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      } else if (event.key === "Tab") {
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);
  const dismissMenu = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className="xl:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="store-mobile-menu"
        onClick={() => setOpen(true)}
        className="grid h-11 w-11 place-items-center rounded-xl text-store-deep transition-colors hover:bg-store-surface"
      >
        <HiOutlineBars3BottomRight className="h-6 w-6" aria-hidden="true" />
      </button>
      {open && (
        <div id="store-mobile-menu" className="fixed inset-0 z-[80] xl:hidden">
          <button type="button" aria-label="Close menu" onClick={dismissMenu} className="absolute inset-0 h-full w-full bg-store-deep/55 backdrop-blur-[3px]" />
          <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Store menu" className="relative flex h-dvh w-[min(88vw,400px)] flex-col overflow-hidden bg-store-page shadow-2xl">
            <div className="flex items-center justify-between border-b border-store-border bg-white px-5 py-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-store-orange-ink">NovaMart</span>
                <p className="mt-1 text-xl font-semibold tracking-tight text-store-deep">Explore the store</p>
              </div>
              <button ref={closeRef} type="button" aria-label="Close menu" onClick={dismissMenu} className="grid h-11 w-11 place-items-center rounded-full border border-store-border bg-store-page text-store-deep">
                <LuX className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <nav className="storefront-scroll-track flex-1 overflow-y-auto overscroll-contain px-4 py-5" aria-label="Mobile navigation">
              <div className="space-y-1">
                {navItems.map((item) =>
                  item.hasDropdown ? (
                    <div key={item.label} className="overflow-hidden rounded-2xl border border-store-border bg-white">
                      <div className="flex items-center">
                        <Link href={item.href} onClick={closeMenu} className="flex min-h-12 flex-1 items-center px-4 text-sm font-semibold text-store-deep">{item.label}</Link>
                        <button type="button" aria-label="Toggle categories" aria-expanded={categoriesOpen} onClick={() => setCategoriesOpen((value) => !value)} className="grid h-12 w-12 place-items-center border-l border-store-border text-store-primary">
                          <LuChevronDown className={`h-4 w-4 transition-transform ${categoriesOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                        </button>
                      </div>
                      {categoriesOpen && (
                        <div className="border-t border-store-border bg-store-page p-2">
                          {visibleCategories.map((category) => {
                            const children = category.children ?? [];
                            const expanded = expandedCategory === category.id;
                            return (
                              <div key={category.id}>
                                <div className="flex items-center">
                                  <Link href={`/products?category=${encodeURIComponent(category.name)}`} onClick={closeMenu} className="flex min-h-11 flex-1 items-center rounded-lg px-3 text-sm text-store-ink hover:bg-white">{category.name}</Link>
                                  {children.length > 0 && (
                                    <button type="button" aria-label={`Show ${category.name} subcategories`} aria-expanded={expanded} onClick={() => setExpandedCategory(expanded ? null : category.id)} className="grid h-11 w-11 place-items-center text-store-accent">
                                      <LuChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
                                    </button>
                                  )}
                                </div>
                                {expanded && children.map((child) => (
                                  <Link key={child.id} href={`/products?category=${encodeURIComponent(child.name)}`} onClick={closeMenu} className="block rounded-lg py-2.5 pl-7 pr-3 text-sm text-store-accent hover:bg-white hover:text-store-primary">{child.name}</Link>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link key={item.label} href={item.href} onClick={closeMenu} className="flex min-h-12 items-center justify-between rounded-2xl px-4 text-sm font-semibold text-store-deep transition-colors hover:bg-white">
                      {item.label}<LuArrowRight className="h-4 w-4 text-store-accent" aria-hidden="true" />
                    </Link>
                  ),
                )}
              </div>
              <div className="mt-7 rounded-2xl bg-store-deep p-5 text-white">
                <p className="text-xs font-medium text-white/70">Everything you love, in one place.</p>
                <Link href="/products" onClick={closeMenu} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white">Shop all products <LuArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
