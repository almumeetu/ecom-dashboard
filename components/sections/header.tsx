"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import MobileMenu from "./ui/mobile-menu";
import Navigation from "./ui/navigation";
import { IoSearchOutline, IoHeartOutline } from "react-icons/io5";
import { LuShoppingBag, LuUser, LuChevronDown, LuLogOut, LuPhone, LuTruck, LuMapPin, LuX } from "react-icons/lu";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/app/_providers/auth-provider";
import { useCart } from "@/app/_providers/cart-provider";
import { useWishlist } from "@/app/_providers/wishlist-provider";
import { fetchShopProducts, type ShopProduct } from "@/lib/shop-api";
import Logo from "@/components/ui/logo";

const sylhetiTeaItems = [
  { label: "Fresh Groceries", href: "/products?search=grocery" },
  { label: "Women's Fashion", href: "/products?category=Women's+Fashion" },
  { label: "Men's Fashion", href: "/products?category=Men's+Fashion" },
  { label: "Footwear & Shoes", href: "/products?category=Footwear" },
  { label: "Bags & Accessories", href: "/products?category=Accessories" },
  { label: "Artisan Food & Drinks", href: "/products?search=food" },
];

const navItems = [
  { label: "Home", href: "/" },
  { label: "CATEGORIES", href: "/products", hasDropdown: true },
  { label: "GROCERIES", href: "/products?search=grocery" },
  { label: "FASHION", href: "/products?category=Fashion" },
  { label: "FOOTWEAR", href: "/products?category=Footwear" },
  { label: "ACCESSORIES", href: "/products?category=Accessories" },
  { label: "ABOUT US", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, setShowAuthModal, logout } = useAuth();
  const { itemCount: cartItemCount } = useCart();
  const { itemCount: wishlistItemCount } = useWishlist();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Close dropdowns/suggestions and scroll to top on route changes
  useEffect(() => {
    setDropdownOpen(false);
    setShowSuggestions(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  // Close dropdowns/suggestions on scroll
  useEffect(() => {
    const handleScroll = () => {
      setDropdownOpen(false);
      setShowSuggestions(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ShopProduct[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync search input with URL search param
  useEffect(() => {
    const search = searchParams?.get("search") || "";
    setSearchQuery(search);
  }, [searchParams]);

  // Debounced search suggestions fetch
  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetchShopProducts({
          page: 1,
          limit: 5,
          search: trimmedQuery,
        });
        setSuggestions(res.data);
      } catch (err) {
        console.error("Failed to fetch search suggestions:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/products");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedOutsideDesktop = !desktopDropdownRef.current || !desktopDropdownRef.current.contains(target);
      const clickedOutsideMobile = !mobileDropdownRef.current || !mobileDropdownRef.current.contains(target);

      if (clickedOutsideDesktop && clickedOutsideMobile) {
        setDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleNavigate = (path: string) => {
    setDropdownOpen(false);
    window.location.href = path;
  };

  return (
    <header className="sticky top-0 z-50 w-full font-sans bg-white">
      {/* ═══════════════ Desktop Main Header ═══════════════ */}
      <div className="hidden xl:block bg-white border-b border-zinc-200/80 shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[72px] gap-8">
          {/* Logo */}
          <div className="shrink-0">
            <Logo variant="dark" size="md" showTagline={false} />
          </div>

          {/* Search Bar — centered & wide */}
          <div className="flex-1 max-w-2xl relative" ref={searchContainerRef}>
            <form
              onSubmit={(e) => { handleSearchSubmit(e); setShowSuggestions(false); }}
              className="relative flex items-center w-full"
            >
              <IoSearchOutline className="absolute left-4 w-4.5 h-4.5 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full h-11 pl-11 pr-28 rounded-full border border-zinc-200 bg-zinc-50/80 text-sm text-zinc-800 placeholder:text-zinc-400 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setShowSuggestions(false);
                  }}
                  className="absolute right-22 text-zinc-400 hover:text-zinc-600 p-1 cursor-pointer"
                  aria-label="Clear search"
                >
                  <LuX className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                aria-label="Submit Search"
                className="absolute right-1.5 h-8 px-4.5 rounded-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              >
                <span>Search</span>
              </button>
            </form>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && searchQuery.trim() !== "" && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white text-zinc-800 shadow-2xl border border-zinc-200/80 py-2.5 z-[999] rounded-2xl overflow-hidden animate-fadeIn">
                {isSearching ? (
                  <div className="flex items-center justify-center py-6 px-4 gap-2 text-sm text-zinc-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-500 border-t-transparent" />
                    Searching...
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="flex flex-col">
                    <div className="px-4 pb-2 mb-1 border-b border-zinc-100 text-[10px] uppercase font-bold tracking-wider text-zinc-400 select-none">
                      Matching Products
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {suggestions.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug ?? product.id}`}
                          onClick={() => {
                            setShowSuggestions(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-3.5 px-4 py-2.5 hover:bg-zinc-50 transition-colors group"
                        >
                          <div className="w-11 h-11 shrink-0 relative overflow-hidden bg-zinc-100 rounded-lg border border-zinc-200">
                            <Image
                              src={product.image || "/images/no-image-icon-6.png"}
                              alt={product.name}
                              fill
                              sizes="44px"
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="text-sm font-medium text-zinc-800 truncate group-hover:text-emerald-600 transition-colors">
                              {product.name}
                            </h4>
                            <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                              {product.category}
                            </span>
                          </div>
                          <div className="text-sm font-semibold text-zinc-900 shrink-0">
                            ৳{product.price.toLocaleString()}
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-zinc-100 mt-1 pt-2.5 px-3">
                      <button
                        onClick={(e) => {
                          handleSearchSubmit(e);
                          setShowSuggestions(false);
                        }}
                        className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs uppercase tracking-wider text-center transition-colors rounded-xl cursor-pointer shadow-xs"
                      >
                        View All Results
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 px-4 text-center text-sm text-zinc-500 select-none">
                    No products found for &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/profile?tab=orders"
              className="flex items-center gap-1.5 px-3 py-1.5 text-zinc-600 hover:text-emerald-600 hover:bg-zinc-50 transition-colors rounded-xl text-xs font-semibold"
            >
              <LuTruck className="w-4 h-4 text-emerald-500" />
              <span>Track Order</span>
            </Link>

            <Link
              href="/wishlist"
              className="relative flex flex-col items-center justify-center px-3 py-1.5 text-zinc-600 hover:text-emerald-600 hover:bg-zinc-50 transition-colors rounded-xl"
              aria-label="Wishlist"
            >
              <IoHeartOutline className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 font-medium">Wishlist</span>
              {mounted && wishlistItemCount > 0 && (
                <span className="absolute top-0.5 right-1.5 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-emerald-500 text-[9px] font-bold text-white shadow-2xs">
                  {wishlistItemCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative flex flex-col items-center justify-center px-3 py-1.5 text-zinc-600 hover:text-emerald-600 hover:bg-zinc-50 transition-colors rounded-xl"
              aria-label="Shopping Cart"
            >
              <LuShoppingBag className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 font-medium">Cart</span>
              {mounted && cartItemCount > 0 && (
                <span className="absolute top-0.5 right-1.5 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-emerald-500 text-[9px] font-bold text-white shadow-2xs">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <div className="w-px h-6 bg-zinc-200 mx-1" />

            {!mounted || !isAuthenticated ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 hover:bg-emerald-600 text-white text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                aria-label="Login or Sign Up"
              >
                <LuUser className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            ) : (
              <div className="relative" ref={desktopDropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-zinc-100 transition-all cursor-pointer focus:outline-none"
                  aria-label="User profile menu"
                  aria-expanded={dropdownOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs overflow-hidden shrink-0">
                    {user?.avatarUrl || (user as any)?.avatar ? (
                      <img
                        src={user?.avatarUrl || (user as any)?.avatar || undefined}
                        alt={user?.name || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>
                        {user?.name
                          ? user.name
                              .trim()
                              .split(/\s+/)
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()
                          : "U"}
                      </span>
                    )}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-[10px] text-zinc-400 leading-none">Hello,</p>
                    <p className="text-xs font-semibold text-zinc-800 leading-tight truncate max-w-[100px]">
                      {user?.name?.split(" ")[0] || "Account"}
                    </p>
                  </div>
                  <LuChevronDown
                    className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Desktop User Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-zinc-200 p-1.5 z-50 font-sans animate-fadeIn">
                    <div className="px-3.5 py-3 border-b border-zinc-100 mb-1">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                          {user?.avatarUrl || (user as any)?.avatar ? (
                            <img
                              src={user?.avatarUrl || (user as any)?.avatar || undefined}
                              alt={user?.name || "User"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>
                              {user?.name
                                ? user.name
                                    .trim()
                                    .split(/\s+/)
                                    .map((n) => n[0])
                                    .slice(0, 2)
                                    .join("")
                                    .toUpperCase()
                                : "U"}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-zinc-900 truncate">
                            {user?.name || "Account Profile"}
                          </p>
                          <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                            {user?.email || ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 rounded-lg transition-colors cursor-pointer"
                      >
                        <LuUser className="w-4 h-4 text-zinc-400" />
                        My Account
                      </Link>
                      <Link
                        href="/profile?tab=orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 rounded-lg transition-colors cursor-pointer"
                      >
                        <LuShoppingBag className="w-4 h-4 text-zinc-400" />
                        My Orders
                      </Link>
                      <Link
                        href="/profile?tab=track"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 rounded-lg transition-colors cursor-pointer"
                      >
                        <LuTruck className="w-4 h-4 text-zinc-400" />
                        Track Shipment
                      </Link>
                      <Link
                        href="/profile?tab=wishlist"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 rounded-lg transition-colors cursor-pointer"
                      >
                        <IoHeartOutline className="w-4 h-4 text-zinc-400" />
                        Wishlist
                      </Link>
                    </div>

                    {/* Helpline */}
                    <div className="px-3.5 py-2 bg-zinc-50 rounded-lg my-1 border border-zinc-100">
                      <p className="text-[10px] uppercase font-bold text-zinc-400">
                        Helpline
                      </p>
                      <a
                        href="tel:01722301927"
                        className="text-xs font-bold text-emerald-600 hover:underline"
                      >
                        01722301927
                      </a>
                    </div>

                    <div className="my-1 border-t border-zinc-100" />

                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <LuLogOut className="w-4 h-4 text-red-500" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════ Desktop Navigation Bar ═══════════════ */}
      <div className="hidden xl:block bg-[#181D1A] text-white border-t border-white/5">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <Navigation />
        </div>
      </div>

      {/* ═══════════════ Mobile Header ═══════════════ */}
      <div className="xl:hidden bg-white border-b border-zinc-200 shadow-sm">
        {/* Mobile top row: menu + logo + icons */}
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center shrink-0">
            <MobileMenu
              navItems={navItems}
              sylhetiTeaItems={sylhetiTeaItems}
            />
          </div>

          <div className="flex items-center justify-center">
            <Logo variant="dark" size="sm" showTagline={false} />
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Link
              href="/wishlist"
              className="relative p-2 text-zinc-700 hover:text-emerald-600 transition-colors"
              aria-label="Wishlist"
            >
              <IoHeartOutline className="w-5 h-5" />
              {mounted && wishlistItemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex items-center justify-center min-w-[15px] h-3.5 px-0.5 rounded-full bg-emerald-500 text-[9px] text-white font-bold">
                  {wishlistItemCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative p-2 text-zinc-700 hover:text-emerald-600 transition-colors"
              aria-label="Shopping Cart"
            >
              <LuShoppingBag className="w-5 h-5" />
              {mounted && cartItemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex items-center justify-center min-w-[15px] h-3.5 px-0.5 rounded-full bg-emerald-500 text-[9px] text-white font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {!mounted || !isAuthenticated ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="p-2 text-zinc-700 hover:text-emerald-600 transition-colors cursor-pointer"
                aria-label="Sign in"
              >
                <LuUser className="w-5 h-5" />
              </button>
            ) : (
              <div className="relative" ref={mobileDropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs overflow-hidden shrink-0 cursor-pointer"
                  aria-label="User menu"
                >
                  {user?.avatarUrl || (user as any)?.avatar ? (
                    <img
                      src={user?.avatarUrl || (user as any)?.avatar || undefined}
                      alt={user?.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {user?.name
                        ? user.name
                            .trim()
                            .split(/\s+/)
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </span>
                  )}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-zinc-200 p-1.5 z-50 font-sans">
                    <div className="px-3 py-2 border-b border-zinc-100 mb-1">
                      <p className="text-xs font-bold text-zinc-900 truncate">{user?.name}</p>
                      <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg w-full text-left cursor-pointer"
                    >
                      <LuUser className="w-4 h-4 text-zinc-400" /> My Account
                    </Link>
                    <Link
                      href="/profile?tab=orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg w-full text-left cursor-pointer"
                    >
                      <LuShoppingBag className="w-4 h-4 text-zinc-400" /> My Orders
                    </Link>
                    <Link
                      href="/profile?tab=wishlist"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg w-full text-left cursor-pointer"
                    >
                      <IoHeartOutline className="w-4 h-4 text-zinc-400" /> Wishlist
                    </Link>
                    <div className="my-1 border-t border-zinc-100" />
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                    >
                      <LuLogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile search bar — full width below header row */}
        <div className="px-4 pb-2.5" ref={searchContainerRef}>
          <form
            onSubmit={(e) => { handleSearchSubmit(e); setShowSuggestions(false); }}
            className="flex items-center w-full relative"
          >
            <IoSearchOutline className="absolute left-3 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products, brands..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full h-9.5 pl-9 pr-16 rounded-full border border-zinc-200 bg-zinc-50/90 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setShowSuggestions(false);
                }}
                className="absolute right-10 text-zinc-400 hover:text-zinc-600 p-1 cursor-pointer"
                aria-label="Clear search"
              >
                <LuX className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              aria-label="Submit Search"
              className="absolute right-1 top-1 bottom-1 px-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
            >
              <IoSearchOutline className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Mobile Search Suggestions */}
          {showSuggestions && searchQuery.trim() !== "" && (
            <div className="mt-1.5 bg-white text-zinc-800 shadow-xl border border-zinc-200 py-2 z-[999] rounded-lg relative">
              {isSearching ? (
                <div className="flex items-center justify-center py-5 gap-2 text-sm text-zinc-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-500 border-t-transparent" />
                  Searching...
                </div>
              ) : suggestions.length > 0 ? (
                <div className="max-h-[240px] overflow-y-auto">
                  {suggestions.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug ?? product.id}`}
                      onClick={() => {
                        setShowSuggestions(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-50 transition-colors"
                    >
                      <div className="w-9 h-9 shrink-0 relative overflow-hidden bg-zinc-100 rounded border border-zinc-200">
                        <Image
                          src={product.image || "/images/no-image-icon-6.png"}
                          alt={product.name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="text-xs font-medium text-zinc-800 truncate">{product.name}</h4>
                        <span className="text-[10px] text-zinc-400">{product.category}</span>
                      </div>
                      <span className="text-xs font-semibold text-zinc-900 shrink-0">
                        ৳{product.price.toLocaleString()}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-5 text-center text-xs text-zinc-500">
                  No products found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}