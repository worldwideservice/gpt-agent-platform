import { redirectToTenantPath } from "@/lib/utils/getTenantRedirect";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface LegacyPipelinesPageProps {
  params: Promise<{ id: string }>;
}

const LegacyPipelinesPage = async ({ params }: LegacyPipelinesPageProps) => {
  const { id } = await params;
  return redirectToTenantPath(`/ai-agents/${id}/pipelines`);
};

export default LegacyPipelinesPage;
