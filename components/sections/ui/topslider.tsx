'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import data from "@/data/top-header.json";
import 'swiper/css';
import 'swiper/css/navigation';

export default function TopSlider({ slogan }: { slogan?: string }) {
  const { slider } = data;
  const slides = slogan ? [slogan, ...slider.slides] : slider.slides;

  return (
    <div className="flex items-center gap-1 sm:gap-2 text-[#94A3B8] w-full justify-center">
      <button 
        className="topslider-prev cursor-pointer hover:opacity-80 transition-opacity shrink-0 hidden sm:flex items-center justify-center text-[#94A3B8] hover:text-white px-0.5 sm:px-1"
        aria-label="Previous slide"
      >
        <IoChevronBack className="w-3 h-3" />
      </button>

      <div className="flex-grow overflow-hidden px-0.5 sm:px-1">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            prevEl: '.topslider-prev',
            nextEl: '.topslider-next',
          }}
          autoplay={{
            delay: slider.autoplayDelay || 3500,
            disableOnInteraction: false,
          }}
          loop={true}
          speed={slider.speed || 600}
          className="topslider-swiper"
        >
          {slides.map((text: string, index: number) => (
            <SwiperSlide key={index}>
              <div className="text-center truncate">
                <span className="text-[#94A3B8] text-[11px] sm:text-xs font-normal tracking-wide cursor-pointer hover:text-white transition-colors">
                  {text}
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <button 
        className="topslider-next cursor-pointer hover:opacity-80 transition-opacity shrink-0 hidden sm:flex items-center justify-center text-[#94A3B8] hover:text-white px-0.5 sm:px-1"
        aria-label="Next slide"
      >
        <IoChevronForward className="w-3 h-3" />
      </button>
    </div>
  );
}

