import { redirectToTenantPath } from "@/lib/utils/getTenantRedirect";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ArticlesPage = async () => {
  // Редиректим на новый формат с tenant-id
  return redirectToTenantPath("/knowledge-items");
};

export default ArticlesPage;
