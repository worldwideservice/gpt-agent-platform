import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getOrganizationsForUser } from "@/lib/repositories/organizations";
import { generateTenantId } from "@/lib/utils/tenant";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const DashboardPage = async () => {
  const session = await auth();
  
  if (!session?.user?.orgId) {
    redirect("/login");
  }

  // Редиректим на формат с tenant-id
  const organizations = await getOrganizationsForUser(session.user.id);
  const activeOrganization =
    organizations.find(
      (organization) => organization.id === session.user.orgId,
    ) ??
    organizations[0] ??
    null;

  if (activeOrganization) {
    const supabase = getSupabaseServiceRoleClient();
    const { data: orgData } = await supabase
      .from("organizations")
      .select("id, slug")
      .eq("id", activeOrganization.id)
      .single();

    if (orgData) {
      const tenantId = generateTenantId(orgData.id, orgData.slug);
      redirect(`/manage/${tenantId}`);
    }
  }

  // Если не удалось найти организацию, показываем простую заглушку
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl font-bold">Добро пожаловать</h1>
      <p>Идет перенаправление...</p>
    </div>
  );
};

export default DashboardPage;
