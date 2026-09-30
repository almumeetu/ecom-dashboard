"use client";

import { type Campaign, API_BASE_URL, resolveImageUrl } from "./admin-api";

export const CAMPAIGNS_STORAGE_KEY = "novamart_campaigns_v1";
export const CAMPAIGNS_UPDATED_EVENT = "novamart_campaigns_updated";

/**
 * Built-in default hero campaigns matching NovaMart's high-converting,
 * Bangladesh-friendly multi-category store (Groceries, Electronics, Skincare, Perfumes, Baby products).
 */
export const DEFAULT_HERO_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-hero-1",
    title: "ভালো বাজারে আপনাকে স্বাগতম",
    description: "বিশ্বস্ত উৎসের ১০০% অরিজিনাল পণ্য • সারা বাংলাদেশে দ্রুত ক্যাশ অন ডেলিভারি",
    status: "active",
    startAt: new Date().toISOString(),
    endAt: null,
    hasDiscount: true,
    sectionId: "sec-hero",
    section: {
      id: "sec-hero",
      title: "Hero Campaign",
      position: 1,
      page: "home",
    },
    images: [
      {
        id: "img-hero-1",
        images: [
          "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80",
        ],
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "camp-hero-2",
    title: "স্মার্ট গ্যাজেটস & ডিজিটাল ইলেকট্রনিক্স",
    description: "হেডফোন, স্মার্টওয়াচ, স্পিকার ও আধুনিক টেক এক্সেসরিজে সর্বোচ্চ ৪০% ছাড়",
    status: "active",
    startAt: new Date().toISOString(),
    endAt: null,
    hasDiscount: true,
    sectionId: "sec-hero",
    section: {
      id: "sec-hero",
      title: "Hero Campaign",
      position: 1,
      page: "home",
    },
    images: [
      {
        id: "img-hero-2",
        images: [
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&auto=format&fit=crop&q=80",
        ],
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "camp-hero-3",
    title: "স্কিন কেয়ার & লাক্সারি অরিজিনাল পারফিউম",
    description: "কোরিয়ান সিরাম, ফেসওয়াশ ও অরিজিনাল অ্যারাবিয়ান আতর ও সুগন্ধিতে বিশেষ ছাড়",
    status: "active",
    startAt: new Date().toISOString(),
    endAt: null,
    hasDiscount: true,
    sectionId: "sec-hero",
    section: {
      id: "sec-hero",
      title: "Hero Campaign",
      position: 1,
      page: "home",
    },
    images: [
      {
        id: "img-hero-3",
        images: [
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&auto=format&fit=crop&q=80",
        ],
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "camp-hero-4",
    title: "প্রিমিয়াম বেবি কেয়ার ও কিডস ফ্যাশন",
    description: "শিশুদের নিরাপদ স্কিন কেয়ার, ডায়াপার, পুষ্টিকর খাবার ও স্টাইলিশ পোশাক",
    status: "active",
    startAt: new Date().toISOString(),
    endAt: null,
    hasDiscount: true,
    sectionId: "sec-hero",
    section: {
      id: "sec-hero",
      title: "Hero Campaign",
      position: 1,
      page: "home",
    },
    images: [
      {
        id: "img-hero-4",
        images: [
          "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1600&auto=format&fit=crop&q=80",
        ],
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

/**
 * Reads campaigns saved in localStorage, or falls back to default hero campaigns.
 */
export function getStoredCampaigns(): Campaign[] {
  if (typeof window === "undefined") {
    return DEFAULT_HERO_CAMPAIGNS;
  }

  try {
    const raw = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading stored campaigns:", err);
  }

  // Initialize with default campaigns if none found
  try {
    localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(DEFAULT_HERO_CAMPAIGNS));
  } catch {}

  return DEFAULT_HERO_CAMPAIGNS;
}

/**
 * Saves campaigns to localStorage and broadcasts an update event.
 */
export function saveStoredCampaigns(campaigns: Campaign[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(campaigns));
    window.dispatchEvent(new CustomEvent(CAMPAIGNS_UPDATED_EVENT, { detail: campaigns }));
  } catch (err) {
    console.error("Error saving campaigns:", err);
  }
}

/**
 * Adds or updates a campaign in the store.
 */
export function saveCustomCampaign(campaign: Campaign): void {
  const current = getStoredCampaigns();
  const index = current.findIndex((c) => c.id === campaign.id);

  let updated: Campaign[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...current[index], ...campaign, updatedAt: new Date().toISOString() };
  } else {
    updated = [campaign, ...current];
  }

  saveStoredCampaigns(updated);
}

/**
 * Toggles a campaign's status (active / inactive).
 */
export function toggleStoredCampaignStatus(id: string): void {
  const current = getStoredCampaigns();
  const updated = current.map((c) => {
    if (c.id === id) {
      return {
        ...c,
        status: (c.status === "active" ? "inactive" : "active") as "active" | "inactive",
        updatedAt: new Date().toISOString(),
      };
    }
    return c;
  });

  saveStoredCampaigns(updated);
}

/**
 * Deletes a campaign from local storage.
 */
export function deleteStoredCampaign(id: string): void {
  const current = getStoredCampaigns();
  const updated = current.filter((c) => c.id !== id);
  saveStoredCampaigns(updated);
}

/**
 * Fetches active hero campaigns by querying the backend API first,
 * falling back to or merging with localStorage campaigns.
 */
export async function fetchActiveHeroCampaigns(): Promise<Campaign[]> {
  let apiCampaigns: Campaign[] = [];

  try {
    const res = await fetch(`${API_BASE_URL}/campaigns`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        apiCampaigns = data.filter((c) => c.status === "active");
      }
    }
  } catch {
    // API is offline — handled by stored/fallback campaigns
  }

  const stored = getStoredCampaigns().filter((c) => c.status === "active");

  // Merge unique campaigns (API campaigns take precedence)
  const map = new Map<string, Campaign>();
  for (const c of stored) {
    map.set(c.id, c);
  }
  for (const c of apiCampaigns) {
    map.set(c.id, c);
  }

  const result = Array.from(map.values());

  // If no active campaigns found, return default hero campaigns
  return result.length > 0 ? result : DEFAULT_HERO_CAMPAIGNS;
}
