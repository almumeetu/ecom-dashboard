import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaXTwitter,
  FaLinkedinIn,
} from "react-icons/fa6";
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

const POLICY_SLOTS: { key: PolicyKey; defaultLabel: string }[] = [
  { key: "delivery",     defaultLabel: "Delivery Policy"      },
  { key: "refund",       defaultLabel: "Refund Policy"        },
  { key: "return",       defaultLabel: "Return Policy"        },
  { key: "cancellation", defaultLabel: "Cancellation Policy"  },
  { key: "privacy",      defaultLabel: "Privacy Policy"       },
  { key: "terms",        defaultLabel: "Terms of Service"     },
];

function resolveActiveLinks(policies: StorePolicies | null): ActivePolicy[] {
  if (!policies) return [];
  return POLICY_SLOTS.reduce<ActivePolicy[]>((acc, slot) => {
    const entry = policies[slot.key];
    if (!entry?.content?.trim()) return acc;
    acc.push({ key: slot.key, label: entry.title?.trim() || slot.defaultLabel, entry });
    return acc;
  }, []);
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

  return (
    <section className="w-full bg-[#0B0C0E] text-zinc-400 py-7 border-t border-white/10 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left: Copyright & Policies */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-left">
          <p className="text-sm text-zinc-400 font-normal">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-white tracking-wide">NovaMart</span> Marketplace. All rights reserved.
          </p>
          <span className="hidden sm:inline text-zinc-700">|</span>
          <div className="text-sm text-zinc-400 flex items-center gap-2 flex-wrap text-left">
            <PolicyLinksBar links={activeLinks} />
          </div>
        </div>

        {/* Right: Socials & Payment Badges */}
        <div className="flex flex-wrap items-center gap-5 lg:justify-end w-full lg:w-auto">
          {/* Social Icons */}
          <div className="flex items-center gap-2">
            {displaySocials.map((key) => {
              const { Icon, label } = SOCIAL_ICONS[key];
              const href = socialContact[key] || "#";
              return (
                <Link
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white text-zinc-400 hover:text-zinc-950 border border-white/10 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                >
                  <Icon className="w-3.5 h-3.5" />
                </Link>
              );
            })}
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Payment Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mr-1">
              Secured Payments:
            </span>
            {["bKash", "Nagad", "VISA", "Mastercard", "AMEX", "Cash on Delivery"].map((method, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 tracking-wide"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
