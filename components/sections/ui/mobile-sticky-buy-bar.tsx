'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { IoBagCheckOutline, IoFlashOutline } from 'react-icons/io5';

interface MobileStickyBuyBarProps {
  name: string;
  priceFormatted: string;
  image: string;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isOutOfStock?: boolean;
}

export default function MobileStickyBuyBar({
  name,
  priceFormatted,
  image,
  onAddToCart,
  onBuyNow,
  isOutOfStock = false,
}: MobileStickyBuyBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar once scrolled down 350px
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        {/* Mini Product Details */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-stone-50 border border-stone-200 shrink-0">
            <Image
              src={image || '/images/no-image-icon-6.png'}
              alt={name}
              fill
              sizes="44px"
              className="object-contain p-1"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-zinc-900 truncate leading-tight">
              {name}
            </h4>
            <span className="text-xs font-extrabold text-zinc-950">
              {priceFormatted}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onAddToCart}
            disabled={isOutOfStock}
            className="h-10 px-3.5 bg-white border border-zinc-900 text-zinc-900 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-40"
            aria-label="Add to Bag"
          >
            <IoBagCheckOutline className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>

          <button
            type="button"
            onClick={onBuyNow}
            disabled={isOutOfStock}
            className="h-10 px-4 bg-zinc-950 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-zinc-950/20 active:scale-95 disabled:opacity-40"
            aria-label="Buy Now"
          >
            <IoFlashOutline className="w-3.5 h-3.5 text-amber-400" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
