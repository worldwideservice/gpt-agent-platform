import { redirectToTenantPath } from "@/lib/utils/getTenantRedirect";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface LegacyAgentPageProps {
  params: Promise<{ id: string }>;
}

const LegacyAgentPage = async ({ params }: LegacyAgentPageProps) => {
  const { id } = await params;
  return redirectToTenantPath(`/ai-agents/${id}/edit`);
};

export default LegacyAgentPage;
