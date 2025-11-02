import type { Metadata } from "next";

import { SupportContent } from "@/components/support/SupportContent";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Центр поддержки",
  description: "Руководства и помощь по работе с платформой GPT Agent",
};

const SupportPage = () => {
  return <SupportContent variant="internal" />;
};

export default SupportPage;
