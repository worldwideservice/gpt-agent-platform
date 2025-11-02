import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";

import { AgentEditForm } from "@/app/(protected)/agents/[id]/_components/AgentEditForm";

import { auth } from "@/auth";
import { getAgentById } from "@/lib/repositories/agents";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Редактирование агента",
  description: "Настройка параметров и поведения AI-агента",
};

interface EditAgentPageProps {
  params: Promise<{ tenantId: string; id: string }>;
}

const EditAgentPage = async ({ params }: EditAgentPageProps) => {
  const resolvedParams = await params;
  const { id, tenantId } = resolvedParams;

  const session = await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const agent = await getAgentById(id, session.user.orgId);

  if (!agent) {
    notFound();
  }

  // Ensure agent has all required fields
  const agentWithDefaults = {
    ...agent,
    messagesTotal: agent.messagesTotal ?? 0,
    lastActivityAt: agent.lastActivityAt ?? null,
    ownerName: agent.ownerName ?? null,
  };

  return (
    <AgentEditForm
      agentId={id}
      initialAgent={agentWithDefaults}
      tenantId={tenantId}
    />
  );
};

export default EditAgentPage;
