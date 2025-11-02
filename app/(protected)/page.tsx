import { redirectToTenantPath } from "@/lib/utils/getTenantRedirect";

export const dynamic = "force-dynamic";

const DashboardPage = async () => {
  // Редиректим на формат с tenant-id используя единую логику
  return redirectToTenantPath("/");
};

export default DashboardPage;
