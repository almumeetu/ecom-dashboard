"use client";

import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { fetchShopSettings } from "@/lib/shop-api";

export default function FloatingWhatsApp() {
  const [phone, setPhone] = useState("+880 1712-345678");
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

        if (num && !num.includes("01722301927")) {
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
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 font-sans"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip on hover / desktop prompt */}
      <div
        className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white text-zinc-800 text-xs font-semibold rounded-full shadow-lg border border-zinc-200 transition-all duration-200 select-none ${
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
        <span>WhatsApp এ অর্ডার বা সাহায্য চান?</span>
      </div>

      {/* Floating Circular WhatsApp Button (#EA580C Accent) */}
      <a
        href={`https://wa.me/${waNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative group w-14 h-14 rounded-full bg-[#EA580C] hover:bg-[#C2410C] text-white flex items-center justify-center shadow-lg shadow-orange-950/25 hover:shadow-xl hover:shadow-[#EA580C]/40 transition-all duration-300 hover:scale-108 active:scale-95 cursor-pointer"
      >
        {/* Subtle breathing ripple wave */}
        <span className="absolute -inset-1 rounded-full bg-[#EA580C] opacity-35 animate-ping -z-10" />

        <FaWhatsapp className="w-8 h-8 text-white transition-transform duration-300 group-hover:scale-110" />
      </a>
    </div>
  );
}
