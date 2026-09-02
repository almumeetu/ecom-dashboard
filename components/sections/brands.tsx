"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { fetchShopBrands } from "@/lib/shop-api";
import { resolveImageUrl } from "@/lib/admin-api";
import { LuStore, LuBadgeCheck } from "react-icons/lu";
import "swiper/css";

const fallbackBrands = [
  { name: "Zara", slug: "zara", tag: "Fashion & Apparel" },
  { name: "Nike", slug: "nike", tag: "Footwear & Sport" },
  { name: "H&M", slug: "hm", tag: "Casual Styles" },
  { name: "Adidas", slug: "adidas", tag: "Athletics & Shoes" },
  { name: "Levi's", slug: "levis", tag: "Denim & Casual" },
  { name: "Mango", slug: "mango", tag: "Luxury Fashion" },
  { name: "Fresh Mart", slug: "fresh-mart", tag: "Daily Grocery" },
  { name: "Organic Valley", slug: "organic-valley", tag: "Fresh Farm Food" },
];

export default function Brands({
  bgClassName = "bg-[#FAF9F5]",
  variant = "horizontal",
}: {
  bgClassName?: string;
  variant?: "horizontal" | "vertical";
}) {
  const [brandList, setBrandList] = useState<any[]>([]);

  useEffect(() => {
    async function loadBrands() {
      try {
        const fetched = await fetchShopBrands();
        if (fetched && fetched.length > 0) {
          setBrandList(
            fetched.map((b) => ({
              id: b.id,
              name: b.name,
              slug: b.slug,
              logo: b.logoUrl ? resolveImageUrl(b.logoUrl) : null,
              tag: "Verified Vendor",
            }))
          );
        } else {
          setBrandList(fallbackBrands);
        }
      } catch (error) {
        console.error("Failed to load brands:", error);
        setBrandList(fallbackBrands);
      }
    }
    loadBrands();
  }, []);

  const activeBrands = brandList.length > 0 ? brandList : fallbackBrands;

  return (
    <section className={`w-full py-14 sm:py-20 px-4 sm:px-6 md:px-12 lg:py-20 ${bgClassName} border-t border-stone-200/70`}>
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-3">
            <LuBadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Multi-Vendor Certified</span>
          </div>

          <h2 className="text-zinc-900 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight font-['Bembo_Std'] mb-3">
            Featured Brands & Verified Vendors
          </h2>

          <p className="max-w-2xl text-zinc-500 text-sm sm:text-base leading-relaxed">
            Shop authentic products directly from certified multi-vendors, world-renowned fashion labels, organic food producers, and local specialty stores.
          </p>
        </div>

        {/* Brands Carousel */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          slidesPerView={2}
          loop={activeBrands.length >= 3}
          speed={900}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            500: { slidesPerView: 3, spaceBetween: 16 },
            768: { slidesPerView: 4, spaceBetween: 20 },
            1024: { slidesPerView: 5, spaceBetween: 24 },
            1280: { slidesPerView: 6, spaceBetween: 24 },
          }}
          className="brands-swiper py-2"
        >
          {activeBrands.map((brand, index) => (
            <SwiperSlide key={brand.id || index}>
              <Link
                href={`/products?search=${encodeURIComponent(brand.name)}`}
                className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-stone-200/80 hover:border-emerald-500/50 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 group h-32 cursor-pointer"
              >
                {brand.logo ? (
                  <div className="relative h-12 w-full">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-center">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                      <LuStore className="w-4 h-4 text-emerald-700" />
                    </div>
                    <span className="font-semibold text-zinc-800 group-hover:text-emerald-700 text-sm sm:text-[15px] transition-colors line-clamp-1">
                      {brand.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium tracking-wide">
                      {brand.tag || "Official Store"}
                    </span>
                  </div>
                )}
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
