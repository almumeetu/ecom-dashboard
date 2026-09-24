'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  IoCloseOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoAddOutline,
  IoRemoveOutline,
  IoRefreshOutline,
} from 'react-icons/io5';

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

export default function ImageLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  productName = 'Product Image',
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [images.length]);

  const zoomIn = () => setScale((s) => Math.min(s + 0.5, 3.5));
  const zoomOut = () => {
    setScale((s) => {
      const next = Math.max(s - 0.5, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };
  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-') zoomOut();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Dragging support when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  if (!isOpen || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md select-none animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/10 z-20">
        <div className="flex items-center gap-3">
          <span className="text-white/80 font-medium text-sm hidden sm:inline truncate max-w-sm">
            {productName}
          </span>
          <span className="text-white/40 text-xs hidden sm:inline">•</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white font-mono">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        {/* Zoom Controls & Close */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={zoomIn}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Zoom in (+)"
            aria-label="Zoom in"
          >
            <IoAddOutline className="w-5 h-5" />
          </button>
          <button
            onClick={zoomOut}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Zoom out (-)"
            aria-label="Zoom out"
          >
            <IoRemoveOutline className="w-5 h-5" />
          </button>
          <button
            onClick={resetZoom}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Reset zoom"
            aria-label="Reset zoom"
          >
            <IoRefreshOutline className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-white/20 mx-1" />
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close (Esc)"
            aria-label="Close viewer"
          >
            <IoCloseOutline className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image Display */}
      <div
        className="flex-1 relative overflow-hidden flex items-center justify-center cursor-default"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Navigation Arrow Left */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all z-20 backdrop-blur-sm cursor-pointer"
            aria-label="Previous image"
          >
            <IoChevronBackOutline className="w-6 h-6" />
          </button>
        )}

        {/* The Image */}
        <div
          className="relative w-full h-full max-w-5xl max-h-[75vh] flex items-center justify-center p-4 transition-transform duration-100"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
          }}
        >
          <Image
            src={images[currentIndex]}
            alt={`${productName} image ${currentIndex + 1}`}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-contain pointer-events-none select-none"
            priority
          />
        </div>

        {/* Navigation Arrow Right */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all z-20 backdrop-blur-sm cursor-pointer"
            aria-label="Next image"
          >
            <IoChevronForwardOutline className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div className="py-4 px-4 border-t border-white/10 z-20 overflow-x-auto flex justify-center items-center gap-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setScale(1);
                setPosition({ x: 0, y: 0 });
              }}
              className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'ring-2 ring-emerald-500 scale-105 shadow-md shadow-emerald-500/20'
                  : 'opacity-50 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="56px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
