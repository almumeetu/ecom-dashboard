import Image from "next/image";
import Link from "next/link";
import { LuArrowRight, LuBadgePercent, LuCheck, LuShoppingBag, LuSparkles } from "react-icons/lu";
import type { ShopProduct } from "@/lib/shop-api";

type StorefrontCtaProps = {
  featuredProduct?: ShopProduct;
};

export default function StorefrontCta({ featuredProduct }: StorefrontCtaProps) {
  const hasDiscount = Boolean(
    featuredProduct?.originalPrice && featuredProduct.originalPrice > featuredProduct.price,
  );
  const discountPercent = hasDiscount && featuredProduct
    ? Math.round(((featuredProduct.originalPrice! - featuredProduct.price) / featuredProduct.originalPrice!) * 100)
    : 0;
  const productHref = featuredProduct?.slug
    ? `/products/${encodeURIComponent(featuredProduct.slug)}`
    : "/products";

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-10 lg:px-16" aria-labelledby="storefront-cta-title">
      <div className="relative isolate overflow-hidden rounded-3xl border border-store-border bg-gradient-to-br from-store-surface via-white to-store-orange-soft shadow-sm sm:rounded-[30px]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-orange-200/25 blur-3xl" />
        <div className="relative grid items-center gap-8 p-5 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:p-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-store-primary/15 bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-store-primary shadow-sm">
              {hasDiscount ? <LuBadgePercent className="h-4 w-4 text-orange-500" aria-hidden="true" /> : <LuSparkles className="h-4 w-4 text-orange-500" aria-hidden="true" />}
              {hasDiscount ? "A deal picked for you" : "A NovaMart pick"}
            </span>

            <h2 id="storefront-cta-title" className="mt-4 max-w-xl text-2xl font-semibold leading-tight tracking-tight text-store-deep sm:text-3xl lg:text-[2.5rem]">
              Find your next <span className="text-store-primary">everyday favourite.</span>
            </h2>

            <div className="mt-6 flex flex-col gap-3 min-[420px]:flex-row">
              <Link
                href={productHref}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-store-primary px-5 py-3 text-sm font-semibold text-white shadow-md shadow-store-deep/15 transition hover:bg-store-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-store-primary"
              >
                {featuredProduct ? "Shop this pick" : "Start shopping"}
                <LuArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/products"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-store-primary/25 bg-white/80 px-5 py-3 text-sm font-semibold text-store-deep transition hover:border-store-primary hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-store-primary"
              >
                Explore all products
              </Link>
            </div>

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-store-accent">
              {["Handpicked finds", "Secure checkout", "Delivery across Bangladesh"].map((benefit) => (
                <li key={benefit} className="inline-flex items-center gap-1.5">
                  <LuCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {featuredProduct ? (
            <Link
              href={productHref}
              aria-label={`Shop ${featuredProduct.name}`}
              className="group relative mx-auto flex w-full max-w-[500px] items-center gap-4 rounded-2xl border border-white bg-white/90 p-3 shadow-lg shadow-store-deep/10 transition hover:-translate-y-0.5 hover:shadow-xl sm:gap-5 sm:p-4"
            >
              <div className="relative aspect-square w-[112px] shrink-0 overflow-hidden rounded-xl bg-store-surface sm:w-36">
                <Image
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  fill
                  sizes="(max-width: 640px) 112px, 144px"
                  className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
                {hasDiscount && (
                  <span className="absolute left-2 top-2 rounded-full bg-orange-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1 py-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-store-accent">
                  {featuredProduct.category || "Featured product"}
                </p>
                <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-store-ink sm:text-base">
                  {featuredProduct.name}
                </h3>
                <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-lg font-bold text-store-deep sm:text-xl">
                    ৳ {featuredProduct.price.toLocaleString()}
                  </span>
                  {hasDiscount && featuredProduct.originalPrice && (
                    <span className="text-xs text-zinc-400 line-through">
                      ৳ {featuredProduct.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-store-primary">
                  View product <LuArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ) : (
            <Link
              href="/products"
              className="group relative mx-auto flex min-h-[188px] w-full max-w-[500px] items-center justify-center overflow-hidden rounded-2xl border border-white bg-white/80 p-6 text-center shadow-lg shadow-store-deep/10 transition hover:-translate-y-0.5 sm:min-h-[216px]"
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
