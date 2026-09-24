'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import ProductCard from './product-card';
import DiscoverMoreButton from './button';
import { fetchShopProducts, ShopProduct } from '@/lib/shop-api';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

import 'swiper/css';
import 'swiper/css/navigation';

export default function RelatedCarousel() {
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(2);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetchShopProducts({ limit: 12 });
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch related products', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full bg-[#FAF9F5] py-16 sm:py-20 border-t border-stone-200/80 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center mb-10 space-y-2">
            <div className="w-48 h-8 bg-stone-200 animate-pulse rounded-lg" />
            <div className="w-64 h-4 bg-stone-200 animate-pulse rounded-lg" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-stone-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  // Duplicate to guarantee smooth infinite loop
  const displayProducts = [
    ...products,
    ...products.map((p) => ({ ...p, id: p.id + '-dup' })),
  ];

  return (
    <section className="w-full bg-[#FAF9F5] py-16 sm:py-20 border-t border-stone-200/80 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200/80 text-stone-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              <span>Handpicked For You</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 font-sans">
              You May Also Like
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Popular trending items and verified multi-vendor recommendations
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              className="related-prev w-11 h-11 rounded-full bg-white border border-stone-200 text-zinc-800 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all flex items-center justify-center shadow-xs cursor-pointer"
              aria-label="Previous products"
            >
              <IoChevronBackOutline className="w-5 h-5" />
            </button>
            <button
              className="related-next w-11 h-11 rounded-full bg-white border border-stone-200 text-zinc-800 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all flex items-center justify-center shadow-xs cursor-pointer"
              aria-label="Next products"
            >
              <IoChevronForwardOutline className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Swiper Carousel */}
      <div className="w-full px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto">
        <Swiper
          modules={[Navigation, Autoplay]}
          onSwiper={setSwiperRef}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          navigation={{
            prevEl: '.related-prev',
            nextEl: '.related-next',
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          spaceBetween={20}
          slidesPerView={1.2}
          centeredSlides={false}
          loop={true}
          breakpoints={{
            480: { slidesPerView: 2, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
          className="related-swiper pb-4 w-full"
        >
          {displayProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard
                id={product.id.replace('-dup', '')}
                name={product.name}
                price={`৳${product.price.toLocaleString()}`}
                originalPrice={product.originalPrice ? `৳${product.originalPrice.toLocaleString()}` : ''}
                image={product.image}
                slug={product.slug}
                category={product.category}
                brand={product.team}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 text-center mt-10">
        <DiscoverMoreButton href="/products" label="DISCOVER ALL PRODUCTS" variant="primary" />
      </div>
    </section>
  );
}
