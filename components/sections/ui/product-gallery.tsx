'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoExpandOutline,
  IoSparklesOutline,
} from 'react-icons/io5';
import ImageLightbox from './image-lightbox';

interface ProductGalleryProps {
  images: string[];
  activeImage?: string;
  productName?: string;
  badge?: string;
  discountPercentage?: number;
}

export default function ProductGallery({
  images,
  activeImage,
  productName = 'Product',
  badge,
  discountPercentage,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Sync index if activeImage changes from parent (e.g., variant color selection)
  useEffect(() => {
    if (activeImage) {
      const idx = images.indexOf(activeImage);
      if (idx !== -1) {
        setActiveIndex(idx);
      }
    }
  }, [activeImage, images]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setMousePos({ x, y });
  };

  const displayImages = images.length > 0 ? images : ['/images/no-image-icon-6.png'];
  const currentImg = displayImages[activeIndex] || displayImages[0];

  return (
    <>
      <div className="w-full flex flex-col-reverse lg:flex-row gap-4 items-start select-none">
        {/* ── Desktop Left Vertical Thumbnails (Hidden on mobile) ─────── */}
        {displayImages.length > 1 && (
          <div className="hidden lg:flex flex-col gap-3 max-h-[560px] overflow-y-auto pr-1 scrollbar-none shrink-0 py-1">
            {displayImages.map((img, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden bg-stone-50 border-2 transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'border-zinc-900 shadow-md shadow-zinc-900/10 scale-102 ring-2 ring-zinc-900/10'
                      : 'border-stone-200/80 hover:border-zinc-400 opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <Image
                    src={img}
                    alt={`${productName} thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-contain p-1.5"
                  />
                  {isActive && (
                    <div className="absolute inset-0 border-2 border-zinc-900 rounded-xl pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Main Showcase Image Box ──────────────────────────────────── */}
        <div className="flex-1 w-full flex flex-col gap-3">
          <div
            ref={imageContainerRef}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            onClick={() => setLightboxOpen(true)}
            className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] max-h-[600px] rounded-2xl bg-stone-50/70 border border-stone-200/90 overflow-hidden flex items-center justify-center cursor-crosshair group shadow-xs hover:shadow-xl transition-all duration-300"
          >
            {/* Primary Image with Magnifier Zoom */}
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={currentImg}
                alt={`${productName} main view`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 55vw, 50vw"
                className={`object-contain p-4 sm:p-6 transition-transform duration-150 ease-out will-change-transform ${
                  isZoomed ? 'scale-175' : 'scale-100'
                }`}
                style={{
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                }}
              />
            </div>

            {/* Badges Overlay (Top-Left) */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
              {discountPercentage && discountPercentage > 0 ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-rose-600 text-white shadow-md shadow-rose-600/30">
                  <span>-{discountPercentage}%</span>
                  <span className="hidden sm:inline">OFF</span>
                </span>
              ) : null}

              {badge && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-white/90 backdrop-blur-sm text-zinc-900 border border-stone-200/80 shadow-xs">
                  <IoSparklesOutline className="w-3.5 h-3.5 text-amber-500" />
                  <span>{badge}</span>
                </span>
              )}
            </div>

            {/* Fullscreen Zoom Trigger (Top-Right) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(true);
              }}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-zinc-700 hover:text-zinc-900 flex items-center justify-center shadow-md border border-stone-200/80 backdrop-blur-xs transition-all hover:scale-105 cursor-pointer opacity-90 group-hover:opacity-100"
              title="Expand Fullscreen (Click to Zoom)"
              aria-label="Expand image"
            >
              <IoExpandOutline className="w-5 h-5" />
            </button>

            {/* Navigation Arrows for Previous / Next */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-zinc-800 flex items-center justify-center shadow-md border border-stone-200/80 transition-all hover:scale-105 cursor-pointer opacity-0 group-hover:opacity-100 z-10"
                  aria-label="Previous image"
                >
                  <IoChevronBackOutline className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-zinc-800 flex items-center justify-center shadow-md border border-stone-200/80 transition-all hover:scale-105 cursor-pointer opacity-0 group-hover:opacity-100 z-10"
                  aria-label="Next image"
                >
                  <IoChevronForwardOutline className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Hover Hint Overlay (Bottom-Center on Desktop) */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium tracking-wide pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
              {isZoomed ? 'Move mouse to inspect' : 'Hover to zoom • Click to expand'}
            </div>

            {/* Mobile Image Counter Badge (Bottom-Right) */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-3 right-3 sm:hidden px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-mono font-medium backdrop-blur-xs z-10">
                {activeIndex + 1} / {displayImages.length}
              </div>
            )}
          </div>

          {/* ── Mobile Horizontal Thumbnails Strip ─────────────────────── */}
          {displayImages.length > 1 && (
            <div className="flex lg:hidden items-center justify-start gap-2.5 overflow-x-auto py-2 px-1 scrollbar-none">
              {displayImages.map((img, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden bg-stone-50 border-2 shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? 'border-zinc-900 scale-102 ring-2 ring-zinc-900/10 shadow-sm'
                        : 'border-stone-200 opacity-65 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumb ${idx + 1}`}
                      fill
                      sizes="64px"
                      className="object-contain p-1"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Fullscreen Lightbox Modal ───────────────────────────────── */}
      <ImageLightbox
        images={displayImages}
        initialIndex={activeIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        productName={productName}
      />
    </>
  );
}
