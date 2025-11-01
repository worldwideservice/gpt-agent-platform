import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { AgentsClient } from "./_components/AgentsClient";

import { auth } from "@/auth";
import { getAgents } from "@/lib/repositories/agents";

// Отключаем prerendering - всегда динамический
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Агенты ИИ",
  description: "Управление AI-агентами и настройка их поведения",
};

const AgentsPage = async () => {
  // Демо режим для локального тестирования и администратора
  const isDemoMode =
    process.env.NODE_ENV === "development" ||
    process.env.DEMO_MODE === "true" ||
    process.env.VERCEL_ENV !== "production"; // Временное решение для продакшена

  let agents, total;

  // Всегда используем демо-режим пока не исправлена авторизация
  const useDemoData = true;

  if (isDemoMode || useDemoData) {
    // Mock данные для демо-режима
    agents = [
      {
        id: "demo-agent-1",
        name: "Техническая поддержка",
        status: "active" as const,
        model: "gpt-4o-mini",
        messagesTotal: 1250,
        lastActivityAt: new Date().toISOString(),
        ownerName: "Demo User",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        temperature: 0.7,
        maxTokens: 4000,
        responseDelaySeconds: 2,
        instructions: "Вы - специалист технической поддержки...",
        settings: {},
      },
      {
        id: "demo-agent-2",
        name: "Продажи",
        status: "active" as const,
        model: "claude-3-haiku",
        messagesTotal: 890,
        lastActivityAt: new Date().toISOString(),
        ownerName: "Demo User",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        temperature: 0.8,
        maxTokens: 4000,
        responseDelaySeconds: 3,
        instructions: "Вы - менеджер по продажам...",
        settings: {},
      },
      {
        id: "demo-agent-3",
        name: "Консультации",
        status: "inactive" as const,
        model: "gpt-4o-mini",
        messagesTotal: 234,
        lastActivityAt: null,
        ownerName: "Demo User",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        temperature: 0.6,
        maxTokens: 4000,
        responseDelaySeconds: 1,
        instructions: "Вы - консультант по продуктам...",
        settings: {},
      },
    ];
    total = 3;
  } else {
    const session = await auth();

    // Для администратора показываем демо-данные
    if (session?.user?.email === "admin@worldwideservice.eu") {
      agents = [
        {
          id: "admin-agent-1",
          name: "Техническая поддержка",
          status: "active" as const,
          model: "gpt-4o-mini",
          messagesTotal: 1250,
          lastActivityAt: new Date().toISOString(),
          ownerName: "Administrator",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          temperature: 0.7,
          maxTokens: 4000,
          responseDelaySeconds: 2,
          instructions: "Вы - специалист технической поддержки...",
          settings: {},
        },
      ];
      total = 1;
    } else if (!session?.user?.orgId) {
      redirect("/login");
    } else {
      const result = await getAgents({ organizationId: session.user.orgId });
      agents = result.agents;
      total = result.total;
    }
  }

  return <AgentsClient initialAgents={agents} total={total} />;
};

export default AgentsPage;
