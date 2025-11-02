import { redirect } from "next/navigation";
import { Bot, CalendarCheck2, MessageSquare, Sparkles } from "lucide-react";

import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { LineChartCard } from "@/components/dashboard/LineChartCard";
import { RecentUpdates } from "@/components/dashboard/RecentUpdates";
import { KwidStatCard } from "@/components/kwid";

import { auth } from "@/auth";
import { getOnboardingState } from "@/lib/onboarding/server";
import {
  getDashboardStats,
  getWeeklyBarChartData,
  getMonthlyResponsesSeries,
  getDailyResponsesSeries,
} from "@/lib/repositories/agents";

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  params: Promise<{ tenantId: string }>;
}

const DashboardPage = async ({ params }: DashboardPageProps) => {
  const resolvedParams = await params;
  const { tenantId } = resolvedParams;

  const session = await auth();
  
  if (!session?.user?.orgId) {
    redirect("/login");
  }

  const orgId = session.user.orgId;

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
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* Kwid: "This Month AI Responses" */}
        <KwidStatCard
          title="This Month AI Responses"
          value={stats.monthlyResponses}
          change={stats.monthlyChange}
          subtitle="vs last month"
          icon={MessageSquare}
        />

        {/* Kwid: "Last 7 Days Responses" */}
        <KwidStatCard
          title="Last 7 Days Responses"
          value={stats.weeklyResponses}
          subtitle="Past 7 days"
          icon={CalendarCheck2}
        />

        {/* Kwid: "Today's AI Responses" */}
        <KwidStatCard
          title="Today's AI Responses"
          value={stats.todayResponses}
          change={stats.todayChange}
          subtitle="vs yesterday"
          icon={Sparkles}
        />

        {/* Kwid: "Agents" */}
        <KwidStatCard
          title="Agents"
          value={stats.totalAgents}
          subtitle="Total agents"
          icon={Bot}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Kwid: "This Month AI Responses" график */}
        <LineChartCard title="This Month AI Responses" data={monthlyData} />
        {/* Kwid: "Daily AI Responses" график */}
        <LineChartCard title="Daily AI Responses" data={dailyData} />
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
