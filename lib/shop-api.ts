import { type PaginatedProducts, type Product as AdminProduct, type Campaign, resolveImageUrl } from "./admin-api";

const API_BASE_URL =
  typeof window === "undefined"
    ? (process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5010/api/v1")
    : (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api-ecom.bornobyte.com/api/v1");

export type ShopProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  team: string;
  price: number;
  originalPrice?: number;
  image: string;
  unit?: string;
  badge?: string;
  rating?: number;
};

export type FetchShopProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brandId?: string;
};

export type ShopProductsResponse = {
  data: ShopProduct[];
  total: number;
};

export type MappedProduct = {
  id: string;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  collection: string;
  priceNum: number;
  category: string;
  origin: string;
  subtitle: string;
  description: string;
  teas: { name: string; description: string }[];
  ingredients: string[];
  galleryImages: string[];
  variantId: string;
};

export interface TeaItem {
  name: string;
  description: string;
}

export interface ProductInfoProps {
  name: string;
  subtitle: string;
  price: string;
  originalPrice: string;
  teas: TeaItem[];
  productId: string;
  variantId: string;
  productData: {
    name: string;
    priceNum: number;
    image: string;
    category: string;
    description: string;
  };
}
export type ShopBrand = {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
};

export type ShopCategory = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  parentId?: string | null;
  children?: ShopCategory[];
};

export type ShopSettings = {
  id: string;
  shopName: string;
  slogan: string;
  contactNumber?: any;
  email?: any;
  socialContact?: any;
  currency: string;
  language: string;
  deliveryChargeInside: string;
  deliveryChargeOutside: string;
  deliveryChargeNearCity: string;
  youtubeUrl?: string | null;
  youtubeThumbnailImage?: string | null;
  youtubeTitle?: string | null;
  youtubeDescription?: string | null;
};

function mapProduct(product: AdminProduct): ShopProduct {
  const defaultVariant = product.variants?.find((v) => v.isDefault) ?? product.variants?.[0];

  const featuredMedia = product.media?.find((m) => m.isFeatured);
  const firstMedia = product.media?.[0];
  const rawImage = featuredMedia?.media.url ?? firstMedia?.media.url ?? "";

  const priceNum = Number(defaultVariant?.price ?? 0);
  const costNum = defaultVariant?.cost ? Number(defaultVariant.cost) : 0;
  const discountPrice = product.discountPrice ? Number(product.discountPrice) : 0;
  const showOriginal = discountPrice > 0 && discountPrice < priceNum;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category?.name ?? "",
    team: product.brand?.name ?? "",
    price: showOriginal ? discountPrice : priceNum,
    originalPrice: showOriginal ? priceNum : (costNum > priceNum ? costNum : undefined),
    image: resolveImageUrl(rawImage),
    unit: product.unit?.name ?? product.unit?.abbreviation ?? undefined,
  };
}

import { FALLBACK_MARKETPLACE_PRODUCTS } from "./fallback-products";

export async function fetchShopProducts(
  params: FetchShopProductsParams = {},
): Promise<ShopProductsResponse> {
  const { page = 1, limit = 12, search, categoryId, brandId } = params;

  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));
  if (search) {
    searchParams.set("search", search);
  }
  if (categoryId) {
    searchParams.set("categoryId", categoryId);
  }
  if (brandId) {
    searchParams.set("brandId", brandId);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/products?${searchParams.toString()}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (res.status === 200) {
      const paginated: PaginatedProducts = await res.json();
      return {
        data: (paginated.data ?? []).map(mapProduct),
        total: paginated.meta?.total ?? 0,
      };
    }
  } catch (err) {
    console.warn("API product fetch failed, using fallback:", err);
  }

  // Graceful fallback to rich local marketplace catalog
  let filtered = FALLBACK_MARKETPLACE_PRODUCTS;
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        (p.category?.name && p.category.name.toLowerCase().includes(s)) ||
        (p.brand?.name && p.brand.name.toLowerCase().includes(s))
    );
  }
  if (categoryId) {
    filtered = filtered.filter((p) => p.categoryId === categoryId || p.category?.id === categoryId);
  }
  if (brandId) {
    filtered = filtered.filter((p) => p.brandId === brandId || p.brand?.id === brandId);
  }

  const start = (page - 1) * limit;
  const slice = filtered.slice(start, start + limit);
  return {
    data: slice.map(mapProduct),
    total: filtered.length,
  };
}

export async function fetchShopProductById(id: string): Promise<AdminProduct | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (res.status === 200) {
      return (await res.json()) as AdminProduct;
    }
  } catch (err) {
    console.warn(`fetchShopProductById(${id}) failed, checking fallback:`, err);
  }

  // Check fallback
  const found = FALLBACK_MARKETPLACE_PRODUCTS.find((p) => p.id === id);
  return found ?? null;
}

export async function fetchShopProductBySlug(slug: string): Promise<AdminProduct | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/slug/${encodeURIComponent(slug)}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (res.status === 200) {
      return (await res.json()) as AdminProduct;
    }
  } catch (err) {
    console.warn(`fetchShopProductBySlug(${slug}) failed, checking fallback:`, err);
  }

  // Check fallback by slug match or clean match
  const clean = slug.toLowerCase().trim();
  const found = FALLBACK_MARKETPLACE_PRODUCTS.find(
    (p) =>
      p.slug.toLowerCase() === clean ||
      p.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-") === clean ||
      clean.includes(p.slug.toLowerCase()) ||
      p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === clean
  );
  return found ?? null;
}
async function safeFetchJson<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return fallback;
    return await res.json() as T;
  } catch {
    return fallback;
  }
}

export function fetchShopBrands(): Promise<ShopBrand[]> {
  return safeFetchJson<ShopBrand[]>(`${API_BASE_URL}/brands`, []);
}

export function fetchShopCategories(): Promise<ShopCategory[]> {
  return safeFetchJson<ShopCategory[]>(`${API_BASE_URL}/category`, []);
}

export function fetchShopSettings(): Promise<ShopSettings | null> {
  return safeFetchJson<ShopSettings | null>(`${API_BASE_URL}/settings`, null);
}

export function fetchShopTags(): Promise<any[]> {
  return safeFetchJson<any[]>(`${API_BASE_URL}/tags`, []);
}

export function fetchShopAttributes(): Promise<any[]> {
  return safeFetchJson<any[]>(`${API_BASE_URL}/attributes`, []);
}

// ─── Policies ────────────────────────────────────────────────────────────────

export interface PolicyEntry {
  title: string;
  content: string;
}

export type PolicyKey = "delivery" | "refund" | "return" | "cancellation" | "privacy" | "terms";

export interface StorePolicies {
  delivery?:     PolicyEntry;
  refund?:       PolicyEntry;
  return?:       PolicyEntry;
  cancellation?: PolicyEntry;
  privacy?:      PolicyEntry;
  terms?:        PolicyEntry;
}

/** Fetches all policies from the API. Safe – never throws; returns null on failure. */
export function fetchStorePolicies(): Promise<StorePolicies | null> {
  return safeFetchJson<StorePolicies | null>(`${API_BASE_URL}/policies`, null);
}

/** Fetches all active campaigns */
export async function fetchActiveCampaigns(): Promise<Campaign[]> {
  const campaigns = await safeFetchJson<Campaign[]>(`${API_BASE_URL}/campaigns`, []);
  return campaigns.filter(c => c.status === "active");
}
