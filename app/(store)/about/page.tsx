import About from '@/components/sections/about-us/about';
import PageBanner from '@/components/ui/page-banner';

export const metadata = {
  title: "About Us | Trust Point Mart — Defining Bangladesh's Multi-Category E-Commerce Standard",
  description: "Learn about Trust Point Mart, founded by entrepreneur Mohammad Abdullah in Mohadevpur, Naogaon, Rajshahi. Discover our mission to deliver authentic groceries, lifestyle fashion, tech, and verified consumer goods nationwide.",
};

export default function AboutPage() {
  return (
    <div className="w-full">
      <PageBanner
        title="About Trust Point Mart"
        subtitle="Bangladesh's trusted multi-category online hypermarket. Built on direct sourcing, zero middleman markups, and verified authenticity. Founded by Mohammad Abdullah in Mohadevpur, Naogaon, Rajshahi."
        breadcrumbs={[
          { label: "About Us" },
        ]}
      />
      <About />
    </div>
  );
}
