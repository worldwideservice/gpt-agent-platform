"use client";

/**
 * Диалог создания правила автоматизации
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { DraggableCondition } from "./DraggableCondition";
import { DraggableAction } from "./DraggableAction";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { Label } from "@/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { Switch } from "@/components/ui";
import { useToast } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

const TRIGGER_TYPES = [
  { value: "lead_created", label: "Создание лида" },
  { value: "lead_updated", label: "Обновление лида" },
  { value: "message_received", label: "Получение сообщения" },
  { value: "stage_changed", label: "Смена этапа" },
  { value: "time_based", label: "По времени" },
  { value: "manual", label: "Вручную" },
];

const CONDITION_TYPES = [
  { value: "field_value", label: "Значение поля" },
  { value: "stage_changed", label: "Смена этапа" },
  { value: "time_elapsed", label: "Прошло времени" },
  { value: "event_triggered", label: "Событие" },
];

const CONDITION_OPERATORS = [
  { value: "equals", label: "Равно" },
  { value: "contains", label: "Содержит" },
  { value: "greater_than", label: "Больше" },
  { value: "less_than", label: "Меньше" },
  { value: "changed_to", label: "Изменилось на" },
  { value: "not_empty", label: "Не пусто" },
];

const ACTION_TYPES = [
  { value: "send_message", label: "Отправить сообщение" },
  { value: "change_stage", label: "Изменить этап" },
  { value: "create_task", label: "Создать задачу" },
  { value: "update_field", label: "Обновить поле" },
  { value: "send_email", label: "Отправить email" },
  { value: "webhook", label: "Webhook" },
  { value: "ai_response", label: "AI ответ" },
];

const createRuleSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  description: z.string().optional(),
  trigger_type: z.enum(["lead_created", "lead_updated", "message_received", "stage_changed", "time_based", "manual"]),
  is_active: z.boolean().optional().default(true),
  priority: z.number().min(1).max(100).optional().default(10),
  cooldown_minutes: z.number().min(0).optional(),
  max_executions_per_day: z.number().min(1).optional(),
});

type CreateRuleFormData = z.infer<typeof createRuleSchema>;

interface Condition {
  type: string;
  field?: string;
  operator?: string;
  value?: string;
  timeUnit?: string;
  timeValue?: number;
}

interface Action {
  type: string;
  template?: string;
  targetField?: string;
  newValue?: string;
  recipient?: string;
  webhookUrl?: string;
  aiPrompt?: string;
}

interface CreateRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentId: string;
  onSuccess: () => void;
}

export function CreateRuleDialog({
  open,
  onOpenChange,
  agentId,
  onSuccess,
}: CreateRuleDialogProps) {
  const { push: pushToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [draggedConditionIndex, setDraggedConditionIndex] = useState<number | null>(null);
  const [draggedActionIndex, setDraggedActionIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CreateRuleFormData>({
    // @ts-expect-error - zodResolver type mismatch with react-hook-form
    resolver: zodResolver(createRuleSchema),
    defaultValues: {
      name: "",
      description: "",
      trigger_type: "lead_created",
      is_active: true,
      priority: 10,
    },
  });

  const triggerType = watch("trigger_type");
  const priority = watch("priority") || 10;

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        type: "field_value",
        operator: "equals",
        value: "",
      },
    ]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (index: number, updates: Partial<Condition>) => {
    setConditions(
      conditions.map((c, i) => (i === index ? { ...c, ...updates } : c))
    );
  };

  const handleConditionDragStart = (index: number) => {
    setDraggedConditionIndex(index);
  };

  const handleConditionDragEnd = () => {
    setDraggedConditionIndex(null);
  };

  const handleConditionDrop = (targetIndex: number) => {
    if (draggedConditionIndex === null || draggedConditionIndex === targetIndex) return;
    
    const newConditions = [...conditions];
    const [removed] = newConditions.splice(draggedConditionIndex, 1);
    newConditions.splice(targetIndex, 0, removed);
    setConditions(newConditions);
    setDraggedConditionIndex(null);
  };

  const addAction = () => {
    setActions([
      ...actions,
      {
        type: "send_message",
        template: "",
      },
    ]);
  };

  const removeAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const updateAction = (index: number, updates: Partial<Action>) => {
    setActions(actions.map((a, i) => (i === index ? { ...a, ...updates } : a)));
  };

  const handleActionDragStart = (index: number) => {
    setDraggedActionIndex(index);
  };

  const handleActionDragEnd = () => {
    setDraggedActionIndex(null);
  };

  const handleActionDrop = (targetIndex: number) => {
    if (draggedActionIndex === null || draggedActionIndex === targetIndex) return;
    
    const newActions = [...actions];
    const [removed] = newActions.splice(draggedActionIndex, 1);
    newActions.splice(targetIndex, 0, removed);
    setActions(newActions);
    setDraggedActionIndex(null);
  };

  const onSubmit = async (data: CreateRuleFormData) => {
    if (conditions.length === 0) {
      pushToast({
        title: "Ошибка",
        description: "Добавьте хотя бы одно условие",
        variant: "error",
      });
      return;
    }

    if (actions.length === 0) {
      pushToast({
        title: "Ошибка",
        description: "Добавьте хотя бы одно действие",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/agents/${agentId}/rules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: data.name,
          description: data.description || undefined,
          trigger_type: data.trigger_type,
          conditions: conditions,
          actions: actions,
          is_active: data.is_active,
          priority: data.priority,
          cooldown_minutes: data.cooldown_minutes,
          max_executions_per_day: data.max_executions_per_day,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Не удалось создать правило");
      }

      pushToast({
        title: "Правило создано",
        description: "Правило успешно создано",
        variant: "success",
      });

      reset();
      setConditions([]);
      setActions([]);
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to create rule", error);
      pushToast({
        title: "Ошибка",
        description: error.message || "Не удалось создать правило",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создать правило автоматизации</DialogTitle>
          <DialogDescription>
            Настройте правило "Если условие → выполнить действие"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => onSubmit(data as unknown as CreateRuleFormData))} className="space-y-6">
          {/* Основная информация */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Название <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Название правила"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Описание правила"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trigger_type">
                  Тип триггера <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={triggerType}
                  onValueChange={(value) => setValue("trigger_type", value as any)}
                >
                  <SelectTrigger id="trigger_type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRIGGER_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Приоритет (1-100)</Label>
                <Input
                  id="priority"
                  type="number"
                  min={1}
                  max={100}
                  {...register("priority", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={watch("is_active")}
                onCheckedChange={(checked) => setValue("is_active", checked)}
              />
              <Label htmlFor="is_active">Правило активно</Label>
            </div>
          </div>

          {/* Условия */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Условия</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCondition}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить условие
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {conditions.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Нет условий. Добавьте хотя бы одно условие.
                </p>
              ) : (
                conditions.map((condition, index) => (
                  <div
                    key={index}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add("border-blue-400");
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove("border-blue-400");
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove("border-blue-400");
                      handleConditionDrop(index);
                    }}
                  >
                    <DraggableCondition
                      condition={condition}
                      index={index}
                      onUpdate={updateCondition}
                      onRemove={removeCondition}
                      onDragStart={handleConditionDragStart}
                      onDragEnd={handleConditionDragEnd}
                      onDragOver={() => {}}
                      isDragging={draggedConditionIndex === index}
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Действия */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Действия</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAction}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить действие
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {actions.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Нет действий. Добавьте хотя бы одно действие.
                </p>
              ) : (
                actions.map((action, index) => (
                  <div
                    key={index}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add("border-blue-400");
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove("border-blue-400");
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove("border-blue-400");
                      handleActionDrop(index);
                    }}
                  >
                    <DraggableAction
                      action={action}
                      index={index}
                      onUpdate={updateAction}
                      onRemove={removeAction}
                      onDragStart={handleActionDragStart}
                      onDragEnd={handleActionDragEnd}
                      isDragging={draggedActionIndex === index}
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Создание..." : "Создать правило"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

