import Image from "next/image";
import Link from "next/link";

export default function Collection() {
  return (
    <section className="w-full py-0">
      <div className="collection-wrapper">
        <div className="container mx-auto">
          <div className="relative w-full min-h-212.5 overflow-hidden shadow-xl">
            <Image
              src="/images/footer/footerright.png"
              alt="Tea Collections"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/50"></div>
            <div className="absolute inset-0 flex flex-col py-8">
              <div className="flex justify-center">
                <h3 className="font-bembo text-white text-2xl uppercase tracking-widest">
                  THE COLLECTIONS
                </h3>
              </div>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 py-3">
                <Link
                  href="/products?category=Fresh+Groceries"
                  className="bg-brand-primary text-white text-center py-4 px-6 font-bembo text-base uppercase tracking-wide hover:bg-opacity-90 transition-all"
                >
                  FRESH GROCERIES
                </Link>
                <div className="w-16 h-16 flex items-center justify-center relative">
                  <Image
                    src="/images/footer/footerrightlogo.png"
                    alt="Trust Point Mart Logo"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <Link
                  href="/products?category=Fashion"
                  className="bg-white text-text-primary text-center py-4 px-6 font-bembo text-base uppercase tracking-wide hover:bg-brand-3 hover:text-white transition-all"
                >
                  FASHION & LIFESTYLE
                </Link>
              </div>
              <div className="flex justify-center px-6">
                <p className="text-white text-center text-sm font-gotham leading-relaxed max-w-3xl">
                  Curated multi-category marketplace featuring fresh farm harvests, designer apparels, footwear, smart tech, and daily essentials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}