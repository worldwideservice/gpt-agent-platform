import { redirect } from "next/navigation";

import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { LineChartCard } from "@/components/dashboard/LineChartCard";
import { RecentUpdates } from "@/components/dashboard/RecentUpdates";
import { SimpleDashboardStats } from "@/components/dashboard/SimpleDashboardStats";

import { auth } from "@/auth";
import { getOnboardingState } from "@/lib/onboarding/server";
import {
  getDashboardStats,
  getWeeklyBarChartData,
  getMonthlyResponsesSeries,
  getDailyResponsesSeries,
} from "@/lib/repositories/agents";
import { getOrganizationsForUser } from "@/lib/repositories/organizations";
import { generateTenantId } from "@/lib/utils/tenant";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const DashboardPage = async () => {
  const session = await auth();
  
  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId = session.user.orgId;

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

    if (orgData && orgData.slug) {
      const tenantId = generateTenantId(orgData.id, orgData.slug);
      redirect(`/manage/${tenantId}`);
    }
  }

  // Fallback - если не удалось получить tenant-id
  redirect("/login");
};

export default DashboardPage;
