import About from '@/components/sections/about-us/about';
import PageBanner from '@/components/ui/page-banner';

export const metadata = {
  title: "About Us - NovaMart Marketplace",
  description: "Learn more about NovaMart, our verified multi-vendor marketplace, and our commitment to authenticity, fair pay, and fresh quality.",
};

export default function AboutPage() {
  return (
    <div className="w-full">
      <PageBanner
        title="About NovaMart Marketplace"
        subtitle="Empowering verified independent vendors, authentic global brands, and conscious shoppers on one unified modern platform."
        badge="OUR MISSION & STORY"
        breadcrumbs={[
          { label: "About Us" },
        ]}
      />
      <About />
    </div>
  );
}
