"use client";

/**
 * Компонент управления триггерами агента
 * Работает напрямую с API (без Refine, так как структура API отличается)
 */

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

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
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { CreateTriggerDialog } from "./CreateTriggerDialog";
import { EditTriggerDialog } from "./EditTriggerDialog";

interface Trigger {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  conditions: Array<{ conditionType: string; payload: Record<string, unknown> }>;
  actions: Array<{ actionType: string; payload: Record<string, unknown> }>;
}

interface TriggersManagerProps {
  agentId: string;
}

export function TriggersManager({ agentId }: TriggersManagerProps) {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [triggerToDelete, setTriggerToDelete] = useState<Trigger | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null);
  const { push: pushToast } = useToast();

  const refreshTriggers = useCallback(async () => {
    try {
      const response = await fetch(`/api/agents/${agentId}/triggers`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setTriggers(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch triggers", error);
    }
  }, [agentId]);

  // Загрузка триггеров
  useEffect(() => {
    const fetchTriggers = async () => {
      setIsLoading(true);
      await refreshTriggers();
      setIsLoading(false);
    };
    fetchTriggers();
  }, [agentId, refreshTriggers]);

  const handleToggleStatus = async (trigger: Trigger) => {
    try {
      const response = await fetch(
        `/api/agents/${agentId}/triggers/${trigger.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ isActive: !trigger.isActive }),
        }
      );
      if (response.ok) {
        setTriggers(
          triggers.map((t) =>
            t.id === trigger.id ? { ...t, isActive: !t.isActive } : t
          )
        );
        pushToast({
          title: "Статус обновлен",
          description: "Статус триггера успешно изменен",
          variant: "success",
        });
      }
    } catch (error) {
      pushToast({
        title: "Ошибка",
        description: "Не удалось обновить статус триггера",
        variant: "error",
      });
    }
  };

  const handleDeleteClick = (trigger: Trigger) => {
    setTriggerToDelete(trigger);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!triggerToDelete) return;

    try {
      const response = await fetch(
        `/api/agents/${agentId}/triggers/${triggerToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        await refreshTriggers();
        pushToast({
          title: "Триггер удален",
          description: "Триггер успешно удален",
          variant: "success",
        });
        setDeleteDialogOpen(false);
        setTriggerToDelete(null);
      }
    } catch (error) {
      pushToast({
        title: "Ошибка",
        description: "Не удалось удалить триггер",
        variant: "error",
      });
    }
  };

  return (
    <div className="space-y-4">
      <LoadingOverlay loading={isLoading}>
        {/* Заголовок с кнопкой создания */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Триггеры</h3>
            <p className="text-sm text-gray-500">
              Настройте автоматические действия при выполнении условий
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Создать триггер
          </Button>
        </div>

        {/* Таблица триггеров */}
        {triggers.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-gray-500 mb-4">Триггеры не созданы</p>
            <Button variant="outline" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Создать первый триггер
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Условия</TableHead>
                  <TableHead>Действия</TableHead>
                  <TableHead>Активен</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {triggers.map((trigger) => (
                  <TableRow key={trigger.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{trigger.name}</div>
                        {trigger.description && (
                          <div className="text-sm text-gray-500">
                            {trigger.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {trigger.conditions.length} условий
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {trigger.actions.length} действий
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={trigger.isActive}
                        onCheckedChange={() => handleToggleStatus(trigger)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedTrigger(trigger);
                            setEditDialogOpen(true);
                          }}
                          title="Изменить"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(trigger)}
                          title="Удалить"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Диалог создания триггера */}
      <CreateTriggerDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        agentId={agentId}
        onSuccess={async () => {
          await refreshTriggers();
        }}
      />

      {/* Диалог редактирования триггера */}
      {selectedTrigger && (
        <EditTriggerDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          agentId={agentId}
          trigger={selectedTrigger}
          onSuccess={async () => {
            await refreshTriggers();
            setSelectedTrigger(null);
          }}
        />
      )}

      {/* Диалог подтверждения удаления */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Удалить триггер"
        description={`Вы уверены, что хотите удалить триггер "${triggerToDelete?.name}"? Это действие нельзя отменить.`}
        onConfirm={handleDeleteConfirm}
        confirmText="Удалить"
        cancelText="Отмена"
        variant="destructive"
      />
    </div>
  );
}

