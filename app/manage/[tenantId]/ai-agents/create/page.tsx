"use client";

/**
 * Страница создания AI Agent (Агент ИИ)
 * Использует Refine для работы с данными
 */

import { useForm } from "@refinedev/react-hook-form";
import { useNavigation } from "@refinedev/core";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { Label } from "@/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { useToast } from "@/components/ui";

// Доступные модели ИИ
const AI_MODELS = [
  { value: "gpt-4", label: "GPT-4" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "gpt-4o", label: "GPT-4o" },
];

// Статусы агента
const AGENT_STATUSES = [
  { value: "draft", label: "Черновик" },
  { value: "active", label: "Активный" },
  { value: "inactive", label: "Неактивный" },
];

// Схема валидации
const createAgentSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  status: z.enum(["active", "inactive", "draft"]).optional().default("draft"),
  model: z.string().optional(),
  instructions: z.string().optional(),
  temperature: z.number().min(0).max(2).optional().default(0.7),
  maxTokens: z.number().int().min(128).max(8000).optional().default(2000),
  responseDelaySeconds: z
    .number()
    .int()
    .min(0)
    .max(86400)
    .optional()
    .default(0),
});

type CreateAgentFormData = z.infer<typeof createAgentSchema>;

export default function CreateAIAgentPage() {
  const params = useParams();
  const tenantId = (params?.tenantId as string) || "";
  const { list } = useNavigation();
  const { push: pushToast } = useToast();

  // Форма создания
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(createAgentSchema),
    refineCoreProps: {
      resource: "agents",
      action: "create",
      redirect: false,
      onMutationSuccess: () => {
        pushToast({
          title: "Агент создан",
          description: "Агент успешно создан",
          variant: "success",
        });
        list("agents");
      },
      onMutationError: () => {
        pushToast({
          title: "Ошибка",
          description: "Не удалось создать агента",
          variant: "error",
        });
      },
    },
    defaultValues: {
      name: "",
      status: "draft",
      model: "gpt-4",
      instructions: "",
      temperature: 0.7,
      maxTokens: 2000,
      responseDelaySeconds: 0,
    },
  });

  const status = watch("status");
  const model = watch("model");

  return (
    <div className="p-6">
      {/* Заголовок */}
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/manage/${tenantId}/ai-agents`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Создать агента ИИ</h1>
          <nav className="text-sm text-gray-500 mt-1">
            Агенты ИИ → Создать
          </nav>
        </div>
      </div>

      {/* Форма */}
      <form onSubmit={handleSubmit(onFinish)} className="max-w-4xl space-y-6">
        {/* Название */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Название <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Название агента*"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500">
              {typeof errors.name.message === "string"
                ? errors.name.message
                : "Поле обязательно для заполнения"}
            </p>
          )}
        </div>

        {/* Статус */}
        <div className="space-y-2">
          <Label htmlFor="status">Статус</Label>
          <Select
            value={status || "draft"}
            onValueChange={(value) =>
              setValue("status", value as "active" | "inactive" | "draft", {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AGENT_STATUSES.map((statusOption) => (
                <SelectItem key={statusOption.value} value={statusOption.value}>
                  {statusOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Модель ИИ */}
        <div className="space-y-2">
          <Label htmlFor="model">Модель ИИ</Label>
          <Select
            value={model || "gpt-4"}
            onValueChange={(value) =>
              setValue("model", value, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger id="model">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AI_MODELS.map((modelOption) => (
                <SelectItem key={modelOption.value} value={modelOption.value}>
                  {modelOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Инструкции */}
        <div className="space-y-2">
          <Label htmlFor="instructions">Инструкции</Label>
          <Textarea
            id="instructions"
            {...register("instructions")}
            placeholder="Основные инструкции для агента..."
            rows={8}
          />
          <p className="text-xs text-gray-500">
            Опишите, как должен вести себя агент, его роль и стиль общения
          </p>
        </div>

        {/* Дополнительные настройки */}
        <div className="grid grid-cols-3 gap-4">
          {/* Temperature */}
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature</Label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              min="0"
              max="2"
              {...register("temperature", { valueAsNumber: true })}
            />
            <p className="text-xs text-gray-500">0.0 - 2.0</p>
          </div>

          {/* Max Tokens */}
          <div className="space-y-2">
            <Label htmlFor="maxTokens">Max Tokens</Label>
            <Input
              id="maxTokens"
              type="number"
              min="128"
              max="8000"
              {...register("maxTokens", { valueAsNumber: true })}
            />
            <p className="text-xs text-gray-500">128 - 8000</p>
          </div>

          {/* Response Delay */}
          <div className="space-y-2">
            <Label htmlFor="responseDelaySeconds">Задержка ответа (сек)</Label>
            <Input
              id="responseDelaySeconds"
              type="number"
              min="0"
              max="86400"
              {...register("responseDelaySeconds", { valueAsNumber: true })}
            />
            <p className="text-xs text-gray-500">0 - 86400</p>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" disabled={formLoading}>
            {formLoading ? "Создание..." : "Создать"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => list("agents")}
            disabled={formLoading}
          >
            Отмена
          </Button>
        </div>
      </form>
    </div>
  );
}

