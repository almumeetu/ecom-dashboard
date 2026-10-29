"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa6";
import { fetchShopSettings } from "@/lib/shop-api";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const isPurchasePage = ["/cart", "/checkout", "/confirmation"].includes(pathname) || pathname.startsWith("/products/");
  const [phone, setPhone] = useState("+880 1722-301927");
  const [shopName, setShopName] = useState("NovaMart");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetchShopSettings()
      .then((settings) => {
        if (settings?.shopName) setShopName(settings.shopName.trim());
        const contact = settings?.contactNumber;
        let num = "";
        if (typeof contact === "string") num = contact;
        else if (Array.isArray(contact) && contact[0]?.value) num = contact[0].value;
        else if (contact?.entries?.[0]?.value) num = contact?.entries[0].value;

        if (num) {
          setPhone(num);
        }
      })
      .catch(() => {});
  }, []);

  const cleanDigits = phone.replace(/[^\d]/g, "");
  const waNumber = cleanDigits.startsWith("88")
    ? cleanDigits
    : cleanDigits.startsWith("0")
    ? `88${cleanDigits}`
    : `880${cleanDigits}`;

  const message = encodeURIComponent(
    `Hello ${shopName}, I have a question about your products.`
  );

  return (
    <div
      className={`fixed bottom-4 right-4 z-40 items-center gap-2.5 font-sans sm:bottom-6 sm:right-6 ${isPurchasePage ? "hidden lg:flex" : "hidden sm:flex"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip on hover / desktop prompt */}
      <div
        className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white text-zinc-800 text-xs font-semibold rounded-full shadow-lg border border-zinc-200 transition-all duration-200 select-none ${
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        <span>WhatsApp এ অর্ডার বা সাহায্য চান?</span>
      </div>

      {/* WhatsApp keeps its recognizable brand green. */}
      <a
        href={`https://wa.me/${waNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-950/20 transition-all duration-300 hover:scale-105 hover:bg-[#1DA851] hover:shadow-xl hover:shadow-emerald-900/25 active:scale-95 sm:h-14 sm:w-14"
      >
        {/* Subtle breathing ripple wave */}
        <span className="absolute -inset-1 -z-10 animate-ping rounded-full bg-[#25D366] opacity-25 motion-reduce:animate-none" />

        <FaWhatsapp className="h-7 w-7 text-white transition-transform duration-300 group-hover:scale-110 sm:h-8 sm:w-8" />
      </a>
    </div>
  );
}
