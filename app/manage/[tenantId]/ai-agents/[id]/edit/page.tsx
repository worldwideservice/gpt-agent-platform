"use client";

/**
 * Страница редактирования AI Agent (Агент ИИ)
 * Базовая версия - только вкладка "Основные"
 * Использует Refine для работы с данными
 */

import { useState } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { useNavigation, useOne, useDelete } from "@refinedev/core";
import { useParams } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Textarea } from "@/components/ui";
import { Label } from "@/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { Switch } from "@/components/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { useToast } from "@/components/ui";
import { ConfirmDialog } from "@/components/ui";

// Доступные модели ИИ
const AI_MODELS = [
  { value: "gpt-4", label: "GPT-4" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "gpt-4o", label: "GPT-4o" },
];

// Схема валидации
const updateAgentSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  status: z.enum(["active", "inactive", "draft"]).optional(),
  model: z.string().optional(),
  instructions: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().min(128).max(8000).optional(),
  responseDelaySeconds: z
    .number()
    .int()
    .min(0)
    .max(86400)
    .optional(),
  settings: z
    .object({
      checkBeforeSending: z.boolean().optional(),
    })
    .optional(),
});

type UpdateAgentFormData = z.infer<typeof updateAgentSchema>;

export default function EditAIAgentPage() {
  const params = useParams();
  const tenantId = (params?.tenantId as string) || "";
  const agentId = (params?.id as string) || "";
  const { list } = useNavigation();
  
  // Состояние для диалога подтверждения удаления
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Toast для уведомлений
  const { push: pushToast } = useToast();

  // Загружаем данные агента для редактирования
  const { result: agentResult, query: agentQuery } = useOne({
    resource: "agents",
    id: agentId,
  });

  const agentData = agentResult?.data;
  const isLoadingAgent = agentQuery.isLoading;

  // Удаление агента
  const { mutate: deleteAgent } = useDelete();

  // Форма редактирования
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(updateAgentSchema),
    refineCoreProps: {
      resource: "agents",
      id: agentId,
      action: "edit",
      redirect: false,
      onMutationSuccess: () => {
        list("agents");
      },
    },
  });

  const status = watch("status");
  const model = watch("model");
  const checkBeforeSending = watch("settings.checkBeforeSending");

  // Загружаем данные агента
  if (isLoadingAgent) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Загрузка...</div>
      </div>
    );
  }

  if (!agentData) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-red-500">Агент не найден</p>
          <Link href={`/manage/${tenantId}/ai-agents`}>
            <Button variant="outline" className="mt-4">
              Вернуться к списку
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteAgent(
      {
        resource: "agents",
        id: agentId,
      },
      {
        onSuccess: () => {
          pushToast({
            title: "Агент удален",
            description: "Агент успешно удален",
            variant: "success",
          });
          list("agents");
        },
        onError: () => {
          pushToast({
            title: "Ошибка",
            description: "Не удалось удалить агента",
            variant: "error",
          });
        },
      }
    );
  };

  return (
    <div className="p-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href={`/manage/${tenantId}/ai-agents`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              Редактирование {agentData?.name || "агента"}
            </h1>
            <nav className="text-sm text-gray-500 mt-1">
              Агенты ИИ → {agentData?.name || "Агент"} → Основные
            </nav>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDeleteClick}
          title="Удалить агента"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Удалить
        </Button>
      </div>

      {/* Вкладки - пока только "Основные" */}
      <Tabs defaultValue="basic" className="max-w-4xl">
        <TabsList>
          <TabsTrigger value="basic">Основные</TabsTrigger>
          {/* Остальные вкладки будут добавлены позже */}
        </TabsList>

        <TabsContent value="basic">
          {/* Форма */}
          <form
            onSubmit={handleSubmit(onFinish)}
            className="space-y-8 mt-6"
          >
            {/* Секция "Профиль агента" */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Профиль агента</h2>

              {/* Название */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Название <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Название агента*"
                  defaultValue={agentData?.name || ""}
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

              {/* Статус (Switch) */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={status === "active"}
                    onCheckedChange={(checked) =>
                      setValue("status", checked ? "active" : "inactive", {
                        shouldValidate: true,
                      })
                    }
                    defaultChecked={agentData?.status === "active"}
                  />
                  <Label htmlFor="status" className="cursor-pointer">
                    Активно
                  </Label>
                </div>
              </div>

              {/* Инструкции */}
              <div className="space-y-2">
                <Label htmlFor="instructions">
                  Инструкции для агента{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="instructions"
                  {...register("instructions")}
                  placeholder="Начальные инструкции по тону, стилю и ответам вашего агента..."
                  rows={10}
                  defaultValue={agentData?.instructions || ""}
                  className={errors.instructions ? "border-red-500" : ""}
                />
                <p className="text-xs text-gray-500">
                  Вы также можете добавить общие сведения о компании, чтобы
                  помочь агенту отвечать более точно.
                </p>
                {errors.instructions && (
                  <p className="text-sm text-red-500">
                    {typeof errors.instructions.message === "string"
                      ? errors.instructions.message
                      : "Ошибка в поле инструкций"}
                  </p>
                )}
              </div>
            </div>

            {/* Секция "Взаимодействие" */}
            <div className="space-y-6 border-t pt-6">
              <h2 className="text-lg font-semibold">Взаимодействие</h2>

              {/* Проверять перед отправкой */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="checkBeforeSending"
                    checked={checkBeforeSending || false}
                    onCheckedChange={(checked) =>
                      setValue("settings.checkBeforeSending", checked, {
                        shouldValidate: true,
                      })
                    }
                    defaultChecked={
                      agentData?.settings?.checkBeforeSending || false
                    }
                  />
                  <Label htmlFor="checkBeforeSending" className="cursor-pointer">
                    Проверять перед отправкой
                  </Label>
                </div>
                <p className="text-xs text-gray-500">
                  Сообщения не будут отправляться автоматически. Они появятся в
                  поле ввода сообщения для вашего просмотра и ручной отправки.
                </p>
              </div>
            </div>

            {/* Секция "Настройки ИИ" */}
            <div className="space-y-6 border-t pt-6">
              <h2 className="text-lg font-semibold">Настройки ИИ</h2>

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
                  defaultValue={agentData?.model || "gpt-4"}
                >
                  <SelectTrigger id="model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_MODELS.map((modelOption) => (
                      <SelectItem
                        key={modelOption.value}
                        value={modelOption.value}
                      >
                        {modelOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    defaultValue={agentData?.temperature || 0.7}
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
                    defaultValue={agentData?.maxTokens || 2000}
                  />
                  <p className="text-xs text-gray-500">128 - 8000</p>
                </div>

                {/* Response Delay */}
                <div className="space-y-2">
                  <Label htmlFor="responseDelaySeconds">
                    Задержка ответа (сек)
                  </Label>
                  <Input
                    id="responseDelaySeconds"
                    type="number"
                    min="0"
                    max="86400"
                    {...register("responseDelaySeconds", {
                      valueAsNumber: true,
                    })}
                    defaultValue={agentData?.responseDelaySeconds || 0}
                  />
                  <p className="text-xs text-gray-500">0 - 86400</p>
                </div>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="flex items-center gap-4 pt-6 border-t">
              <Button type="submit" disabled={formLoading}>
                {formLoading ? "Сохранение..." : "Сохранить"}
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
        </TabsContent>
      </Tabs>

      {/* Диалог подтверждения удаления */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Удалить агента?"
        description="Вы уверены, что хотите удалить этого агента? Это действие нельзя отменить."
        confirmText="Удалить"
        cancelText="Отмена"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

