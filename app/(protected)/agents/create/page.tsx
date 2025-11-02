import { redirectToTenantPath } from "@/lib/utils/getTenantRedirect";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CreateAgentLegacyRedirect = async () => {
  return redirectToTenantPath("/ai-agents/create");
};

export default CreateAgentLegacyRedirect;
