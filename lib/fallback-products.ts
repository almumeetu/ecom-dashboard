import type { Product as AdminProduct } from "./admin-api";
import localProducts from "@/data/products.json";

function getCategoryInfo(rawCat: string) {
  const c = (rawCat || "").toLowerCase();
  if (c.includes("skin") || c.includes("beauty")) {
    return { id: "cat-skincare", name: "Skin Care & Beauty", slug: "skin-care" };
  }
  if (c.includes("electronic") || c.includes("digital") || c.includes("gadget")) {
    return { id: "cat-electronics", name: "Digital Electronics", slug: "digital-electronics" };
  }
  if (c.includes("perfume") || c.includes("fragrance")) {
    return { id: "cat-perfume", name: "Perfumes & Fragrances", slug: "perfume" };
  }
  if (c.includes("cloth") || c.includes("fashion") || c.includes("apparel")) {
    return { id: "cat-clothing", name: "Clothing & Fashion", slug: "clothing" };
  }
  if (c.includes("baby") || c.includes("kid")) {
    return { id: "cat-baby", name: "Baby & Kids Products", slug: "baby-products" };
  }
  if (c.includes("home") || c.includes("living")) {
    return { id: "cat-home", name: "Home & Living", slug: "home-living" };
  }
  if (c.includes("footwear") || c.includes("shoe")) {
    return { id: "cat-footwear", name: "Footwear & Shoes", slug: "footwear" };
  }
  if (c.includes("food") || c.includes("grocery") || c.includes("agro") || c.includes("pantry")) {
    return { id: "cat-groceries", name: "Gourmet Foods & Agro", slug: "groceries" };
  }
  if (c.includes("health") || c.includes("wellness") || c.includes("fitness")) {
    return { id: "cat-health", name: "Health, Wellness & Fitness", slug: "health-wellness" };
  }
  if (c.includes("watch") || c.includes("accessor") || c.includes("eyewear")) {
    return { id: "cat-watches", name: "Watches & Premium Accessories", slug: "watches-accessories" };
  }
  return {
    id: `cat-${(rawCat || "general").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name: rawCat || "General",
    slug: (rawCat || "general").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  };
}

export const FALLBACK_MARKETPLACE_PRODUCTS: AdminProduct[] = (localProducts as any[]).map((lp) => {
  const catInfo = getCategoryInfo(lp.category || lp.collection);
  const origNum = lp.originalPrice ? Number(String(lp.originalPrice).replace(/[^\d.]/g, "")) : 0;
  const costPrice = origNum > (lp.priceNum || 0) ? origNum : (lp.priceNum ? Math.round(lp.priceNum * 0.75) : 2000);
  const brandName = lp.brand || lp.collection || "NovaMart Collection";

  return {
    id: lp.id,
    name: lp.name,
    slug: lp.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    description: lp.description,
    shortDescription: lp.subtitle,
    status: "active",
    metaTitle: `${lp.name} | NovaMart`,
    metaDescription: lp.subtitle,
    brandId: `b-${brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    categoryId: catInfo.id,
    brand: {
      id: `b-${brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name: brandName,
      slug: brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      logoUrl: null,
    },
    category: {
      id: catInfo.id,
      name: catInfo.name,
      slug: catInfo.slug,
    },
    unit: {
      id: `u-${lp.id}`,
      name: "Piece",
      abbreviation: "PC",
      factor: 1,
      isActive: true,
    },
    media: (lp.galleryImages || [lp.image]).map((img: string, idx: number) => ({
      id: `med-${lp.id}-${idx}`,
      isFeatured: idx === 0,
      sortOrder: idx,
      mediaId: `med-id-${lp.id}-${idx}`,
      media: {
        id: `med-id-${lp.id}-${idx}`,
        url: img,
        type: "image",
      },
    })),
    variants: [
      {
        id: `var-${lp.id}-std`,
        sku: `NM-${lp.id}-001`,
        price: String(lp.priceNum || 2000),
        cost: String(costPrice),
        stockQuantity: 100,
        stockAlertThreshold: 10,
        isDefault: true,
        attributes: [
          { attributeValue: { attribute: { name: "Condition" }, value: "Authentic & Sealed" } },
        ],
      },
    ],
  };
}) as unknown as AdminProduct[];
