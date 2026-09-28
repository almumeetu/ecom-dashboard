"use client";

import { useState } from "react";
import { LuPlay, LuX, LuExternalLink } from "react-icons/lu";
import { FaFacebookF } from "react-icons/fa6";

const FACEBOOK_REELS = [
  {
    id: "reel-1",
    embedUrl: "https://www.facebook.com/reel/1399503357700927",
    thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop&q=80",
    title: "Latest Collection Drop",
    views: "2.1K",
  },
  {
    id: "reel-2",
    embedUrl: "https://www.facebook.com/reel/1399503357700927",
    thumbnail: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80",
    title: "Farm Fresh Delivery",
    views: "1.8K",
  },
  {
    id: "reel-3",
    embedUrl: "https://www.facebook.com/reel/1399503357700927",
    thumbnail: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop&q=80",
    title: "Shoe Collection Unboxing",
    views: "3.2K",
  },
  {
    id: "reel-4",
    embedUrl: "https://www.facebook.com/reel/1399503357700927",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80",
    title: "Accessories Haul",
    views: "1.5K",
  },
  {
    id: "reel-5",
    embedUrl: "https://www.facebook.com/reel/1399503357700927",
    thumbnail: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80",
    title: "Food & Bakery Special",
    views: "2.7K",
  },
];

export default function SocialReels() {
  const [activeReel, setActiveReel] = useState<string | null>(null);

  return (
    <section className="w-full py-16 sm:py-20 bg-zinc-950 overflow-hidden relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.06),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.04),transparent_50%)]" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold uppercase tracking-wider mb-4">
            <FaFacebookF className="w-3 h-3" />
            <span>Follow Us on Facebook</span>
          </div>

          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight font-['Bembo_Std'] mb-3">
            Watch Our Latest Reels
          </h2>

          <p className="max-w-2xl text-zinc-400 text-sm sm:text-base leading-relaxed">
            Stay connected with Trust Point Mart — watch product unboxings, fresh arrivals, behind-the-scenes looks, and customer stories from our Facebook page.
          </p>
        </div>

        {/* Reels Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {FACEBOOK_REELS.map((reel) => (
            <div
              key={reel.id}
              className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-zinc-800 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-1"
              onClick={() => setActiveReel(reel.id)}
            >
              {/* Thumbnail Background */}
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 ease-out"
                style={{ backgroundImage: `url(${reel.thumbnail})` }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300 shadow-xl">
                  <LuPlay className="w-6 h-6 text-white ml-0.5 fill-white" />
                </div>
              </div>

              {/* Reel Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <p className="text-white text-xs sm:text-sm font-semibold line-clamp-2 mb-1">{reel.title}</p>
                <div className="flex items-center gap-2 text-[11px] text-zinc-300">
                  <span className="flex items-center gap-1">
                    <LuPlay className="w-3 h-3 fill-zinc-300" />
                    {reel.views} views
                  </span>
                </div>
              </div>

              {/* Facebook Badge */}
              <div className="absolute top-3 left-3 z-10">
                <div className="w-7 h-7 rounded-full bg-[#1877F2] flex items-center justify-center shadow-lg">
                  <FaFacebookF className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View on Facebook CTA */}
        <div className="pt-8 sm:pt-10 text-center px-4">
          <a
            href="https://www.facebook.com/share/18CfeyLYXR/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto max-w-sm sm:max-w-none inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#1877F2] hover:bg-[#1565D8] text-white font-semibold text-xs sm:text-sm tracking-wide uppercase transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/20 active:scale-95 cursor-pointer"
          >
            <FaFacebookF className="w-4 h-4" />
            <span>Follow Us on Facebook</span>
            <LuExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Video Modal */}
      {activeReel && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveReel(null)}
        >
          <div
            className="relative w-full max-w-sm bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveReel(null)}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
            >
              <LuX className="w-5 h-5" />
            </button>

            <div className="aspect-[9/16] w-full">
              <iframe
                src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
                  FACEBOOK_REELS.find((r) => r.id === activeReel)?.embedUrl || ""
                )}&show_text=false&width=350`}
                width="100%"
                height="100%"
                style={{ border: "none", overflow: "hidden" }}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                title="Facebook Reel"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
