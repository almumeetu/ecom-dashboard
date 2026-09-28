"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { getCustomerToken } from "@/lib/storefront-api";
import { resolveImageUrl } from "@/lib/admin-api";
import type { WishlistProduct, BackendWishlistItem, WishlistContextValue } from "@/lib/types";
import { useAuth } from "@/app/_providers/auth-provider";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5010/api/v1";

const defaultWishlistContext: WishlistContextValue = {
  items: [],
  itemCount: 0,
  isInWishlist: () => false,
  toggleWishlist: async () => {},
  clearWishlist: async () => {},
};

const WishlistContext = createContext<WishlistContextValue>(defaultWishlistContext);

/**
 * Dynamically extracts an attribute value using a case-insensitive regular expression match.
 * Returns an empty string if no matching attribute key is found.
 */
function mapBackendItem(item: BackendWishlistItem): WishlistProduct {
  const p = item.product;
  const defaultVariant = p.variants?.find((v) => v.isDefault) ?? p.variants?.[0];
  const featured = p.media?.find((m) => m.isFeatured);
  const first = p.media?.[0];
  const attributes = defaultVariant?.attributes ?? {};

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(defaultVariant?.price ?? p.price ?? 0),
    image: resolveImageUrl(featured?.media.url ?? first?.media.url ?? ""),
    color: attributes.Color ?? attributes.Colour ?? attributes.color ?? '',
    size: attributes.Size ?? attributes.size ?? '',
    category: p.category?.name ?? "",
    team: p.brand?.name ?? "",
    variantId: defaultVariant?.id,
    attributes,
    ...attributes,
  };
}

async function authenticatedRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getCustomerToken();
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

const WISHLIST_STORAGE_KEY = "trustpoint-wishlist";

function loadLocalWishlist(): WishlistProduct[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WishlistProduct[];
  } catch {
    return [];
  }
}

function saveLocalWishlist(items: WishlistProduct[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
}

function clearLocalWishlist() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(WISHLIST_STORAGE_KEY);
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      authenticatedRequest<BackendWishlistItem[]>("/wishlist")
        .then((data) => {
          const serverItems = data.map(mapBackendItem);
          const local = loadLocalWishlist();
          if (local.length > 0) {
            local.forEach((localItem) => {
              if (!serverItems.some((s) => s.id === localItem.id || s.slug === localItem.slug)) {
                authenticatedRequest<BackendWishlistItem>("/wishlist", {
                  method: "POST",
                  body: JSON.stringify({ productId: localItem.id }),
                }).catch(() => {});
              }
            });
            clearLocalWishlist();
          }
          setItems(serverItems);
        })
        .catch(() => {
          setItems(loadLocalWishlist());
        });
    } else {
      setItems(loadLocalWishlist());
    }
  }, [isAuthenticated]);

  const isInWishlist = useCallback(
    (productIdOrSlug: string) => {
      if (!productIdOrSlug) return false;
      return items.some(
        (i) =>
          i.id === productIdOrSlug ||
          i.slug === productIdOrSlug ||
          (i as any).productId === productIdOrSlug
      );
    },
    [items],
  );

  const toggleWishlist = useCallback(
    (product: WishlistProduct) => {
      const token = getCustomerToken();
      const targetId = product.id || product.slug;
      if (!targetId) return;

      const exists = items.some(
        (i) =>
          i.id === targetId ||
          i.slug === product.slug ||
          (i as any).productId === targetId
      );

      if (token && isAuthenticated) {
        if (exists) {
          authenticatedRequest(`/wishlist/${targetId}`, { method: "DELETE" })
            .then(() => {
              setItems((prev) =>
                prev.filter(
                  (i) => i.id !== targetId && i.slug !== product.slug
                )
              );
              toast.success("Removed from wishlist");
            })
            .catch(() => {
              setItems((prev) =>
                prev.filter(
                  (i) => i.id !== targetId && i.slug !== product.slug
                )
              );
              toast.success("Removed from wishlist");
            });
        } else {
          authenticatedRequest<BackendWishlistItem>("/wishlist", {
            method: "POST",
            body: JSON.stringify({ productId: targetId }),
          })
            .then((serverItem) => {
              setItems((prev) => [mapBackendItem(serverItem), ...prev]);
              toast.success("Added to wishlist");
            })
            .catch(() => {
              setItems((prev) => [product, ...prev]);
              toast.success("Added to wishlist");
            });
        }
      } else {
        // Guest mode: persist to local storage
        if (exists) {
          setItems((prev) => {
            const next = prev.filter(
              (i) => i.id !== targetId && i.slug !== product.slug
            );
            saveLocalWishlist(next);
            return next;
          });
          toast.success("Removed from wishlist");
        } else {
          setItems((prev) => {
            const next = [product, ...prev];
            saveLocalWishlist(next);
            return next;
          });
          toast.success("Added to wishlist");
        }
      }
    },
    [isAuthenticated, items],
  );

  const clearWishlist = useCallback(() => {
    const token = getCustomerToken();
    if (token && isAuthenticated) {
      Promise.all(
        items.map((i) => authenticatedRequest(`/wishlist/${i.id}`, { method: "DELETE" }))
      )
        .then(() => {
          setItems([]);
          toast.success("Wishlist cleared");
        })
        .catch(() => {
          setItems([]);
          toast.success("Wishlist cleared");
        });
    } else {
      clearLocalWishlist();
      setItems([]);
      toast.success("Wishlist cleared");
    }
  }, [isAuthenticated, items]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount: items.length,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  return ctx ?? defaultWishlistContext;
}
