import Link from "next/link";
import Logo from "@/components/ui/logo";
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
import NewsletterSubscribeForm from "./ui/newsletter-subscribe-form";

export default async function Mainfooter() {
  const [settings, categories] = await Promise.all([
    fetchShopSettings(),
    fetchShopCategories(),
  ]);

  // Dynamic Shop Name & Slogan from Admin Dashboard Settings
  const shopName = settings?.shopName?.trim() || "NovaMart";
  const shopSlogan = settings?.slogan?.trim() || "BANGLADESH'S PREMIER MULTI-CATEGORY MART";

  // Dynamic Contact Numbers from Admin Dashboard Settings
  const rawContactEntries = parseContactEntries(settings?.contactNumber);
  const rawEmailEntries = parseContactEntries(settings?.email);

  // Filter out dummy helpline 01722301927 or unwanted desk entries
  const validContacts = rawContactEntries.filter(
    (c) =>
      !c.value.includes("01722301927") &&
      !c.title.includes("01722301927") &&
      !c.extra?.includes("NovaMart Team") &&
      !c.title?.toLowerCase().includes("executive desk")
  );

  const displayedContacts = validContacts.length > 0 ? validContacts : [
    { title: "Hotline", value: "+880 1712-345678" }
  ];

  const primaryPhone = displayedContacts[0]?.value || "+880 1712-345678";
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
    <footer className="w-full bg-white text-zinc-700 font-sans border-t border-zinc-200">
      {/* ── 1. Clean Trust Highlights Bar ── */}
      <div className="border-b border-zinc-100 bg-[#FAF9F5] py-4">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center shrink-0 border border-indigo-100">
              <HiTruck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-zinc-900 block">
                Nationwide Delivery
              </span>
              <span className="text-[11px] sm:text-xs text-zinc-500 block">
                All 64 districts in Bangladesh
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center shrink-0 border border-indigo-100">
              <HiShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-zinc-900 block">
                100% Genuine Quality
              </span>
              <span className="text-[11px] sm:text-xs text-zinc-500 block">
                Direct from verified sources
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center shrink-0 border border-indigo-100">
              <FiRefreshCw className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-zinc-900 block">
                7-Day Easy Returns
              </span>
              <span className="text-[11px] sm:text-xs text-zinc-500 block">
                Hassle-free exchange &amp; refunds
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center shrink-0 border border-indigo-100">
              <HiOutlineSupport className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-zinc-900 block">
                Dedicated Support
              </span>
              <a
                href={`tel:${primaryPhone.replace(/[^\d+]/g, "")}`}
                className="text-[11px] sm:text-xs text-[#4F46E5] hover:underline font-semibold block"
              >
                Hotline: {primaryPhone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Clean 4-Column Directory ── */}
      <div className="py-10 sm:py-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Column 1: Brand & Contact (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-6 space-y-3.5">
            <Logo variant="dark" size="md" tagline={shopSlogan} />

            <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed pt-1">
              Fresh groceries, skin care, digital electronics, perfumes, daily essentials — delivered fast at your doorstep with love. 💛
            </p>

            <div className="space-y-2 text-xs text-zinc-600 w-full pt-1">
              {displayedContacts.map((contact, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <HiPhone className="w-4 h-4 text-[#4F46E5] shrink-0" />
                  <span>
                    {contact.title ? `${contact.title}: ` : "Helpline: "}
                    <a
                      href={`tel:${contact.value.replace(/[^\d+]/g, "")}`}
                      className="text-zinc-900 font-bold hover:text-[#4F46E5] transition-colors"
                    >
                      {contact.value}
                    </a>
                  </span>
                </div>
              ))}

              {finalEmails.map((emailItem, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <HiMail className="w-4 h-4 text-[#4F46E5] shrink-0" />
                  <span>
                    {emailItem.title ? `${emailItem.title}: ` : "Email: "}
                    <a
                      href={`mailto:${emailItem.value}`}
                      className="text-zinc-700 hover:text-[#4F46E5] transition-colors"
                    >
                      {emailItem.value}
                    </a>
                  </span>
                </div>
              ))}
            </div>

            {/* Direct WhatsApp Order CTA (#EA580C Accent) */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${formattedWhatsapp}?text=Hello%20${encodeURIComponent(shopName)}%2C%20I%20would%20like%20to%20place%20an%20order.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] active:scale-95 text-white font-bold text-xs tracking-wide transition-all shadow-xs cursor-pointer"
              >
                <FaWhatsapp className="w-4 h-4 text-white" />
                <span>WhatsApp Quick Order</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (2.5 cols) */}
          <div className="lg:col-span-2 sm:col-span-1">
            <h4 className="text-zinc-950 font-bold text-sm mb-3.5">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {quickLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="text-zinc-600 hover:text-[#4F46E5] transition-colors block font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Policies (2.5 cols) */}
          <div className="lg:col-span-3 sm:col-span-1">
            <h4 className="text-zinc-950 font-bold text-sm mb-3.5">
              Policies
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {policyLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="text-zinc-600 hover:text-[#4F46E5] transition-colors block font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Top Categories (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-zinc-950 font-bold text-sm mb-3.5">
              Top Categories
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {departmentLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="text-zinc-600 hover:text-[#4F46E5] transition-colors block font-medium"
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
