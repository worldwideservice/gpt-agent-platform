"use client";

/**
 * Диалог создания скрипта продаж
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
import { useToast } from "@/components/ui";

const SCRIPT_TYPES = [
  { value: "greeting", label: "Приветствие" },
  { value: "qualification", label: "Квалификация" },
  { value: "presentation", label: "Презентация" },
  { value: "objection_handling", label: "Работа с возражениями" },
  { value: "closing", label: "Закрытие сделки" },
];

const createScriptSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
  scriptType: z.enum(["greeting", "qualification", "presentation", "objection_handling", "closing"]),
  content: z.string().min(1, "Содержимое обязательно"),
  pipelineStageId: z.string().uuid().nullable().optional(),
});

type CreateScriptFormData = z.infer<typeof createScriptSchema>;

interface CreateScriptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentId: string;
  onSuccess: () => void;
}

export function CreateScriptDialog({
  open,
  onOpenChange,
  agentId,
  onSuccess,
}: CreateScriptDialogProps) {
  const { push: pushToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CreateScriptFormData>({
    resolver: zodResolver(createScriptSchema),
    defaultValues: {
      title: "",
      scriptType: "greeting",
      content: "",
      pipelineStageId: null,
    },
  });

  const onSubmit = async (data: CreateScriptFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/agents/${agentId}/scripts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: data.title,
          scriptType: data.scriptType,
          content: data.content,
          pipelineStageId: data.pipelineStageId || null,
          variables: {},
          conditions: {},
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Не удалось создать скрипт");
      }

      pushToast({
        title: "Скрипт создан",
        description: "Скрипт успешно создан",
        variant: "success",
      });

      reset();
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to create script", error);
      pushToast({
        title: "Ошибка",
        description: error.message || "Не удалось создать скрипт",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создать скрипт продаж</DialogTitle>
          <DialogDescription>
            Создайте скрипт для общения с клиентами. Можно использовать переменные вида {"{{variable_name}}"}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Название <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Название скрипта"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="scriptType">
              Тип скрипта <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch("scriptType")}
              onValueChange={(value) => setValue("scriptType", value as any)}
            >
              <SelectTrigger id="scriptType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCRIPT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">
              Содержимое скрипта <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              {...register("content")}
              placeholder="Введите текст скрипта. Используйте {{client_name}}, {{product_name}} и другие переменные."
              rows={10}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              Доступные переменные: {"{{client_name}}"}, {"{{product_name}}"}, {"{{price}}"}, {"{{company_name}}"}
            </p>
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
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
              {isSubmitting ? "Создание..." : "Создать скрипт"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

