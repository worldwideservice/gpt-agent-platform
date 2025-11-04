"use client";

/**
 * Страница редактирования AI Agent (Агент ИИ)
 * Базовая версия - только вкладка "Основные"
 * Использует Refine для работы с данными
 */

import { useState } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { useNavigation, useOne } from "@refinedev/core";
import { useParams } from "next/navigation";
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
import { EditView, EditViewHeader } from "@/components/refine-ui/views/edit-view";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { DealContactFieldsSelector } from "@/components/crm/DealContactFieldsSelector";
import { TriggersManager } from "./_components/TriggersManager";
import { SequencesManager } from "./_components/SequencesManager";
import { IntegrationsManager } from "./_components/IntegrationsManager";
import { RulesManager } from "./_components/RulesManager";

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
          language: z.string().optional(),
          maxResponseLength: z.number().optional(),
          enableMarkdown: z.boolean().optional(),
        })
        .optional(),
});

type UpdateAgentFormData = z.infer<typeof updateAgentSchema>;

export default function EditAIAgentPage() {
  const params = useParams();
  const agentId = (params?.id as string) || "";
  const { list } = useNavigation();
  
  // Toast для уведомлений
  const { push: pushToast } = useToast();

  // Загружаем данные агента для редактирования
  const { result: agentResult, query: agentQuery } = useOne({
    resource: "agents",
    id: agentId,
  });

  const agentData = agentResult?.data;
  const isLoadingAgent = agentQuery.isLoading;

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
        <LoadingOverlay loading={true}>
          <div className="text-center py-8">Загрузка...</div>
        </LoadingOverlay>
      </div>
    );
  }

  if (!agentData) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-red-500">Агент не найден</p>
          <Button variant="outline" className="mt-4" onClick={() => list("agents")}>
            Вернуться к списку
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <EditView>
        <EditViewHeader 
          resource="agents" 
          title={`Редактирование ${agentData?.name || "агента"}`}
          actionsSlot={
            <DeleteButton
              recordItemId={agentId}
              resource="agents"
            />
          }
        />
        
        <LoadingOverlay loading={formLoading}>

      {/* Вкладки */}
      <Tabs defaultValue="basic" className="max-w-4xl">
        <TabsList>
          <TabsTrigger value="basic">Основные</TabsTrigger>
          <TabsTrigger value="deals">Сделки и контакты</TabsTrigger>
          <TabsTrigger value="triggers">Триггеры</TabsTrigger>
          <TabsTrigger value="rules">Правила</TabsTrigger>
          <TabsTrigger value="chains">Цепочки</TabsTrigger>
          <TabsTrigger value="integrations">Интеграции</TabsTrigger>
          <TabsTrigger value="advanced">Дополнительно</TabsTrigger>
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

        {/* Вкладка "Сделки и контакты" */}
        <TabsContent value="deals">
          <div className="mt-6">
            <DealContactFieldsSelector
              agentId={agentId}
              onFieldsChange={(dealFields, contactFields) => {
                // Поля автоматически сохраняются через компонент
                console.log('Fields changed:', { dealFields, contactFields })
              }}
            />
          </div>
        </TabsContent>

        {/* Вкладка "Триггеры" */}
        <TabsContent value="triggers">
          <div className="mt-6">
            <TriggersManager agentId={agentId} />
          </div>
        </TabsContent>

        {/* Вкладка "Правила" */}
        <TabsContent value="rules">
          <div className="mt-6">
            <RulesManager agentId={agentId} />
          </div>
        </TabsContent>

        {/* Вкладка "Цепочки" */}
        <TabsContent value="chains">
          <div className="mt-6">
            <SequencesManager agentId={agentId} />
          </div>
        </TabsContent>

        {/* Вкладка "Интеграции" */}
        <TabsContent value="integrations">
          <div className="mt-6">
            <IntegrationsManager agentId={agentId} />
          </div>
        </TabsContent>

        {/* Вкладка "Дополнительно" */}
        <TabsContent value="advanced">
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Дополнительные настройки</h3>
              <p className="text-sm text-gray-500 mb-6">
                Расширенные параметры для тонкой настройки агента
              </p>
            </div>

            {/* Языковые настройки */}
            <div className="space-y-6 border rounded-lg p-6">
              <h4 className="text-base font-semibold">Языковые настройки</h4>
              <div className="space-y-2">
                <Label htmlFor="language">Язык ответов</Label>
                <Select
                  value={String(watch("settings.language") || agentData?.settings?.language || "ru")}
                  onValueChange={(value) =>
                    setValue("settings.language", value, { shouldValidate: true })
                  }
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="auto">Автоматически</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Язык, на котором агент будет отвечать пользователям
                </p>
              </div>
            </div>

            {/* Настройки ответов */}
            <div className="space-y-6 border rounded-lg p-6">
              <h4 className="text-base font-semibold">Настройки ответов</h4>
              
              <div className="space-y-2">
                <Label htmlFor="maxResponseLength">Максимальная длина ответа (символов)</Label>
                <Input
                  id="maxResponseLength"
                  type="number"
                  min="100"
                  max="10000"
                  {...register("settings.maxResponseLength", { valueAsNumber: true })}
                  defaultValue={agentData?.settings?.maxResponseLength || 2000}
                />
                <p className="text-xs text-gray-500">
                  Ограничение длины ответа агента (100 - 10000 символов)
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableMarkdown"
                    checked={watch("settings.enableMarkdown") || false}
                    onCheckedChange={(checked) =>
                      setValue("settings.enableMarkdown", checked, { shouldValidate: true })
                    }
                    defaultChecked={agentData?.settings?.enableMarkdown || false}
                  />
                  <Label htmlFor="enableMarkdown" className="cursor-pointer">
                    Разрешить форматирование Markdown
                  </Label>
                </div>
                <p className="text-xs text-gray-500">
                  Агент сможет использовать Markdown для форматирования ответов
                </p>
              </div>
            </div>

            {/* Информация о настройках */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Примечание:</strong> Основные настройки ИИ (модель, temperature, max tokens) 
                находятся во вкладке "Основные". Здесь доступны дополнительные параметры для тонкой настройки.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      </LoadingOverlay>
      </EditView>
    </div>
  );
}

