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
import { fetchShopSettings, fetchStorePolicies, type PolicyKey, type StorePolicies } from "@/lib/shop-api";
import { PolicyLinksBar, type ActivePolicy } from "./ui/policy-links-bar";

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

const POLICY_SLOTS: { key: PolicyKey; defaultLabel: string; defaultContent: string }[] = [
  {
    key: "delivery",
    defaultLabel: "Delivery Policy",
    defaultContent: "<p>We offer reliable nationwide delivery across all 64 districts in Bangladesh. Orders inside Dhaka are delivered within 24-48 hours. Orders across all other divisions and districts are dispatched via trusted logistics partners and arrive within 2-4 business days. Real-time SMS and dispatch tracking are provided for every parcel.</p>",
  },
  {
    key: "refund",
    defaultLabel: "Refund Policy",
    defaultContent: "<p>If an item arrives damaged, defective, or incorrect, you are entitled to a full refund. Once our verification team receives the returned parcel, refunds are processed within 3-5 business days directly through your original payment method (bKash, Nagad, Card, or Bank transfer).</p>",
  },
  {
    key: "return",
    defaultLabel: "Return Policy",
    defaultContent: "<p>We maintain an easy 7-day return and exchange policy. Items must be unused, unwashed, and in their original packaging with intact product tags and receipt. Please contact our customer care or helpline to initiate a return pickup.</p>",
  },
  {
    key: "cancellation",
    defaultLabel: "Cancellation Policy",
    defaultContent: "<p>You may cancel your order free of charge at any time before it is dispatched from our central hub. Once the shipment has been handed over to the courier, cancellations cannot be processed directly, but you may request a return upon delivery.</p>",
  },
  {
    key: "privacy",
    defaultLabel: "Privacy Policy",
    defaultContent: "<p>Your privacy is strictly guarded. We never sell or share your personal contact details, delivery addresses, or payment credentials. All transactions are protected by bank-level 256-bit SSL encryption to guarantee complete checkout security.</p>",
  },
  {
    key: "terms",
    defaultLabel: "Terms of Service",
    defaultContent: "<p>Welcome to our online marketplace. By accessing our platform and placing orders, you agree to authentic product representations, fair pricing, and standard customer service guidelines. All products sold are verified genuine and sourced through authorized suppliers.</p>",
  },
];

function resolveActiveLinks(policies: StorePolicies | null): ActivePolicy[] {
  return POLICY_SLOTS.map((slot) => {
    const entry = policies?.[slot.key];
    const hasCustomContent = entry?.content && entry.content.trim().length > 0;
    return {
      key: slot.key,
      label: entry?.title?.trim() || slot.defaultLabel,
      entry: {
        title: entry?.title?.trim() || slot.defaultLabel,
        content: hasCustomContent ? entry!.content : slot.defaultContent,
      },
    };
  });
}

function normalizeExternalUrl(url?: string | null): string {
  if (!url || !url.trim() || url === "#") return "#";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export default async function Bottomfooter() {
  const [settings, policies] = await Promise.all([
    fetchShopSettings(),
    fetchStorePolicies(),
  ]);

  const activeLinks = resolveActiveLinks(policies);
  const socialContact: Partial<Record<SocialKey, string>> = settings?.socialContact ?? {};

  const activeSocials = SOCIAL_ORDER.filter(
    (key) => socialContact[key] && socialContact[key]!.trim() !== ""
  );

  const displaySocials = activeSocials.length > 0 ? activeSocials : (["facebook", "instagram", "youtube"] as SocialKey[]);

  // Dynamic Shop & Company Metadata from Admin Settings
  const shopName = settings?.shopName?.trim() || "NovaMart";
  const copyrightYear = settings?.copyrightYear || new Date().getFullYear();
  const parentCompany = settings?.parentCompany?.trim();
  const parentCompanyLink = settings?.parentCompanyLink?.trim();

  return (
    <section className="w-full bg-[#080B0F] text-zinc-200 py-4 sm:py-5 border-t border-white/10 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 space-y-3.5">
        
        {/* Row 1: Vivid, Realistic Payment Gateways & Verified Security */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 pb-3.5 border-b border-white/[0.08]">
          {/* Payment Gateways Strip */}
          <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-start">
            <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mr-1 flex items-center gap-1.5">
              <HiLockClosed className="w-3.5 h-3.5 text-emerald-400" />
              <span>We Accept:</span>
            </span>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              {/* bKash Official Badge */}
              <div
                className="h-7.5 px-2 bg-white rounded-md flex items-center gap-1.5 border border-zinc-200/90 shadow-2xs hover:border-pink-300 hover:shadow-xs transition-all shrink-0 cursor-default select-none"
                title="bKash Mobile Payment"
              >
                <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 shrink-0" fill="none">
                  <path d="M18.9 12.9L8.5 11.2L9.9 17.8L18.9 12.9Z" fill="#E2136E"/>
                  <path d="M18.9 12.9L11.1 1.4L8.5 11.2L18.9 12.9Z" fill="#D12053"/>
                  <path d="M8.3 11.1L0.1 0L10.8 1.4L8.3 11.1Z" fill="#E2136E"/>
                  <path d="M4.6 6.5L0 1.9H1.2L4.6 6.5Z" fill="#A50034"/>
                  <path d="M21.1 7.3L19.2 12.9L16.1 8.3L21.1 7.3Z" fill="#E2136E"/>
                  <path d="M11.1 17.4L18.7 14.2L19 13.2L11.1 17.4Z" fill="#C4164C"/>
                  <path d="M5.1 23.5L8.3 11.5L10 19.3L5.1 23.5Z" fill="#E2136E"/>
                  <path d="M21.4 7.4L20.6 9.7L23.5 9.6L21.4 7.4Z" fill="#A50034"/>
                </svg>
                <span className="font-extrabold text-[12px] tracking-tight text-[#E2136E]">bKash</span>
              </div>

              {/* Nagad Official Badge */}
              <div
                className="h-7.5 px-2 bg-white rounded-md flex items-center gap-1.5 border border-zinc-200/90 shadow-2xs hover:border-orange-300 hover:shadow-xs transition-all shrink-0 cursor-default select-none"
                title="Nagad Mobile Payment"
              >
                <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 shrink-0" fill="none">
                  <circle cx="12" cy="12" r="10" fill="url(#nagadGrad)" />
                  <defs>
                    <linearGradient id="nagadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F99F1B"/>
                      <stop offset="100%" stopColor="#ED1C24"/>
                    </linearGradient>
                  </defs>
                  <path d="M12 6C8.7 6 6 8.7 6 12C6 15.3 8.7 18 12 18C14.5 18 16.6 16.5 17.5 14.3C16.8 14.8 15.9 15.1 15 15.1C13 15.1 11.3 13.8 10.7 12C10.2 10.5 10.8 8.8 12 7.8C12 7.2 12 6.6 12 6Z" fill="#FFFFFF"/>
                </svg>
                <span className="font-extrabold text-[12px] tracking-tight text-[#ED1C24]">Nagad</span>
              </div>

              {/* Rocket Official Badge */}
              <div
                className="h-7.5 px-2 bg-white rounded-md flex items-center gap-1.5 border border-zinc-200/90 shadow-2xs hover:border-purple-300 hover:shadow-xs transition-all shrink-0 cursor-default select-none"
                title="DBBL Rocket Payment"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="#8C3494">
                  <path d="M13.1 1.5L9.5 5.5L9.8 7.6L10.5 6.2L12.6 8.9L15.6 0L5.7 4.1L8.4 5.5L13.3 2.1L13.1 1.5Z"/>
                  <circle cx="5" cy="17" r="2.5" fill="#8C3494"/>
                  <path d="M9.5 9.5H3.5C0.5 10 0.2 14.2 3.5 14.8H7.5V11C8.8 11 9.1 12.6 8.1 13.2L12 10C11.5 9.6 10.5 9.5 9.5 9.5Z"/>
                </svg>
                <span className="font-extrabold text-[12px] tracking-tight text-[#8C3494]">Rocket</span>
              </div>

              {/* Upay Official Badge */}
              <div
                className="h-7.5 px-2 bg-white rounded-md flex items-center gap-1 border border-zinc-200/90 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all shrink-0 cursor-default select-none"
                title="Upay Payment"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-[#003B73] flex items-center justify-center text-[9px] text-[#FFC709] font-black leading-none">
                  u
                </div>
                <span className="font-black text-[12px] tracking-tight text-[#003B73]">upay</span>
              </div>

              {/* Visa Official Badge (React Icon) */}
              <div
                className="h-7.5 px-2.5 bg-white rounded-md flex items-center justify-center border border-zinc-200/90 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all shrink-0 cursor-default select-none"
                title="Visa Card Payment"
              >
                <SiVisa className="w-8 h-4.5 text-[#1A1F71]" />
              </div>

              {/* Mastercard Official Badge */}
              <div
                className="h-7.5 px-2.5 bg-white rounded-md flex items-center gap-1.5 border border-zinc-200/90 shadow-2xs hover:border-amber-300 hover:shadow-xs transition-all shrink-0 cursor-default select-none"
                title="Mastercard"
              >
                <div className="flex items-center -space-x-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-90" />
                </div>
                <span className="font-bold text-[11px] text-zinc-900 tracking-tight">Mastercard</span>
              </div>

              {/* American Express (React Icon) */}
              <div
                className="h-7.5 px-2 bg-white rounded-md flex items-center justify-center border border-zinc-200/90 shadow-2xs hover:border-sky-300 hover:shadow-xs transition-all shrink-0 cursor-default select-none"
                title="American Express"
              >
                <FaCcAmex className="w-6.5 h-4.5 text-[#016FD0]" />
              </div>

              {/* Cash on Delivery Badge */}
              <div
                className="h-7.5 px-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-md flex items-center gap-1.5 shadow-2xs hover:bg-emerald-500/15 transition-all shrink-0 cursor-default select-none"
                title="Cash on Delivery Available Nationwide"
              >
                <HiTruck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px] font-bold text-emerald-300">Cash on Delivery</span>
              </div>
            </div>
          </div>

          {/* Clean Security Seal */}
          <div className="flex items-center gap-2 text-xs text-zinc-300 shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-200 font-medium">256-Bit SSL Encrypted &amp; Verified Checkout</span>
          </div>
        </div>

        {/* Row 2: Dynamic Policy Links synced with Admin Settings */}
        {activeLinks.length > 0 && (
          <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap text-xs text-zinc-300">
            <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
              Policies:
            </span>
            <PolicyLinksBar links={activeLinks} />
          </div>
        )}

        {/* Row 3: Clean Copyright & Social Media (Admin Synced) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left pt-0.5">
          <p className="text-xs text-zinc-300 font-normal leading-relaxed">
            © {copyrightYear}{" "}
            <span className="font-bold text-white tracking-wide">{shopName}</span>. All Rights Reserved.
            {parentCompany && (
              <>
                {" "}• Part of{" "}
                {parentCompanyLink ? (
                  <a
                    href={normalizeExternalUrl(parentCompanyLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 font-semibold hover:underline"
                  >
                    {parentCompany}
                  </a>
                ) : (
                  <span className="text-emerald-400 font-semibold">{parentCompany}</span>
                )}
              </>
            )}
          </p>

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
                  className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-emerald-500 text-zinc-300 hover:text-white border border-white/10 hover:border-emerald-400 transition-all duration-150 flex items-center justify-center cursor-pointer shadow-xs hover:scale-105 active:scale-95"
                >
                  <Icon className="w-3.5 h-3.5" />
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
