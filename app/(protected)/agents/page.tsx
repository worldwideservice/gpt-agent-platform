import type { Metadata } from "next";
import { redirectToTenantPath } from "@/lib/utils/getTenantRedirect";

// Отключаем prerendering - всегда динамический
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Агенты ИИ",
  description: "Управление AI-агентами и настройка их поведения",
};

const AgentsPage = async () => {
  // Редиректим на новый формат с tenant-id
  return redirectToTenantPath("/ai-agents");
};

export default AgentsPage;
