import { redirect } from "next/navigation";
import { Bot, CalendarCheck2, MessageSquare, Sparkles } from "lucide-react";

import { LineChartCard } from "@/components/dashboard/LineChartCard";
import { KwidStatCard } from "@/components/kwid";

import { auth } from "@/auth";
import { getOnboardingState } from "@/lib/onboarding/server";
import {
  getDashboardStats,
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
  // Временно отключаем редирект на онбординг для отладки
  // if (!onboardingState.isCompleted) {
  //   redirect("/onboarding");
  // }

  const [stats, monthlyData, dailyData] = await Promise.all([
    getDashboardStats(orgId),
    getMonthlyResponsesSeries(orgId, 6),
    getDailyResponsesSeries(orgId, 14),
  ]);

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* Kwid: "Ответы ИИ за этот месяц" */}
        <KwidStatCard
          title="Ответы ИИ за этот месяц"
          value={stats.monthlyResponses}
          change={stats.monthlyChange}
          subtitle="к прошлому месяцу"
          icon={MessageSquare}
        />

        {/* Kwid: "Ответы ИИ за последние 7 дней" */}
        <KwidStatCard
          title="Ответы ИИ за последние 7 дней"
          value={stats.weeklyResponses}
          icon={CalendarCheck2}
        />

        {/* Kwid: "Ответы ИИ сегодня" */}
        <KwidStatCard
          title="Ответы ИИ сегодня"
          value={stats.todayResponses}
          change={stats.todayChange}
          subtitle="к вчерашнему дню"
          icon={Sparkles}
        />

        {/* Kwid: "Агенты" */}
        <KwidStatCard
          title="Агенты"
          value={stats.totalAgents}
          subtitle="Всего агентов"
          icon={Bot}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Kwid: "Ответы ИИ за этот месяц" график */}
        <LineChartCard title="Ответы ИИ за этот месяц" data={monthlyData} />
        {/* Kwid: "Ответы ИИ за день" график */}
        <LineChartCard title="Ответы ИИ за день" data={dailyData} />
      </section>
    </div>
  );
};

export default DashboardPage;
