import { redirectToTenantPath } from "@/lib/utils/getTenantRedirect";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface LegacyAgentEditPageProps {
  params: Promise<{ id: string }>;
}

const LegacyAgentEditPage = async ({ params }: LegacyAgentEditPageProps) => {
  const { id } = await params;
  return redirectToTenantPath(`/ai-agents/${id}/edit`);
};

export default LegacyAgentEditPage;
