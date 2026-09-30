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
      <div className="w-full flex flex-col gap-3.5 select-none font-sans">
        {/* ── Main Showcase Image Box (Square, Clean, matching screenshot) ── */}
        <div
          ref={imageContainerRef}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setLightboxOpen(true)}
          className="relative w-full aspect-square rounded-2xl bg-white border border-zinc-200/90 overflow-hidden flex items-center justify-center cursor-crosshair group shadow-2xs hover:shadow-md transition-all duration-300"
        >
          {/* Primary Image with Magnifier Zoom */}
          <div className="relative w-full h-full overflow-hidden p-4 sm:p-6 flex items-center justify-center">
            <Image
              src={currentImg}
              alt={`${productName} main view`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-contain p-2 sm:p-4 transition-transform duration-150 ease-out will-change-transform ${
                isZoomed ? 'scale-175' : 'scale-100'
              }`}
              style={{
                transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
              }}
            />
          </div>

          {/* Badges Overlay (Top-Left) */}
          <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 pointer-events-none">
            {discountPercentage && discountPercentage > 0 ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-black tracking-wide uppercase bg-[#EA580C] text-white shadow-xs">
                -{discountPercentage}%
              </span>
            ) : null}

            {badge && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/95 backdrop-blur-md text-zinc-900 border border-zinc-200 shadow-2xs">
                <IoSparklesOutline className="w-3 h-3 text-[#F97316]" />
                <span>{badge}</span>
              </span>
            )}
          </div>

          {/* Fullscreen Zoom Trigger (Top-Right) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(true);
            }}
            className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-zinc-700 hover:text-zinc-950 flex items-center justify-center shadow-xs border border-zinc-200 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer opacity-80 group-hover:opacity-100"
            title="Click to Zoom Fullscreen"
            aria-label="Expand image"
          >
            <IoExpandOutline className="w-4.5 h-4.5" />
          </button>

          {/* Navigation Arrows for Previous / Next */}
          {displayImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-zinc-900 flex items-center justify-center shadow-md border border-zinc-200 backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer opacity-0 group-hover:opacity-100 z-10"
                aria-label="Previous image"
              >
                <IoChevronBackOutline className="w-4.5 h-4.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-zinc-900 flex items-center justify-center shadow-md border border-zinc-200 backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer opacity-0 group-hover:opacity-100 z-10"
                aria-label="Next image"
              >
                <IoChevronForwardOutline className="w-4.5 h-4.5" />
              </button>
            </>
          )}

          {/* Hover Hint Overlay */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium tracking-wide pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
            {isZoomed ? 'Move mouse to zoom' : 'Hover to zoom • Click to expand'}
          </div>
        </div>

        {/* ── Thumbnails Strip (Clean horizontal line under image) ── */}
        {displayImages.length > 1 && (
          <div className="flex items-center justify-start gap-2.5 overflow-x-auto py-1 scrollbar-none">
            {displayImages.map((img, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-white border-2 shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#4F46E5] scale-102 ring-2 ring-[#4F46E5]/20 shadow-xs'
                      : 'border-zinc-200/80 hover:border-zinc-400 opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <Image
                    src={img}
                    alt={`${productName} thumb ${idx + 1}`}
                    fill
                    sizes="72px"
                    className="object-contain p-1"
                  />
                </button>
              );
            })}
          </div>
        )}
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
