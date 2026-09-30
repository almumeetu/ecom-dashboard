"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../../lib/admin-api";

export type Section = {
  id: string;
  title: string;
  position: number;
  page: string;
};

export const DEFAULT_CAMPAIGN_SECTIONS: Section[] = [
  { id: "sec-hero", title: "Hero Campaign", position: 1, page: "home" },
  { id: "sec-trend", title: "New Trend Campaign", position: 2, page: "home" },
  { id: "sec-banner", title: "Banner Campaign", position: 3, page: "home" },
];

export function useSections() {
  const [sections, setSections] = useState<Section[]>(DEFAULT_CAMPAIGN_SECTIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSections() {
    setIsLoading(true);
    try {
      const data = await apiRequest<Section[]>("/campaigns/sections");
      if (Array.isArray(data) && data.length > 0) {
        setSections(data);
      } else {
        setSections(DEFAULT_CAMPAIGN_SECTIONS);
      }
    } catch {
      setSections(DEFAULT_CAMPAIGN_SECTIONS);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSections();
  }, []);

  return { sections, isLoading, error, loadSections };
}
