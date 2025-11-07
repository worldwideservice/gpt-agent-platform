"use client";

/**
 * Страница расширенной аналитики
 */

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Calendar, Download, TrendingUp, TrendingDown, Users, MessageSquare, Zap, Clock } from "lucide-react";

import { Button } from "@/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useToast } from "@/components/ui";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";

interface AnalyticsData {
  totalAgents: number;
  activeAgents: number;
  totalConversations: number;
  totalMessages: number;
  totalTokensUsed: number;
  averageResponseTime: number;
  successRate: number;
  topPerformingAgents: Array<{
    agentId: string;
    name: string;
    conversationsCount: number;
    messagesCount: number;
    tokensUsed: number;
  }>;
  usageByPeriod: Array<{
    period: string;
    conversations: number;
    messages: number;
    tokens: number;
  }>;
  performanceMetrics: {
    averageFirstResponseTime: number;
    averageResolutionTime: number;
    customerSatisfaction: number;
    automationRate: number;
  };
  channelBreakdown: Array<{
    channel: string;
    conversations: number;
    messages: number;
  }>;
}

export default function AnalyticsPage() {
  const params = useParams();
  const tenantId = (params?.tenantId as string) || "";
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7d");
  const { push: pushToast } = useToast();

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.append("range", dateRange);

      const response = await fetch(`/api/analytics?${params.toString()}`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.data);
      } else {
        throw new Error("Failed to fetch analytics");
      }
    } catch (error) {
      console.error("Failed to fetch analytics", error);
      pushToast({
        title: "Ошибка",
        description: "Не удалось загрузить аналитику",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, pushToast]);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, fetchAnalytics]);

  const [exportFormat, setExportFormat] = useState<"csv" | "json" | "pdf">("csv");
  const [exportReportType, setExportReportType] = useState<string>("");

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      params.append("range", dateRange);
      params.append("format", exportFormat);
      if (exportReportType) {
        params.append("reportType", exportReportType);
      }

      const response = await fetch(`/api/analytics/export?${params.toString()}`, {
        credentials: "include",
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        
        // Получаем имя файла из заголовка Content-Disposition
        const contentDisposition = response.headers.get("Content-Disposition");
        let filename = `analytics-${dateRange}-${new Date().toISOString().split("T")[0]}.${exportFormat}`;
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }
        
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        pushToast({
          title: "Экспорт выполнен",
          description: `Данные успешно экспортированы в формате ${exportFormat.toUpperCase()}`,
          variant: "success",
        });
      } else {
        throw new Error("Failed to export");
      }
    } catch (error) {
      pushToast({
        title: "Ошибка",
        description: "Не удалось экспортировать данные",
        variant: "error",
      });
    }
  };

  if (!analytics) {
    return (
      <div className="p-6">
        <LoadingOverlay loading={isLoading}>
          <div className="text-center py-12">Загрузка аналитики...</div>
        </LoadingOverlay>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Расширенная аналитика</h1>
          <p className="text-sm text-gray-500 mt-1">
            Детальная статистика по агентам, разговорам и производительности
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Последние 7 дней</SelectItem>
              <SelectItem value="30d">Последние 30 дней</SelectItem>
              <SelectItem value="90d">Последние 90 дней</SelectItem>
              <SelectItem value="1y">Последний год</SelectItem>
            </SelectContent>
          </Select>
          <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as "csv" | "json" | "pdf")}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>
          <Select value={exportReportType} onValueChange={setExportReportType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Все данные" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Все данные</SelectItem>
              <SelectItem value="usage">Использование</SelectItem>
              <SelectItem value="performance">Производительность</SelectItem>
              <SelectItem value="engagement">Вовлечённость</SelectItem>
              <SelectItem value="revenue">Доходы</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Агенты
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalAgents}</div>
            <div className="text-sm text-gray-500 mt-1">
              {analytics.activeAgents} активных
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Разговоры
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalConversations}</div>
            <div className="text-sm text-gray-500 mt-1">
              {analytics.totalMessages} сообщений
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Токены
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalTokensUsed.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mt-1">Использовано</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Время ответа
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.averageResponseTime.toFixed(1)}с
            </div>
            <div className="text-sm text-gray-500 mt-1">Среднее</div>
          </CardContent>
        </Card>
      </div>

      {/* Метрики производительности */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Метрики производительности</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Время первого ответа</span>
              <span className="font-semibold">
                {analytics.performanceMetrics.averageFirstResponseTime.toFixed(1)}с
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Время решения</span>
              <span className="font-semibold">
                {analytics.performanceMetrics.averageResolutionTime.toFixed(1)}с
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Удовлетворенность</span>
              <span className="font-semibold">
                {(analytics.performanceMetrics.customerSatisfaction * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Автоматизация</span>
              <span className="font-semibold">
                {(analytics.performanceMetrics.automationRate * 100).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Топ агентов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topPerformingAgents.map((agent, index) => (
                <div key={agent.agentId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{agent.name}</div>
                      <div className="text-xs text-gray-500">
                        {agent.conversationsCount} разговоров
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{agent.messagesCount}</div>
                    <div className="text-xs text-gray-500">сообщений</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Использование по периодам */}
      <Card>
        <CardHeader>
          <CardTitle>Использование по периодам</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">
                    Период
                  </th>
                  <th className="text-right py-2 px-4 text-sm font-medium text-gray-600">
                    Разговоры
                  </th>
                  <th className="text-right py-2 px-4 text-sm font-medium text-gray-600">
                    Сообщения
                  </th>
                  <th className="text-right py-2 px-4 text-sm font-medium text-gray-600">
                    Токены
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.usageByPeriod.map((period) => (
                  <tr key={period.period} className="border-b">
                    <td className="py-2 px-4 text-sm">{period.period}</td>
                    <td className="py-2 px-4 text-sm text-right">
                      {period.conversations}
                    </td>
                    <td className="py-2 px-4 text-sm text-right">
                      {period.messages}
                    </td>
                    <td className="py-2 px-4 text-sm text-right">
                      {period.tokens.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Распределение по каналам */}
      <Card>
        <CardHeader>
          <CardTitle>Распределение по каналам</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.channelBreakdown.map((channel) => (
              <div key={channel.channel} className="flex items-center justify-between">
                <span className="font-medium">{channel.channel}</span>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {channel.conversations}
                    </div>
                    <div className="text-xs text-gray-500">разговоров</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{channel.messages}</div>
                    <div className="text-xs text-gray-500">сообщений</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

