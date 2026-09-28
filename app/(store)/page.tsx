import Hero from '@/components/sections/hero';
import TheCollection from '@/components/sections/the-collection';
import NewArrival from '@/components/sections/newarrival';
import PromoBanner from '@/components/sections/promo-banner';
import MostPopuler from '@/components/sections/most-populer';
import Brands from '@/components/sections/brands';
import TrustFeatures from '@/components/sections/trust-features';
import Testimonial from '@/components/sections/testimonial';
import SocialReels from '@/components/sections/social-reels';
import FounderCta from '@/components/sections/founder-cta';
import ScrollAnimate from '@/components/ui/scroll-animate';

export default function Home() {
  return (
    <div className="w-full overflow-hidden bg-[#FAF9F5]">
      {/* Dynamic Multi-Category Marketplace Hero with Category Pills */}
      <Hero />

      {/* Fresh Arrivals & Trending Drops — Products First Focus for Customers */}
      <ScrollAnimate variant="fade-in-up">
        <NewArrival />
      </ScrollAnimate>

      {/* Shop By Department / Multi-Category Cards */}
      <ScrollAnimate variant="fade-in-up">
        <TheCollection />
      </ScrollAnimate>

      {/* Dual High-Impact Promo Split Banners (Groceries & Fashion) */}
      <ScrollAnimate variant="fade-in-up">
        <PromoBanner />
      </ScrollAnimate>

      {/* Best Sellers & Customer Favorites */}
      <ScrollAnimate variant="fade-in-up">
        <MostPopuler />
      </ScrollAnimate>

      {/* Verified Vendors & Brand Partners */}
      <ScrollAnimate variant="fade-in-up">
        <Brands />
      </ScrollAnimate>

      {/* Facebook Reels & Social Media Videos */}
      <ScrollAnimate variant="fade-in-up">
        <SocialReels />
      </ScrollAnimate>

      {/* Marketplace Guarantees & Trust Features */}
      <ScrollAnimate variant="fade-in-up">
        <TrustFeatures />
      </ScrollAnimate>

      {/* Community Testimonials — Redesigned Premium Cards */}
      <ScrollAnimate variant="fade-in-up">
        <Testimonial />
      </ScrollAnimate>

      {/* Founder CTA with Abdullah's Image — Trust Builder */}
      <ScrollAnimate variant="fade-in-up">
        <FounderCta />
      </ScrollAnimate>
    </div>
  );
}
