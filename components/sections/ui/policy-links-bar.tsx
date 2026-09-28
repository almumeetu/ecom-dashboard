"use client";

import { useState } from "react";
import { PolicyModal } from "./policy-modal";
import type { PolicyEntry, PolicyKey } from "@/lib/shop-api";

export interface ActivePolicy {
  key: PolicyKey;
  label: string;
  entry: PolicyEntry;
}

interface Props {
  links: ActivePolicy[];
}

export function PolicyLinksBar({ links }: Props) {
  const [open, setOpen] = useState<ActivePolicy | null>(null);

  if (links.length === 0) return null;

  return (
    <>
      {links.map((link, index) => (
        <span key={link.key} className="flex items-center gap-2">
          <button
            onClick={() => setOpen(link)}
            className="text-zinc-300 text-xs sm:text-sm hover:text-emerald-400 font-medium transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            {link.label}
          </button>
          {index < links.length - 1 && (
            <span className="text-zinc-500 text-xs sm:text-sm" aria-hidden>·</span>
          )}
        </span>
      ))}

      {open && (
        <PolicyModal
          policy={{ ...open.entry, key: open.key }}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
