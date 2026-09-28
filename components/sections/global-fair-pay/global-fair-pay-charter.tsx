import CharterHero from "@/components/sections/global-fair-pay/charter-hero";
import CharterIntro from "@/components/sections/global-fair-pay/charter-intro";
import CharterPrinciples from "@/components/sections/global-fair-pay/charter-principles";
import CharterBeneficiaries from "@/components/sections/global-fair-pay/charter-beneficiaries";
import CharterVerification from "@/components/sections/global-fair-pay/charter-verification";
import CharterFAQ from "@/components/sections/global-fair-pay/charter-faq";
import CharterCTA from "@/components/sections/global-fair-pay/charter-cta";

export default function GlobalFairPayCharter() {
  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen text-stone-900 font-sans">
      {/* 1. Hero Section */}
      <CharterHero />

      {/* 2. Impact & Key Metrics */}
      <CharterIntro />

      {/* 3. The 8 Foundational Articles */}
      <CharterPrinciples />

      {/* 4. Who the Charter Protects (Beneficiaries) */}
      <CharterBeneficiaries />

      {/* 5. 4-Stage Verification & Compliance Engine */}
      <CharterVerification />

      {/* 6. Frequently Asked Questions */}
      <CharterFAQ />

      {/* 7. Call To Action & Partner Commitment */}
      <CharterCTA />
    </div>
  );
}
