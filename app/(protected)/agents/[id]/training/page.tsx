import { redirectToTenantPath } from "@/lib/utils/getTenantRedirect";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface LegacyTrainingPageProps {
  params: Promise<{ id: string }>;
}

const LegacyTrainingPage = async ({ params }: LegacyTrainingPageProps) => {
  const { id } = await params;
  return redirectToTenantPath(`/ai-agents/${id}/training`);
};

export default LegacyTrainingPage;
