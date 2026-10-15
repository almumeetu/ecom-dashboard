"use client";

import { useEffect } from "react";
import { LuX, LuMapPin, LuCheck, LuLoader, LuPlus } from "react-icons/lu";
import type { SavedAddress } from "@/lib/storefront-api";

interface AddressSelectModalProps {
  open: boolean;
  onClose: () => void;
  addresses: SavedAddress[];
  selectedAddressId: string | "new";
  onSelect: (addr: SavedAddress) => void;
  onAddNew?: () => void;
  loading?: boolean;
}

export default function AddressSelectModal({
  open,
  onClose,
  addresses,
  selectedAddressId,
  onSelect,
  onAddNew,
  loading = false,
}: AddressSelectModalProps) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="saved-addresses-title" className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="relative min-w-0 w-full max-w-xl bg-white rounded-xl shadow-xl overflow-hidden max-h-[90dvh] flex flex-col border border-zinc-200">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-zinc-100 shrink-0">
          <div>
            <h3 id="saved-addresses-title" className="text-lg font-medium text-zinc-900 tracking-tight">Saved Addresses</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 shrink-0 rounded-full bg-zinc-50 hover:bg-zinc-100 text-zinc-500 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable List */}
        <div className="min-h-0 flex-grow overflow-y-auto overscroll-y-contain p-4 sm:p-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500 text-sm gap-2.5">
              <LuLoader className="w-6 h-6 animate-spin text-emerald-600" />
              <span className="font-medium text-xs">Loading your saved addresses...</span>
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-3 text-zinc-400">
                <LuMapPin className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-zinc-800">No saved addresses found</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                Fill in your address in the checkout form to deliver your order.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {addresses.map((addr) => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <button
                    key={addr.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      onSelect(addr);
                      onClose();
                    }}
                    className={`w-full min-w-0 p-4 text-left rounded-lg cursor-pointer transition-colors border flex items-start justify-between gap-3 ${
                      isSelected
                        ? "border-store-primary bg-store-surface"
                        : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        <LuMapPin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm font-bold text-zinc-900 truncate">
                            {addr.fullName}
                          </span>
                          {addr.isDefault && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-zinc-600 mb-1">{addr.phone}</p>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          {addr.addressLine1}
                          {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                          {`, ${addr.city}, ${addr.state} ${addr.postalCode}`}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 pt-0.5">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-zinc-300 bg-white"
                        }`}
                      >
                        {isSelected && <LuCheck className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 border-t border-zinc-100 flex flex-wrap gap-3 items-center justify-between shrink-0 bg-zinc-50/60">
          {onAddNew ? (
            <button
              type="button"
              onClick={() => {
                onAddNew();
                onClose();
              }}
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-store-accent transition-colors cursor-pointer"
            >
              <LuPlus className="w-4 h-4" />
              <span>Use a new address</span>
            </button>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={onClose}
            className="min-h-11 px-5 py-2 rounded-lg bg-white border border-zinc-200 text-zinc-700 font-medium text-sm hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
