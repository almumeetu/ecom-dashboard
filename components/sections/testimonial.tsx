"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";
import { IoStar } from "react-icons/io5";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Testimonial() {
  const testimonials = [
    {
      id: 1,
      author: "Ayesha Karim",
      role: "Verified Grocery & Food Customer",
      rating: 5,
      text: "The fresh organic groceries and food delivery was remarkably fast! Everything arrived crisp, perfectly packaged, and fresh from the local farm. My go-to daily store now.",
    },
    {
      id: 2,
      author: "Tanvir Hasan",
      role: "Verified Fashion Buyer",
      rating: 5,
      text: "Ordered from Zara and Nike through this marketplace — 100% authentic items, rapid delivery, and seamless checkout. Extremely pleased with the product quality and fit.",
    },
    {
      id: 3,
      author: "Farhana Mahbub",
      role: "Lifestyle & Home Shopper",
      rating: 5,
      text: "Love having all categories in one place. Whether it's daily kitchen essentials, footwear, or designer accessories, the experience and customer care are unmatched.",
    },
  ];

  return (
    <section 
      className="relative bg-zinc-900 py-16 lg:py-24 overflow-hidden"
    >
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Customer Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight font-['Bembo_Std'] text-zinc-900 mt-3">
              What Our Community Is Saying
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="relative">
            <button className="testimonial-prev absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-md border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-emerald-600 hover:scale-105 transition-all cursor-pointer">
              <HiOutlineChevronLeft className="w-5 h-5" />
            </button>
            <button className="testimonial-next absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-md border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-emerald-600 hover:scale-105 transition-all cursor-pointer">
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
                delay: 6000,
                disableOnInteraction: false,
              }}
              speed={800}
              loop
              className="max-w-2xl mx-auto py-2"
            >
              {testimonials.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="text-center px-4 sm:px-8">
                    <div className="flex justify-center gap-1 text-amber-400 mb-4">
                      {[...Array(item.rating)].map((_, i) => (
                        <IoStar key={i} className="w-5 h-5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-base sm:text-xl lg:text-2xl leading-relaxed text-zinc-700 font-normal italic mb-6">
                      “{item.text}”
                    </p>
                    <h4 className="font-semibold text-zinc-900 text-base">
                      {item.author}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {item.role}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Pagination Dots */}
          <div className="testimonial-pagination flex justify-center gap-1 mt-6"></div>
        </div>
      </div>
    </section>
  );
}
