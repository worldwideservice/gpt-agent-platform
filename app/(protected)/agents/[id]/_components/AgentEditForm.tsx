"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTenantId } from "@/hooks/useTenantId";
import {
  ArrowLeft,
  BookOpen,
  Link2,
  Save,
  Sparkles,
  Target,
  Trash2,
  Workflow,
  Settings,
  FileText,
  Users,
  Zap,
  Clock,
  Plug,
  Settings2,
} from "lucide-react";

import { TriggerManager } from "@/components/agents/TriggerManager";
import { CalloutPipelines } from "./CalloutPipelines";
import { StageCard } from "./StageCard";
import { KnowledgeBaseSettings } from "@/components/crm/KnowledgeBaseSettings";
import { ChannelsSettings } from "@/components/crm/ChannelsSettings";
import { InteractionSettings } from "@/components/crm/InteractionSettings";
import { DealContactFieldsSelector } from "@/components/crm/DealContactFieldsSelector";
import { AgentSequencesManager } from "./AgentSequencesManager";
import { IntegrationsTable } from "@/components/integrations/IntegrationsTable";
import {
  KwidButton,
  KwidInput,
  KwidSelect,
  KwidTextarea,
  KwidSwitch,
  KwidTabs,
  KwidTabsContent,
  KwidSection,
} from "@/components/kwid";

import type { Agent } from "@/types";
import type { AgentChannel } from "@/lib/repositories/agent-sequences";

interface AgentEditFormProps {
  agentId: string;
  initialAgent?: Agent | null;
  tenantId?: string;
}

interface SummaryCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const SummaryCard = ({ icon: Icon, title, description }: SummaryCardProps) => (
  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800">
    <Icon className="mb-2 h-5 w-5 text-custom-600 dark:text-custom-400" />
    <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
      {title}
    </h3>
    <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

type ChannelState = {
  id: string;
  label: string;
  name: string;
  type: string;
  isActive: boolean;
};

const DEFAULT_CHANNEL_OPTIONS: ChannelState[] = [
  { id: "email", label: "Email", name: "Email", type: "email", isActive: true },
  {
    id: "telegram",
    label: "Telegram",
    name: "Telegram",
    type: "chat",
    isActive: true,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    name: "WhatsApp",
    type: "chat",
    isActive: true,
  },
  {
    id: "facebook",
    label: "Facebook Messenger",
    name: "Facebook Messenger",
    type: "social",
    isActive: true,
  },
  {
    id: "website",
    label: "Виджет на сайте",
    name: "Виджет на сайте",
    type: "web",
    isActive: true,
  },
];

const DEFAULT_NOT_FOUND_MESSAGE =
  "Передам вопрос специалисту и вернусь с ответом в течение рабочего дня. Если нужно быстрее — напишите, пожалуйста, номер телефона.";

const CHANNEL_LABELS: Record<string, { label: string; type: string }> = {
  email: { label: "Email", type: "email" },
  telegram: { label: "Telegram", type: "chat" },
  whatsapp: { label: "WhatsApp", type: "chat" },
  facebook: { label: "Facebook Messenger", type: "social" },
  website: { label: "Виджет на сайте", type: "web" },
};

type AgentFormState = {
  name: string;
  status: Agent["status"];
  model: string;
  instructions: string;
  welcomeMessage: string;
  description: string;
  language: string;
  temperature: number;
  maxTokens: number;
  responseDelaySeconds: number;
  presencePenalty: number;
  frequencyPenalty: number;
  knowledgeBaseAllCategories: boolean;
  createTaskOnNotFound: boolean;
  notFoundMessage: string;
  checkBeforeSending: boolean;
  defaultChannels: string[];
};

const mapChannelLabel = (
  channelId: string,
): { label: string; type: string } => {
  return CHANNEL_LABELS[channelId] ?? { label: channelId, type: "other" };
};

const createChannelState = (
  channelId: string,
  isActive: boolean,
): ChannelState => {
  const meta = mapChannelLabel(channelId);
  return {
    id: channelId,
    label: meta.label,
    name: meta.label,
    type: meta.type,
    isActive,
  };
};

const buildChannelsFromSelection = (
  selected: string[],
  allEnabled: boolean,
): ChannelState[] => {
  const map = new Map<string, ChannelState>();

  DEFAULT_CHANNEL_OPTIONS.forEach((option) => {
    map.set(option.id, {
      ...option,
      isActive: allEnabled ? true : selected.includes(option.id),
    });
  });

  if (!allEnabled) {
    selected.forEach((channelId) => {
      if (!map.has(channelId)) {
        map.set(channelId, createChannelState(channelId, true));
      }
    });
  }

  return Array.from(map.values());
};

const deriveFormState = (agent?: Agent | null): AgentFormState => {
  const settings = agent?.settings ?? {};

  return {
    name: agent?.name ?? "",
    status: agent?.status ?? "draft",
    model: agent?.model ?? "",
    instructions: agent?.instructions ?? "",
    welcomeMessage:
      typeof settings.welcomeMessage === "string"
        ? settings.welcomeMessage
        : "",
    description:
      typeof settings.description === "string" ? settings.description : "",
    language:
      typeof settings.language === "string" ? settings.language : "auto",
    temperature: Number.isFinite(agent?.temperature)
      ? Number(agent?.temperature)
      : 0.7,
    maxTokens: Number.isFinite(agent?.maxTokens)
      ? Number(agent?.maxTokens)
      : 2048,
    responseDelaySeconds: Number.isFinite(agent?.responseDelaySeconds)
      ? Number(agent?.responseDelaySeconds)
      : 0,
    presencePenalty: Number.isFinite(settings.presencePenalty)
      ? Number(settings.presencePenalty)
      : 0,
    frequencyPenalty: Number.isFinite(settings.frequencyPenalty)
      ? Number(settings.frequencyPenalty)
      : 0,
    knowledgeBaseAllCategories:
      typeof settings.knowledgeBaseAllCategories === "boolean"
        ? settings.knowledgeBaseAllCategories
        : true,
    createTaskOnNotFound:
      typeof settings.createTaskOnNotFound === "boolean"
        ? settings.createTaskOnNotFound
        : false,
    notFoundMessage:
      typeof settings.notFoundMessage === "string" &&
      settings.notFoundMessage.trim().length > 0
        ? settings.notFoundMessage
        : DEFAULT_NOT_FOUND_MESSAGE,
    defaultChannels: Array.isArray(settings.defaultChannels)
      ? settings.defaultChannels.filter(
          (item): item is string => typeof item === "string",
        )
      : [],
    checkBeforeSending:
      typeof settings.checkBeforeSending === "boolean"
        ? settings.checkBeforeSending
        : false,
  };
};

export const AgentEditForm = ({
  agentId,
  initialAgent,
  tenantId,
}: AgentEditFormProps) => {
  const router = useRouter();
  const activeTenantId = useTenantId() || tenantId;
  const isNew = agentId === "new";

  // Функция для построения пути с tenant-id
  const getPath = (path: string) => {
    if (activeTenantId) {
      const cleanPath = path.startsWith("/") ? path.slice(1) : path;
      const mapping: Record<string, string> = {
        agents: "ai-agents",
        "agents/[id]": "ai-agents/[id]",
        "agents/[id]/edit": "ai-agents/[id]/edit",
        "agents/[id]/training": "ai-agents/[id]/training",
        "agents/[id]/pipelines": "ai-agents/[id]/pipelines",
        "knowledge-base": "knowledge-categories",
      };
      const mappedPath = mapping[cleanPath] || cleanPath;
      const finalPath = mappedPath.replace("[id]", agentId);
      return `/manage/${activeTenantId}/${finalPath}`;
    }
    return path.replace("[id]", agentId);
  };

  const initialFormState = useMemo(
    () => deriveFormState(initialAgent),
    [initialAgent],
  );

  const [activeTab, setActiveTab] = useState("basic");
  const [isSaving, setIsSaving] = useState(false);
  const [agent, setAgent] = useState<Agent | null>(initialAgent ?? null);
  const [formData, setFormData] = useState<AgentFormState>(initialFormState);
  const [channels, setChannels] = useState<ChannelState[]>(() =>
    buildChannelsFromSelection(
      initialFormState.defaultChannels,
      initialFormState.defaultChannels.length === 0,
    ),
  );
  const [allChannelsEnabled, setAllChannelsEnabled] = useState(
    initialFormState.defaultChannels.length === 0,
  );
  const [channelsLoading, setChannelsLoading] = useState(!isNew);
  const [channelsInitialized, setChannelsInitialized] = useState(isNew);

  const updateDefaultChannelsSetting = useCallback(
    (nextChannels: ChannelState[], nextAllEnabled: boolean) => {
      const activeIds = nextAllEnabled
        ? []
        : nextChannels
            .filter((channel) => channel.isActive)
            .map((channel) => channel.id);

      setFormData((prev) => ({
        ...prev,
        defaultChannels: activeIds,
      }));
    },
    [],
  );

  const activeChannelIds = useMemo(() => {
    return channels
      .filter((channel) => channel.isActive)
      .map((channel) => channel.id);
  }, [channels]);

  const fetchAgentChannels = useCallback(
    async (force = false) => {
      if (isNew) {
        return;
      }

      if (!force && channelsInitialized) {
        return;
      }

      setChannelsLoading(true);

      try {
        const response = await fetch(`/api/agents/${agentId}/channels`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch channels");
        }

        const payload = (await response.json()) as {
          success: boolean;
          data: AgentChannel[];
          error?: string;
        };

        if (!payload.success) {
          throw new Error(payload.error ?? "Failed to fetch channels");
        }

        const nextChannels =
          (payload.data ?? []).length > 0
            ? payload.data.map((channel) =>
                createChannelState(channel.channel, channel.isEnabled),
              )
            : DEFAULT_CHANNEL_OPTIONS;

        const allEnabled = nextChannels.every((channel) => channel.isActive);

        setChannels(nextChannels);
        setAllChannelsEnabled(allEnabled);
        updateDefaultChannelsSetting(nextChannels, allEnabled);
        setChannelsInitialized(true);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to load channels", error);
        }
      } finally {
        setChannelsLoading(false);
      }
    },
    [agentId, isNew, channelsInitialized, updateDefaultChannelsSetting],
  );

  useEffect(() => {
    if (isNew) {
      return;
    }

    void fetchAgentChannels();
  }, [fetchAgentChannels, isNew]);

  const handleChannelToggle = useCallback(
    async (channelId: string, enabled: boolean) => {
      if (isNew) {
        setChannels((prev) => {
          const nextChannels = prev.map((channel) =>
            channel.id === channelId
              ? { ...channel, isActive: enabled }
              : channel,
          );
          updateDefaultChannelsSetting(nextChannels, allChannelsEnabled);
          return nextChannels;
        });
        return;
      }

      const previousChannels = channels;

      setChannels((prev) => {
        const nextChannels = prev.map((channel) =>
          channel.id === channelId
            ? { ...channel, isActive: enabled }
            : channel,
        );
        updateDefaultChannelsSetting(nextChannels, allChannelsEnabled);
        return nextChannels;
      });

      setChannelsLoading(true);

      try {
        const response = await fetch(
          `/api/agents/${agentId}/channels/${channelId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ isEnabled: enabled }),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to update channel");
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to update channel", error);
        }
        alert("Не удалось обновить канал. Попробуйте позже.");
        setChannels(previousChannels.map((channel) => ({ ...channel })));
        updateDefaultChannelsSetting(previousChannels, allChannelsEnabled);
      } finally {
        setChannelsLoading(false);
      }
    },
    [
      agentId,
      allChannelsEnabled,
      channels,
      isNew,
      updateDefaultChannelsSetting,
    ],
  );

  const handleAllChannelsToggle = useCallback(
    async (enabled: boolean) => {
      const previousChannels = channels;
      setAllChannelsEnabled(enabled);

      if (enabled) {
        const nextChannels = previousChannels.map((channel) => ({
          ...channel,
          isActive: true,
        }));
        setChannels(nextChannels);
        updateDefaultChannelsSetting(nextChannels, true);

        if (isNew) {
          return;
        }

        setChannelsLoading(true);

        try {
          const responses = await Promise.all(
            nextChannels.map((channel) =>
              fetch(`/api/agents/${agentId}/channels/${channel.id}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ isEnabled: true }),
              }),
            ),
          );

          if (responses.some((response) => !response.ok)) {
            throw new Error("Failed to enable all channels");
          }
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.error("Failed to enable all channels", error);
          }
          alert("Не удалось включить все каналы. Попробуйте позже.");
          const revertedAllEnabled = previousChannels.every(
            (channel) => channel.isActive,
          );
          setAllChannelsEnabled(revertedAllEnabled);
          setChannels(previousChannels.map((channel) => ({ ...channel })));
          updateDefaultChannelsSetting(previousChannels, revertedAllEnabled);
        } finally {
          setChannelsLoading(false);
        }
      } else {
        updateDefaultChannelsSetting(previousChannels, false);
      }
    },
    [agentId, channels, isNew, updateDefaultChannelsSetting],
  );

  const handleChannelSync = useCallback(async () => {
    if (isNew) {
      return;
    }

    await fetchAgentChannels(true);
  }, [fetchAgentChannels, isNew]);

  useEffect(() => {
    if (initialAgent) {
      setAgent(initialAgent);
      const nextForm = deriveFormState(initialAgent);
      setFormData(nextForm);
      const allEnabled = nextForm.defaultChannels.length === 0;
      setAllChannelsEnabled(allEnabled);
      setChannels(
        buildChannelsFromSelection(nextForm.defaultChannels, allEnabled),
      );
      setChannelsInitialized(false);
      setChannelsLoading(false);
    } else if (isNew) {
      const nextForm = deriveFormState(null);
      setFormData(nextForm);
      setAllChannelsEnabled(true);
      setChannels(buildChannelsFromSelection([], true));
      setChannelsInitialized(true);
      setChannelsLoading(false);
    }
  }, [initialAgent, isNew]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const url = isNew ? "/api/agents" : `/api/agents/${agentId}`;
      const method = isNew ? "POST" : "PATCH";

      const defaultChannels = allChannelsEnabled ? [] : activeChannelIds;

      const payload = {
        name: formData.name,
        status: formData.status,
        model: formData.model || undefined,
        instructions: formData.instructions || undefined,
        temperature: formData.temperature,
        maxTokens: formData.maxTokens,
        responseDelaySeconds: formData.responseDelaySeconds,
        settings: {
          language: formData.language,
          welcomeMessage: formData.welcomeMessage || undefined,
          description: formData.description || undefined,
          presencePenalty: formData.presencePenalty,
          frequencyPenalty: formData.frequencyPenalty,
          knowledgeBaseAllCategories: formData.knowledgeBaseAllCategories,
          createTaskOnNotFound: formData.createTaskOnNotFound,
          notFoundMessage: formData.notFoundMessage,
          defaultChannels,
        },
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Не удалось сохранить агента");
      }

      const result = (await response.json()) as {
        success: boolean;
        data: Agent;
      };

      if (!result.success) {
        throw new Error("Не удалось сохранить агента");
      }

      if (isNew) {
        const redirectPath = activeTenantId
          ? `/manage/${activeTenantId}/ai-agents/${result.data.id}/edit`
          : `/agents/${result.data.id}/edit`;
        router.push(redirectPath);
      } else {
        setAgent(result.data);
        const nextForm = deriveFormState(result.data);
        setFormData(nextForm);

        const nextAllEnabled = nextForm.defaultChannels.length === 0;
        const nextChannels = buildChannelsFromSelection(
          nextForm.defaultChannels,
          nextAllEnabled,
        );
        setAllChannelsEnabled(nextAllEnabled);
        setChannels(nextChannels);
        updateDefaultChannelsSetting(nextChannels, nextAllEnabled);
        setChannelsInitialized(false);
        await fetchAgentChannels(true);
        router.refresh();
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to save agent", error);
      }
      alert("Не удалось сохранить агента. Попробуйте еще раз.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew) {
      const redirectPath = activeTenantId
        ? `/manage/${activeTenantId}/ai-agents`
        : "/agents";
      router.push(redirectPath);
      return;
    }

    if (
      !confirm(
        "Вы уверены, что хотите удалить этого агента? Это действие нельзя отменить.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Не удалось удалить агента");
      }

      const redirectPath = activeTenantId
        ? `/manage/${activeTenantId}/ai-agents`
        : "/agents";
      router.push(redirectPath);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to delete agent", error);
      }
      alert("Не удалось удалить агента. Попробуйте еще раз.");
    }
  };

  const agentTitle = isNew
    ? "Новый AI-ассистент"
    : (agent?.name ?? "AI ассистент");

  const agentsPath = activeTenantId
    ? `/manage/${activeTenantId}/ai-agents`
    : "/agents"
  const editPath = activeTenantId
    ? `/manage/${activeTenantId}/ai-agents/${agentId}/edit`
    : `/agents/${agentId}/edit`

  return (
    <div className="space-y-8">
      <nav className="flex items-center gap-2 mb-4" aria-label="Хлебные крошки">
        <Link
          href={agentsPath}
          className="fi-breadcrumbs-item-label text-sm font-medium text-gray-500 transition duration-75 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Агенты ИИ
        </Link>
        {!isNew && (
          <>
            <Link
              href={editPath}
              className="fi-breadcrumbs-item-label text-sm font-medium text-gray-500 transition duration-75 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {agentTitle}
            </Link>
            <span className="fi-breadcrumbs-item-label text-sm font-medium text-gray-500 dark:text-gray-400">
              Основные
            </span>
          </>
        )}
      </nav>

      <header className="fi-header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Агенты ИИ
            </span>
            {!isNew && (
              <>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {agentTitle}
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Основные
                </span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
            {isNew ? "Создание агента" : "Редактирование АИ ассистент"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {!isNew && (
            <KwidButton
              type="button"
              variant="danger"
              size="md"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Удалить
            </KwidButton>
          )}
        </div>
      </header>

      {!isNew && <CalloutPipelines agentId={agentId} />}

      <KwidTabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
        tabs={[
          { value: "basic", label: "Основные", icon: Settings },
          { value: "instructions", label: "Инструкции", icon: FileText },
          { value: "crm", label: "Сделки и контакты", icon: Users },
          { value: "triggers", label: "Триггеры", icon: Zap },
          { value: "chains", label: "Цепочки", icon: Clock },
          { value: "integrations", label: "Интеграции", icon: Plug },
          { value: "training", label: "Обучение", icon: BookOpen },
          { value: "advanced", label: "Дополнительно", icon: Settings2 },
        ]}
      >
        <KwidTabsContent value="basic" className="space-y-6">
          <div className="fi-fo-component-ctn">
            <KwidSection
              title="Профиль агента"
              description="Основные настройки агента"
            >
              <div className="fi-section-content p-6">
                <div className="space-y-6">
                  <KwidInput
                    label="Название*"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Введите название агента"
                    required
                  />

                  <div className="fi-fo-field-wrp">
                    <div className="flex items-center gap-x-3 justify-between">
                      <label className="fi-fo-field-wrp-label inline-flex items-center gap-x-3">
                        <span className="text-sm font-medium leading-6 text-gray-950 dark:text-white">
                          Активно
                        </span>
                      </label>
                      <KwidSwitch
                        checked={formData.status === "active"}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            status: checked ? "active" : "inactive",
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="fi-fo-field-wrp space-y-2">
                    <div className="flex items-center gap-x-3 justify-between">
                      <label className="fi-fo-field-wrp-label inline-flex items-center gap-x-3">
                        <span className="text-sm font-medium leading-6 text-gray-950 dark:text-white">
                          Инструкции для агента*
                        </span>
                      </label>
                    </div>
                    <textarea
                      className="block h-full w-full border-none bg-transparent px-3 py-1.5 text-base text-gray-950 placeholder:text-gray-400 focus:ring-0 disabled:text-gray-500"
                      rows={20}
                      value={formData.instructions}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          instructions: e.target.value,
                        }))
                      }
                      placeholder="Начальные инструкции по тону, стилю и ответам вашего агента. Вы также можете добавить общие сведения о компании, чтобы помочь агенту отвечать более точно."
                      required
                    />
                    <p className="fi-fo-field-wrp-helper-text break-words text-sm text-gray-500">
                      Начальные инструкции по тону, стилю и ответам вашего агента. Вы также можете добавить общие сведения о компании, чтобы помочь агенту отвечать более точно.
                    </p>
                  </div>
                </div>
              </div>
            </KwidSection>
          </div>

          <div className="fi-fo-component-ctn">
            <KwidSection
              title="Взаимодействие"
              description="Настройки взаимодействия с пользователями"
            >
              <div className="space-y-6">
                <div className="fi-fo-field-wrp">
                  <div className="flex items-center gap-x-3 justify-between">
                    <div className="flex-1">
                      <label className="fi-fo-field-wrp-label inline-flex items-center gap-x-3">
                        <span className="text-sm font-medium leading-6 text-gray-950 dark:text-white">
                          Проверять перед отправкой
                        </span>
                      </label>
                      <p className="fi-fo-field-wrp-helper-text break-words text-sm text-gray-500 mt-1">
                        Сообщения не будут отправляться автоматически. Они появятся в поле ввода сообщения для вашего просмотра и ручной отправки.
                      </p>
                    </div>
                    <KwidSwitch
                      checked={formData.checkBeforeSending}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          checkBeforeSending: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </KwidSection>
          </div>
        </KwidTabsContent>

        <KwidTabsContent value="instructions" className="space-y-6">
          <div className="fi-fo-component-ctn">
            <KwidSection title="Инструкции и стратегия">
              <div className="grid gap-6 lg:grid-cols-2">
                <KwidTextarea
                  label="Стратегия общения"
                  placeholder="Опишите ключевые принципы общения с клиентом"
                  rows={8}
                  defaultValue="1. Уточняй потребности клиента.
2. Предлагай подходящий продукт.
3. Всегда подтверждай следующий шаг."
                />
                <KwidTextarea
                  label="Запрещено"
                  placeholder="Что агент не должен делать"
                  rows={8}
                  defaultValue="— Не обсуждай внутренние процессы.
— Не обещай результат без подтверждения менеджера.
— Не используй эмодзи в официальных ответах."
                />
              </div>

              <KwidSelect
                label="Методология диалога"
                value={(formData as any).methodology || "spin"}
                onChange={(value: string) =>
                  setFormData(
                    (prev) => ({ ...prev, methodology: value }) as any,
                  )
                }
                options={[
                  {
                    value: "spin",
                    label: "SPIN (ситуация, проблема, импликация, решение)",
                  },
                  {
                    value: "bant",
                    label: "BANT (Budget, Authority, Need, Timeline)",
                  },
                  { value: "custom", label: "Собственный сценарий" },
                ]}
                placeholder="Выберите методологию"
              />

              <KwidTextarea
                label="Завершение диалога"
                placeholder="Опишите, как агент завершает разговор"
                rows={5}
                defaultValue="Подведи итоги, подтвердив договоренности, и предложи клиенту следующий шаг: консультация, звонок или заполнение формы."
              />
            </KwidSection>
          </div>
        </KwidTabsContent>

        <KwidTabsContent value="crm" className="space-y-6">
          <DealContactFieldsSelector agentId={agentId} />
        </KwidTabsContent>

        <KwidTabsContent value="triggers">
          <TriggerManager agentId={agentId} />
        </KwidTabsContent>

        <KwidTabsContent value="chains" className="space-y-6">
          <AgentSequencesManager agentId={agentId} />
        </KwidTabsContent>

        <KwidTabsContent value="integrations">
          <IntegrationsTable agentId={agentId} />
        </KwidTabsContent>

        <KwidTabsContent value="training" className="space-y-6">
          <KwidSection
            title="Обучение агента"
            description="Обучите агента всей информацией о компании: продукты, услуги, процессы, скрипты продаж"
          >
            <div className="space-y-4 text-center">
              <BookOpen className="mx-auto h-16 w-16 text-custom-500 dark:text-custom-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Загрузите файлы, добавьте структурированные знания и скрипты для
                полного цикла продаж от 0 до 100%
              </p>
              <Link
                href={
                  activeTenantId
                    ? `/manage/${activeTenantId}/ai-agents/${agentId}/training`
                    : `/agents/${agentId}/training`
                }
              >
                <KwidButton className="mt-4 gap-2" variant="primary" size="md">
                  <BookOpen className="h-4 w-4" />
                  Перейти к обучению
                </KwidButton>
              </Link>
            </div>
          </KwidSection>
        </KwidTabsContent>

        <KwidTabsContent value="advanced">
          <div className="flex flex-col gap-8">
            <div
              style={{
                '--cols-default': 'repeat(1, minmax(0, 1fr))',
                '--cols-lg': 'repeat(2, minmax(0, 1fr))',
              }}
              className="grid grid-cols-[--cols-default] lg:grid-cols-[--cols-lg] fi-fo-component-ctn gap-6"
            >
              {/* Модель ИИ */}
              <div className="fi-section rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
                <header className="fi-section-header flex flex-col gap-3 px-6 py-4">
                  <h3 className="fi-section-header-heading text-base font-semibold leading-6 text-gray-950 dark:text-white">
                    Модель ИИ
                  </h3>
                </header>
                <div className="fi-section-content p-6">
                  <div className="fi-fo-field-wrp space-y-2">
                    <div className="flex items-center gap-x-3 justify-between">
                      <label className="fi-fo-field-wrp-label inline-flex items-center gap-x-3">
                        <span className="text-sm font-medium leading-6 text-gray-950 dark:text-white">
                          Выберите модель ИИ*
                        </span>
                      </label>
                    </div>
                    {formData.model && (
                      <div className="choices__inner flex flex-wrap gap-2 mb-3">
                        <div
                          className="choices__item choices__item--selectable inline-flex items-center gap-1 rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          data-item
                          data-id={formData.model}
                          data-value={formData.model}
                          aria-selected="true"
                        >
                          {formData.model === 'gpt-5'
                            ? 'OpenAI GPT-5 - Новейшая модель OpenAI с надёжными и естественными ответами'
                            : formData.model}
                          <button
                            type="button"
                            className="choices__button ml-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                            aria-label="Remove item"
                            data-button
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, model: '' }))
                            }
                          >
                            Remove item
                          </button>
                        </div>
                      </div>
                    )}
                    <KwidSelect
                      options={[
                        { value: 'gpt-5', label: 'OpenAI GPT-5 - Новейшая модель OpenAI с надёжными и естественными ответами' },
                        { value: 'gpt-4.1', label: 'OpenAI GPT-4.1' },
                        { value: 'gpt-4', label: 'OpenAI GPT-4' },
                        { value: 'gpt-3.5-turbo', label: 'OpenAI GPT-3.5 Turbo' },
                        { value: 'claude-3-opus', label: 'Anthropic Claude 3 Opus' },
                        { value: 'claude-3-sonnet', label: 'Anthropic Claude 3 Sonnet' },
                        { value: 'claude-3-haiku', label: 'Anthropic Claude 3 Haiku' },
                        { value: 'gemini-pro', label: 'Google Gemini Pro' },
                        { value: 'gemini-ultra', label: 'Google Gemini Ultra' },
                      ]}
                      value={formData.model || ''}
                      onChange={(value: string) =>
                        setFormData((prev) => ({ ...prev, model: value }))
                      }
                      placeholder="Выберите, насколько умным вы хотите сделать ИИ. Более продвинутые модели стоят дороже."
                    />
                    <p className="fi-fo-field-wrp-helper-text break-words text-sm text-gray-500">
                      Выберите, насколько умным вы хотите сделать ИИ. Более продвинутые модели стоят дороже.
                    </p>
                  </div>
                </div>
              </div>

              {/* Язык */}
              <div className="fi-section rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
                <header className="fi-section-header flex flex-col gap-3 px-6 py-4">
                  <h3 className="fi-section-header-heading text-base font-semibold leading-6 text-gray-950 dark:text-white">
                    Язык
                  </h3>
                </header>
                <div className="fi-section-content p-6">
                  <div className="fi-fo-field-wrp">
                    <KwidSwitch
                      checked={formData.language === 'auto'}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          language: checked ? 'auto' : 'ru',
                        }))
                      }
                      label="Автоматически определять язык пользователя"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Настройки ответа */}
            <div className="fi-section rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
              <header className="fi-section-header flex flex-col gap-3 px-6 py-4">
                <h3 className="fi-section-header-heading text-base font-semibold leading-6 text-gray-950 dark:text-white">
                  Настройки ответа
                </h3>
              </header>
              <div className="fi-section-content p-6">
                <div className="fi-fo-field-wrp space-y-2">
                  <div className="flex items-center gap-x-3 justify-between">
                    <label className="fi-fo-field-wrp-label inline-flex items-center gap-x-3">
                      <span className="text-sm font-medium leading-6 text-gray-950 dark:text-white">
                        Задержка ответа (секунд)
                      </span>
                    </label>
                  </div>
                  <input
                    type="number"
                    id="data.response_delay"
                    inputMode="decimal"
                    max={900}
                    min={0}
                    step="any"
                    className="fi-input block w-full border-none py-1.5 text-base text-gray-950 transition duration-75 placeholder:text-gray-400 focus:ring-0 disabled:text-gray-500"
                    value={formData.responseDelaySeconds}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        responseDelaySeconds: Math.max(0, Number.parseFloat(e.target.value) || 0),
                      }))
                    }
                  />
                  <p className="fi-fo-field-wrp-helper-text break-words text-sm text-gray-500">
                    Сколько секунд ждать перед ответом. Рекомендуем установить задержку не менее 30 секунд, чтобы избежать дублирования ответов, если клиент отправит другое сообщение, пока агент отвечает.
                  </p>
                </div>
              </div>
            </div>

            <KnowledgeBaseSettings
              allCategoriesEnabled={formData.knowledgeBaseAllCategories}
              createTaskOnNotFound={formData.createTaskOnNotFound}
              notFoundMessage={formData.notFoundMessage}
              onAllCategoriesToggle={(enabled) =>
                setFormData((prev) => ({
                  ...prev,
                  knowledgeBaseAllCategories: enabled,
                }))
              }
              onCreateTaskToggle={(enabled) =>
                setFormData((prev) => ({
                  ...prev,
                  createTaskOnNotFound: enabled,
                }))
              }
              onMessageChange={(message) =>
                setFormData((prev) => ({ ...prev, notFoundMessage: message }))
              }
              onOpenKnowledgeBase={() => {
                const redirectPath = activeTenantId
                  ? `/manage/${activeTenantId}/knowledge-categories`
                  : "/knowledge-base";
                router.push(redirectPath);
              }}
              disabled={isNew}
            />
          </div>
        </KwidTabsContent>
      </KwidTabs>

      <div className="fi-ac gap-3 flex flex-wrap items-center justify-start mt-8">
        <KwidButton
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          variant="primary"
          size="md"
          style={{
            '--c-400': 'var(--primary-400)',
            '--c-500': 'var(--primary-500)',
            '--c-600': 'var(--primary-600)',
          } as React.CSSProperties}
          className="fi-color-custom"
        >
          <span className="fi-btn-label">{isSaving ? "Сохранение…" : "Сохранить"}</span>
        </KwidButton>
        <KwidButton
          type="button"
          variant="secondary"
          size="md"
          onClick={() => {
            const redirectPath = activeTenantId
              ? `/manage/${activeTenantId}/ai-agents`
              : "/agents";
            router.push(redirectPath);
          }}
        >
          <span className="fi-btn-label">Отмена</span>
        </KwidButton>
      </div>
    </div>
  );
};
