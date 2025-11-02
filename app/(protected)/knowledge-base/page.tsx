import { redirectToTenantPath } from "@/lib/utils/getTenantRedirect";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const KnowledgeBaseRedirectPage = async () => {
  // Редиректим на категории базы знаний с tenant-id
  return redirectToTenantPath("/knowledge-categories");
};

export default KnowledgeBaseRedirectPage;
