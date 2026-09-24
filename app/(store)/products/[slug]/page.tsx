import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetails from "@/components/sections/product-details";
import { fetchShopProductBySlug } from "@/lib/shop-api";
import { resolveImageUrl } from "@/lib/admin-api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PageProps {
  params: Promise<{ slug: string }>;
}

// ─── Metadata ────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchShopProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | NovaMart Marketplace",
    };
  }

  const firstImg = product.media?.[0]?.media?.url
    ? resolveImageUrl(product.media[0].media.url)
    : undefined;

  return {
    title: `${product.metaTitle ?? product.name} | NovaMart Marketplace`,
    description:
      product.metaDescription ??
      product.shortDescription ??
      product.description ??
      `Shop authentic ${product.name} with express delivery and verified buyer protection from NovaMart.`,
    keywords: product.metaKeywords ?? undefined,
    openGraph: {
      title: product.metaTitle ?? product.name,
      description:
        product.metaDescription ??
        product.shortDescription ??
        product.description ??
        undefined,
      images: firstImg ? [{ url: firstImg }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.metaTitle ?? product.name,
      description:
        product.metaDescription ??
        product.shortDescription ??
        undefined,
      images: firstImg ? [firstImg] : undefined,
    },
  };
}

// ─── Skeleton Fallback ────────────────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        <div className="lg:col-span-7 w-full animate-pulse space-y-4">
          <div className="w-full aspect-[4/5] bg-stone-100 rounded-2xl" />
          <div className="flex gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-20 h-20 bg-stone-100 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 w-full animate-pulse space-y-4">
          <div className="h-6 bg-stone-100 w-1/4 rounded-full" />
          <div className="h-10 bg-stone-100 w-4/5 rounded-lg" />
          <div className="h-4 bg-stone-100 w-1/3 rounded" />
          <div className="h-20 bg-stone-100 w-full rounded-2xl mt-4" />
          <div className="h-12 bg-stone-100 w-full rounded-xl mt-4" />
        </div>
      </div>
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await fetchShopProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetails productId={product.id} initialProduct={product} />
      </Suspense>
    </div>
  );
}
