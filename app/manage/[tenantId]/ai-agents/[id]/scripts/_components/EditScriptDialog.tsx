"use client";

/**
 * Диалог редактирования скрипта продаж
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
import { useToast } from "@/components/ui";

const SCRIPT_TYPES = [
  { value: "greeting", label: "Приветствие" },
  { value: "qualification", label: "Квалификация" },
  { value: "presentation", label: "Презентация" },
  { value: "objection_handling", label: "Работа с возражениями" },
  { value: "closing", label: "Закрытие сделки" },
];

const updateScriptSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
  scriptType: z.enum(["greeting", "qualification", "presentation", "objection_handling", "closing"]),
  content: z.string().min(1, "Содержимое обязательно"),
  pipelineStageId: z.string().uuid().nullable().optional(),
});

type UpdateScriptFormData = z.infer<typeof updateScriptSchema>;

interface SalesScript {
  id: string;
  orgId: string;
  agentId: string | null;
  pipelineStageId: string | null;
  title: string;
  scriptType: "greeting" | "qualification" | "presentation" | "objection_handling" | "closing";
  content: string;
  variables: Record<string, unknown>;
  conditions: Record<string, unknown>;
  effectivenessScore: number;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface EditScriptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentId: string;
  script: SalesScript;
  onSuccess: () => void;
}

export function EditScriptDialog({
  open,
  onOpenChange,
  agentId,
  script,
  onSuccess,
}: EditScriptDialogProps) {
  const { push: pushToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<UpdateScriptFormData>({
    resolver: zodResolver(updateScriptSchema),
    defaultValues: {
      title: script.title,
      scriptType: script.scriptType,
      content: script.content,
      pipelineStageId: script.pipelineStageId,
    },
  });

  useEffect(() => {
    if (script) {
      reset({
        title: script.title,
        scriptType: script.scriptType,
        content: script.content,
        pipelineStageId: script.pipelineStageId,
      });
    }
  }, [script, reset]);

  const onSubmit = async (data: UpdateScriptFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/agents/${agentId}/scripts/${script.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: data.title,
          scriptType: data.scriptType,
          content: data.content,
          pipelineStageId: data.pipelineStageId || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Не удалось обновить скрипт");
      }

      pushToast({
        title: "Скрипт обновлен",
        description: "Скрипт успешно обновлен",
        variant: "success",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to update script", error);
      pushToast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить скрипт",
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
          <DialogTitle>Редактировать скрипт</DialogTitle>
          <DialogDescription>
            Измените содержимое скрипта продаж
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
              {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

