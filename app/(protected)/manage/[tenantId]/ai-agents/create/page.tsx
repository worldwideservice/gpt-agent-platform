import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { AgentEditForm } from "@/app/(protected)/agents/[id]/_components/AgentEditForm";

import { auth } from "@/auth";

export const dynamic =
  process.env.NODE_ENV === "development" || process.env.DEMO_MODE === "true"
    ? "force-dynamic"
    : "auto";

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

  const isDemoMode =
    process.env.NODE_ENV === "development" || process.env.DEMO_MODE === "true";

  if (!isDemoMode) {
    const session = await auth();

    if (!session?.user?.orgId) {
      redirect("/login");
    }
  }

  return (
    <AgentEditForm agentId="new" initialAgent={null} tenantId={tenantId} />
  );
};

export default CreateAgentPage;
