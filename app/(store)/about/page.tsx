import About from '@/components/sections/about-us/about';
import PageBanner from '@/components/ui/page-banner';
import PolicyNav from '@/components/sections/policy/policy-nav';

export const metadata = {
  title: "About Us | NovaMart — Bangladesh's Premier Multi-Category Shopping Platform",
  description: "Discover NovaMart, a multi-category online store featuring skin care, digital electronics, perfumes, fashion, baby care, and home essentials.",
};

export default function AboutPage() {
  return (
    <div className="w-full">
      <PageBanner
        title="About NovaMart"
        subtitle="Explore products across skin care, electronics, fashion, baby care, and home essentials. Delivery options and charges are shown at checkout."
        breadcrumbs={[
          { label: "About Us" },
        ]}
      />
      <PolicyNav currentKey="about" />
      <About />
    </div>
  );
}
