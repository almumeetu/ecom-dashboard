'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  IoChevronBackOutline,
  IoHomeOutline,
  IoChevronForwardOutline,
  IoShieldCheckmarkOutline,
} from 'react-icons/io5';
import ProductGallery from './ui/product-gallery';
import ProductInfo from './ui/product-info';
import ProductTabs from './ui/product-tabs';
import RelatedCarousel from './ui/related-carousel';
import MobileStickyBuyBar from './ui/mobile-sticky-buy-bar';
import { fetchShopProductById } from '@/lib/shop-api';
import { resolveImageUrl } from '@/lib/admin-api';
import type { Product } from '@/lib/admin-api';
import { useCart } from '@/app/_providers/cart-provider';
import { setBuyNowItem } from '@/lib/buy-now';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export interface ParsedVariant {
  id: string;
  sku: string;
  priceNum: number;
  priceFormatted: string;
  originalPriceFormatted?: string;
  stockQuantity: number;
  isDefault: boolean;
  attributes: Record<string, string>;
  image?: string;
}

export interface MappedProduct {
  id: string;
  name: string;
  slug: string;
  priceFormatted: string;
  originalPriceFormatted: string;
  priceNum: number;
  image: string;
  galleryImages: string[];
  category: string;
  brand: string;
  subtitle: string;
  description: string;
  sku: string;
  unit: string;
  variantId: string;
  variants: ParsedVariant[];
}

function fmt(n: number): string {
  return `৳${n.toLocaleString('en-BD')}`;
}

export function mapProduct(raw: Product): MappedProduct {
  const parsedVariants: ParsedVariant[] = (raw.variants ?? []).map((v) => {
    const priceNum = Number(v.price ?? 0);
    const costNum = v.cost ? Number(v.cost) : 0;
    const variantDiscounted = (v as any).discountedPrice;
    const productDiscounted = raw.discountPrice;
    const discountNum = Number(variantDiscounted ?? productDiscounted ?? 0);
    const showOriginal = discountNum > 0 && discountNum < priceNum;
    const activePrice = showOriginal ? discountNum : priceNum;

    // Parse attributes array into key-value map
    const attributesMap: Record<string, string> = {};
    (v as any).attributes?.forEach((attr: any) => {
      const attrName = attr.attributeValue?.attribute?.name;
      const attrVal = attr.attributeValue?.value;
      if (attrName && attrVal) {
        attributesMap[attrName] = attrVal;
      }
    });

    const variantImages = (v as any).media
      ? ((v as any).media as any[])
          .slice()
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((m) => resolveImageUrl(m.media?.url))
          .filter(Boolean) as string[]
      : [];
    const variantImage = variantImages[0] ?? undefined;

    return {
      id: v.id,
      sku: v.sku,
      priceNum: activePrice,
      priceFormatted: fmt(activePrice),
      originalPriceFormatted: showOriginal
        ? fmt(priceNum)
        : costNum > priceNum
        ? fmt(costNum)
        : '',
      stockQuantity: v.stockQuantity,
      isDefault: v.isDefault,
      attributes: attributesMap,
      image: variantImage,
    };
  });

  const defaultVariant =
    parsedVariants.find((v) => v.isDefault) ?? parsedVariants[0] ?? null;

  const priceNum = defaultVariant?.priceNum ?? 0;
  const priceFormatted = defaultVariant?.priceFormatted ?? fmt(0);
  const originalPriceFormatted = defaultVariant?.originalPriceFormatted ?? '';

  // Gallery: sort by sortOrder, resolve image URLs
  const galleryImages = (raw.media ?? [])
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((m) => resolveImageUrl(m.media.url))
    .filter(Boolean) as string[];

  // Subtitle: prefer shortDescription, fall back to first sentence of description
  const subtitle =
    raw.shortDescription?.trim() ||
    raw.description?.split('.')[0]?.trim() ||
    `Premium ${raw.category?.name || 'marketplace'} piece crafted with authentic materials for maximum style and comfort.`;

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    priceFormatted,
    originalPriceFormatted,
    priceNum,
    image: galleryImages[0] ?? '/images/no-image-icon-6.png',
    galleryImages,
    category: raw.category?.name ?? '',
    brand: raw.brand?.name ?? '',
    subtitle,
    description: raw.description ?? '',
    sku: defaultVariant?.sku ?? (raw as any).sku ?? '',
    unit: raw.unit?.name ?? raw.unit?.abbreviation ?? 'Piece',
    variantId: defaultVariant?.id ?? '',
    variants: parsedVariants,
  };
}

// Loading Skeleton
function Skeleton() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        <div className="lg:col-span-7 w-full space-y-4 animate-pulse">
          <div className="w-full aspect-[4/5] bg-stone-100 rounded-2xl" />
          <div className="flex gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-20 h-20 shrink-0 bg-stone-100 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 w-full flex flex-col gap-5 animate-pulse">
          <div className="h-4 bg-stone-100 w-1/4 rounded" />
          <div className="h-10 bg-stone-100 w-4/5 rounded" />
          <div className="h-4 bg-stone-100 w-full rounded" />
          <div className="h-4 bg-stone-100 w-5/6 rounded" />
          <div className="h-20 bg-stone-100 w-full rounded-2xl" />
          <div className="h-12 bg-stone-100 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

interface ProductDetailsProps {
  productId: string;
  initialProduct?: Product | null;
}

export default function ProductDetails({
  productId,
  initialProduct = null,
}: ProductDetailsProps) {
  const [product, setProduct] = useState<MappedProduct | null>(() =>
    initialProduct ? mapProduct(initialProduct) : null
  );
  const [selectedVariant, setSelectedVariant] = useState<ParsedVariant | null>(() => {
    if (!initialProduct) return null;
    const mapped = mapProduct(initialProduct);
    return mapped.variants.find((v) => v.isDefault) ?? mapped.variants[0] ?? null;
  });
  const [loading, setLoading] = useState(() => !initialProduct);
  const [error, setError] = useState(false);

  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    // If we already have initialProduct matching productId, do not re-fetch
    if (initialProduct && initialProduct.id === productId) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    fetchShopProductById(productId)
      .then((raw) => {
        if (cancelled) return;
        if (!raw) {
          setError(true);
          return;
        }
        const mapped = mapProduct(raw);
        setProduct(mapped);
        const def = mapped.variants.find((v) => v.isDefault) ?? mapped.variants[0] ?? null;
        setSelectedVariant(def);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId, initialProduct]);

  // Combine gallery images with variant images
  const galleryImages = useMemo(() => {
    if (!product) return [];
    const list = [...product.galleryImages];
    product.variants.forEach((v) => {
      if (v.image && !list.includes(v.image)) {
        list.push(v.image);
      }
    });
    return list.length > 0 ? list : ['/images/no-image-icon-6.png'];
  }, [product]);

  if (loading) return <Skeleton />;

  if (error || !product) {
    return (
      <main className="flex-grow bg-white w-full">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 py-32 text-center">
          <p className="text-2xl text-zinc-400 font-medium mb-6">
            Product could not be found.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <IoChevronBackOutline className="text-sm" />
            Back to Catalog
          </Link>
        </div>
      </main>
    );
  }

  const scrollToReviews = () => {
    const el = document.getElementById('product-details-tabs');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMobileAddToCart = () => {
    const finalPrice = selectedVariant ? selectedVariant.priceNum : product.priceNum;
    const attributes = selectedVariant?.attributes ?? {};
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: finalPrice,
      image: selectedVariant?.image ?? product.image,
      description: product.description,
      color: attributes.Color ?? attributes.Colour ?? attributes.color ?? '',
      size: attributes.Size ?? attributes.size ?? '',
      variantId: selectedVariant?.id ?? product.variantId,
      quantity: 1,
      attributes,
      ...attributes,
    });
    toast.success(`Added ${product.name} to your bag!`);
  };

  const handleMobileBuyNow = () => {
    const finalPrice = selectedVariant ? selectedVariant.priceNum : product.priceNum;
    const attributes = selectedVariant?.attributes ?? {};
    setBuyNowItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: finalPrice,
      image: selectedVariant?.image ?? product.image,
      description: product.description,
      color: attributes.Color ?? attributes.Colour ?? attributes.color ?? '',
      size: attributes.Size ?? attributes.size ?? '',
      variantId: selectedVariant?.id ?? product.variantId,
      quantity: 1,
      attributes,
      ...attributes,
    });
    router.push('/checkout');
  };

  const isOutOfStock = (selectedVariant?.stockQuantity ?? 1) <= 0;

  return (
    <main className="flex-grow bg-white w-full">
      {/* ── Minimalist Clean Breadcrumb Strip ───────────────────────── */}
      <div className="w-full border-b border-stone-200/80 bg-stone-50/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-3 flex items-center justify-between text-xs text-zinc-500">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap">
            <Link
              href="/"
              className="flex items-center gap-1 text-zinc-500 hover:text-zinc-950 transition-colors font-medium"
            >
              <IoHomeOutline className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <IoChevronForwardOutline className="w-3 h-3 text-stone-400 shrink-0" />
            <Link
              href="/products"
              className="text-zinc-500 hover:text-zinc-950 transition-colors font-medium"
            >
              Products
            </Link>
            {product.category && (
              <>
                <IoChevronForwardOutline className="w-3 h-3 text-stone-400 shrink-0" />
                <Link
                  href={`/products?category=${encodeURIComponent(product.category)}`}
                  className="text-zinc-500 hover:text-zinc-950 transition-colors font-medium"
                >
                  {product.category}
                </Link>
              </>
            )}
            <IoChevronForwardOutline className="w-3 h-3 text-stone-400 shrink-0" />
            <span className="text-zinc-900 font-semibold truncate max-w-[200px] sm:max-w-md">
              {product.name}
            </span>
          </nav>

          {/* Quick Back Link */}
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            <IoChevronBackOutline className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </Link>
        </div>
      </div>

      {/* ── Main Product Two-Column Layout ──────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Gallery Column (Left - 7 cols) */}
          <div className="lg:col-span-7 w-full lg:sticky lg:top-24">
            <ProductGallery
              images={galleryImages}
              activeImage={selectedVariant?.image}
              productName={product.name}
              badge={product.brand || 'VERIFIED'}
            />
          </div>

          {/* Purchasing Info Column (Right - 5 cols) */}
          <div className="lg:col-span-5 w-full flex flex-col gap-6">
            <ProductInfo
              name={product.name}
              subtitle={product.subtitle}
              price={product.priceFormatted}
              originalPrice={product.originalPriceFormatted}
              productId={product.id}
              productSlug={product.slug}
              category={product.category}
              brand={product.brand}
              sku={product.sku}
              variants={product.variants}
              onVariantChange={setSelectedVariant}
              onReviewsClick={scrollToReviews}
              productData={{
                name: product.name,
                priceNum: product.priceNum,
                image: product.image,
                category: product.category,
                description: product.description,
              }}
            />

            {/* Structured Specifications & Overview Tabs */}
            <ProductTabs
              description={product.description}
              category={product.category}
              brand={product.brand}
              sku={product.sku}
              unit={product.unit}
              attributes={selectedVariant?.attributes || {}}
            />
          </div>
        </div>
      </div>

      {/* ── Recommended & Related Products Carousel ─────────────────── */}
      <RelatedCarousel />

      {/* ── Mobile Sticky Buy Bar ───────────────────────────────────── */}
      <MobileStickyBuyBar
        name={product.name}
        priceFormatted={selectedVariant?.priceFormatted || product.priceFormatted}
        image={selectedVariant?.image || product.image}
        onAddToCart={handleMobileAddToCart}
        onBuyNow={handleMobileBuyNow}
        isOutOfStock={isOutOfStock}
      />
    </main>
  );
}
