import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { AgentsClient } from "@/app/(protected)/agents/_components/AgentsClient";

import { auth } from "@/auth";
import { getAgents } from "@/lib/repositories/agents";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Агенты ИИ",
  description: "Управление AI-агентами и настройка их поведения",
};

interface AgentsPageProps {
  params: Promise<{ tenantId: string }>;
}

const AgentsPage = async ({ params }: AgentsPageProps) => {
  const resolvedParams = await params;
  const session = await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const result = await getAgents({ organizationId: session.user.orgId });
  const agents = result.agents;
  const total = result.total;

  return (
    <AgentsClient
      initialAgents={agents}
      total={total}
      tenantId={resolvedParams.tenantId}
    />
  );
};

export default AgentsPage;
