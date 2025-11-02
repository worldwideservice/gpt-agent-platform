import { redirectToTenantPath } from "@/lib/utils/getTenantRedirect";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function PricingRedirectPage() {
  return redirectToTenantPath("/pricing");
}
