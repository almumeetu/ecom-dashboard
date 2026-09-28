"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { LuLoader, LuX, LuMapPin, LuSearch, LuCheck } from "react-icons/lu";

interface MapPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (data: {
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }) => void;
}

export default function MapPickerModal({ open, onClose, onSelect }: MapPickerModalProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [leaflet, setLeaflet] = useState<typeof import("leaflet") | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<{
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null>(null);

  useEffect(() => {
    if (!open) return;

    if (!document.querySelector("link[href*='leaflet']")) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled) return;
      setLeaflet(L);
    });

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!leaflet || !mapRef.current || mapInstanceRef.current) return;

    const L = leaflet;
    const map = L.map(mapRef.current, {
      center: [23.8103, 90.4125],
      zoom: 12,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const icon = L.divIcon({
      html: `<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#059669" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="#10B981"/></svg>`,
      className: "",
      iconSize: [36, 36],
      iconAnchor: [18, 36],
    });

    const marker = L.marker([23.8103, 90.4125], { icon, draggable: true });
    marker.addTo(map);
    markerRef.current = marker;

    const updateFromCoords = async (lat: number, lng: number) => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
          { headers: { "Accept-Language": "en" } }
        );
        const addr = (await res.json()) as {
          address?: {
            road?: string;
            house_number?: string;
            city?: string;
            town?: string;
            village?: string;
            state?: string;
            country?: string;
            postcode?: string;
          };
        };
        if (addr.address) {
          const a = addr.address;
          const street = [a.house_number, a.road].filter(Boolean).join(" ");
          const city = a.city || a.town || a.village || "";
          setSelectedAddress({
            addressLine1: street || `${city} Address`,
            city,
            state: a.state || "",
            postalCode: a.postcode || "",
            country: a.country || "Bangladesh",
          });
        }
      } catch {
        // geocoding failed silently
      } finally {
        setLoading(false);
      }
    };

    const onMapClick = async (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      await updateFromCoords(e.latlng.lat, e.latlng.lng);
    };

    const onMarkerDragEnd = async () => {
      const pos = marker.getLatLng();
      await updateFromCoords(pos.lat, pos.lng);
    };

    map.on("click", onMapClick);
    marker.on("dragend", onMarkerDragEnd);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, [leaflet]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim() || !leaflet || !mapInstanceRef.current) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ", Bangladesh")}&limit=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const results = (await res.json()) as Array<{ lat: string; lon: string }>;
      if (results.length > 0) {
        const { lat, lon } = results[0];
        const map = mapInstanceRef.current;
        map.setView([parseFloat(lat), parseFloat(lon)], 15);
        if (markerRef.current) {
          markerRef.current.setLatLng([parseFloat(lat), parseFloat(lon)]);
          markerRef.current.fire("dragend");
        }
      }
    } catch {
      // search failed silently
    } finally {
      setLoading(false);
    }
  }, [searchQuery, leaflet]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-zinc-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Select Delivery Location</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Click or drag the marker to pinpoint your delivery address</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close map"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-3 border-b border-zinc-100 shrink-0 bg-zinc-50/70">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <LuSearch className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search area, road, or city in Bangladesh (e.g. Uttara Sector 3)..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {loading ? <LuLoader className="w-3.5 h-3.5 animate-spin" /> : <LuMapPin className="w-3.5 h-3.5" />}
              <span>Find</span>
            </button>
          </form>
        </div>

        {/* Map View */}
        <div ref={mapRef} className="w-full min-h-[300px] sm:min-h-[380px] flex-1 z-0 relative" />

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 bg-zinc-50/70">
          {selectedAddress ? (
            <div className="min-w-0 text-center sm:text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mb-1">
                Detected Location
              </span>
              <p className="text-xs font-semibold text-zinc-900 truncate max-w-sm sm:max-w-md">
                {[selectedAddress.addressLine1, selectedAddress.city, selectedAddress.state].filter(Boolean).join(", ")}
              </p>
            </div>
          ) : (
            <p className="text-xs font-medium text-zinc-500 text-center sm:text-left">
              Click anywhere on the map to place your delivery pin
            </p>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-100 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (selectedAddress) {
                  onSelect(selectedAddress);
                }
              }}
              disabled={!selectedAddress}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-emerald-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LuCheck className="w-4 h-4 stroke-[3]" />
              <span>Use This Address</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
