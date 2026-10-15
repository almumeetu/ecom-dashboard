'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoExpandOutline,
} from 'react-icons/io5';
import ImageLightbox from './image-lightbox';

interface ProductGalleryProps {
  images: string[];
  activeImage?: string;
  productName?: string;
}

export default function ProductGallery({
  images,
  activeImage,
  productName = 'Product',
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
    setActiveIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
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
      <div className="min-w-0 w-full flex flex-col gap-4 select-none font-sans">
        {/* ── Main Showcase Image Box (Square, Clean, matching screenshot) ── */}
        <div
          ref={imageContainerRef}
          onMouseEnter={() => {
            if (window.matchMedia('(hover: hover)').matches) setIsZoomed(true);
          }}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setLightboxOpen(true)}
          className="relative w-full aspect-square sm:aspect-[4/3] lg:aspect-square max-h-[560px] rounded-xl bg-white border border-[#DED7CC] overflow-hidden flex items-center justify-center cursor-zoom-in group"
        >
          {/* Primary Image with Magnifier Zoom */}
          <div className="relative w-full h-full overflow-hidden p-4 sm:p-6 flex items-center justify-center">
            <Image
              src={currentImg}
              alt={`${productName} main view`}
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 50vw"
              className={`object-contain p-6 sm:p-8 lg:p-10 transition-transform duration-150 ease-out will-change-transform ${
                isZoomed ? 'scale-175' : 'scale-100'
              }`}
              style={{
                transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
              }}
            />
          </div>

          {/* Fullscreen Zoom Trigger (Top-Right) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(true);
            }}
            className="absolute top-3 right-3 z-10 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-zinc-700 flex items-center justify-center border border-zinc-200 transition-colors cursor-pointer"
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
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-zinc-700 flex items-center justify-center border border-zinc-200 transition-opacity cursor-pointer sm:opacity-0 group-hover:opacity-100 focus-visible:opacity-100 z-10"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-zinc-700 flex items-center justify-center border border-zinc-200 transition-opacity cursor-pointer sm:opacity-0 group-hover:opacity-100 focus-visible:opacity-100 z-10"
                aria-label="Next image"
              >
                <IoChevronForwardOutline className="w-4.5 h-4.5" />
              </button>
            </>
          )}

        </div>

        {/* ── Thumbnails Strip (Clean horizontal line under image) ── */}
        {displayImages.length > 1 && (
          <div className="storefront-scroll-track flex items-center gap-3 overflow-x-auto px-1 pb-3 pt-1">
            {displayImages.map((img, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-white border-2 shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'border-store-primary ring-2 ring-store-primary/15'
                      : 'border-zinc-200/80 hover:border-zinc-400 opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                  aria-pressed={isActive}
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
