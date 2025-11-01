"use client";

import { useEffect, useState } from "react";
import { PricingClient } from "./_components/PricingClient";

interface PricingPageProps {
  params: Promise<{ tenantId: string }>;
}

const PricingPage = ({ params }: PricingPageProps) => {
  const [resolvedParams, setResolvedParams] = useState<{
    tenantId: string;
  } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  return <PricingClient tenantId={resolvedParams.tenantId} />;
};

export default PricingPage;
