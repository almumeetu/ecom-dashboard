import About from '@/components/sections/about-us/about';
import PageBanner from '@/components/ui/page-banner';

export const metadata = {
  title: "About Us | NovaMart — Bangladesh's Premier Multi-Category Shopping Platform",
  description: "Discover NovaMart, Bangladesh's modern e-commerce destination for authentic skin care, digital electronics, luxury perfumes, fashion, baby care, and home essentials delivered nationwide.",
};

export default function AboutPage() {
  return (
    <div className="w-full">
      <PageBanner
        title="About NovaMart"
        subtitle="Bangladesh's premier multi-category online shopping destination. Delivering 100% genuine products with fast doorstep delivery and buyer protection across all 64 districts."
        breadcrumbs={[
          { label: "About Us" },
        ]}
      />
      <About />
    </div>
  );
}
