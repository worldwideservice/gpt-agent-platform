"use client";

/**
 * Компонент управления интеграциями агента
 */

import { useState, useEffect } from "react";
import { Plus, Settings, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui";
import { Badge } from "@/components/ui";
import { Switch } from "@/components/ui";
import { useToast } from "@/components/ui";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";

interface Integration {
  id: string;
  integration_type: string;
  is_active: boolean;
  settings: Record<string, unknown>;
}

interface IntegrationsManagerProps {
  agentId: string;
}

export function IntegrationsManager({ agentId }: IntegrationsManagerProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { push: pushToast } = useToast();

  const refreshIntegrations = async () => {
    try {
      const response = await fetch(`/api/agents/${agentId}/integrations`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        // API возвращает integrations, а не data
        setIntegrations(data.integrations || data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch integrations", error);
    }
  };

  // Загрузка интеграций
  useEffect(() => {
    const fetchIntegrations = async () => {
      setIsLoading(true);
      await refreshIntegrations();
      setIsLoading(false);
    };
    fetchIntegrations();
  }, [agentId]);

  const handleToggleStatus = async (integration: Integration) => {
    try {
      const response = await fetch(
        `/api/agents/${agentId}/integrations/${integration.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ is_active: !integration.is_active }),
        }
      );
      if (response.ok) {
        await refreshIntegrations();
        pushToast({
          title: "Статус обновлен",
          description: "Статус интеграции успешно изменен",
          variant: "success",
        });
      }
    } catch (error) {
      pushToast({
        title: "Ошибка",
        description: "Не удалось обновить статус интеграции",
        variant: "error",
      });
    }
  };

  const getIntegrationName = (type: string) => {
    const names: Record<string, string> = {
      kommo: "Kommo CRM",
      telegram: "Telegram",
      whatsapp: "WhatsApp",
      email: "Email",
    };
    return names[type] || type;
  };

  return (
    <div className="space-y-4">
      <LoadingOverlay loading={isLoading}>
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Интеграции</h3>
            <p className="text-sm text-gray-500">
              Управление подключениями и настройками интеграций
            </p>
          </div>
          <Button onClick={() => pushToast({ title: "В разработке", description: "Доступные интеграции будут добавлены", variant: "default" })}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить интеграцию
          </Button>
        </div>

        {/* Таблица интеграций */}
        {integrations.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-gray-500 mb-4">Интеграции не подключены</p>
            <Button variant="outline" onClick={() => pushToast({ title: "В разработке", description: "Доступные интеграции будут добавлены", variant: "default" })}>
              <Plus className="h-4 w-4 mr-2" />
              Подключить интеграцию
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Интеграция</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Активна</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {integrations.map((integration) => (
                  <TableRow key={integration.id}>
                    <TableCell>
                      <div className="font-medium">
                        {getIntegrationName(integration.integration_type)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {integration.integration_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={integration.is_active}
                        onCheckedChange={() => handleToggleStatus(integration)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => pushToast({ title: "В разработке", description: "Настройки интеграции будут добавлены", variant: "default" })}
                          title="Настройки"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
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

