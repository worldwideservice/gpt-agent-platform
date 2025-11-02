import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";

import { PipelinesClient } from "./_components/PipelinesClient";

import { auth } from "@/auth";
import { getAgentById } from "@/lib/repositories/agents";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Настройка воронок",
  description: "Управление воронками продаж для AI-агента",
};

interface PipelinesPageProps {
  params: Promise<{ tenantId: string; id: string }>;
}

const PipelinesPage = async ({ params }: PipelinesPageProps) => {
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
    <PipelinesClient agentId={id} agentName={agent.name} tenantId={tenantId} />
  );
};

export default PipelinesPage;
