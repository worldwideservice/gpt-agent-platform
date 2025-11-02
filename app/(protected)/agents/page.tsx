import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AgentsClient } from "./_components/AgentsClient";

import { auth } from "@/auth";
import { getAgents } from "@/lib/repositories/agents";

// Отключаем prerendering - всегда динамический
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Агенты ИИ",
  description: "Управление AI-агентами и настройка их поведения",
};

const AgentsPage = async () => {
  const session = await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  try {
    const result = await getAgents({
      organizationId: session.user.orgId,
      page: 1,
      limit: 25,
    });

    return (
      <AgentsClient
        initialAgents={result.agents}
        total={result.total}
        tenantId={session.user.orgId}
      />
    );
  } catch (error) {
    // В случае ошибки возвращаем пустой массив
    return <AgentsClient initialAgents={[]} total={0} tenantId={session.user.orgId} />;
  }
};

export default AgentsPage;
