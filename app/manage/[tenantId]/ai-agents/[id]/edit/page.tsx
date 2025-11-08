"use client";

/**
 * Страница редактирования AI Agent (Агент ИИ)
 * Базовая версия - только вкладка "Основные"
 * Использует Refine для работы с данными
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { useNavigation, useOne } from "@refinedev/core";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Button,
  Input,
  Textarea,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Badge,
  useToast,
  CRMSync,
  ChannelsSettings,
  KnowledgeBaseSettings,
  InteractionSettings,
} from "@/components/ui";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { GlassCard } from "@/components/ui/glass-card";
import { EditView, EditViewHeader } from "@/components/refine-ui/views/edit-view";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import { DealContactFieldsSelector } from "@/components/crm/DealContactFieldsSelector";
import { TriggersManager } from "./_components/TriggersManager";
import { SequencesManager } from "./_components/SequencesManager";
import { IntegrationsManager } from "./_components/IntegrationsManager";
import { RulesManager } from "./_components/RulesManager";
import { TrainingTab } from "./_components/TrainingTab";
import type { CRMConnection } from "@/types/crm";

// Доступные модели ИИ (по KWID)
const AI_MODELS = [
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4o-mini", label: "GPT-4o mini" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
];

const AVAILABLE_CHANNELS = [
  { id: "email", name: "Email", type: "Email" },
  { id: "whatsapp", name: "WhatsApp", type: "Мессенджер" },
  { id: "telegram", name: "Telegram", type: "Мессенджер" },
  { id: "facebook", name: "Facebook Messenger", type: "Социальные сети" },
  { id: "instagram", name: "Instagram Direct", type: "Социальные сети" },
  { id: "website", name: "Веб-чат", type: "Web" },
];

const DEFAULT_NOT_FOUND_MESSAGE =
  "У меня недостаточно информации, чтобы ответить на этот вопрос. Я передам его специалисту и вернусь с ответом.";

interface PipelineSettingsState {
  id: string;
  name: string;
  isActive: boolean;
  allStages: boolean;
  selectedStages: string[];
  stageInstructions: Record<string, string>;
}

// Схема валидации
const updateAgentSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  status: z.enum(["active", "inactive", "draft"]).optional(),
  model: z.string().optional(),
  instructions: z.string().min(1, "Инструкции для агента обязательны"),
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
      defaultChannels: z.array(z.string()).optional(),
      knowledgeBaseAllCategories: z.boolean().optional(),
      createTaskOnNotFound: z.boolean().optional(),
      notFoundMessage: z.string().optional(),
    })
    .optional(),
});

type UpdateAgentFormData = z.infer<typeof updateAgentSchema>;

export default function EditAIAgentPage() {
  const params = useParams();
  const agentId = (params?.id as string) || "";
  const tenantId = (params?.tenantId as string) || "";
  const router = useRouter();
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
  const checkBeforeSending = watch("settings.checkBeforeSending") ?? false;
  const knowledgeBaseAllCategories = watch("settings.knowledgeBaseAllCategories") ?? true;
  const createTaskOnNotFound = watch("settings.createTaskOnNotFound") ?? false;
  const notFoundMessage = watch("settings.notFoundMessage") ?? DEFAULT_NOT_FOUND_MESSAGE;

  const [crmConnection, setCrmConnection] = useState<CRMConnection | null>(null);
  const [pipelineSettings, setPipelineSettings] = useState<Record<string, PipelineSettingsState>>({});
  const [isPipelineLoading, setIsPipelineLoading] = useState(false);
  const [isSavingPipelines, setIsSavingPipelines] = useState(false);

  const [allChannelsEnabled, setAllChannelsEnabled] = useState(true);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(AVAILABLE_CHANNELS.map((channel) => channel.id));
  const [channelsInitialized, setChannelsInitialized] = useState(false);
  const [isSyncingChannels, setIsSyncingChannels] = useState(false);
  const [isSavingChannels, setIsSavingChannels] = useState(false);

  useEffect(() => {
    register("settings.checkBeforeSending");
    register("settings.defaultChannels");
    register("settings.knowledgeBaseAllCategories");
    register("settings.createTaskOnNotFound");
    register("settings.notFoundMessage");
  }, [register]);

  // Состояния для счетчиков элементов на вкладках
  const [triggersCount, setTriggersCount] = useState(0);
  const [rulesCount, setRulesCount] = useState(0);
  const [sequencesCount, setSequencesCount] = useState(0);
  const [integrationsCount, setIntegrationsCount] = useState(0);
  const [loadingCounts, setLoadingCounts] = useState(true);

  // Загрузка счетчиков для Badge на вкладках
  useEffect(() => {
    const loadCounts = async () => {
      if (!agentId) return;
      
      try {
        setLoadingCounts(true);
        
        // Загружаем счетчики параллельно
        const [triggersRes, rulesRes, sequencesRes, integrationsRes] = await Promise.all([
          fetch(`/api/agents/${agentId}/triggers`, { credentials: "include" }).catch(() => null),
          fetch(`/api/agents/${agentId}/rules`, { credentials: "include" }).catch(() => null),
          fetch(`/api/agents/${agentId}/sequences`, { credentials: "include" }).catch(() => null),
          fetch(`/api/agents/${agentId}/integrations`, { credentials: "include" }).catch(() => null),
        ]);

        if (triggersRes?.ok) {
          const data = await triggersRes.json();
          setTriggersCount(Array.isArray(data.data) ? data.data.length : 0);
        }

        if (rulesRes?.ok) {
          const data = await rulesRes.json();
          setRulesCount(Array.isArray(data.data) ? data.data.length : 0);
        }

        if (sequencesRes?.ok) {
          const data = await sequencesRes.json();
          setSequencesCount(Array.isArray(data.data) ? data.data.length : 0);
        }

        if (integrationsRes?.ok) {
          const data = await integrationsRes.json();
          const integrations = data.integrations || data.data || [];
          setIntegrationsCount(Array.isArray(integrations) ? integrations.length : 0);
        }
      } catch (error) {
        console.error("Failed to load counts", error);
      } finally {
        setLoadingCounts(false);
      }
    };

    if (agentId && !isLoadingAgent) {
      loadCounts();
    }
  }, [agentId, isLoadingAgent]);

  useEffect(() => {
    if (!agentData) {
      return;
    }

    setValue("name", agentData.name ?? "", { shouldDirty: false });
    setValue("status", agentData.status ?? "draft", { shouldDirty: false });
    setValue("model", agentData.model ?? "gpt-4o", { shouldDirty: false });
    setValue("temperature", agentData.temperature ?? 0.7, { shouldDirty: false });
    setValue("maxTokens", agentData.maxTokens ?? 2000, { shouldDirty: false });
    setValue("responseDelaySeconds", agentData.responseDelaySeconds ?? 0, { shouldDirty: false });
    setValue("instructions", agentData.instructions ?? "", { shouldDirty: false });
    setValue("settings.checkBeforeSending", agentData.settings?.checkBeforeSending ?? false, { shouldDirty: false });
    setValue("settings.language", agentData.settings?.language ?? "ru", { shouldDirty: false });
    setValue("settings.maxResponseLength", agentData.settings?.maxResponseLength ?? 2000, { shouldDirty: false });
    setValue("settings.enableMarkdown", agentData.settings?.enableMarkdown ?? false, { shouldDirty: false });
    setValue(
      "settings.knowledgeBaseAllCategories",
      agentData.settings?.knowledgeBaseAllCategories ?? true,
      { shouldDirty: false },
    );
    setValue(
      "settings.createTaskOnNotFound",
      agentData.settings?.createTaskOnNotFound ?? false,
      { shouldDirty: false },
    );
    setValue(
      "settings.notFoundMessage",
      agentData.settings?.notFoundMessage ?? DEFAULT_NOT_FOUND_MESSAGE,
      { shouldDirty: false },
    );
  }, [agentData, setValue]);

  useEffect(() => {
    const channelsForForm = allChannelsEnabled
      ? AVAILABLE_CHANNELS.map((channel) => channel.id)
      : selectedChannels;

    setValue("settings.defaultChannels", channelsForForm, {
      shouldDirty: channelsInitialized,
    });
  }, [allChannelsEnabled, selectedChannels, setValue, channelsInitialized]);

  useEffect(() => {
    if (!agentId) {
      return;
    }

    const loadChannels = async () => {
      try {
        const response = await fetch(`/api/agents/${agentId}/channels`, {
          credentials: "include",
        });

        if (!response?.ok) {
          return;
        }

        const payload = await response.json();
        if (!payload?.success) {
          return;
        }

        const channelsData: Array<{ channel: string; isEnabled: boolean }> = Array.isArray(
          payload.data,
        )
          ? payload.data
          : [];

        const allAvailableIds = AVAILABLE_CHANNELS.map((item) => item.id);

        if (channelsData.length === 0) {
          setAllChannelsEnabled(true);
          setSelectedChannels(allAvailableIds);
          setValue("settings.defaultChannels", allAvailableIds, { shouldDirty: false });
          setChannelsInitialized(true);
          return;
        }

        const enabledChannels = channelsData
          .filter((item) => item.isEnabled)
          .map((item) => item.channel)
          .filter((channel) => allAvailableIds.includes(channel));

        const allExplicitEnabled =
          channelsData.length === allAvailableIds.length &&
          channelsData.every((item) => item.isEnabled);

        const nextAllChannelsEnabled = allExplicitEnabled;
        const nextSelectedChannels = nextAllChannelsEnabled ? allAvailableIds : enabledChannels;

        setAllChannelsEnabled(nextAllChannelsEnabled);
        setSelectedChannels(nextSelectedChannels);
        setValue("settings.defaultChannels", nextSelectedChannels, {
          shouldDirty: false,
        });
        setChannelsInitialized(true);
      } catch (error) {
        console.error("Failed to load agent channels", error);
      } finally {
        setChannelsInitialized(true);
      }
    };

    void loadChannels();
  }, [agentId, setValue]);

  useEffect(() => {
    if (!agentId) {
      return;
    }

    const loadCrmData = async () => {
      setIsPipelineLoading(true);

      try {
        const [connectionResponse, pipelineSettingsResponse] = await Promise.all([
          fetch(`/api/agents/${agentId}/crm-connection`, { credentials: "include" }).catch(() => null),
          fetch(`/api/agents/${agentId}/pipeline-settings`, { credentials: "include" }).catch(() => null),
        ]);

        if (connectionResponse?.ok) {
          const connectionData = await connectionResponse.json();
          if (connectionData?.success) {
            const connection = connectionData.data as (CRMConnection & { lastSyncAt?: string | null }) | null;
            if (connection) {
              setCrmConnection({
                ...connection,
                lastSyncAt: connection.lastSyncAt ? new Date(connection.lastSyncAt) : undefined,
              });
            } else {
              setCrmConnection(null);
            }
          }
        }

        if (pipelineSettingsResponse?.ok) {
          const pipelineSettingsData = await pipelineSettingsResponse.json();
          if (pipelineSettingsData?.success && Array.isArray(pipelineSettingsData.data)) {
            type PipelineSettingResponse = {
              pipeline_id: string;
              is_active?: boolean | null;
              all_stages?: boolean | null;
              selected_stages?: string[] | null;
              stage_instructions?: Record<string, string> | null;
            };

            const nextSettings: Record<string, PipelineSettingsState> = {};

            (pipelineSettingsData.data as PipelineSettingResponse[]).forEach((item) => {
              const pipelineId = item.pipeline_id;
              if (!pipelineId) {
                return;
              }

              nextSettings[pipelineId] = {
                id: pipelineId,
                name: pipelineId,
                isActive: Boolean(item.is_active),
                allStages: Boolean(item.all_stages),
                selectedStages: Array.isArray(item.selected_stages) ? item.selected_stages : [],
                stageInstructions:
                  item.stage_instructions && typeof item.stage_instructions === "object"
                    ? item.stage_instructions
                    : {},
              };
            });

            setPipelineSettings(nextSettings);
          } else {
            setPipelineSettings({});
          }
        } else if (pipelineSettingsResponse) {
          setPipelineSettings({});
        }
      } catch (error) {
        console.error("Failed to load CRM data", error);
      } finally {
        setIsPipelineLoading(false);
      }
    };

    void loadCrmData();
  }, [agentId]);

  const pipelineSettingsArray = useMemo(() => Object.values(pipelineSettings), [pipelineSettings]);

  const channelItems = useMemo(
    () =>
      AVAILABLE_CHANNELS.map((channel) => ({
        ...channel,
        isActive: allChannelsEnabled || selectedChannels.includes(channel.id),
      })),
    [allChannelsEnabled, selectedChannels],
  );

  const handlePipelineUpdate = useCallback(
    (pipelineId: string, updates: Partial<PipelineSettingsState>) => {
      setPipelineSettings((prev) => {
        const current = prev[pipelineId] ?? {
          id: pipelineId,
          name: pipelineId,
          isActive: false,
          allStages: false,
          selectedStages: [],
          stageInstructions: {},
        };

        return {
          ...prev,
          [pipelineId]: {
            ...current,
            ...updates,
            selectedStages: updates.selectedStages ?? current.selectedStages,
            stageInstructions: updates.stageInstructions ?? current.stageInstructions,
          },
        };
      });
    },
    [],
  );

  const handleAllChannelsToggle = useCallback((enabled: boolean) => {
    setAllChannelsEnabled(enabled);
    if (enabled) {
      setSelectedChannels(AVAILABLE_CHANNELS.map((channel) => channel.id));
    }
  }, []);

  const handleChannelToggle = useCallback(
    (channelId: string, enabled: boolean) => {
      if (enabled) {
        setSelectedChannels((prev) => (prev.includes(channelId) ? prev : [...prev, channelId]));
      } else {
        setSelectedChannels((prev) => prev.filter((id) => id !== channelId));
        if (allChannelsEnabled) {
          setAllChannelsEnabled(false);
        }
      }
    },
    [allChannelsEnabled],
  );

  const persistPipelineSettings = useCallback(
    async (settings: PipelineSettingsState[]) => {
      if (!agentId) {
        return;
      }

      setIsSavingPipelines(true);
      try {
        const response = await fetch(`/api/agents/${agentId}/pipeline-settings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(
            settings.map((setting) => ({
              pipelineId: setting.id,
              isActive: setting.isActive,
              allStages: setting.allStages,
              selectedStages: setting.selectedStages,
              stageInstructions: setting.stageInstructions,
            })),
          ),
        });

        if (!response.ok) {
          const errorPayload = await response.json().catch(() => ({}));
          const message =
            (errorPayload && (errorPayload.error || errorPayload.message)) ||
            "Не удалось сохранить настройки воронок";
          throw new Error(message);
        }
      } finally {
        setIsSavingPipelines(false);
      }
    },
    [agentId],
  );

  const persistAgentChannels = useCallback(async () => {
    if (!agentId) {
      return;
    }

    setIsSavingChannels(true);
    try {
      const response = await fetch(`/api/agents/${agentId}/channels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          allChannelsEnabled,
          channels: AVAILABLE_CHANNELS.map((channel) => ({
            id: channel.id,
            isActive: allChannelsEnabled ? true : selectedChannels.includes(channel.id),
          })),
        }),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        const message =
          (errorPayload && (errorPayload.error || errorPayload.message)) ||
          "Не удалось сохранить настройки каналов";
        throw new Error(message);
      }
    } finally {
      setIsSavingChannels(false);
    }
  }, [agentId, allChannelsEnabled, selectedChannels]);

  const isSaving = formLoading || isSavingPipelines || isSavingChannels;

  const handleBasicSubmit = handleSubmit(async (values) => {
    const channelsForForm = allChannelsEnabled
      ? AVAILABLE_CHANNELS.map((channel) => channel.id)
      : selectedChannels;

    const payload: UpdateAgentFormData = {
      ...values,
      settings: {
        ...values.settings,
        defaultChannels: channelsForForm,
        checkBeforeSending: values.settings?.checkBeforeSending ?? checkBeforeSending,
        knowledgeBaseAllCategories:
          values.settings?.knowledgeBaseAllCategories ?? knowledgeBaseAllCategories,
        createTaskOnNotFound:
          values.settings?.createTaskOnNotFound ?? createTaskOnNotFound,
        notFoundMessage: values.settings?.notFoundMessage ?? notFoundMessage,
      },
    };

    try {
      await onFinish(payload);
      await persistPipelineSettings(pipelineSettingsArray);
      await persistAgentChannels();
      pushToast({
        title: "Изменения сохранены",
        description: "Настройки агента успешно обновлены",
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to save agent settings", error);
      pushToast({
        title: "Ошибка",
        description:
          error instanceof Error ? error.message : "Не удалось сохранить настройки агента",
        variant: "error",
      });
    }
  });

  const handleOpenKnowledgeBase = useCallback(() => {
    if (tenantId) {
      router.push(`/manage/${tenantId}/knowledge-items`);
    } else {
      router.push("/knowledge-items");
    }
  }, [router, tenantId]);

  const handleCrmSync = useCallback(async () => {
    setIsSyncingChannels(true);
    try {
      const response = await fetch("/api/integrations/kommo/sync/pipelines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const message = body?.error || "Не удалось запустить синхронизацию CRM";
        throw new Error(message);
      }

      pushToast({
        title: "Синхронизация запущена",
        description: "Обновление данных CRM выполняется в фоне. Обновите страницу через минуту.",
        variant: "success",
      });
    } catch (error) {
      pushToast({
        title: "Ошибка синхронизации",
        description:
          error instanceof Error ? error.message : "Не удалось запустить синхронизацию CRM",
        variant: "error",
      });
    } finally {
      setIsSyncingChannels(false);
    }
  }, [pushToast]);

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
          <TabsTrigger value="training">Обучение</TabsTrigger>
          <TabsTrigger value="deals">Сделки и контакты</TabsTrigger>
          <TabsTrigger value="triggers">
            Триггеры
            {!loadingCounts && triggersCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                {triggersCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rules">
            Правила
            {!loadingCounts && rulesCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                {rulesCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="chains">
            Цепочки
            {!loadingCounts && sequencesCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                {sequencesCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="integrations">
            Интеграции
            {!loadingCounts && integrationsCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                {integrationsCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="advanced">Дополнительно</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <form onSubmit={handleBasicSubmit} className="space-y-8 mt-6">
            <ScrollAnimation direction="fade" delay={100}>
              <GlassCard variant="subtle">
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">Профиль агента</h2>

                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Название <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Название агента*"
                      defaultValue={agentData?.name || ""}
                      className={`transition-all duration-300 hover:border-[#E63946]/50 focus:border-[#E63946] ${
                        errors.name ? "border-red-500" : ""
                      }`}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">
                        {typeof errors.name.message === "string"
                          ? errors.name.message
                          : "Поле обязательно для заполнения"}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="status"
                      checked={status === "active"}
                      onCheckedChange={(checked) =>
                        setValue("status", checked ? "active" : "inactive", {
                          shouldValidate: true,
                        })
                      }
                    />
                    <Label htmlFor="status" className="cursor-pointer">
                      Активно
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructions">
                      Инструкции для агента <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="instructions"
                      {...register("instructions")}
                      placeholder="Начальные инструкции по тону, стилю и ответам вашего агента..."
                      rows={10}
                      defaultValue={agentData?.instructions ?? ""}
                      className={`transition-all duration-300 hover:border-[#E63946]/50 focus:border-[#E63946] ${
                        errors.instructions ? "border-red-500" : ""
                      }`}
                    />
                    <p className="text-xs text-gray-500">
                      Добавьте сведения о компании, чтобы агент отвечал точнее.
                    </p>
                    {errors.instructions && (
                      <p className="text-sm text-red-500">
                        {typeof errors.instructions.message === "string"
                          ? errors.instructions.message
                          : "Поле обязательно для заполнения"}
                      </p>
                    )}
                  </div>
                </div>
              </GlassCard>
            </ScrollAnimation>

            <ScrollAnimation direction="fade" delay={160}>
              <InteractionSettings
                checkBeforeSending={checkBeforeSending}
                onCheckBeforeSendingToggle={(enabled) =>
                  setValue("settings.checkBeforeSending", enabled, { shouldDirty: true })
                }
              />
            </ScrollAnimation>

            <ScrollAnimation direction="fade" delay={220}>
              <GlassCard variant="subtle">
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">Настройки ИИ</h2>

                  <div className="space-y-2">
                    <Label htmlFor="model">Модель ИИ</Label>
                    <Select
                      value={model || "gpt-4o"}
                      onValueChange={(value) =>
                        setValue("model", value, {
                          shouldValidate: true,
                        })
                      }
                      defaultValue={agentData?.model || "gpt-4o"}
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

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                        className="transition-all duration-300 hover:border-[#E63946]/50 focus:border-[#E63946]"
                      />
                      <p className="text-xs text-gray-500">0.0 - 2.0</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxTokens">Max Tokens</Label>
                      <Input
                        id="maxTokens"
                        type="number"
                        min="128"
                        max="8000"
                        {...register("maxTokens", { valueAsNumber: true })}
                        defaultValue={agentData?.maxTokens || 2000}
                        className="transition-all duration-300 hover:border-[#E63946]/50 focus:border-[#E63946]"
                      />
                      <p className="text-xs text-gray-500">128 - 8000</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="responseDelaySeconds">Задержка ответа (сек)</Label>
                      <Input
                        id="responseDelaySeconds"
                        type="number"
                        min="0"
                        max="86400"
                        {...register("responseDelaySeconds", { valueAsNumber: true })}
                        defaultValue={agentData?.responseDelaySeconds || 0}
                        className="transition-all duration-300 hover:border-[#E63946]/50 focus:border-[#E63946]"
                      />
                      <p className="text-xs text-gray-500">0 - 86400</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </ScrollAnimation>

            <ScrollAnimation direction="fade" delay={260}>
              <GlassCard variant="subtle">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold">Настройки воронок</h2>
                    <p className="text-sm text-gray-500">
                      Выбирайте этапы сделок и добавляйте инструкции, чтобы агент действовал как в референсной CRM.
                    </p>
                  </div>
                  <LoadingOverlay loading={isPipelineLoading}>
                    <CRMSync
                      connection={crmConnection}
                      pipelineSettings={pipelineSettingsArray}
                      onPipelineUpdate={handlePipelineUpdate}
                    />
                  </LoadingOverlay>
                </div>
              </GlassCard>
            </ScrollAnimation>

            <ScrollAnimation direction="fade" delay={320}>
              <div className="grid gap-6 lg:grid-cols-2">
                <ChannelsSettings
                  channels={channelItems}
                  allChannelsEnabled={allChannelsEnabled}
                  onAllChannelsToggle={handleAllChannelsToggle}
                  onChannelToggle={handleChannelToggle}
                  onSync={handleCrmSync}
                  isSyncing={isSyncingChannels}
                  disabled={isSaving}
                />
                <KnowledgeBaseSettings
                  allCategoriesEnabled={knowledgeBaseAllCategories}
                  createTaskOnNotFound={createTaskOnNotFound}
                  notFoundMessage={notFoundMessage}
                  onAllCategoriesToggle={(enabled) =>
                    setValue("settings.knowledgeBaseAllCategories", enabled, { shouldDirty: true })
                  }
                  onCreateTaskToggle={(enabled) =>
                    setValue("settings.createTaskOnNotFound", enabled, { shouldDirty: true })
                  }
                  onMessageChange={(message) =>
                    setValue("settings.notFoundMessage", message, { shouldDirty: true })
                  }
                  onOpenKnowledgeBase={handleOpenKnowledgeBase}
                  disabled={isSaving}
                />
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="fade" delay={380}>
              <div className="flex items-center gap-4 pt-6 border-t">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Сохранение..." : "Сохранить"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => list("agents")}
                  disabled={isSaving}
                >
                  Отмена
                </Button>
              </div>
            </ScrollAnimation>
          </form>
        </TabsContent>

        {/* Вкладка "Обучение" */}
        <TabsContent value="training">
          <form onSubmit={handleSubmit(onFinish)}>
            <ScrollAnimation direction="fade" delay={100}>
            <TrainingTab agentId={agentId} />
            </ScrollAnimation>
            <div className="flex items-center gap-4 pt-6 border-t mt-6">
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
            <ScrollAnimation direction="fade" delay={100}>
            <DealContactFieldsSelector
              agentId={agentId}
              onFieldsChange={(dealFields, contactFields) => {
                // Поля автоматически сохраняются через компонент
                console.log('Fields changed:', { dealFields, contactFields })
              }}
            />
            </ScrollAnimation>
          </div>
        </TabsContent>

        {/* Вкладка "Триггеры" */}
        <TabsContent value="triggers">
          <div className="mt-6">
            <ScrollAnimation direction="fade" delay={100}>
            <TriggersManager agentId={agentId} />
            </ScrollAnimation>
          </div>
        </TabsContent>

        {/* Вкладка "Правила" */}
        <TabsContent value="rules">
          <div className="mt-6">
            <ScrollAnimation direction="fade" delay={100}>
            <RulesManager agentId={agentId} />
            </ScrollAnimation>
          </div>
        </TabsContent>

        {/* Вкладка "Цепочки" */}
        <TabsContent value="chains">
          <div className="mt-6">
            <ScrollAnimation direction="fade" delay={100}>
            <SequencesManager agentId={agentId} />
            </ScrollAnimation>
          </div>
        </TabsContent>

        {/* Вкладка "Интеграции" */}
        <TabsContent value="integrations">
          <div className="mt-6">
            <ScrollAnimation direction="fade" delay={100}>
            <IntegrationsManager agentId={agentId} />
            </ScrollAnimation>
          </div>
        </TabsContent>

        {/* Вкладка "Дополнительно" */}
        <TabsContent value="advanced">
          <div className="mt-6 space-y-6">
            <ScrollAnimation direction="fade" delay={100}>
            <div>
              <h3 className="text-lg font-semibold mb-2">Дополнительные настройки</h3>
              <p className="text-sm text-gray-500 mb-6">
                Расширенные параметры для тонкой настройки агента
              </p>
            </div>

            {/* Языковые настройки */}
            <GlassCard variant="subtle">
              <div className="space-y-6 p-6">
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
            </GlassCard>

            {/* Настройки ответов */}
            <GlassCard variant="subtle">
              <div className="space-y-6 p-6">
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
            </GlassCard>

            {/* Информация о настройках */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Примечание:</strong> Основные настройки ИИ (модель, temperature, max tokens) 
                находятся во вкладке "Основные". Здесь доступны дополнительные параметры для тонкой настройки.
              </p>
            </div>
            </ScrollAnimation>
          </div>
        </TabsContent>
      </Tabs>
      </LoadingOverlay>
      </EditView>
    </div>
  );
}
