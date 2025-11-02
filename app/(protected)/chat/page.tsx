/**
 * Серверный редирект для старого пути /chat
 * Редиректит на /manage/[tenantId]/test-chat
 */
import { redirectToTenantPath } from "@/lib/utils/getTenantRedirect";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function ChatRedirectPage() {
  return redirectToTenantPath("/test-chat");
}

