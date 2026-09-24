import type { Metadata } from "next";
import GlobalFairPayCharter from "@/components/sections/global-fair-pay/global-fair-pay-charter";
import PageBanner from "@/components/ui/page-banner";

export const metadata: Metadata = {
  title: "Global Fair Pay Charter | NovaMart Marketplace",
  description:
    "NovaMart Marketplace Global Fair Pay Charter — committed to living wages, verified ethical trade, and sustainable supply chains across independent multi-vendors and growers.",
  keywords: [
    "Global Fair Pay Charter",
    "NovaMart",
    "ethical trade",
    "fair wages",
    "sustainable sourcing",
    "multi vendor ethics",
  ],
};

export default function GlobalFairPayCharterPage() {
  return (
    <div className="w-full">
      <PageBanner
        title="Global Fair Pay Charter"
        subtitle="Empowering workers, independent producers, and farmers through guaranteed fair wages and ethical vendor standards."
        badge="ETHICAL COMMERCE"
        breadcrumbs={[
          { label: "Global Fair Pay Charter" },
        ]}
      />
      <GlobalFairPayCharter />
    </div>
  );
}
