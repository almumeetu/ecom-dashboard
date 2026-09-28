import HeroSlider from "./ui/hero-slider";
import type { Slide } from "@/data/types";
import { fetchActiveCampaigns } from "@/lib/shop-api";
import { resolveImageUrl } from "@/lib/admin-api";

export default async function Hero() {
  const defaultSlides: Slide[] = [
    {
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80",
      badge: "ORGANIC & FRESH DAILY",
      title: "Fresh Groceries",
      titleItalic: "& Farm Produce",
      subtitle: "Handpicked organic produce, pantry essentials & fresh foods delivered fast to your doorstep.",
      ctaText: "SHOP GROCERIES",
      ctaHref: "/products?category=Grocery",
    },
    {
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80",
      badge: "TRENDING DROPS 2026",
      title: "Designer Fashion",
      titleItalic: "& Everyday Style",
      subtitle: "Explore iconic collections from Zara, H&M, Levi's, Nike & curated global multi-vendors.",
      ctaText: "EXPLORE FASHION",
      ctaHref: "/products?category=Fashion",
    },
    {
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1600&auto=format&fit=crop&q=80",
      badge: "GOURMET KITCHEN",
      title: "Artisan Food",
      titleItalic: "& Beverages",
      subtitle: "Savory delicacies, healthy snacks, craft beverages and premium delights for every craving.",
      ctaText: "DISCOVER FOOD",
      ctaHref: "/products?category=Food",
    },
  ];

  let slides = defaultSlides;

  try {
    const campaigns = await fetchActiveCampaigns();
    const campaignSlides = campaigns
      .filter((c) => c.images && c.images.length > 0 && c.images[0].images.length > 0)
      .map((c) => ({
        image: resolveImageUrl(c.images![0].images[0]),
        title: c.title,
        titleItalic: "Collection",
        subtitle: c.description || "Exclusive multi-category selections from verified premium vendors.",
        hasDiscount: c.hasDiscount,
        ctaText: "SHOP DEALS",
        ctaHref: "/products",
        badge: "EXCLUSIVE PROMO",
      }));

    if (campaignSlides.length > 0) {
      slides = [...campaignSlides, ...defaultSlides];
    }
  } catch (error) {
    console.error("Failed to fetch campaigns for hero slider:", error);
  }

  return (
    <section className="w-full relative">
      <div className="hero-wrapper">
        <HeroSlider slides={slides} />
      </div>
    </section>
  );
}
