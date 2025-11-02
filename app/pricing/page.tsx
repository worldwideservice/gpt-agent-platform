import type { Metadata } from "next";

import { PricingPublic } from "@/components/pricing/PricingPublic";

export const metadata: Metadata = {
  title: "Тарифы GPT Agent",
  description:
    "Сравните тарифы GPT Agent и выберите подходящий план для запуска AI-агентов и автоматизации коммуникаций.",
};

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <PricingPublic />
      </div>
    </div>
  );
};

export default PricingPage;
