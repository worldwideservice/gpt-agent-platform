"use client";

/**
 * Диалог создания правила автоматизации
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";

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
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Условие {index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCondition(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Тип условия</Label>
                        <Select
                          value={condition.type}
                          onValueChange={(value) =>
                            updateCondition(index, { type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CONDITION_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {condition.type === "field_value" && (
                        <>
                          <div className="space-y-2">
                            <Label>Оператор</Label>
                            <Select
                              value={condition.operator}
                              onValueChange={(value) =>
                                updateCondition(index, { operator: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {CONDITION_OPERATORS.map((op) => (
                                  <SelectItem key={op.value} value={op.value}>
                                    {op.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Поле</Label>
                            <Input
                              value={condition.field || ""}
                              onChange={(e) =>
                                updateCondition(index, { field: e.target.value })
                              }
                              placeholder="Название поля"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Значение</Label>
                            <Input
                              value={condition.value || ""}
                              onChange={(e) =>
                                updateCondition(index, { value: e.target.value })
                              }
                              placeholder="Значение"
                            />
                          </div>
                        </>
                      )}

                      {condition.type === "time_elapsed" && (
                        <>
                          <div className="space-y-2">
                            <Label>Количество</Label>
                            <Input
                              type="number"
                              value={condition.timeValue || ""}
                              onChange={(e) =>
                                updateCondition(index, {
                                  timeValue: Number(e.target.value),
                                })
                              }
                              placeholder="Количество"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Единица времени</Label>
                            <Select
                              value={condition.timeUnit}
                              onValueChange={(value) =>
                                updateCondition(index, { timeUnit: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="minutes">Минуты</SelectItem>
                                <SelectItem value="hours">Часы</SelectItem>
                                <SelectItem value="days">Дни</SelectItem>
                                <SelectItem value="weeks">Недели</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                    </div>
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
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Действие {index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAction(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Тип действия</Label>
                        <Select
                          value={action.type}
                          onValueChange={(value) =>
                            updateAction(index, { type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ACTION_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {action.type === "send_message" && (
                        <div className="space-y-2">
                          <Label>Шаблон сообщения</Label>
                          <Textarea
                            value={action.template || ""}
                            onChange={(e) =>
                              updateAction(index, { template: e.target.value })
                            }
                            placeholder="Текст сообщения"
                            rows={3}
                          />
                        </div>
                      )}

                      {action.type === "create_task" && (
                        <>
                          <div className="space-y-2">
                            <Label>Название задачи</Label>
                            <Input
                              value={action.template || ""}
                              onChange={(e) =>
                                updateAction(index, { template: e.target.value })
                              }
                              placeholder="Название задачи"
                            />
                          </div>
                        </>
                      )}

                      {action.type === "update_field" && (
                        <>
                          <div className="space-y-2">
                            <Label>Поле</Label>
                            <Input
                              value={action.targetField || ""}
                              onChange={(e) =>
                                updateAction(index, { targetField: e.target.value })
                              }
                              placeholder="Название поля"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Новое значение</Label>
                            <Input
                              value={action.newValue || ""}
                              onChange={(e) =>
                                updateAction(index, { newValue: e.target.value })
                              }
                              placeholder="Значение"
                            />
                          </div>
                        </>
                      )}

                      {action.type === "send_email" && (
                        <>
                          <div className="space-y-2">
                            <Label>Получатель</Label>
                            <Input
                              value={action.recipient || ""}
                              onChange={(e) =>
                                updateAction(index, { recipient: e.target.value })
                              }
                              placeholder="email@example.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Текст письма</Label>
                            <Textarea
                              value={action.template || ""}
                              onChange={(e) =>
                                updateAction(index, { template: e.target.value })
                              }
                              placeholder="Текст письма"
                              rows={3}
                            />
                          </div>
                        </>
                      )}

                      {action.type === "webhook" && (
                        <div className="space-y-2">
                          <Label>URL Webhook</Label>
                          <Input
                            value={action.webhookUrl || ""}
                            onChange={(e) =>
                              updateAction(index, { webhookUrl: e.target.value })
                            }
                            placeholder="https://example.com/webhook"
                          />
                        </div>
                      )}

                      {action.type === "ai_response" && (
                        <div className="space-y-2">
                          <Label>Промпт для AI</Label>
                          <Textarea
                            value={action.aiPrompt || ""}
                            onChange={(e) =>
                              updateAction(index, { aiPrompt: e.target.value })
                            }
                            placeholder="Промпт для генерации ответа"
                            rows={3}
                          />
                        </div>
                      )}

                      {action.type === "change_stage" && (
                        <div className="space-y-2">
                          <Label>Новый этап</Label>
                          <Input
                            value={action.newValue || ""}
                            onChange={(e) =>
                              updateAction(index, { newValue: e.target.value })
                            }
                            placeholder="ID этапа"
                          />
                        </div>
                      )}
                    </div>
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

