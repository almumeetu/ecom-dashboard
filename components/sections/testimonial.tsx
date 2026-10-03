"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";
import { IoStar } from "react-icons/io5";
import { LuQuote, LuBadgeCheck, LuShieldCheck } from "react-icons/lu";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Testimonial() {
  const testimonials = [
    {
      id: 1,
      author: "Ayesha Karim",
      role: "Verified Grocery & Food Customer",
      location: "Dhaka, Bangladesh",
      rating: 5,
      text: "The fresh organic groceries and food delivery was remarkably fast! Everything arrived crisp, perfectly packaged, and fresh from the local farm. My go-to daily store now.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      purchaseCount: "47 orders",
    },
    {
      id: 2,
      author: "Tanvir Hasan",
      role: "Verified Fashion Buyer",
      location: "Chittagong, Bangladesh",
      rating: 5,
      text: "Ordered from Zara and Nike through this marketplace — 100% authentic items, rapid delivery, and seamless checkout. Extremely pleased with the product quality and fit.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      purchaseCount: "32 orders",
    },
    {
      id: 3,
      author: "Farhana Mahbub",
      role: "Lifestyle & Home Shopper",
      location: "Rajshahi, Bangladesh",
      rating: 5,
      text: "Love having all categories in one place. Whether it's daily kitchen essentials, footwear, or designer accessories, the experience and customer care are unmatched.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80",
      purchaseCount: "28 orders",
    },
    {
      id: 4,
      author: "Rafiqul Islam",
      role: "Verified Electronics Buyer",
      location: "Sylhet, Bangladesh",
      rating: 5,
      text: "Best online marketplace in Bangladesh. I ordered tech accessories and received them within 2 days. The packaging was premium and the product was exactly as described.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
      purchaseCount: "19 orders",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Happy Customers" },
    { value: "4.9/5", label: "Average Rating" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "64", label: "Districts Served" },
  ];

  return (
    <section className="relative w-full py-16 lg:py-24 bg-gradient-to-b from-stone-50 to-white overflow-hidden border-t border-stone-200/70">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-50/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-50/40 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-3">
            <IoStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Customer Reviews</span>
          </div>

          <h2 className="text-zinc-900 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            Trusted by Thousands
          </h2>

          <p className="max-w-2xl text-zinc-500 text-sm sm:text-base leading-relaxed">
            Real stories from verified customers across Bangladesh who trust us for quality products, fast delivery, and exceptional service.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-300"
            >
              <span className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">{stat.value}</span>
              <span className="text-xs text-zinc-500 mt-1 font-medium">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button className="testimonial-prev absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-emerald-600 hover:border-emerald-300 hover:scale-110 transition-all cursor-pointer hidden sm:flex">
            <HiOutlineChevronLeft className="w-5 h-5" />
          </button>
          <button className="testimonial-next absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-emerald-600 hover:border-emerald-300 hover:scale-110 transition-all cursor-pointer hidden sm:flex">
            <HiOutlineChevronRight className="w-5 h-5" />
          </button>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation={{
              prevEl: ".testimonial-prev",
              nextEl: ".testimonial-next",
            }}
            pagination={{
              clickable: true,
              el: ".testimonial-pagination",
              bulletClass:
                "inline-block w-2 h-2 bg-zinc-300 rounded-full cursor-pointer transition-all duration-300 mx-1",
              bulletActiveClass: "!bg-emerald-600 !w-6 !rounded-full",
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            speed={700}
            loop
            className="py-2"
          >
            {testimonials.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="relative bg-white rounded-3xl p-7 sm:p-8 border border-stone-200/80 shadow-xs hover:shadow-lg transition-all duration-500 h-full flex flex-col justify-between group">
                  {/* Quote icon */}
                  <div className="absolute top-6 right-6 opacity-[0.06] pointer-events-none">
                    <LuQuote className="w-16 h-16 text-zinc-900" />
                  </div>

                  <div>
                    {/* Stars */}
                    <div className="flex items-center gap-0.5 text-amber-400 mb-4">
                      {[...Array(item.rating)].map((_, i) => (
                        <IoStar key={i} className="w-4.5 h-4.5 fill-amber-400" />
                      ))}
                    </div>

                    {/* Review text */}
                    <p className="text-zinc-700 text-sm sm:text-[15px] leading-relaxed font-normal mb-6">
                      &ldquo;{item.text}&rdquo;
                    </p>
                  </div>

                  {/* Author info */}
                  <div className="flex items-center gap-3.5 pt-5 border-t border-stone-100">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-100 shrink-0 border-2 border-white shadow-md ring-2 ring-emerald-100">
                      <Image
                        src={item.avatar}
                        alt={item.author}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-semibold text-zinc-900 text-sm truncate">{item.author}</h4>
                        <LuBadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{item.role}</p>
                      <p className="text-[11px] text-emerald-600 font-medium">{item.purchaseCount} • {item.location}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Pagination Dots */}
        <div className="testimonial-pagination flex justify-center gap-1 mt-8"></div>

        {/* Trust badge */}
        <div className="flex items-center justify-center gap-2 mt-8 text-xs text-zinc-400">
          <LuShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>All reviews are from verified purchasers on NovaMart</span>
        </div>
      </div>
    </section>
  );
}
