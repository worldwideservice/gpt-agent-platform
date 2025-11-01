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
import { AgentSequencesManager } from "./AgentSequencesManager";
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

  return (
    <div className="space-y-8">
      <KwidSection
        title={isNew ? "Создание агента" : `Редактирование ${agentTitle}`}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => {
                const redirectPath = activeTenantId
                  ? `/manage/${activeTenantId}/ai-agents`
                  : "/agents";
                router.push(redirectPath);
              }}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-custom-600 dark:text-gray-400 dark:hover:text-custom-400"
            >
              <ArrowLeft className="h-4 w-4" /> Назад к списку
            </button>

            <div className="space-y-2">
              <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
                <Link
                  href={
                    activeTenantId
                      ? `/manage/${activeTenantId}/ai-agents`
                      : "/agents"
                  }
                  className="font-semibold text-custom-600 hover:underline dark:text-custom-400"
                >
                  Агенты ИИ
                </Link>
                <span>/</span>
                <span className="font-semibold text-gray-500 dark:text-gray-400">
                  {agentTitle}
                </span>
              </nav>
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
                {isNew ? "Создание агента" : `Редактирование ${agentTitle}`}
              </h1>
              <p className="max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                Управляйте настройками, сценариями и интеграциями, чтобы агент
                работал в соответствии с вашими бизнес-процессами.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Статус
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formData.status === "active"
                      ? "Агент отвечает пользователям"
                      : "Ответы временно отключены"}
                  </p>
                </div>
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
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
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
            <KwidButton
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              variant="primary"
              size="md"
            >
              <Save className="mr-2 h-4 w-4" />{" "}
              {isSaving ? "Сохранение…" : "Сохранить изменения"}
            </KwidButton>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SummaryCard
            icon={Sparkles}
            title="Персонализируйте опыт"
            description="Настройте приветствия, сценарии и ответы, чтобы агент звучал как реальный сотрудник вашей компании."
          />
          <SummaryCard
            icon={Workflow}
            title="Согласуйте воронку"
            description="Определите этапы сделок и триггеры, чтобы контролировать движение клиента по CRM."
          />
          <SummaryCard
            icon={BookOpen}
            title="Усилите знания"
            description="Подключите статьи и категории базы знаний, чтобы ответы были точными и компетентными."
          />
        </div>
      </KwidSection>

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
            <KwidSection title="Основные настройки">
              <div className="grid gap-4 lg:grid-cols-[1fr,280px]">
                <div className="space-y-4">
                  <KwidInput
                    label="Название агента*"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Например: Консультант по продажам"
                    required
                  />

                  <KwidTextarea
                    label="Инструкции для агента*"
                    placeholder="Опишите роль, допускаемые и запрещенные действия"
                    rows={6}
                    value={formData.instructions}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        instructions: e.target.value,
                      }))
                    }
                  />

                  <KwidTextarea
                    label="Приветственное сообщение"
                    placeholder="Сообщение, которое увидит пользователь при первом обращении"
                    rows={4}
                    value={formData.welcomeMessage}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        welcomeMessage: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                  <KwidSelect
                    label="Модель ИИ"
                    value={formData.model}
                    onChange={(value: string) =>
                      setFormData((prev) => ({ ...prev, model: value }))
                    }
                    options={[
                      { value: "gpt-5", label: "OpenAI GPT-5" },
                      { value: "gpt-4.1", label: "OpenAI GPT-4.1" },
                      { value: "gpt-4", label: "OpenAI GPT-4" },
                      { value: "gpt-3.5-turbo", label: "OpenAI GPT-3.5 Turbo" },
                      {
                        value: "claude-3-opus",
                        label: "Anthropic Claude 3 Opus",
                      },
                      {
                        value: "claude-3-sonnet",
                        label: "Anthropic Claude 3 Sonnet",
                      },
                      {
                        value: "claude-3-haiku",
                        label: "Anthropic Claude 3 Haiku",
                      },
                      { value: "gemini-pro", label: "Google Gemini Pro" },
                      { value: "gemini-ultra", label: "Google Gemini Ultra" },
                    ]}
                    placeholder="Выберите модель ИИ"
                  />
                  <KwidSelect
                    label="Рабочий язык"
                    value={formData.language}
                    onChange={(value: string) =>
                      setFormData((prev) => ({ ...prev, language: value }))
                    }
                    options={[
                      { value: "auto", label: "Автоматически определять" },
                      { value: "en", label: "English" },
                      { value: "ru", label: "Русский" },
                    ]}
                    placeholder="Выберите язык"
                  />
                  <KwidTextarea
                    label="Описание"
                    placeholder="Опишите назначение агента"
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
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
          <div className="fi-fo-component-ctn">
            <KwidSection title="Сделки и контакты">
              <InteractionSettings
                checkBeforeSending={formData.checkBeforeSending}
                onCheckBeforeSendingToggle={(enabled: boolean) =>
                  setFormData((prev) => ({
                    ...prev,
                    checkBeforeSending: enabled,
                  }))
                }
              />

              <KwidSelect
                label="Рабочая воронка"
                options={[
                  { value: "generation", label: "Generation Lead" },
                  { value: "sales", label: "Sales Pipeline" },
                  { value: "support", label: "Customer Support" },
                ]}
                value={(formData as any).pipeline || "generation"}
                onChange={(value: string) =>
                  setFormData((prev) => ({ ...prev, pipeline: value }) as any)
                }
              />

              <KwidTextarea
                label="Инструкции по работе со стадией сделки"
                placeholder="Опишите, как агент работает с каждой стадией"
                rows={6}
                defaultValue="На стадии 'Сделка распределена' агент уточняет услугу, определяет тип клиента и назначает следующую сессию."
              />

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  "Generation lead",
                  "Work Visa in Poland",
                  "Seasonal Visa in Poland",
                  "Product Vendors (Partnership)",
                ].map((name) => (
                  <StageCard key={name} name={name} />
                ))}
              </div>

              <div className="rounded-xl border border-dashed border-gray-300 p-4 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Доступные данные сделки
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Агент сможет читать только выбранные поля. Это помогает
                  исключить лишние личные данные и делает ответы более точными.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                  {[
                    "Название сделки",
                    "Ответственный",
                    "Тип услуги",
                    "Этап",
                    "Email клиента",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </KwidSection>
          </div>
        </KwidTabsContent>

        <KwidTabsContent value="triggers">
          <TriggerManager agentId={agentId} />
        </KwidTabsContent>

        <KwidTabsContent value="chains" className="space-y-6">
          <AgentSequencesManager agentId={agentId} />
        </KwidTabsContent>

        <KwidTabsContent value="integrations">
          <KwidSection
            title="Каналы коммуникаций"
            description="Управляйте подключенными каналами, где агент общается с клиентами."
          >
            <div className="space-y-4">
              <ChannelsSettings
                channels={channels}
                allChannelsEnabled={allChannelsEnabled}
                onAllChannelsToggle={handleAllChannelsToggle}
                onChannelToggle={handleChannelToggle}
                onSync={handleChannelSync}
                isSyncing={channelsLoading}
                disabled={isNew}
              />
            </div>
          </KwidSection>
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
          <div className="fi-fo-component-ctn">
            <KwidSection title="Расширенные настройки">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Температура (creativity)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        temperature: Number.parseFloat(event.target.value),
                      }))
                    }
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-gray-400 dark:text-gray-500">
                      Точный (0)
                    </span>
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      {formData.temperature.toFixed(2)}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500">
                      Креативный (2)
                    </span>
                  </div>
                  <KwidInput
                    type="number"
                    step={0.1}
                    min={0}
                    max={2}
                    value={formData.temperature}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        temperature: Number.parseFloat(event.target.value) || 0,
                      }))
                    }
                    className="max-w-[140px]"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Задержка ответа (секунды)
                  </label>
                  <KwidInput
                    type="number"
                    min={0}
                    max={86400}
                    value={formData.responseDelaySeconds}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        responseDelaySeconds: Math.max(
                          0,
                          Number.parseInt(event.target.value, 10) || 0,
                        ),
                      }))
                    }
                  />

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Максимальная длина ответа (токены)
                  </label>
                  <KwidInput
                    type="number"
                    min={128}
                    max={8000}
                    value={formData.maxTokens}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxTokens: Math.min(
                          8000,
                          Math.max(
                            128,
                            Number.parseInt(event.target.value, 10) || 128,
                          ),
                        ),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Presence Penalty
                  </label>
                  <KwidInput
                    type="number"
                    step={0.1}
                    min={-2}
                    max={2}
                    value={formData.presencePenalty}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        presencePenalty:
                          Number.parseFloat(event.target.value) || 0,
                      }))
                    }
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Повышайте значение, чтобы модель реже повторялась и
                    исследовала новые темы.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Frequency Penalty
                  </label>
                  <KwidInput
                    type="number"
                    step={0.1}
                    min={-2}
                    max={2}
                    value={formData.frequencyPenalty}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        frequencyPenalty:
                          Number.parseFloat(event.target.value) || 0,
                      }))
                    }
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Контролируйте повторяемость слов в ответах агента.
                  </p>
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
            </KwidSection>
          </div>
        </KwidTabsContent>
      </KwidTabs>
    </div>
  );
};
