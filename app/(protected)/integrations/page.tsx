import { redirectToTenantPath } from "@/lib/utils/getTenantRedirect";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const LegacyIntegrationsPage = async () => redirectToTenantPath("/integrations");

export default LegacyIntegrationsPage;
