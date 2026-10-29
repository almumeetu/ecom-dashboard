import Link from "next/link";
import Logo from "@/components/ui/logo";
import FooterNewsletter from "@/components/sections/ui/footer-newsletter";
import { HiMail, HiPhone } from "react-icons/hi";
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

  const shopName = settings?.shopName?.trim() || "NovaMart";
  const rawContactEntries = parseContactEntries(settings?.contactNumber);
  const rawEmailEntries = parseContactEntries(settings?.email);

  const validContacts = rawContactEntries.filter(
    (contact) =>
      !contact.extra?.includes("NovaMart Team") &&
      !contact.title?.toLowerCase().includes("executive desk")
  );
  const displayedContacts = validContacts.length > 0
    ? validContacts
    : [{ title: "Hotline Support", value: "+880 1722-301927" }];

  const displayedEmails = rawEmailEntries.filter(
    (email) =>
      !email.value.toLowerCase().includes("support@webdevsoftware.com") &&
      !email.value.toLowerCase().includes("webdevsoftware")
  );
  const finalEmails = displayedEmails.length > 0
    ? displayedEmails
    : [{ title: "Customer Support", value: "support@novamart.com.bd" }];

  const rawPhoneDigits = displayedContacts[0].value.replace(/[^\d]/g, "");
  const formattedWhatsapp = rawPhoneDigits.startsWith("88")
    ? rawPhoneDigits
    : rawPhoneDigits.startsWith("0")
      ? `88${rawPhoneDigits}`
      : `880${rawPhoneDigits}`;

  const topCategories = (categories || []).filter(
    (category: ShopCategory) => !category.parentId
  );
  const departmentLinks = topCategories.length > 0
    ? topCategories.slice(0, 6).map((category: ShopCategory) => ({
        label: category.name,
        href: `/products?category=${encodeURIComponent(category.slug || category.name)}`,
      }))
    : [
        { label: "Skin Care & Beauty", href: "/products?category=skin-care" },
        { label: "Digital Electronics", href: "/products?category=digital-electronics" },
        { label: "Perfumes & Fragrances", href: "/products?category=perfume" },
        { label: "Clothing & Fashion", href: "/products?category=clothing" },
        { label: "Baby & Kids Products", href: "/products?category=baby-products" },
        { label: "Home & Living", href: "/products?category=home-living" },
      ];

  const footerGroups = [
    {
      title: "Shop",
      links: [
        { label: "All Products", href: "/products" },
        ...departmentLinks,
      ],
    },
    {
      title: "Customer Care",
      links: [
        { label: "Track an Order", href: "/profile?tab=track" },
        { label: "My Account", href: "/profile" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Policies",
      links: [
        { label: "Delivery & Shipping", href: "/delivery" },
        { label: "Returns & Refunds", href: "/returns" },
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Journal & Guides", href: "/blog" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-[#14293a] font-sans text-white">
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-[1440px] gap-4 px-4 py-7 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)] md:items-center md:gap-8 md:px-10 lg:px-16">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
              Get updates from {shopName}
            </h2>
            <p className="mt-1 text-sm leading-5 text-white/65">
              New arrivals and special offers, sent by email.
            </p>
          </div>
          <FooterNewsletter />
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-4 py-8 sm:grid-cols-2 sm:px-6 md:px-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] lg:gap-8 lg:px-16 lg:py-10">
        <div className="flex flex-col items-start gap-4">
          <Logo variant="light" size="md" />
          <div className="space-y-2.5 text-sm text-white/70">
            {displayedContacts.map((contact, index) => (
              <div key={`${contact.value}-${index}`} className="flex items-start gap-2.5">
                <HiPhone aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-store-light" />
                <span>
                  {contact.title ? `${contact.title}: ` : "Helpline: "}
                  <a
                    href={`tel:${contact.value.replace(/[^\d+]/g, "")}`}
                    className="text-white transition-colors hover:text-store-light"
                  >
                    {contact.value}
                  </a>
                </span>
              </div>
            ))}
            {finalEmails.map((email, index) => (
              <div key={`${email.value}-${index}`} className="flex items-start gap-2.5">
                <HiMail aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-store-light" />
                <span>
                  {email.title ? `${email.title}: ` : "Email: "}
                  <a
                    href={`mailto:${email.value}`}
                    className="break-all text-white/80 transition-colors hover:text-white"
                  >
                    {email.value}
                  </a>
                </span>
              </div>
            ))}
          </div>
          <a
            href={`https://wa.me/${formattedWhatsapp}?text=Hello%20${encodeURIComponent(shopName)}%2C%20I%20would%20like%20to%20place%20an%20order.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1DA851]"
          >
            <FaWhatsapp aria-hidden="true" className="h-4 w-4" />
            Order on WhatsApp
          </a>
        </div>

        {footerGroups.map((group) => (
          <nav key={group.title} aria-label={`${group.title} links`}>
            <h2 className="text-sm font-semibold text-white">{group.title}</h2>
            <ul className="mt-3 space-y-2.5">
              {group.links.map((link) => (
                <li key={`${group.title}-${link.href}`}>
                  <Link
                    href={link.href}
                    className="text-sm leading-5 text-white/65 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </footer>
  );
}
