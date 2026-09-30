import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaXTwitter,
  FaLinkedinIn,
  FaCcAmex,
} from "react-icons/fa6";
import { SiVisa } from "react-icons/si";
import { HiLockClosed, HiTruck } from "react-icons/hi";
import { fetchShopSettings } from "@/lib/shop-api";

type SocialKey = "tiktok" | "instagram" | "twitter" | "facebook" | "linkedin" | "youtube";

const SOCIAL_ICONS: Record<SocialKey, { Icon: React.ComponentType<{ className?: string }>; label: string }> = {
  facebook:  { Icon: FaFacebookF, label: "Facebook"  },
  instagram: { Icon: FaInstagram, label: "Instagram" },
  youtube:   { Icon: FaYoutube,   label: "YouTube"   },
  tiktok:    { Icon: FaTiktok,    label: "TikTok"    },
  twitter:   { Icon: FaXTwitter,  label: "Twitter/X" },
  linkedin:  { Icon: FaLinkedinIn,label: "LinkedIn"  },
};

const SOCIAL_ORDER: SocialKey[] = ["facebook", "instagram", "youtube", "tiktok", "twitter", "linkedin"];

function normalizeExternalUrl(url?: string | null): string {
  if (!url || !url.trim() || url === "#") return "#";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export default async function Bottomfooter() {
  const settings = await fetchShopSettings();

  const socialContact: Partial<Record<SocialKey, string>> = settings?.socialContact ?? {};

  const activeSocials = SOCIAL_ORDER.filter(
    (key) => socialContact[key] && socialContact[key]!.trim() !== ""
  );

  const displaySocials = activeSocials.length > 0 ? activeSocials : (["facebook", "instagram", "youtube"] as SocialKey[]);

  // Dynamic Shop & Company Metadata
  const shopName = settings?.shopName?.trim() || "NovaMart";
  const copyrightYear = settings?.copyrightYear || new Date().getFullYear();

  return (
    <section className="w-full bg-[#FAF9F5] text-zinc-600 py-4 sm:py-5 border-t border-zinc-200/80 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 space-y-4">
        
        {/* Row 1: Payment Gateways & Cash on Delivery Badge */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pb-3 border-b border-zinc-200/60">
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
            <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mr-1 flex items-center gap-1.5">
              <HiLockClosed className="w-3.5 h-3.5 text-emerald-600" />
              <span>নিরাপদ পেমেন্ট:</span>
            </span>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              {/* Cash on Delivery Badge */}
              <div
                className="h-7.5 px-2.5 bg-emerald-50 border border-emerald-300 rounded-md flex items-center gap-1.5 shadow-2xs hover:bg-emerald-100 transition-all shrink-0 cursor-default select-none"
                title="ক্যাশ অন ডেলিভারি সুবিধা সারা দেশে প্রযোজ্য"
              >
                <HiTruck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-[11px] font-bold text-emerald-800">ক্যাশ অন ডেলিভারি</span>
              </div>

              {/* bKash Official Badge */}
              <div
                className="h-7.5 px-2 bg-white rounded-md flex items-center gap-1.5 border border-zinc-200 shadow-2xs hover:border-pink-300 transition-all shrink-0 cursor-default select-none"
                title="bKash Mobile Payment"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none">
                  <path d="M18.9 12.9L8.5 11.2L9.9 17.8L18.9 12.9Z" fill="#E2136E"/>
                  <path d="M18.9 12.9L11.1 1.4L8.5 11.2L18.9 12.9Z" fill="#D12053"/>
                  <path d="M8.3 11.1L0.1 0L10.8 1.4L8.3 11.1Z" fill="#E2136E"/>
                  <path d="M4.6 6.5L0 1.9H1.2L4.6 6.5Z" fill="#A50034"/>
                  <path d="M21.1 7.3L19.2 12.9L16.1 8.3L21.1 7.3Z" fill="#E2136E"/>
                  <path d="M11.1 17.4L18.7 14.2L19 13.2L11.1 17.4Z" fill="#C4164C"/>
                  <path d="M5.1 23.5L8.3 11.5L10 19.3L5.1 23.5Z" fill="#E2136E"/>
                  <path d="M21.4 7.4L20.6 9.7L23.5 9.6L21.4 7.4Z" fill="#A50034"/>
                </svg>
                <span className="font-extrabold text-[11px] tracking-tight text-[#E2136E]">bKash</span>
              </div>

              {/* Nagad Official Badge */}
              <div
                className="h-7.5 px-2 bg-white rounded-md flex items-center gap-1.5 border border-zinc-200 shadow-2xs hover:border-orange-300 transition-all shrink-0 cursor-default select-none"
                title="Nagad Mobile Payment"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none">
                  <circle cx="12" cy="12" r="10" fill="url(#nagadGrad)" />
                  <defs>
                    <linearGradient id="nagadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F99F1B"/>
                      <stop offset="100%" stopColor="#ED1C24"/>
                    </linearGradient>
                  </defs>
                  <path d="M12 6C8.7 6 6 8.7 6 12C6 15.3 8.7 18 12 18C14.5 18 16.6 16.5 17.5 14.3C16.8 14.8 15.9 15.1 15 15.1C13 15.1 11.3 13.8 10.7 12C10.2 10.5 10.8 8.8 12 7.8C12 7.2 12 6.6 12 6Z" fill="#FFFFFF"/>
                </svg>
                <span className="font-extrabold text-[11px] tracking-tight text-[#ED1C24]">Nagad</span>
              </div>

              {/* Visa Official Badge */}
              <div
                className="h-7.5 px-2 bg-white rounded-md flex items-center justify-center border border-zinc-200 shadow-2xs hover:border-blue-300 transition-all shrink-0 cursor-default select-none"
                title="Visa Card Payment"
              >
                <SiVisa className="w-7 h-4 text-[#1A1F71]" />
              </div>

              {/* Mastercard Official Badge */}
              <div
                className="h-7.5 px-2 bg-white rounded-md flex items-center gap-1 border border-zinc-200 shadow-2xs hover:border-amber-300 transition-all shrink-0 cursor-default select-none"
                title="Mastercard"
              >
                <div className="flex items-center -space-x-1">
                  <div className="w-3 h-3 rounded-full bg-[#EB001B]" />
                  <div className="w-3 h-3 rounded-full bg-[#F79E1B] opacity-90" />
                </div>
                <span className="font-bold text-[10px] text-zinc-900 tracking-tight">Mastercard</span>
              </div>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-2">
            {displaySocials.map((key) => {
              const { Icon, label } = SOCIAL_ICONS[key];
              const rawHref = socialContact[key];
              const href = normalizeExternalUrl(rawHref);
              return (
                <Link
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-7.5 h-7.5 rounded-full bg-white hover:bg-emerald-600 text-zinc-600 hover:text-white border border-zinc-200 hover:border-emerald-600 transition-all flex items-center justify-center cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                >
                  <Icon className="w-3.5 h-3.5" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Row 2: Standard Copyright & Trade License matching reference screenshot */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs text-zinc-500">
          <p className="leading-relaxed">
            © {copyrightYear} <strong className="text-zinc-800 font-semibold">{shopName}</strong> — All rights reserved. | Trade License: <span className="font-mono text-zinc-600">TRAD/DNCC/1214708/2026</span>
          </p>

          <p className="text-[11px] text-zinc-400">
            Powered by Bangladesh Express Commerce Engine
          </p>
        </div>

      </div>
    </section>
  );
}
