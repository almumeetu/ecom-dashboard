"use client";

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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-zinc-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Saved Addresses</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Select an address from your profile for fast checkout
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable List */}
        <div className="flex-grow overflow-y-auto p-6 space-y-3.5">
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
                  <div
                    key={addr.id}
                    onClick={() => {
                      onSelect(addr);
                      onClose();
                    }}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border flex items-start justify-between gap-3 ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-500/20"
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
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between shrink-0 bg-zinc-50/60">
          {onAddNew ? (
            <button
              type="button"
              onClick={() => {
                onAddNew();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
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
            className="px-5 py-2 rounded-xl bg-white border border-zinc-200 text-zinc-700 font-bold text-xs uppercase tracking-wider hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
