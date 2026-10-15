'use client';

import { useState, useEffect } from 'react';
import { IoBagCheckOutline, IoFlashOutline } from 'react-icons/io5';

interface MobileStickyBuyBarProps {
  name: string;
  priceFormatted: string;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isOutOfStock?: boolean;
}

export default function MobileStickyBuyBar({
  name,
  priceFormatted,
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

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div data-mobile-purchase-bar aria-label={`Buy ${name}`} className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#DED7CC] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 max-w-xl mx-auto">
        <span className="max-w-28 break-words text-sm font-semibold text-store-price sm:text-base">
          {priceFormatted}
        </span>

        {/* Buttons */}
        <div className="grid min-w-0 grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onAddToCart}
            disabled={isOutOfStock}
            className="min-w-0 h-11 px-2 bg-store-primary hover:bg-store-accent text-white font-medium text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40"
            aria-label="Add to Bag"
          >
            <IoBagCheckOutline className="w-4 h-4" />
            <span>Add</span>
          </button>

          <button
            type="button"
            onClick={onBuyNow}
            disabled={isOutOfStock}
            className="min-w-0 h-11 px-2 bg-store-deep hover:bg-store-hover text-white font-medium text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40"
            aria-label="Buy Now"
          >
            <IoFlashOutline className="w-3.5 h-3.5" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
