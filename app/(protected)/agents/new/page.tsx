import { redirectToTenantPath } from "@/lib/utils/getTenantRedirect";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NewAgentPage = async () => redirectToTenantPath("/ai-agents/create");

export default NewAgentPage;
