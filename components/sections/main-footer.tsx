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
    { title: "Hotline Support", value: "+880 1712-345678" }
  ];

  const primaryPhone = displayedContacts[0]?.value || "+880 1712-345678";
  const rawPhoneDigits = (displayedContacts[0]?.value || primaryPhone).replace(/[^\d]/g, "");
  const formattedWhatsapp = rawPhoneDigits.startsWith("88")
    ? rawPhoneDigits
    : rawPhoneDigits.startsWith("0")
    ? `88${rawPhoneDigits}`
    : `880${rawPhoneDigits}`;

  // Remove dummy email support@webdevsoftware.com if present
  const displayedEmails = rawEmailEntries.filter(
    (e) => !e.value.toLowerCase().includes("support@webdevsoftware.com") && !e.value.toLowerCase().includes("webdevsoftware")
  );
  const finalEmails = displayedEmails.length > 0 ? displayedEmails : [
    { title: "Customer Support", value: "support@novamart.com.bd" }
  ];

  // Dynamic Shop Departments (Categories) synced with Admin Dashboard
  const topCategories = (categories || []).filter((c: ShopCategory) => !c.parentId);
  const departmentLinks =
    topCategories.length > 0
      ? [
          ...topCategories.slice(0, 6).map((cat: ShopCategory) => ({
            label: cat.name,
            href: `/products?category=${encodeURIComponent(cat.slug || cat.name)}`,
          })),
          { label: "Browse All Products", href: "/products" },
        ]
      : [
          { label: "Skin Care & Beauty", href: "/products?category=Skin+Care" },
          { label: "Digital Electronics", href: "/products?category=Digital+Electronics" },
          { label: "Perfumes & Fragrances", href: "/products?category=Perfume" },
          { label: "Clothing & Fashion", href: "/products?category=Clothing" },
          { label: "Baby & Kids Products", href: "/products?category=Baby+Products" },
          { label: "Home & Living Essentials", href: "/products?category=Home+%26+Living" },
          { label: "Browse All Products", href: "/products" },
        ];

  // Essential E-Commerce Customer Care Links
  const customerLinks = [
    { label: "Track Your Order", href: "/profile?tab=track" },
    { label: "Shipping & Delivery Rates", href: "/delivery" },
    { label: "7-Day Return & Exchange", href: "/delivery" },
    { label: "Customer Help & FAQs", href: "/contact" },
    { label: "Wishlist & Saved Items", href: "/wishlist" },
    { label: "Shopping Cart", href: "/cart" },
    { label: "My Account Profile", href: "/profile" },
  ];

  // Clean, Standard E-Commerce Company Links
  const companyLinks = [
    { label: `About ${shopName}`, href: "/about" },
    { label: "Contact Customer Care", href: "/contact" },
    { label: "Nationwide Store Delivery", href: "/delivery" },
    { label: "Browse Marketplace", href: "/products" },
    { label: "Merchant & Admin Portal", href: "/admin/login" },
  ];

  return (
    <footer className="w-full bg-[#0D1117] text-zinc-200 font-sans border-t border-white/10">
      {/* ── 1. Clean, Compact Trust Highlights Bar ── */}
      <div className="border-b border-white/10 py-3.5 sm:py-4">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <HiTruck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-white block">
                Nationwide Delivery
              </span>
              <span className="text-xs text-zinc-300 block">
                All 64 districts in Bangladesh
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <HiShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-white block">
                100% Genuine Quality
              </span>
              <span className="text-xs text-zinc-300 block">
                Direct from verified sources
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <FiRefreshCw className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-white block">
                7-Day Easy Returns
              </span>
              <span className="text-xs text-zinc-300 block">
                Simple exchange &amp; refunds
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <HiOutlineSupport className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-white block">
                Dedicated Support
              </span>
              <a
                href={`tel:${primaryPhone.replace(/[^\d+]/g, "")}`}
                className="text-xs text-emerald-400 hover:underline font-semibold block"
              >
                Call: {primaryPhone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Compact Newsletter Strip ── */}
      <div className="border-b border-white/10 py-5 sm:py-6">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Stay in the Loop with {shopName}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 mt-0.5">
              Subscribe for new category arrivals, fresh stock, and exclusive marketplace offers.
            </p>
          </div>

          <NewsletterSubscribeForm />
        </div>
      </div>

      {/* ── 3. Proportional Multi-Column Directory ── */}
      <div className="py-8 sm:py-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
          
          {/* Column 1: Brand & Contact (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-6 space-y-3.5">
            <Logo variant="light" size="md" tagline={shopSlogan} />

            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
              <strong className="text-white font-semibold">{shopName}</strong> is Bangladesh&apos;s premier multi-category online store delivering authentic skin care, digital electronics, luxury perfumes, fashion, baby products, and home essentials directly to your doorstep.
            </p>

            {(displayedContacts.length > 0 || finalEmails.length > 0) && (
              <div className="space-y-2 text-xs text-zinc-200 w-full pt-1">
                {displayedContacts.map((contact, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <HiPhone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      {contact.title ? `${contact.title}: ` : "Helpline: "}
                      <a
                        href={`tel:${contact.value.replace(/[^\d+]/g, "")}`}
                        className="text-white font-bold hover:text-emerald-400 transition-colors"
                      >
                        {contact.value}
                      </a>
                      {contact.extra && <span className="text-zinc-400 ml-1">{contact.extra}</span>}
                    </span>
                  </div>
                ))}

                {finalEmails.map((emailItem, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <HiMail className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      {emailItem.title ? `${emailItem.title}: ` : "Email: "}
                      <a
                        href={`mailto:${emailItem.value}`}
                        className="text-white hover:text-emerald-400 transition-colors"
                      >
                        {emailItem.value}
                      </a>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Departments (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3.5">
              Shop Departments
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {departmentLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="text-zinc-300 hover:text-emerald-400 transition-colors block font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care (2.5 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3.5">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {customerLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="text-zinc-300 hover:text-emerald-400 transition-colors block font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Quick Links & Quick WhatsApp (2.5 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3.5">
                About &amp; Orders
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                {companyLinks.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      href={item.href}
                      className="text-zinc-300 hover:text-emerald-400 transition-colors block font-medium"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clean Direct WhatsApp Order CTA */}
            <div className="pt-1">
              <a
                href={`https://wa.me/${formattedWhatsapp}?text=Hello%20${encodeURIComponent(shopName)}%2C%20I%20would%20like%20to%20place%20an%20order.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-bold text-xs tracking-wide transition-all shadow-sm cursor-pointer"
              >
                <FaWhatsapp className="w-4 h-4 text-white" />
                <span>WhatsApp Quick Order</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}

