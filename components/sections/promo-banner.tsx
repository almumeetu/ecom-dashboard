import Image from 'next/image';
import Link from 'next/link';
import { LuArrowRight } from 'react-icons/lu';

export default function PromoBanner() {
  return (
    <section className="w-full py-12 sm:py-16 bg-white border-t border-stone-200/70">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner 1: Groceries & Fresh Food */}
          <div className="relative h-[280px] sm:h-[320px] rounded-3xl overflow-hidden shadow-sm group">
            <Image
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80"
              alt="Fresh Groceries & Farm Food"
              fill
              className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/60 to-transparent" />
            
            <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-between text-white z-10">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-500 text-white w-fit">
                DAILY FRESH & ORGANIC
              </span>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold font-['Bembo_Std'] leading-tight mb-2">
                  Farm Fresh Groceries & Pantry
                </h3>
                <p className="text-zinc-200 text-xs sm:text-sm max-w-xs mb-5 leading-relaxed">
                  Crisp organic fruits, garden-fresh vegetables, dairy and everyday food staples delivered right to your kitchen.
                </p>

                <Link
                  href="/products?search=grocery"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-emerald-900 hover:bg-emerald-100 font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md"
                >
                  <span>Shop Groceries</span>
                  <LuArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Banner 2: Fashion & Footwear */}
          <div className="relative h-[280px] sm:h-[320px] rounded-3xl overflow-hidden shadow-sm group">
            <Image
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&auto=format&fit=crop&q=80"
              alt="Trending Fashion & Footwear"
              fill
              className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/60 to-transparent" />

            <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-between text-white z-10">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-rose-600 text-white w-fit">
                TRENDING FASHION
              </span>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold font-['Bembo_Std'] leading-tight mb-2">
                  New Season Designer Drops
                </h3>
                <p className="text-zinc-200 text-xs sm:text-sm max-w-xs mb-5 leading-relaxed">
                  Discover contemporary styles, classic denims, footwear and accessories from top verified global labels.
                </p>

                <Link
                  href="/products?category=Fashion"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md"
                >
                  <span>Explore Styles</span>
                  <LuArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
