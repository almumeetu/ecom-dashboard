import Image from "next/image";
import Link from "next/link";
import { LuArrowRight, LuShoppingBag } from "react-icons/lu";
import type { ShopProduct } from "@/lib/shop-api";

type StorefrontCtaProps = {
  featuredProduct?: ShopProduct;
};

export default function StorefrontCta({ featuredProduct }: StorefrontCtaProps) {
  const productHref = featuredProduct?.slug
    ? `/products/${encodeURIComponent(featuredProduct.slug)}`
    : "/products";

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-10 lg:px-16" aria-labelledby="storefront-cta-title">
      <div className="relative isolate overflow-hidden rounded-3xl bg-store-deep shadow-[0_18px_45px_rgba(20,38,56,0.12)] sm:rounded-[30px]">
        <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-28 h-72 w-72 rounded-full bg-store-primary/40 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-1 w-20 bg-store-orange sm:w-28" />
        <div className="relative grid items-center gap-8 p-6 sm:gap-10 sm:p-9 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:p-12">
          <div className="max-w-lg">
            <h2 id="storefront-cta-title" className="max-w-md text-3xl font-semibold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
              Find your next <span className="text-[#f4c9a9]">everyday favourite.</span>
            </h2>

            <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8">
              <Link
                href={productHref}
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-store-deep transition hover:bg-store-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {featuredProduct ? "Shop this pick" : "Start shopping"}
                <LuArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              {featuredProduct && (
                <Link
                  href="/products"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Explore all products
                </Link>
              )}
            </div>
          </div>

          {featuredProduct ? (
            <Link
              href={productHref}
              className="group grid w-full grid-cols-[100px_minmax(0,1fr)] items-stretch gap-4 rounded-2xl bg-white p-3 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-6 sm:p-4"
            >
              <div className="relative min-h-[140px] overflow-hidden rounded-xl bg-store-surface sm:min-h-[180px]">
                <Image
                  src={featuredProduct.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100px, 150px"
                  className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              </div>

              <div className="flex min-w-0 flex-col items-start justify-center py-1 pr-1 sm:py-3 sm:pr-3">
                <h3 className="line-clamp-3 text-sm font-semibold leading-snug text-store-ink sm:text-lg">
                  {featuredProduct.name}
                </h3>
                <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 sm:mt-4">
                  <span className="text-lg font-semibold text-store-deep sm:text-2xl">
                    ৳ {featuredProduct.price.toLocaleString()}
                  </span>
                </div>
                <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-store-primary sm:mt-4 sm:text-sm">
                  View product <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ) : (
            <Link
              href="/products"
              className="group relative flex min-h-[170px] w-full items-center justify-center overflow-hidden rounded-2xl bg-white p-6 text-center shadow-lg shadow-black/10 transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:min-h-[212px]"
            >
              <div aria-hidden="true" className="absolute h-48 w-48 rounded-full bg-store-surface" />
              <div className="relative">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-store-primary text-white shadow-md">
                  <LuShoppingBag className="h-7 w-7" aria-hidden="true" />
                </span>
                <p className="mt-4 text-sm font-semibold text-store-ink">Explore beauty, tech, home & more</p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-store-primary">
                  Browse the store <LuArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
