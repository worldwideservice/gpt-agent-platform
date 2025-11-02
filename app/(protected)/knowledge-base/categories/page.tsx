import { redirectToTenantPath } from "@/lib/utils/getTenantRedirect";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CategoriesPage = async () => {
  // Редиректим на новый формат с tenant-id
  return redirectToTenantPath("/knowledge-categories");
};

export default CategoriesPage;
