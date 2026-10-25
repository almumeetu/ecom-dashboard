import Link from "next/link";
import Logo from "@/components/ui/logo";
import FooterNewsletter from "@/components/sections/ui/footer-newsletter";
import {
  HiPhone,
  HiMail,
  HiShieldCheck,
  HiTruck,
  HiOutlineSupport,
} from "react-icons/hi";
import { FiRefreshCw } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import {
  fetchShopSettings,
  fetchShopCategories,
  parseContactEntries,
  type ShopCategory,
} from "@/lib/shop-api";

export default async function Mainfooter() {
  const [settings, categories] = await Promise.all([
    fetchShopSettings(),
    fetchShopCategories(),
  ]);

  // Dynamic Shop Name from Admin Dashboard Settings
  const shopName = settings?.shopName?.trim() || "NovaMart";

  // Dynamic Contact Numbers from Admin Dashboard Settings
  const rawContactEntries = parseContactEntries(settings?.contactNumber);
  const rawEmailEntries = parseContactEntries(settings?.email);

  // Contact Numbers from Admin Dashboard Settings
  const validContacts = rawContactEntries.filter(
    (c) =>
      !c.extra?.includes("NovaMart Team") &&
      !c.title?.toLowerCase().includes("executive desk")
  );

  const displayedContacts = validContacts.length > 0 ? validContacts : [
    { title: "Hotline Support", value: "+880 1722-301927" }
  ];

  const primaryPhone = displayedContacts[0]?.value || "+880 1722-301927";
  const rawPhoneDigits = (displayedContacts[0]?.value || primaryPhone).replace(/[^\d]/g, "");
  const formattedWhatsapp = rawPhoneDigits.startsWith("88")
    ? rawPhoneDigits
    : rawPhoneDigits.startsWith("0")
    ? `88${rawPhoneDigits}`
    : `880${rawPhoneDigits}`;

  // Filter out unwanted dummy emails
  const displayedEmails = rawEmailEntries.filter(
    (e) => !e.value.toLowerCase().includes("support@webdevsoftware.com") && !e.value.toLowerCase().includes("webdevsoftware")
  );
  const finalEmails = displayedEmails.length > 0 ? displayedEmails : [
    { title: "Customer Support", value: "support@novamart.com.bd" }
  ];

  // Dynamic Shop Departments (Categories)
  const topCategories = (categories || []).filter((c: ShopCategory) => !c.parentId);
  const departmentLinks =
    topCategories.length > 0
      ? [
          ...topCategories.slice(0, 6).map((cat: ShopCategory) => ({
            label: cat.name,
            href: `/products?category=${encodeURIComponent(cat.slug || cat.name)}`,
          })),
        ]
      : [
          { label: "Skin Care & Beauty", href: "/products?category=skin-care" },
          { label: "Digital Electronics", href: "/products?category=digital-electronics" },
          { label: "Perfumes & Fragrances", href: "/products?category=perfume" },
          { label: "Clothing & Fashion", href: "/products?category=clothing" },
          { label: "Baby & Kids Products", href: "/products?category=baby-products" },
          { label: "Home & Living", href: "/products?category=home-living" },
        ];

  // Quick Links
  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Shop All", href: "/products" },
    { label: "Journal & Guides", href: "/blog" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Track Order", href: "/profile?tab=track" },
    { label: "My Account", href: "/profile" },
  ];

  // Standard Policies
  const policyLinks = [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Returns & Refunds", href: "/returns" },
    { label: "Delivery & Shipping Rates", href: "/delivery" },
    { label: "Customer FAQs", href: "/contact" },
  ];

  return (
    <footer className="relative isolate w-full overflow-hidden border-t border-store-deep/20 bg-gradient-to-br from-[#192B3B] via-store-deep to-[#101C2A] font-sans text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -right-32 -top-40 h-96 w-96 rounded-full bg-store-accent/20 blur-3xl" />
        <div className="absolute -bottom-48 left-[28%] h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" />
      </div>
      {/* ── 1. Clean Trust Highlights Bar ── */}
      <div className="relative border-b border-white/10 bg-white/[0.04] py-4 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-store-light flex items-center justify-center shrink-0 border border-white/10">
              <HiTruck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-semibold text-white block">
                Delivery Information
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-store-light flex items-center justify-center shrink-0 border border-white/10">
              <HiShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-semibold text-white block">
                100% Genuine Quality
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-store-light flex items-center justify-center shrink-0 border border-white/10">
              <FiRefreshCw className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-semibold text-white block">
                7-Day Easy Returns
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-store-light flex items-center justify-center shrink-0 border border-white/10">
              <HiOutlineSupport className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-semibold text-white block">
                Dedicated Support
              </span>
              <a
                href={`tel:${primaryPhone.replace(/[^\d+]/g, "")}`}
                className="text-[11px] sm:text-xs text-white/65 hover:text-white hover:underline font-semibold block"
              >
                Hotline: {primaryPhone}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="relative pt-8 sm:pt-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <section className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-lg shadow-black/10 sm:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)] sm:items-center sm:gap-8 sm:p-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-store-light">The NovaMart edit</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">Good finds, useful ideas, delivered occasionally.</h3>
              <p className="mt-2 text-sm leading-6 text-white/65">Join our newsletter for new arrivals, thoughtful guides, and member-only offers.</p>
            </div>
            <FooterNewsletter />
          </section>
        </div>
      </div>

      {/* ── 2. Clean 4-Column Directory ── */}
      <div className="py-10 sm:py-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Column 1: Brand & Contact (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-6 space-y-3.5">
            <Logo variant="light" size="md" />

            <div className="space-y-2 text-xs text-white/65 w-full pt-1">
              {displayedContacts.map((contact, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <HiPhone className="w-4 h-4 text-store-light shrink-0" />
                  <span>
                    {contact.title ? `${contact.title}: ` : "Helpline: "}
                    <a
                      href={`tel:${contact.value.replace(/[^\d+]/g, "")}`}
                      className="text-white font-semibold hover:text-store-light transition-colors"
                    >
                      {contact.value}
                    </a>
                  </span>
                </div>
              ))}

              {finalEmails.map((emailItem, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <HiMail className="w-4 h-4 text-store-light shrink-0" />
                  <span>
                    {emailItem.title ? `${emailItem.title}: ` : "Email: "}
                    <a
                      href={`mailto:${emailItem.value}`}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      {emailItem.value}
                    </a>
                  </span>
                </div>
              ))}
            </div>

            {/* Direct WhatsApp Order CTA */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${formattedWhatsapp}?text=Hello%20${encodeURIComponent(shopName)}%2C%20I%20would%20like%20to%20place%20an%20order.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1DA851] active:scale-95 text-white font-semibold text-xs tracking-wide transition-all shadow-sm cursor-pointer"
              >
                <FaWhatsapp className="w-4 h-4 text-white" />
                <span>WhatsApp Quick Order</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (2.5 cols) */}
          <div className="lg:col-span-2 sm:col-span-1">
            <h4 className="text-white font-semibold text-sm mb-3.5">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {quickLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="text-white/65 hover:text-white transition-colors block font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Policies (2.5 cols) */}
          <div className="lg:col-span-3 sm:col-span-1">
            <h4 className="text-white font-semibold text-sm mb-3.5">
              Policies
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {policyLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="text-white/65 hover:text-white transition-colors block font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Top Categories (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-semibold text-sm mb-3.5">
              Top Categories
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {departmentLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="text-white/65 hover:text-white transition-colors block font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}
