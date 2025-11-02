import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";

import { AgentTrainingPage } from "./_components/AgentTrainingPage";

import { auth } from "@/auth";
import { getAgentById } from "@/lib/repositories/agents";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Обучение агента",
  description: "Управление базой знаний и обучением AI-агента",
};

interface TrainingPageProps {
  params: Promise<{ tenantId: string; id: string }>;
}

const TrainingPage = async ({ params }: TrainingPageProps) => {
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

  return (
    <AgentTrainingPage
      agentId={id}
      agentName={agent.name}
      tenantId={tenantId}
    />
  );
};

export default TrainingPage;
