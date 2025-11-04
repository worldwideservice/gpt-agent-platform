"use client";

/**
 * Диалог редактирования триггера
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

const TRIGGER_ACTIONS = [
  { value: "send_message", label: "Отправить сообщение" },
  { value: "change_stage", label: "Изменить этап" },
  { value: "create_task", label: "Создать задачу" },
  { value: "update_field", label: "Обновить поле" },
  { value: "send_email", label: "Отправить email" },
  { value: "webhook", label: "Webhook" },
  { value: "ai_response", label: "AI ответ" },
];

const updateTriggerSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  actionType: z.string().min(1, "Выберите действие"),
});

type UpdateTriggerFormData = z.infer<typeof updateTriggerSchema>;

interface Trigger {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  conditions: Array<{ conditionType: string; payload: Record<string, unknown> }>;
  actions: Array<{ actionType: string; payload: Record<string, unknown> }>;
}

interface EditTriggerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentId: string;
  trigger: Trigger;
  onSuccess: () => void;
}

export function EditTriggerDialog({
  open,
  onOpenChange,
  agentId,
  trigger,
  onSuccess,
}: EditTriggerDialogProps) {
  const { push: pushToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<UpdateTriggerFormData>({
    resolver: zodResolver(updateTriggerSchema),
    defaultValues: {
      name: trigger.name,
      description: trigger.description || "",
      isActive: trigger.isActive,
      actionType: trigger.actions[0]?.actionType || "",
    },
  });

  // Обновляем значения формы при изменении trigger
  useEffect(() => {
    if (trigger) {
      reset({
        name: trigger.name,
        description: trigger.description || "",
        isActive: trigger.isActive,
        actionType: trigger.actions[0]?.actionType || "",
      });
    }
  }, [trigger, reset]);

  const isActive = watch("isActive");
  const actionType = watch("actionType");

  const onSubmit = async (data: UpdateTriggerFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/agents/${agentId}/triggers/${trigger.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: data.name,
            description: data.description || undefined,
            isActive: data.isActive,
            // Сохраняем существующие условия и действия
            conditions: trigger.conditions.map((cond, idx) => ({
              conditionType: cond.conditionType,
              payload: cond.payload,
              ordering: idx,
            })),
            actions: [
              {
                actionType: data.actionType,
                payload: trigger.actions[0]?.payload || {},
                ordering: 0,
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Не удалось обновить триггер");
      }

      pushToast({
        title: "Триггер обновлен",
        description: "Триггер успешно обновлен",
        variant: "success",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update trigger", error);
      pushToast({
        title: "Ошибка",
        description: "Не удалось обновить триггер",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать триггер</DialogTitle>
          <DialogDescription>
            Измените настройки автоматического действия
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Название */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Название <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Название триггера"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">
                {typeof errors.name.message === "string" ? errors.name.message : "Поле обязательно"}
              </p>
            )}
          </div>

          {/* Описание */}
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Описание триггера (необязательно)"
              rows={3}
            />
          </div>

          {/* Действие */}
          <div className="space-y-2">
            <Label htmlFor="actionType">
              Действие <span className="text-red-500">*</span>
            </Label>
            <Select
              value={actionType}
              onValueChange={(value) => setValue("actionType", value, { shouldValidate: true })}
            >
              <SelectTrigger id="actionType">
                <SelectValue placeholder="Выберите действие" />
              </SelectTrigger>
              <SelectContent>
                {TRIGGER_ACTIONS.map((action) => (
                  <SelectItem key={action.value} value={action.value}>
                    {action.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.actionType && (
              <p className="text-sm text-red-500">
                {typeof errors.actionType.message === "string" ? errors.actionType.message : "Выберите действие"}
              </p>
            )}
          </div>

          {/* Активен */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) =>
                  setValue("isActive", checked, { shouldValidate: true })
                }
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Активен
              </Label>
            </div>
            <p className="text-xs text-gray-500">
              Только активные триггеры будут выполняться
            </p>
          </div>

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
              {isSubmitting ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

