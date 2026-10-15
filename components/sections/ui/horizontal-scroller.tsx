"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface HorizontalScrollerProps {
  children: ReactNode;
  label: string;
  heading?: ReactNode;
  action?: ReactNode;
  controlsPosition?: "header" | "footer";
  trackClassName?: string;
}

export default function HorizontalScroller({
  children,
  label,
  heading,
  action,
  controlsPosition = "header",
  trackClassName = "",
}: HorizontalScrollerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const trackId = useId();
  const [scrollState, setScrollState] = useState({ previous: false, next: false });
  const hasOverflow = scrollState.previous || scrollState.next;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateScrollState = () => {
      const previous = track.scrollLeft > 2;
      const next = track.scrollWidth - track.clientWidth - track.scrollLeft > 2;
      setScrollState((current) =>
        current.previous === previous && current.next === next
          ? current
          : { previous, next }
      );
    };

    updateScrollState();
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(track);
    track.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", updateScrollState);
    };
  }, [children]);

  const scroll = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * Math.max(track.clientWidth * 0.85, 200),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  const controls = hasOverflow ? (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        aria-label={`Scroll ${label} left`}
        aria-controls={trackId}
        disabled={!scrollState.previous}
        onClick={() => scroll(-1)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-store-border bg-white text-store-accent transition-colors hover:border-store-primary hover:text-store-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-store-primary disabled:cursor-default disabled:opacity-30 sm:h-10 sm:w-10"
      >
        <LuChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label={`Scroll ${label} right`}
        aria-controls={trackId}
        disabled={!scrollState.next}
        onClick={() => scroll(1)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-store-border bg-white text-store-accent transition-colors hover:border-store-primary hover:text-store-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-store-primary disabled:cursor-default disabled:opacity-30 sm:h-10 sm:w-10"
      >
        <LuChevronRight className="h-4 w-4" />
      </button>
    </div>
  ) : null;

  return (
    <div className="min-w-0">
      {(heading || action || (controlsPosition === "header" && controls)) && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
          {heading}
          <div className="ml-auto flex items-center gap-3 sm:gap-4">
            {action}
            {controlsPosition === "header" && controls}
          </div>
        </div>
      )}
      <div
        ref={trackRef}
        id={trackId}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={`storefront-scroll-track flex min-w-0 snap-x snap-proximity gap-4 overflow-x-auto overscroll-x-contain pb-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-store-primary sm:gap-5 ${trackClassName}`}
      >
        {children}
      </div>
      {controlsPosition === "footer" && controls && (
        <div className="mt-3 flex justify-end">{controls}</div>
      )}
    </div>
  );
}
