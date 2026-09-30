import type { Metadata } from "next";
import GlobalFairPayCharter from "@/components/sections/global-fair-pay/global-fair-pay-charter";
import PageBanner from "@/components/ui/page-banner";

export const metadata: Metadata = {
  title: "Global Fair Pay Charter | NovaMart",
  description:
    "NovaMart Global Fair Pay Charter — committed to guaranteed living wages, verified ethical trade, prompt vendor payments, and dignified labor standards across our multi-vendor marketplace.",
  keywords: [
    "Global Fair Pay Charter",
    "NovaMart",
    "ethical trade",
    "fair wages",
    "living wage guarantee",
    "multi vendor ethics",
    "supply chain dignity",
  ],
};

export default function GlobalFairPayCharterPage() {
  return (
    <div className="w-full">
      <PageBanner
        title="Global Fair Pay Charter"
        subtitle="Empowering workers, independent producers, and farmers through guaranteed fair wages and ethical vendor standards."
        breadcrumbs={[
          { label: "Global Fair Pay Charter" },
        ]}
      />
      <GlobalFairPayCharter />
    </div>
  );
}
