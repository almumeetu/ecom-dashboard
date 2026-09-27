import About from '@/components/sections/about-us/about';
import PageBanner from '@/components/ui/page-banner';

export const metadata = {
  title: "About Us | Trust Point — সরাসরি বাগান থেকে আপনার বাড়ি",
  description: "Learn about Trust Point, founded by Mohammad Abdullah in Mohadevpur, Naogaon, Rajshahi. 100% formalin-free fresh mangoes, authentic agro produce, and verified lifestyle marketplace in Bangladesh.",
};

export default function AboutPage() {
  return (
    <div className="w-full">
      <PageBanner
        title="About Trust Point (ট্রাস্ট পয়েন্ট)"
        subtitle="সরাসরি বাগান থেকে আপনার বাড়ি, মাঝে কোনো আড়ত বা মধ্যস্বত্বভোগী নেই। তাই শতভাগ ফরমালিনমুক্ত ও খাঁটি সতেজতার গ্যারান্টি। প্রতিষ্ঠাতা: Mohammad Abdullah, মহাদেবপুর, নওগাঁ, রাজশাহী।"
        badge="FOUNDER & CEO: MOHAMMAD ABDULLAH • MOHADEVPUR, NAOGAON, RAJSHAHI"
        breadcrumbs={[
          { label: "About Trust Point" },
        ]}
      />
      <About />
    </div>
  );
}
