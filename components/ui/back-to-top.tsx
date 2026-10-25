"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FiArrowUp } from "react-icons/fi";

export default function BackToTop() {
  const pathname = usePathname();
  const isPurchasePage = ["/cart", "/checkout", "/confirmation"].includes(pathname) || pathname.startsWith("/products/");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400);
    };

    toggleVisibility();
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-24 right-7 z-40 ${isPurchasePage ? "hidden lg:flex" : "flex"} h-11 w-11 items-center justify-center rounded-full bg-zinc-900 text-white border border-zinc-700/60 shadow-lg transition-all duration-300 hover:bg-store-accent focus:outline-none focus:ring-2 focus:ring-store-primary cursor-pointer ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
      }`}
      aria-label="Back to top"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
    >
      <FiArrowUp className="h-5 w-5 stroke-[2]" />
    </button>
  );
}
