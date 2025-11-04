"use client";

/**
 * Компонент управления правилами автоматизации (Rule Engine) агента
 */

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Play, Settings } from "lucide-react";

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
import { CreateRuleDialog } from "./CreateRuleDialog";
import { EditRuleDialog } from "./EditRuleDialog";

interface AutomationRule {
  id: string;
  name: string;
  description?: string | null;
  trigger_type: 'lead_created' | 'lead_updated' | 'message_received' | 'stage_changed' | 'time_based' | 'manual';
  conditions: Array<{
    type: string;
    field?: string;
    operator?: string;
    value?: any;
  }>;
  actions: Array<{
    type: string;
    template?: string;
    targetField?: string;
    newValue?: any;
  }>;
  is_active: boolean;
  priority: number;
  cooldown_minutes?: number;
  max_executions_per_day?: number;
}

interface RulesManagerProps {
  agentId: string;
}

export function RulesManager({ agentId }: RulesManagerProps) {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<AutomationRule | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const { push: pushToast } = useToast();

  const refreshRules = useCallback(async () => {
    try {
      const response = await fetch(`/api/agents/${agentId}/rules`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setRules(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch rules", error);
    }
  }, [agentId]);

  // Загрузка правил
  useEffect(() => {
    const fetchRules = async () => {
      setIsLoading(true);
      await refreshRules();
      setIsLoading(false);
    };
    fetchRules();
  }, [agentId, refreshRules]);

  const handleToggleStatus = async (rule: AutomationRule) => {
    try {
      const response = await fetch(
        `/api/agents/${agentId}/rules/${rule.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ is_active: !rule.is_active }),
        }
      );
      if (response.ok) {
        setRules(
          rules.map((r) =>
            r.id === rule.id ? { ...r, is_active: !r.is_active } : r
          )
        );
        pushToast({
          title: "Статус обновлен",
          description: "Статус правила успешно изменен",
          variant: "success",
        });
      }
    } catch (error) {
      pushToast({
        title: "Ошибка",
        description: "Не удалось обновить статус правила",
        variant: "error",
      });
    }
  };

  const handleDeleteClick = (rule: AutomationRule) => {
    setRuleToDelete(rule);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!ruleToDelete) return;

    try {
      const response = await fetch(
        `/api/agents/${agentId}/rules/${ruleToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        setRules(rules.filter((r) => r.id !== ruleToDelete.id));
        pushToast({
          title: "Правило удалено",
          description: "Правило успешно удалено",
          variant: "success",
        });
      }
      setDeleteDialogOpen(false);
      setRuleToDelete(null);
    } catch (error) {
      pushToast({
        title: "Ошибка",
        description: "Не удалось удалить правило",
        variant: "error",
      });
    }
  };

  const handleEditClick = (rule: AutomationRule) => {
    setSelectedRule(rule);
    setEditDialogOpen(true);
  };

  const getTriggerTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      lead_created: "Создание лида",
      lead_updated: "Обновление лида",
      message_received: "Получение сообщения",
      stage_changed: "Смена этапа",
      time_based: "По времени",
      manual: "Вручную",
    };
    return labels[type] || type;
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 25) return "bg-red-100 text-red-800";
    if (priority <= 50) return "bg-orange-100 text-orange-800";
    if (priority <= 75) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="space-y-4">
      <LoadingOverlay loading={isLoading}>
        {/* Заголовок с кнопкой создания */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Правила автоматизации</h3>
            <p className="text-sm text-gray-500">
              Настройте правила "Если условие → выполнить действие"
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Создать правило
          </Button>
        </div>

        {/* Таблица правил */}
        {rules.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">Правила не созданы</p>
            <Button variant="outline" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Создать первое правило
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Триггер</TableHead>
                  <TableHead>Условия</TableHead>
                  <TableHead>Действия</TableHead>
                  <TableHead>Приоритет</TableHead>
                  <TableHead>Активно</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{rule.name}</div>
                        {rule.description && (
                          <div className="text-sm text-gray-500">
                            {rule.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getTriggerTypeLabel(rule.trigger_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {rule.conditions.length} услови{rule.conditions.length === 1 ? 'е' : rule.conditions.length < 5 ? 'я' : 'й'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {rule.actions.length} действи{rule.actions.length === 1 ? 'е' : rule.actions.length < 5 ? 'й' : 'й'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(rule.priority)}>
                        {rule.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={rule.is_active}
                        onCheckedChange={() => handleToggleStatus(rule)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(rule)}
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

      {/* Диалог создания правила */}
      <CreateRuleDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        agentId={agentId}
        onSuccess={() => {
          setCreateDialogOpen(false);
          refreshRules();
        }}
      />

      {/* Диалог редактирования правила */}
      {selectedRule && (
        <EditRuleDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          agentId={agentId}
          rule={selectedRule}
          onSuccess={() => {
            setEditDialogOpen(false);
            setSelectedRule(null);
            refreshRules();
          }}
        />
      )}

      {/* Диалог подтверждения удаления */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Удалить правило?"
        description={`Вы уверены, что хотите удалить правило "${ruleToDelete?.name}"? Это действие нельзя отменить.`}
        confirmText="Удалить"
        cancelText="Отмена"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

