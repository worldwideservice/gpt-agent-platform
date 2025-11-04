"use client";

/**
 * Диалог создания последовательности действий
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, GripVertical } from "lucide-react";

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
  { value: "manual", label: "Вручную" },
  { value: "lead_created", label: "Создание лида" },
  { value: "stage_changed", label: "Смена этапа" },
  { value: "subscription", label: "Подписка" },
  { value: "event", label: "Событие" },
];

const ACTION_TYPES = [
  { value: "send_message", label: "Отправить сообщение" },
  { value: "create_task", label: "Создать задачу" },
  { value: "send_email", label: "Отправить email" },
  { value: "webhook", label: "Webhook" },
  { value: "ai_response", label: "AI ответ" },
  { value: "wait", label: "Ожидание" },
  { value: "kommo_action", label: "Действие в Kommo" },
];

const createSequenceSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  description: z.string().optional(),
  trigger_type: z.enum(["manual", "lead_created", "stage_changed", "subscription", "event"]),
  is_active: z.boolean().optional().default(true),
});

type CreateSequenceFormData = z.infer<typeof createSequenceSchema>;

interface SequenceStep {
  step_order: number;
  delay_minutes: number;
  action_type: string;
  template?: string;
  recipient?: string;
  webhook_url?: string;
  ai_prompt?: string;
  task_title?: string;
  task_description?: string;
  kommo_action?: {
    type: string;
    data: Record<string, any>;
    entity_id?: number;
    entity_type?: string;
  };
  metadata?: Record<string, any>;
}

interface CreateSequenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentId: string;
  onSuccess: () => void;
}

export function CreateSequenceDialog({
  open,
  onOpenChange,
  agentId,
  onSuccess,
}: CreateSequenceDialogProps) {
  const { push: pushToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [steps, setSteps] = useState<SequenceStep[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CreateSequenceFormData>({
    // @ts-expect-error - resolver type mismatch
    resolver: zodResolver(createSequenceSchema),
    defaultValues: {
      name: "",
      description: "",
      trigger_type: "manual",
      is_active: true,
    },
  });

  const addStep = () => {
    setSteps([
      ...steps,
      {
        step_order: steps.length + 1,
        delay_minutes: 0,
        action_type: "send_message",
        template: "",
        metadata: {},
      },
    ]);
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index).map((step, i) => ({
      ...step,
      step_order: i + 1,
    }));
    setSteps(newSteps);
  };

  const updateStep = (index: number, updates: Partial<SequenceStep>) => {
    setSteps(steps.map((s, i) => (i === index ? { ...s, ...updates } : s)));
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === steps.length - 1) return;

    const newSteps = [...steps];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newSteps[index], newSteps[targetIndex]] = [
      newSteps[targetIndex],
      newSteps[index],
    ];

    // Обновляем порядок шагов
    newSteps.forEach((step, i) => {
      step.step_order = i + 1;
    });

    setSteps(newSteps);
  };

  const onSubmit = async (data: CreateSequenceFormData) => {
    if (steps.length === 0) {
      pushToast({
        title: "Ошибка",
        description: "Добавьте хотя бы один шаг",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/agents/${agentId}/sequences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: data.name,
          description: data.description || undefined,
          trigger_type: data.trigger_type,
          is_active: data.is_active,
          steps: steps,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Не удалось создать последовательность");
      }

      pushToast({
        title: "Последовательность создана",
        description: "Последовательность успешно создана",
        variant: "success",
      });

      reset();
      setSteps([]);
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to create sequence", error);
      pushToast({
        title: "Ошибка",
        description: error.message || "Не удалось создать последовательность",
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
          <DialogTitle>Создать последовательность</DialogTitle>
          <DialogDescription>
            Настройте последовательность автоматизированных действий
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Основная информация */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Название <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Название последовательности"
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
                placeholder="Описание последовательности"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trigger_type">
                  Тип триггера <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watch("trigger_type")}
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
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={watch("is_active")}
                onCheckedChange={(checked) => setValue("is_active", checked)}
              />
              <Label htmlFor="is_active">Последовательность активна</Label>
            </div>
          </div>

          {/* Шаги */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Шаги последовательности</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addStep}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить шаг
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {steps.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Нет шагов. Добавьте хотя бы один шаг.
                </p>
              ) : (
                steps.map((step, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">
                          Шаг {step.step_order}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => moveStep(index, "up")}
                          >
                            ↑
                          </Button>
                        )}
                        {index < steps.length - 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => moveStep(index, "down")}
                          >
                            ↓
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeStep(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Тип действия</Label>
                        <Select
                          value={step.action_type}
                          onValueChange={(value) =>
                            updateStep(index, { action_type: value })
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

                      <div className="space-y-2">
                        <Label>Задержка (минуты)</Label>
                        <Input
                          type="number"
                          min={0}
                          value={step.delay_minutes}
                          onChange={(e) =>
                            updateStep(index, {
                              delay_minutes: Number(e.target.value),
                            })
                          }
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {step.action_type === "send_message" && (
                      <div className="space-y-2">
                        <Label>Шаблон сообщения</Label>
                        <Textarea
                          value={step.template || ""}
                          onChange={(e) =>
                            updateStep(index, { template: e.target.value })
                          }
                          placeholder="Текст сообщения"
                          rows={3}
                        />
                      </div>
                    )}

                    {step.action_type === "create_task" && (
                      <>
                        <div className="space-y-2">
                          <Label>Название задачи</Label>
                          <Input
                            value={step.task_title || ""}
                            onChange={(e) =>
                              updateStep(index, { task_title: e.target.value })
                            }
                            placeholder="Название задачи"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Описание задачи</Label>
                          <Textarea
                            value={step.task_description || ""}
                            onChange={(e) =>
                              updateStep(index, { task_description: e.target.value })
                            }
                            placeholder="Описание задачи"
                            rows={2}
                          />
                        </div>
                      </>
                    )}

                    {step.action_type === "send_email" && (
                      <>
                        <div className="space-y-2">
                          <Label>Получатель</Label>
                          <Input
                            value={step.recipient || ""}
                            onChange={(e) =>
                              updateStep(index, { recipient: e.target.value })
                            }
                            placeholder="email@example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Текст письма</Label>
                          <Textarea
                            value={step.template || ""}
                            onChange={(e) =>
                              updateStep(index, { template: e.target.value })
                            }
                            placeholder="Текст письма"
                            rows={3}
                          />
                        </div>
                      </>
                    )}

                    {step.action_type === "webhook" && (
                      <div className="space-y-2">
                        <Label>URL Webhook</Label>
                        <Input
                          value={step.webhook_url || ""}
                          onChange={(e) =>
                            updateStep(index, { webhook_url: e.target.value })
                          }
                          placeholder="https://example.com/webhook"
                        />
                      </div>
                    )}

                    {step.action_type === "ai_response" && (
                      <div className="space-y-2">
                        <Label>Промпт для AI</Label>
                        <Textarea
                          value={step.ai_prompt || ""}
                          onChange={(e) =>
                            updateStep(index, { ai_prompt: e.target.value })
                          }
                          placeholder="Промпт для генерации ответа"
                          rows={3}
                        />
                      </div>
                    )}
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
              {isSubmitting ? "Создание..." : "Создать последовательность"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

