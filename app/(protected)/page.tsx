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

    if (orgData) {
      const tenantId = generateTenantId(orgData.id, orgData.slug);
      redirect(`/manage/${tenantId}`);
    }
  }

  const onboardingState = await getOnboardingState(orgId);
  if (!onboardingState.isCompleted) {
    redirect("/onboarding");
  }

  const [stats, weeklyBarData, monthlyData, dailyData] = await Promise.all([
    getDashboardStats(orgId),
    getWeeklyBarChartData(orgId),
    getMonthlyResponsesSeries(orgId, 6),
    getDailyResponsesSeries(orgId, 14),
  ]);

  // Пока нет реальных обновлений - используем пустой массив
  // TODO: Реализовать получение реальных обновлений из БД/уведомлений
  const recentUpdates: Array<{
    id: string;
    message: string;
    timestamp: string;
    color: "green" | "blue" | "purple" | "yellow";
  }> = [];

  return (
    <div className="space-y-8">
      <SimpleDashboardStats stats={stats} />

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LineChartCard title="Ответы ИИ за этот месяц" data={monthlyData} />
        <LineChartCard title="Ответы ИИ за день" data={dailyData} />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BarChartCard
          title="Активность за последние 7 дней"
          data={weeklyBarData}
        />
        <RecentUpdates updates={recentUpdates} />
      </section>
    </div>
  );
};

export default DashboardPage;
