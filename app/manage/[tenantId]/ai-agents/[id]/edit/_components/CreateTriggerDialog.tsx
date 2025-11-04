"use client";

/**
 * Диалог создания триггера
 */

import { useState } from "react";
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

const createTriggerSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  description: z.string().optional(),
  isActive: z.boolean().optional().default(true),
  actionType: z.string().min(1, "Выберите действие"),
});

type CreateTriggerFormData = z.infer<typeof createTriggerSchema>;

interface CreateTriggerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentId: string;
  onSuccess: () => void;
}

export function CreateTriggerDialog({
  open,
  onOpenChange,
  agentId,
  onSuccess,
}: CreateTriggerDialogProps) {
  const { push: pushToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CreateTriggerFormData>({
    // @ts-expect-error - resolver type mismatch with react-hook-form
    resolver: zodResolver(createTriggerSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      actionType: "",
    },
  });

  const isActive = watch("isActive");
  const actionType = watch("actionType");

  const onSubmit = async (data: CreateTriggerFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/agents/${agentId}/triggers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: data.name,
          description: data.description || undefined,
          isActive: data.isActive,
          conditions: [], // Упрощенная версия - условия будут добавлены позже
          actions: [
            {
              actionType: data.actionType,
              payload: {},
              ordering: 0,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Не удалось создать триггер");
      }

      pushToast({
        title: "Триггер создан",
        description: "Триггер успешно создан",
        variant: "success",
      });

      reset();
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create trigger", error);
      pushToast({
        title: "Ошибка",
        description: "Не удалось создать триггер",
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
          <DialogTitle>Создать триггер</DialogTitle>
          <DialogDescription>
            Настройте автоматическое действие при выполнении условий
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
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Создание..." : "Создать"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

