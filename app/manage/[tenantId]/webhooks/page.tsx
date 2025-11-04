"use client";

/**
 * Страница истории Webhooks
 */

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Search, Filter, RefreshCw, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";

import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui";
import { Badge } from "@/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { useToast } from "@/components/ui";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

interface WebhookEvent {
  id: string;
  org_id: string;
  provider: string;
  event_type: string;
  event_subtype?: string | null;
  entity_id?: string | null;
  entity_type?: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'retrying';
  retry_count: number;
  max_retries: number;
  next_retry_at?: string | null;
  error?: string | null;
  created_at: string;
  processed_at?: string | null;
  processing_started_at?: string | null;
}

export default function WebhooksPage() {
  const params = useParams();
  const tenantId = (params?.tenantId as string) || "";
  const [webhooks, setWebhooks] = useState<WebhookEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const { push: pushToast } = useToast();

  const refreshWebhooks = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.append("status", filterStatus);
      if (filterType !== "all") params.append("event_type", filterType);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/webhooks/events?${params.toString()}`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setWebhooks(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch webhooks", error);
      pushToast({
        title: "Ошибка",
        description: "Не удалось загрузить историю webhooks",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus, filterType, searchQuery, pushToast]);

  useEffect(() => {
    refreshWebhooks();
  }, [filterStatus, filterType, refreshWebhooks]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "processing":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "retrying":
        return <RefreshCw className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      processing: "bg-blue-100 text-blue-800",
      retrying: "bg-yellow-100 text-yellow-800",
      pending: "bg-gray-100 text-gray-800",
    };
    return (
      <Badge className={variants[status] || "bg-gray-100 text-gray-800"}>
        {status === "completed" ? "Успешно" :
         status === "failed" ? "Ошибка" :
         status === "processing" ? "Обработка" :
         status === "retrying" ? "Повтор" :
         "Ожидание"}
      </Badge>
    );
  };

  const filteredWebhooks = webhooks.filter((webhook) => {
    const matchesSearch = !searchQuery ||
      webhook.event_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      webhook.event_subtype?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      webhook.entity_id?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: webhooks.length,
    completed: webhooks.filter((w) => w.status === "completed").length,
    failed: webhooks.filter((w) => w.status === "failed").length,
    processing: webhooks.filter((w) => w.status === "processing" || w.status === "pending").length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">История Webhooks</h1>
          <p className="text-sm text-gray-500 mt-1">
            Просмотр всех webhook событий и их статусов
          </p>
        </div>
        <Button onClick={refreshWebhooks} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Обновить
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Всего</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Успешно</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Ошибки</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">В обработке</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск по типу события, подтипу или ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="completed">Успешно</SelectItem>
            <SelectItem value="failed">Ошибки</SelectItem>
            <SelectItem value="processing">В обработке</SelectItem>
            <SelectItem value="retrying">Повторы</SelectItem>
            <SelectItem value="pending">Ожидание</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Тип события" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            <SelectItem value="leads">Сделки</SelectItem>
            <SelectItem value="contacts">Контакты</SelectItem>
            <SelectItem value="tasks">Задачи</SelectItem>
            <SelectItem value="messages">Сообщения</SelectItem>
            <SelectItem value="calls">Звонки</SelectItem>
            <SelectItem value="companies">Компании</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <LoadingOverlay loading={isLoading}>
        {filteredWebhooks.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">
              {webhooks.length === 0
                ? "Webhook события отсутствуют"
                : "Не найдено событий по заданным критериям"}
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Тип события</TableHead>
                  <TableHead>Подтип</TableHead>
                  <TableHead>Сущность</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Повторы</TableHead>
                  <TableHead>Создано</TableHead>
                  <TableHead>Обработано</TableHead>
                  <TableHead>Ошибка</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWebhooks.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell className="font-mono text-xs">
                      {webhook.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{webhook.event_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {webhook.event_subtype ? (
                        <span className="text-sm text-gray-600">{webhook.event_subtype}</span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {webhook.entity_type && webhook.entity_id ? (
                        <span className="text-sm">
                          {webhook.entity_type}:{webhook.entity_id.substring(0, 8)}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(webhook.status)}
                        {getStatusBadge(webhook.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {webhook.retry_count}/{webhook.max_retries}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {new Date(webhook.created_at).toLocaleString("ru-RU", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      {webhook.processed_at ? (
                        <span className="text-sm text-gray-600">
                          {new Date(webhook.processed_at).toLocaleString("ru-RU", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {webhook.error ? (
                        <span className="text-xs text-red-600 line-clamp-1" title={webhook.error}>
                          {webhook.error.substring(0, 50)}...
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </LoadingOverlay>
    </div>
  );
}

