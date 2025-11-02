import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { AgentEditForm } from "@/app/(protected)/agents/[id]/_components/AgentEditForm";

import { auth } from "@/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Создание агента",
  description: "Создание нового AI-агента",
};

interface CreateAgentPageProps {
  params: Promise<{ tenantId: string }>;
}

const CreateAgentPage = async ({ params }: CreateAgentPageProps) => {
  const resolvedParams = await params;
  const { tenantId } = resolvedParams;

  const session = await auth();

  if (!session?.user?.orgId) {
    redirect("/login");
  }

  return (
    <AgentEditForm agentId="new" initialAgent={null} tenantId={tenantId} />
  );
};

export default CreateAgentPage;
