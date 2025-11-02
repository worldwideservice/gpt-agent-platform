import type { Metadata } from "next";

import { IntegrationsContent } from "@/components/integrations/IntegrationsContent";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Интеграции",
  description: "Управляйте подключением Kommo CRM и каналов коммуникаций",
};

const IntegrationsPage = () => {
  return <IntegrationsContent />;
};

export default IntegrationsPage;
