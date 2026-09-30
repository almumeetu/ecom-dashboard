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
  variantId?: string;
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

export type ContactEntry = {
  title: string;
  value: string;
  extra?: string;
};

export type ShopSettings = {
  id?: string;
  shopName?: string;
  slogan?: string;
  contactNumber?: any;
  email?: any;
  socialContact?: any;
  currency?: string;
  language?: string;
  deliveryChargeInside?: string | number;
  deliveryChargeOutside?: string | number;
  deliveryChargeNearCity?: string | number;
  youtubeUrl?: string | null;
  youtubeThumbnailImage?: string | null;
  youtubeTitle?: string | null;
  youtubeDescription?: string | null;
  branchName?: string | null;
  branchAddress?: string | null;
  branchLat?: number | null;
  branchLng?: number | null;
  copyrightYear?: string | null;
  parentCompany?: string | null;
  parentCompanyLink?: string | null;
  logo?: string | null;
  icon?: string | null;
  favicon?: string | null;
  isTopBarVisible?: boolean;
  hideOutOfStock?: boolean;
};

/** Helper to cleanly extract contact number or email entries from various API formats */
export function parseContactEntries(field: any): ContactEntry[] {
  if (!field) return [];
  if (Array.isArray(field)) {
    return field
      .filter((item) => item && typeof item.value === "string" && item.value.trim() !== "")
      .map((item) => ({ title: item.title || "", value: item.value.trim() }));
  }
  if (Array.isArray(field.entries)) {
    return field.entries
      .filter((item: any) => item && typeof item.value === "string" && item.value.trim() !== "")
      .map((item: any) => ({ title: item.title || "", value: item.value.trim() }));
  }
  return [];
}


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
    variantId: defaultVariant?.id,
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

export const DEFAULT_NOVAMART_CATEGORIES: ShopCategory[] = [
  { id: "cat-skincare", name: "Skin Care & Beauty", slug: "skin-care", imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80" },
  { id: "cat-electronics", name: "Digital Electronics", slug: "digital-electronics", imageUrl: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80" },
  { id: "cat-perfume", name: "Perfumes & Fragrances", slug: "perfume", imageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80" },
  { id: "cat-clothing", name: "Clothing & Fashion", slug: "clothing", imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80" },
  { id: "cat-baby", name: "Baby & Kids Products", slug: "baby-products", imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80" },
  { id: "cat-home", name: "Home & Living", slug: "home-living", imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80" },
];

export const DEFAULT_NOVAMART_SETTINGS: ShopSettings = {
  id: "novamart-settings-default",
  shopName: "NovaMart",
  slogan: "YOUR PREMIER MULTI-CATEGORY ONLINE STORE",
  contactNumber: [
    { title: "Hotline Support", value: "+880 1712-345678" },
    { title: "Customer Care", value: "01712345678" },
  ],
  email: [
    { title: "Customer Support", value: "support@novamart.com.bd" },
    { title: "Corporate Inquiries", value: "sales@novamart.com.bd" },
  ],
  socialContact: {
    whatsapp: "8801712345678",
    facebook: "https://facebook.com/novamart.bd",
    instagram: "https://instagram.com/novamart.bd",
    youtube: "https://youtube.com/@novamartbd",
  },
  currency: "BDT",
  language: "en",
  deliveryChargeInside: 60,
  deliveryChargeOutside: 120,
  deliveryChargeNearCity: 80,
  branchName: "NovaMart Central Flagship & Fulfillment",
  branchAddress: "Level 4, Nova Tower, Plot 18, Road 11, Banani, Dhaka-1213, Bangladesh",
  copyrightYear: "2026",
  parentCompany: "NovaMart Retail Bangladesh Limited",
  parentCompanyLink: "https://novamart.com.bd",
  logo: "/images/logo/novamart-logo-main.png",
  isTopBarVisible: true,
  hideOutOfStock: false,
};

export const DEFAULT_NOVAMART_BRANDS: ShopBrand[] = [
  { id: "b-apple", name: "Apple", slug: "apple" },
  { id: "b-samsung", name: "Samsung", slug: "samsung" },
  { id: "b-dior", name: "Dior", slug: "dior" },
  { id: "b-chanel", name: "Chanel", slug: "chanel" },
  { id: "b-theordinary", name: "The Ordinary", slug: "the-ordinary" },
  { id: "b-cerave", name: "CeraVe", slug: "cerave" },
  { id: "b-pampers", name: "Pampers", slug: "pampers" },
  { id: "b-philips", name: "Philips Avent", slug: "philips-avent" },
  { id: "b-anker", name: "Anker", slug: "anker" },
  { id: "b-sony", name: "Sony", slug: "sony" },
];

export async function fetchShopBrands(): Promise<ShopBrand[]> {
  const result = await safeFetchJson<ShopBrand[]>(`${API_BASE_URL}/brands`, []);
  return result && result.length > 0 ? result : DEFAULT_NOVAMART_BRANDS;
}

export async function fetchShopCategories(): Promise<ShopCategory[]> {
  const result = await safeFetchJson<ShopCategory[]>(`${API_BASE_URL}/category`, []);
  return result && result.length > 0 ? result : DEFAULT_NOVAMART_CATEGORIES;
}

export async function fetchShopSettings(): Promise<ShopSettings | null> {
  const result = await safeFetchJson<ShopSettings | null>(`${API_BASE_URL}/settings`, null);
  return result ?? DEFAULT_NOVAMART_SETTINGS;
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
export async function fetchStorePolicies(): Promise<StorePolicies | null> {
  const result = await safeFetchJson<StorePolicies | null>(`${API_BASE_URL}/policies`, null);
  if (result) return result;
  return {
    delivery: {
      title: "Nationwide Doorstep Delivery",
      content: "Inside Dhaka Metropolitan: ৳60 (24 to 48 hours). All other 63 districts across Bangladesh: ৳120 (2 to 4 days). Free delivery on orders over ৳1,999. Cash on Delivery is supported nationwide.",
    },
    return: {
      title: "7-Day Return & Replacement Policy",
      content: "If your item is damaged, defective, or incorrect upon delivery, you may request a free return or replacement within 7 days. Customer helpline: +880 1712-345678.",
    },
    refund: {
      title: "Instant Refund Guarantee",
      content: "Refunds for returned or canceled orders are processed within 24 to 48 business hours via your original payment method (bKash, Nagad, Card, or Bank transfer).",
    },
    privacy: {
      title: "Data Privacy & Security",
      content: "NovaMart respects your privacy and utilizes SSL bank-grade encryption to protect customer payment and personal information.",
    },
    terms: {
      title: "Terms & Conditions",
      content: "All purchases made on NovaMart Bangladesh are backed by authentic brand guarantees, valid commercial VAT invoices, and consumer protection regulations.",
    },
  };
}

/** Fetches all active campaigns */
export async function fetchActiveCampaigns(): Promise<Campaign[]> {
  const campaigns = await safeFetchJson<Campaign[]>(`${API_BASE_URL}/campaigns`, []);
  return campaigns.filter(c => c.status === "active");
}

// ─── Product Reviews ─────────────────────────────────────────────────────────

export interface ShopReview {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
  } | null;
}

export function fetchShopProductReviews(productId: string): Promise<ShopReview[]> {
  return safeFetchJson<ShopReview[]>(`${API_BASE_URL}/products/${productId}/reviews`, []);
}

// ─── Coupons ────────────────────────────────────────────────────────────────

export interface CouponItem {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number | string;
  maxUsage: number;
  usedCount: number;
  expiresAt?: string | null;
}

export interface ApplyCouponResult {
  coupon: CouponItem;
  discount: number;
  total: number;
}

export function fetchCoupons(): Promise<CouponItem[]> {
  return safeFetchJson<CouponItem[]>(`${API_BASE_URL}/coupons`, []);
}

export async function applyCouponApi(
  code: string,
  subtotal: number
): Promise<{ success: boolean; data?: ApplyCouponResult; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/coupons/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.trim().toUpperCase(), subtotal }),
    });
    const body = await res.json();
    if (!res.ok) {
      return { success: false, message: body?.message || "Invalid coupon code" };
    }
    return { success: true, data: body };
  } catch (err: any) {
    return { success: false, message: err?.message || "Failed to validate coupon" };
  }
}

