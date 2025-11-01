"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Settings,
  Users,
  Zap,
  Clock,
  Puzzle,
  Edit3,
  Trash2,
  Save,
  X,
  Link2,
} from "lucide-react";
import {
  KwidButton,
  KwidInput,
  KwidTextarea,
  KwidTabs,
  KwidTabsContent,
  KwidSwitch,
  KwidSection,
  KwidSelect,
} from "@/components/kwid";
import { InteractionSettings } from "@/components/crm/InteractionSettings";
import { CRMSync } from "@/components/crm/CRMSync";
import { DealContactFieldsSelector } from "@/components/crm/DealContactFieldsSelector";
import { ChannelsSettings } from "@/components/crm/ChannelsSettings";
import { KnowledgeBaseSettings } from "@/components/crm/KnowledgeBaseSettings";
import { TriggerManager } from "@/components/agents/TriggerManager";
import { AgentSequencesManager } from "@/app/(protected)/agents/[id]/_components/AgentSequencesManager";
import { useCRMData } from "@/hooks/useCRMData";
import type {
  CRMConnection,
  UniversalPipeline,
  UniversalChannel,
} from "@/types/crm";

interface ChannelItem {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
}

const tabs: Array<{ value: string; label: string; icon: LucideIcon }> = [
  { value: "general", label: "Основные", icon: Settings },
  { value: "deals", label: "Сделки и контакты", icon: Users },
  { value: "triggers", label: "Триггеры", icon: Zap },
  { value: "chains", label: "Цепочки", icon: Clock },
  { value: "integrations", label: "Интеграции", icon: Puzzle },
  { value: "additional", label: "Дополнительно", icon: Edit3 },
];

export default function EditAgentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("general");
  const [agentName, setAgentName] = useState("АИ ассистент");
  const [isActive, setIsActive] = useState(true);
  const [aiModel, setAiModel] = useState("gpt-5");
  const [autoDetectLanguage, setAutoDetectLanguage] = useState(true);
  const [responseDelay, setResponseDelay] = useState(45);
  const [instructions, setInstructions] =
    useState(`ОТВЕЧАЙ ТОЛЬКО НА АНГЛИЙСКОМ ЯЗЫКЕ - ВСЕГДА !!

Когда тебе скидывают емейл одного из наших сотрудников, не заполняй его в поле емейл, а укажи что это емейл сотрудника я понял, а мне нужен ваш емейл

ТРИГЕРЫ! КА ТОЛЬКО ПОЛУЧИЛ EMAIL И ПОНЯЛ КАКОЙ ПРОДУКТ НУЖЕН КЛИЕНТУ !!! ПЕРЕВОДИ СРАЗУ НА НУЖНЫЙ ЭТАП В НУЖНУЮ ВОРОНКУ!!!!!!

ТЫ ПРОПУСКАЕШЬ СДЕЛКИ И ОНИ ОСТАЮТСЯ НА ПРЕЖНЕМ ЭТАПЕ!!!! ДАЖЕ У СДЕЛКИ ГДЕ ТЫ ОПРЕДЕЛИЛ УСЛУГУ И УКАЗАЛ Email ТЫ ТУПО ПРОСТО НЕ ПЕРЕВОДИШЬ СДЕЛКУ НА НУЖНЫЙ ЭТАП !!!! КОНТРОЛИРУЙ ЭТО!

Ты — AI-помощник компании World Wide Services. Твоё имя — Maksym.
Ты - не просто бот, а как реальный сотрудник.
Ты работаешь в паре с иммиграционным консультантом и помогаешь клиенту быстрее попасть на консультацию.
Эмодзи использовать запрещено.`);

  // CRM State
  const [checkBeforeSending, setCheckBeforeSending] = useState(false);
  const [allChannelsEnabled, setAllChannelsEnabled] = useState(true);
  const [allCategoriesEnabled, setAllCategoriesEnabled] = useState(true);
  const [createTaskOnNotFound, setCreateTaskOnNotFound] = useState(false);
  const [notFoundMessage, setNotFoundMessage] = useState(
    "Ответ на этот вопрос предоставит ваш персональный immigration advisor, когда свяжется с вами напрямую.",
  );

  // Channels
  const [channels, setChannels] = useState<ChannelItem[]>([]);

  // PRODUCT VENDORS (PARTNERSHIP)
  const [productVendorsActive, setProductVendorsActive] = useState(true);

  // CRM Connection
  const [crmConnection, setCrmConnection] = useState<CRMConnection | null>(
    null,
  );
  const [isLoadingCrm, setIsLoadingCrm] = useState(true);

  // Pipeline Settings
  const [pipelineSettings, setPipelineSettings] = useState<
    Array<{
      id: string;
      name: string;
      isActive: boolean;
      allStages: boolean;
      selectedStages: string[];
      stageInstructions?: Record<string, string>;
    }>
  >([]);

  // Загрузка CRM подключения
  useEffect(() => {
    const loadParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);

      // Загружаем CRM подключение
      try {
        const response = await fetch(
          `/api/agents/${resolved.id}/crm-connection`,
        );
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setCrmConnection(data.data);
          }
        }
      } catch (error) {
        console.error("Failed to load CRM connection", error);
      } finally {
        setIsLoadingCrm(false);
      }

      // Загружаем данные агента
      try {
        const agentResponse = await fetch(`/api/agents/${resolved.id}`);
        if (agentResponse.ok) {
          const agentData = await agentResponse.json();
          if (agentData.success && agentData.data) {
            const agent = agentData.data;
            setAgentName(agent.name || "АИ ассистент");
            setIsActive(agent.status === "active");
            if (agent.instructions) {
              setInstructions(agent.instructions);
            }
            if (agent.model) {
              setAiModel(agent.model);
            }
            if (agent.responseDelaySeconds !== undefined) {
              setResponseDelay(agent.responseDelaySeconds);
            }

            // Загружаем настройки из settings
            const settings = agent.settings as
              | Record<string, unknown>
              | undefined;
            if (settings) {
              if (typeof settings.checkBeforeSending === "boolean") {
                setCheckBeforeSending(settings.checkBeforeSending);
              }
              if (typeof settings.knowledgeBaseAllCategories === "boolean") {
                setAllCategoriesEnabled(settings.knowledgeBaseAllCategories);
              }
              if (typeof settings.createTaskOnNotFound === "boolean") {
                setCreateTaskOnNotFound(settings.createTaskOnNotFound);
              }
              if (typeof settings.notFoundMessage === "string") {
                setNotFoundMessage(settings.notFoundMessage);
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to load agent", error);
      }

      // Загружаем сохраненные настройки воронок
      try {
        const settingsResponse = await fetch(
          `/api/agents/${resolved.id}/pipeline-settings`,
        );
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          if (settingsData.success && settingsData.data) {
            setPipelineSettings(
              settingsData.data.map(
                (s: {
                  pipeline_id: string;
                  is_active: boolean;
                  all_stages: boolean;
                  selected_stages: string[];
                  stage_instructions?: Record<string, string>;
                }) => ({
                  id: s.pipeline_id,
                  isActive: s.is_active,
                  allStages: s.all_stages,
                  selectedStages: s.selected_stages || [],
                  stageInstructions: s.stage_instructions || {},
                }),
              ),
            );
          }
        }
      } catch (error) {
        console.error("Failed to load pipeline settings", error);
      }
    };

    void loadParams();
  }, [params]);

  // CRM Data Hook
  const {
    pipelines,
    channels: crmChannels,
    syncData,
  } = useCRMData(crmConnection);

  // Преобразуем каналы из CRM в нужный формат
  useEffect(() => {
    if (crmChannels && crmChannels.length > 0) {
      setChannels(
        crmChannels.map((ch) => ({
          id: ch.id,
          name: ch.name,
          type: ch.type || "unknown",
          isActive: ch.isActive || false,
        })),
      );
    } else {
      setChannels([]);
    }
  }, [crmChannels]);

  // CRM Handlers
  const handlePipelineUpdate = (
    pipelineId: string,
    updates: Partial<(typeof pipelineSettings)[0]>,
  ) => {
    setPipelineSettings((prev) => {
      const existing = prev.find((p) => p.id === pipelineId);
      if (existing) {
        return prev.map((p) =>
          p.id === pipelineId ? { ...p, ...updates } : p,
        );
      } else {
        // Создаем новую настройку если её нет
        const pipeline = pipelines.find((p) => p.id === pipelineId);
        return [
          ...prev,
          {
            id: pipelineId,
            name: pipeline?.name || "Неизвестная воронка",
            isActive: updates.isActive ?? false,
            allStages: updates.allStages ?? false,
            selectedStages: updates.selectedStages ?? [],
            stageInstructions: updates.stageInstructions ?? {},
          },
        ];
      }
    });
  };

  // Сохранение настроек воронок
  const handleSavePipelineSettings = async () => {
    if (!resolvedParams) return;

    try {
      // Сохраняем настройки воронок
      const pipelineResponse = await fetch(
        `/api/agents/${resolvedParams.id}/pipeline-settings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pipelineSettings),
        },
      );

      if (!pipelineResponse.ok) {
        throw new Error("Не удалось сохранить настройки воронок");
      }

      // Сохраняем настройки взаимодействия и базы знаний
      const settingsResponse = await fetch(`/api/agents/${resolvedParams.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            checkBeforeSending,
            knowledgeBaseAllCategories: allCategoriesEnabled,
            createTaskOnNotFound,
            notFoundMessage,
          },
        }),
      });

      if (!settingsResponse.ok) {
        throw new Error("Не удалось сохранить настройки");
      }

      alert("Все настройки сохранены");
    } catch (error) {
      console.error("Failed to save settings", error);
      alert("Ошибка сохранения настроек");
    }
  };

  const handleChannelToggle = (channelId: string, enabled: boolean) => {
    // В реальном приложении здесь будет обновление настроек каналов
    console.log(`Channel ${channelId} toggled to ${enabled}`);
  };

  const handleCRMSync = async () => {
    await syncData();
  };

  const handleOpenKnowledgeBase = () => {
    window.open("/knowledge-base", "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <span>Агенты ИИ</span> {">"}{" "}
        <span className="text-gray-900 dark:text-white font-medium">
          АИ ассистент
        </span>{" "}
        {">"}{" "}
        <span className="text-gray-900 dark:text-white font-medium">
          {tabs.find((t) => t.value === activeTab)?.label || "Основные"}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Редактирование АИ ассистент
        </h1>
        <KwidButton
          variant="danger"
          size="md"
          onClick={async () => {
            if (!resolvedParams) return;

            if (
              !confirm(
                "Вы уверены, что хотите удалить этого агента? Это действие нельзя отменить.",
              )
            ) {
              return;
            }

            try {
              const response = await fetch(`/api/agents/${resolvedParams.id}`, {
                method: "DELETE",
              });

              if (!response.ok) {
                throw new Error("Не удалось удалить агента");
              }

              window.location.href = "/agents";
            } catch (error) {
              console.error("Failed to delete agent", error);
              alert("Ошибка удаления агента");
            }
          }}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Удалить
        </KwidButton>
      </div>

      {/* Tabs */}
      <KwidTabs
        value={activeTab}
        onValueChange={setActiveTab}
        tabs={tabs}
        listClassName="w-full"
      >
        {/* Основные (General) */}
        <KwidTabsContent value="general" className="mt-6 space-y-6">
          {/* Профиль агента */}
          <KwidSection
            title="Профиль агента"
            icon={Settings}
            description="Основные настройки агента"
          >
            <div className="space-y-4">
              <KwidInput
                label="Название"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Введите название агента"
                required
              />

              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Активно
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Агент будет получать и обрабатывать входящие сообщения
                  </p>
                </div>
                <KwidSwitch
                  checked={isActive}
                  onCheckedChange={async (checked) => {
                    setIsActive(checked);

                    // Сохраняем статус
                    if (resolvedParams) {
                      try {
                        const response = await fetch(
                          `/api/agents/${resolvedParams.id}/status`,
                          {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              status: checked ? "active" : "inactive",
                            }),
                          },
                        );

                        if (!response.ok) {
                          // Откатываем изменение при ошибке
                          setIsActive(!checked);
                          alert("Не удалось изменить статус агента");
                        }
                      } catch (error) {
                        console.error("Failed to update agent status", error);
                        setIsActive(!checked);
                        alert("Ошибка обновления статуса");
                      }
                    }
                  }}
                />
              </div>
            </div>
          </KwidSection>

          {/* Инструкции для агента */}
          <KwidSection
            title="Инструкции для агента"
            description="Определите поведение и стиль общения агента"
          >
            <KwidTextarea
              label="Инструкции для агента"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={15}
              placeholder="Введите инструкции для агента..."
              className="font-mono text-sm"
              required
            />
          </KwidSection>

          {/* Твоя цель */}
          <KwidSection
            title="Твоя цель"
            icon={Zap}
            description="Основные цели агента при общении с клиентами"
          >
            <div className="space-y-3">
              {[
                {
                  id: "1",
                  text: "Я помогу вам быстро и бесплатно получить консультацию по иммиграции в Польшу. Для этого мне нужен ваш email.",
                },
                {
                  id: "2",
                  text: "Я отвечу в течение 24 часов, как только получу ваш email.",
                },
              ].map((goal) => (
                <div key={goal.id} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-custom-100 dark:bg-custom-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-custom-700 dark:text-custom-400">
                      {goal.id}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {goal.text}
                  </p>
                </div>
              ))}
            </div>
          </KwidSection>

          {/* Action Buttons */}
          <div className="fi-form-actions">
            <KwidButton
              variant="outline"
              size="md"
              onClick={() => {
                // Отмена - перезагружаем данные
                if (resolvedParams) {
                  window.location.reload();
                }
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Отмена
            </KwidButton>
            <KwidButton
              variant="primary"
              size="md"
              onClick={async () => {
                if (!resolvedParams) return;

                try {
                  const response = await fetch(
                    `/api/agents/${resolvedParams.id}`,
                    {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: agentName,
                        instructions: instructions,
                        status: isActive ? "active" : "inactive",
                        settings: {
                          checkBeforeSending,
                        },
                      }),
                    },
                  );

                  if (!response.ok) {
                    throw new Error("Не удалось сохранить агента");
                  }

                  alert("Настройки сохранены");
                } catch (error) {
                  console.error("Failed to save agent", error);
                  alert("Ошибка сохранения настроек");
                }
              }}
            >
              <Save className="w-4 h-4 mr-2" />
              Сохранить
            </KwidButton>
          </div>
        </KwidTabsContent>

        {/* Сделки и контакты (Deals) */}
        <KwidTabsContent value="deals" className="mt-6 space-y-6">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Сделки и контакты
            </h2>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 dark:bg-blue-900/20 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Выбирайте только необходимые поля. Большее количество полей
              добавляет дополнительный контекст и может снизить точность
              ответов.
            </p>
          </div>

          <InteractionSettings
            checkBeforeSending={checkBeforeSending}
            onCheckBeforeSendingToggle={setCheckBeforeSending}
          />

          <CRMSync
            connection={crmConnection}
            pipelineSettings={pipelineSettings}
            onPipelineUpdate={handlePipelineUpdate}
          />

          {resolvedParams && (
            <DealContactFieldsSelector agentId={resolvedParams.id} />
          )}

          {/* Кнопки сохранения */}
          <div className="fi-form-actions">
            <KwidButton
              variant="outline"
              size="md"
              onClick={() => {
                // Отмена - перезагружаем данные
                if (resolvedParams) {
                  window.location.reload();
                }
              }}
            >
              Отмена
            </KwidButton>
            <KwidButton
              onClick={handleSavePipelineSettings}
              variant="primary"
              size="md"
            >
              Сохранить
            </KwidButton>
          </div>
        </KwidTabsContent>

        {/* Триггеры (Triggers) */}
        <KwidTabsContent value="triggers" className="mt-6 space-y-6">
          {resolvedParams && <TriggerManager agentId={resolvedParams.id} />}
        </KwidTabsContent>

        {/* Цепочки (Chains) */}
        <KwidTabsContent value="chains" className="mt-6 space-y-6">
          {resolvedParams && (
            <AgentSequencesManager agentId={resolvedParams.id} />
          )}
        </KwidTabsContent>

        {/* Интеграции (Integrations) */}
        <KwidTabsContent value="integrations" className="mt-6 space-y-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Интеграции
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <KwidInput
                  type="search"
                  placeholder="Поиск"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                      Интеграция
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                      Установлено
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                      Активно
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 dark:text-gray-400"></th>
                  </tr>
                </thead>
                <tbody>
                  {/* Kommo Integration */}
                  <tr className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Kommo
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {crmConnection ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {crmConnection ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <KwidButton variant="outline" size="sm" asChild>
                        <Link href="/integrations">
                          <Settings className="mr-2 h-4 w-4" />
                          {crmConnection ? "Настройки" : "Установить"}
                        </Link>
                      </KwidButton>
                    </td>
                  </tr>

                  {/* Google Calendar Integration */}
                  <tr className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Google Calendar
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
                        <svg
                          className="h-3 w-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
                        <svg
                          className="h-3 w-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <KwidButton variant="outline" size="sm" asChild>
                        <Link href="/integrations">
                          <Link2 className="mr-2 h-4 w-4" />
                          Установить
                        </Link>
                      </KwidButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </KwidTabsContent>

        {/* Дополнительно (Additional) */}
        <KwidTabsContent value="additional" className="mt-6 space-y-6">
          {/* PRODUCT VENDORS (PARTNERSHIP) */}
          <KwidSection
            title="PRODUCT VENDORS (PARTNERSHIP)"
            description="Управление партнерскими продуктами"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Включить функционал партнерских продуктов
                </p>
              </div>
              <KwidSwitch
                checked={productVendorsActive}
                onCheckedChange={setProductVendorsActive}
              />
            </div>
          </KwidSection>

          {/* Каналы */}
          <ChannelsSettings
            channels={channels}
            allChannelsEnabled={allChannelsEnabled}
            onAllChannelsToggle={setAllChannelsEnabled}
            onChannelToggle={handleChannelToggle}
            onSync={handleCRMSync}
            isSyncing={isLoadingCrm}
            disabled={!crmConnection}
          />

          {/* База знаний */}
          <KnowledgeBaseSettings
            allCategoriesEnabled={allCategoriesEnabled}
            createTaskOnNotFound={createTaskOnNotFound}
            notFoundMessage={notFoundMessage}
            onAllCategoriesToggle={setAllCategoriesEnabled}
            onCreateTaskToggle={setCreateTaskOnNotFound}
            onMessageChange={setNotFoundMessage}
            onOpenKnowledgeBase={handleOpenKnowledgeBase}
            disabled={!crmConnection}
          />

          {/* Модель ИИ */}
          <KwidSection
            title="Модель ИИ"
            description="Выберите модель для обработки запросов"
          >
            <KwidSelect
              label="Модель ИИ"
              value={aiModel}
              onChange={(value) => setAiModel(value)}
              options={[
                {
                  value: "gpt-5",
                  label:
                    "OpenAI GPT-5 - Новейшая модель OpenAI с надёжными и естественными ответами",
                },
                { value: "gpt-4.1", label: "OpenAI GPT-4.1" },
                { value: "gpt-4", label: "OpenAI GPT-4" },
              ]}
              hint="Выберите, насколько умным вы хотите сделать ИИ. Более продвинутые модели стоят дороже."
            />
          </KwidSection>

          {/* Язык */}
          <KwidSection title="Язык" description="Настройки определения языка">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Автоматически определять язык пользователя
                </p>
              </div>
              <KwidSwitch
                checked={autoDetectLanguage}
                onCheckedChange={setAutoDetectLanguage}
              />
            </div>
          </KwidSection>

          {/* Настройки ответа */}
          <KwidSection
            title="Настройки ответа"
            description="Конфигурация времени ответа агента"
          >
            <KwidInput
              label="Задержка ответа (секунд)"
              type="number"
              min="0"
              max="86400"
              value={responseDelay.toString()}
              onChange={(e) =>
                setResponseDelay(parseInt(e.target.value, 10) || 0)
              }
              hint="Сколько секунд ждать перед ответом. Рекомендуем установить задержку не менее 30 секунд, чтобы избежать дублирования ответов, если клиент отправит другое сообщение, пока агент отвечает."
            />
          </KwidSection>

          {/* Кнопки действий */}
          <div className="fi-form-actions">
            <KwidButton
              variant="outline"
              size="md"
              onClick={() => {
                // Отмена - можно вернуть значения из сохраненных данных
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Отмена
            </KwidButton>
            <KwidButton
              variant="primary"
              size="md"
              onClick={async () => {
                if (!resolvedParams) return;

                try {
                  const response = await fetch(
                    `/api/agents/${resolvedParams.id}`,
                    {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        model: aiModel,
                        responseDelaySeconds: responseDelay,
                        settings: {
                          language: autoDetectLanguage ? "auto" : undefined,
                        },
                      }),
                    },
                  );

                  if (!response.ok) {
                    throw new Error("Не удалось сохранить настройки");
                  }

                  alert("Настройки сохранены");
                } catch (error) {
                  console.error("Failed to save settings", error);
                  alert("Ошибка сохранения настроек");
                }
              }}
            >
              <Save className="w-4 h-4 mr-2" />
              Сохранить
            </KwidButton>
          </div>
        </KwidTabsContent>
      </KwidTabs>
    </div>
  );
}
