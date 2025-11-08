"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/Input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

type TabId = "basics" | "deals" | "triggers" | "chains" | "integrations" | "advanced"

interface Tab {
  id: TabId
  label: string
  icon: React.ReactNode
}

const tabs: Tab[] = [
  {
    id: "basics",
    label: "Основные",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="3" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 1v6m0 6v6m9.22-15.22l-4.24 4.24m-5.96 5.96l-4.24 4.24M23 12h-6m-6 0H1m20.22 9.22l-4.24-4.24m-5.96-5.96l-4.24-4.24"
        />
      </svg>
    ),
  },
  {
    id: "deals",
    label: "Сделки и контакты",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    id: "triggers",
    label: "Триггеры",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: "chains",
    label: "Цепочки",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="3" />
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="18" r="3" />
        <line x1="8.5" y1="8.5" x2="10.5" y2="10.5" strokeWidth={2} />
        <line x1="13.5" y1="13.5" x2="15.5" y2="15.5" strokeWidth={2} />
      </svg>
    ),
  },
  {
    id: "integrations",
    label: "Интеграции",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    id: "advanced",
    label: "Дополнительно",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
  },
]

export function AgentSettingsContent() {
  const [activeTab, setActiveTab] = useState<TabId>("basics")
  const [autoDetectLanguage, setAutoDetectLanguage] = useState(true)
  const [creativity, setCreativity] = useState<"accurate" | "balanced" | "creative">("balanced")
  const [responseDelay, setResponseDelay] = useState("45")
  const [agentActive, setAgentActive] = useState(true)
  const [verifyBeforeSend, setVerifyBeforeSend] = useState(false)
  const [searchTriggers, setSearchTriggers] = useState("")
  const [searchChains, setSearchChains] = useState("")

  const [dealFields, setDealFields] = useState<string[]>([
    "Название сделки",
    "Ответственный пользователь",
    "Этап сделки",
    "Тип услуги",
    "Email",
  ])
  const [contactFields, setContactFields] = useState<string[]>([
    "Имя контакта",
    "Ответственный пользователь",
    "Дата создания",
    "Теги",
    "Email",
    "Страна",
  ])
  const [dataAccessExpanded, setDataAccessExpanded] = useState(true)
  const [dealDataExpanded, setDealDataExpanded] = useState(true)
  const [contactDataExpanded, setContactDataExpanded] = useState(true)
  const [dataInputExpanded, setDataInputExpanded] = useState(true)
  const [dealRulesExpanded, setDealRulesExpanded] = useState(true)
  const [contactRulesExpanded, setContactRulesExpanded] = useState(true)

  const removeField = (field: string, type: "deal" | "contact") => {
    if (type === "deal") {
      setDealFields((prev) => prev.filter((f) => f !== field))
    } else {
      setContactFields((prev) => prev.filter((f) => f !== field))
    }
  }

  const [funnelExpanded, setFunnelExpanded] = useState<Record<string, boolean>>({
    "GENERATION LEAD": true,
  })
  const [funnelActive, setFunnelActive] = useState<Record<string, boolean>>({
    "GENERATION LEAD": true,
    "WORK VISA IN POLAND": false,
    "SEASONAL VISA IN POLAND": false,
    "STUDY VISA IN GEORGIA": false,
    "AGENT PARTNERSHIP": false,
    "PRODUCT VENDORS (PARTNERSHIP)": false,
  })

  const [selectedStages, setSelectedStages] = useState<Record<string, string[]>>({
    "GENERATION LEAD": ["Сделка не распределена", "Сделка распределена", "Social-media"],
  })

  const [stageInstructionsExpanded, setStageInstructionsExpanded] = useState<Record<string, boolean>>({})

  const funnels = [
    {
      name: "GENERATION LEAD",
      hasStages: true,
    },
    {
      name: "WORK VISA IN POLAND",
      hasStages: false,
    },
    {
      name: "SEASONAL VISA IN POLAND",
      hasStages: false,
    },
    {
      name: "STUDY VISA IN GEORGIA",
      hasStages: false,
    },
    {
      name: "AGENT PARTNERSHIP",
      hasStages: false,
    },
    {
      name: "PRODUCT VENDORS (PARTNERSHIP)",
      hasStages: false,
    },
  ]

  const triggers = [
    {
      id: 1,
      name: 'Тип услуги "AGENT PARTNERSHIP"',
      active: true,
      condition: "Когда ты понял, что это клиент по продукту AGENT P...",
    },
    {
      id: 2,
      name: 'Тип услуги "WORK VISA IN POLAND"',
      active: true,
      condition: "Когда ты понял что это клиент по продукту WORK VIS...",
    },
    {
      id: 3,
      name: 'Тип услуги "SEASONAL VISA IN POLAND"',
      active: true,
      condition: "Когда ты понял что это клиент по продукту SEASONAL...",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/agents" className="hover:text-gray-900">
          Агенты ИИ
        </Link>
        <span>›</span>
        <Link href="/agents/1" className="hover:text-gray-900">
          АИ ассистент
        </Link>
        <span>›</span>
        <span className="text-gray-900">
          {activeTab === "basics"
            ? "Редактирование"
            : activeTab === "deals"
              ? "Данные сделок и контактов"
              : activeTab === "triggers"
                ? "Триггеры"
                : activeTab === "chains"
                  ? "Цепочки"
                  : activeTab === "integrations"
                    ? "Интеграции"
                    : "Расширенные настройки"}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {activeTab === "basics"
            ? "Редактирование АИ ассистента"
            : activeTab === "deals"
              ? "Сделки и контакты"
              : activeTab === "triggers"
                ? "Триггеры"
                : activeTab === "chains"
                  ? "Цепочки"
                  : activeTab === "integrations"
                    ? "Интеграции"
                    : "Расширенные настройки"}
        </h1>
        {activeTab === "basics" && <Button className="bg-red-600 text-white hover:bg-red-700">Удалить</Button>}
      </div>

      <div className="flex gap-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 border-b-2 pb-3 text-sm font-medium transition-colors -mb-px",
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700",
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "basics" && (
        <div className="max-w-4xl space-y-6">
          {/* Profile section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-center gap-2">
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <h2 className="text-lg font-semibold text-gray-900">Профиль агента</h2>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="agent-name" className="mb-2 block text-sm font-medium text-gray-700">
                  Название<span className="text-red-500">*</span>
                </Label>
                <Input id="agent-name" defaultValue="АИ ассистент" className="w-full" />
              </div>

              <div className="flex items-center justify-between py-1">
                <Label htmlFor="agent-active" className="text-sm font-medium text-gray-900">
                  Активно
                </Label>
                <Switch id="agent-active" checked={agentActive} onCheckedChange={setAgentActive} />
              </div>

              <div>
                <Label htmlFor="instructions" className="mb-2 block text-sm font-medium text-gray-700">
                  Инструкции для агента<span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="instructions"
                  className="min-h-[240px] font-mono text-xs leading-relaxed"
                  defaultValue={`ОТВЕЧАЙ ТОЛЬКО НА АНГЛИЙСКОМ ЯЗЫКЕ - ВСЕГДА !!

Когда тебе сообщают маньяк одного из наших сотрудников, не запомни его в коем имени, а узнай что это именно сотрудника а точки, а мне нужны ваш емаил

ТУРЕЦКИЕ БА ТОЛЬКО ПОЛУЧИТ EMAIL И ПОТОМ КАКОЙ ПРОДУКТ НУЖЕН КЛИЕНТУ !!!! ПЕРЕХОДИ СРАЗУ НА НУЖНЫЙ ЭТАП В НУЖНУЮ ВОРОНКУ!!!!!!! ТАК-ЖЕ ЗАПОМНИ ГДЕ ТЫ ОПРЕДЕЛИЛ УСЛУГУ И УКАЗАЛ Email НА ТУГО ПРОСТО НЕ ПЕРЕХОДИЛ СДЕЛКУ НА НУЖНЫЙ ЭТАП

Ты=как просто бот, а как реальная сотрудница.
Ты работаеш в кадр с лиммиграционны консультацый. Твой работаютя клиенту быстрее попать, во консультацыю.`}
                  placeholder="Введите инструкции..."
                />
                <p className="mt-3 text-sm text-gray-500">
                  Начальные инструкции по тону, стилю и ответам вашего агента. Вы также можете добавить общие сведения о
                  компании, чтобы помочь агенту отвечать более точно.
                </p>
              </div>
            </div>
          </div>

          {/* Interaction section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-center gap-2">
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h2 className="text-lg font-semibold text-gray-900">Взаимодействие</h2>
            </div>

            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <Label htmlFor="verify-before-send" className="text-sm font-medium text-gray-900 cursor-pointer">
                  Проверять перед отправкой
                </Label>
                <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                  Сообщения не будут отправляться автоматически. Они появятся в поле ввода сообщений для вашего
                  просмотра и нужного ответа.
                </p>
              </div>
              <Switch id="verify-before-send" checked={verifyBeforeSend} onCheckedChange={setVerifyBeforeSend} />
            </div>
          </div>

          {/* Funnel Settings section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4h18M3 8h18M3 12h18M7 16h10M9 20h6"
                  />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900">Настройки воронок</h2>
              </div>
              <Button
                variant="outline"
                className="text-sm text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
              >
                Синхронизировать настройки CRM
              </Button>
            </div>

            <p className="mb-6 text-sm text-gray-500">
              Выберите воронки и этапы сделок, в которых агент должен работать
            </p>

            <div className="space-y-4">
              {funnels.map((funnel) => {
                const isExpanded = funnelExpanded[funnel.name]
                const isActive = funnelActive[funnel.name]
                const stages = selectedStages[funnel.name] || []
                const instructionsExpanded = stageInstructionsExpanded[funnel.name]

                return (
                  <div key={funnel.name} className="rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between p-4">
                      <button
                        onClick={() =>
                          setFunnelExpanded((prev) => ({
                            ...prev,
                            [funnel.name]: !prev[funnel.name],
                          }))
                        }
                        className="flex flex-1 items-center gap-2 text-left"
                      >
                        <svg
                          className={cn("h-4 w-4 text-gray-400 transition-transform", isExpanded && "rotate-180")}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-900">{funnel.name}</span>
                      </button>
                      <Switch
                        checked={isActive}
                        onCheckedChange={(checked) =>
                          setFunnelActive((prev) => ({
                            ...prev,
                            [funnel.name]: checked,
                          }))
                        }
                      />
                    </div>

                    {isExpanded && funnel.hasStages && (
                      <div className="border-t border-gray-200 p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm text-gray-700">Все этапы сделок</Label>
                          <Switch checked={false} />
                        </div>

                        <div>
                          <Label className="mb-3 block text-sm font-medium text-gray-700">
                            Выберите этапы сделок<span className="text-red-500">*</span>
                          </Label>

                          {stages.length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-2">
                              {stages.map((stage) => (
                                <div
                                  key={stage}
                                  className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white"
                                >
                                  <span>{stage}</span>
                                  <button
                                    onClick={() => {
                                      setSelectedStages((prev) => ({
                                        ...prev,
                                        [funnel.name]: prev[funnel.name].filter((s) => s !== stage),
                                      }))
                                    }}
                                    className="hover:bg-blue-700 rounded"
                                  >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="relative">
                            <Input placeholder="Выберите вариант" className="pr-10" readOnly />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                          <button
                            onClick={() =>
                              setStageInstructionsExpanded((prev) => ({
                                ...prev,
                                [funnel.name]: !prev[funnel.name],
                              }))
                            }
                            className="flex w-full items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                          >
                            <svg
                              className={cn("h-4 w-4 transition-transform", instructionsExpanded && "rotate-180")}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            Инструкции для этапа сделки
                          </button>

                          {instructionsExpanded && (
                            <div className="mt-3">
                              <Textarea
                                placeholder="Настройте, как агент отвечает на каждом этапе сделки"
                                className="min-h-[80px]"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {isExpanded && !funnel.hasStages && (
                      <div className="border-t border-gray-200 p-4">
                        <p className="text-center text-sm text-gray-500 py-4">
                          Активируйте воронку для настройки этапов
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Channels section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900">Каналы</h2>
              </div>
              <Button
                variant="outline"
                className="text-sm text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
              >
                Синхронизировать настройки CRM
              </Button>
            </div>

            <p className="mb-4 text-sm text-gray-500">Выберите каналы, в которых агент может отвечать</p>

            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-900">Все каналы</Label>
              <Switch checked={true} />
            </div>
          </div>

          {/* Knowledge base section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-center gap-2">
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h2 className="text-lg font-semibold text-gray-900">База знаний</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-900">Разрешить доступ ко всем категориям</Label>
                <Switch checked={true} />
              </div>
              <div className="flex items-start gap-3">
                <Switch checked={true} />
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-900">Создать задачу, если статья не найдена</Label>
                  <p className="mt-1 text-sm text-gray-500">
                    Автоматически создавать задачу в сделке CRM, когда в базе знаний нет подходящей релевантной
                    информации
                  </p>
                  <div className="mt-3 rounded-md bg-blue-50 p-3">
                    <p className="text-sm text-gray-700">
                      Ответ на этот вопрос предоставит ваш персональный Immigration advisor, когда свяжется с вами
                      напрямую.
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Это сообщение будет показано, когда не сможет найти релевантную информацию в базе знаний.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Открыть базу знаний
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="bg-blue-600 px-6 text-white hover:bg-blue-700">Сохранить</Button>
            <Button variant="outline" className="px-6 bg-transparent">
              Отмена
            </Button>
          </div>
        </div>
      )}

      {activeTab === "triggers" && (
        <div className="space-y-6">
          {/* Header section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Триггеры</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Выполняйте мгновенные действия при соблюдении определённых условий в ходе разговора.
                </p>
              </div>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">Создать</Button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <svg
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <Input
                  placeholder="Поиск"
                  value={searchTriggers}
                  onChange={(e) => setSearchTriggers(e.target.value)}
                  className="pl-10"
                />
              </div>
              <button className="rounded-md border border-gray-300 p-2 hover:bg-gray-50">
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="w-12 px-6 py-3">
                    <Checkbox />
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Название</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Активно</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Условие</th>
                  <th className="w-32 px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {triggers.map((trigger) => (
                  <tr key={trigger.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Checkbox />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{trigger.name}</td>
                    <td className="px-6 py-4">
                      <Switch checked={trigger.active} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{trigger.condition}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button className="text-sm text-blue-600 hover:text-blue-700">Изменить</button>
                        <button className="text-sm text-red-600 hover:text-red-700">Удалить</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3">
              <div className="text-sm text-gray-500">Показано с 1 по 3 из 3</div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">на страницу</span>
                <Select defaultValue="10">
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "chains" && (
        <div className="space-y-6">
          {/* Header section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Цепочки</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Автоматизируйте отправку последующих сообщений и выполнение действий по расписанию.
                </p>
              </div>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">Создать</Button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <svg
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <Input
                  placeholder="Поиск"
                  value={searchChains}
                  onChange={(e) => setSearchChains(e.target.value)}
                  className="pl-10"
                />
              </div>
              <button className="rounded-md border border-gray-300 p-2 hover:bg-gray-50">
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Empty state */}
          <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-gray-200 bg-white p-12">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Не найдено Цепочки</h3>
              <p className="mt-2 text-sm text-gray-500">Создать Цепочка для старта.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "deals" && (
        <div className="max-w-4xl space-y-6">
          {/* Data Access Settings */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <button
              onClick={() => setDataAccessExpanded(!dataAccessExpanded)}
              className="flex w-full items-center justify-between p-6"
            >
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900">Настройки доступа к данным</h2>
              </div>
              <svg
                className={cn("h-5 w-5 text-gray-400 transition-transform", dataAccessExpanded && "rotate-180")}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dataAccessExpanded && (
              <div className="border-t border-gray-200 px-6 pb-6 pt-4">
                <div className="flex items-start justify-between">
                  <p className="text-sm text-gray-500">
                    Выберите, какие данные агент может читать и использовать в диалогах
                  </p>
                  <Button
                    variant="outline"
                    className="text-sm text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent shrink-0"
                  >
                    Синхронизировать настройки CRM
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Deal Data */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <button
              onClick={() => setDealDataExpanded(!dealDataExpanded)}
              className="flex w-full items-center justify-between p-6"
            >
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-gray-900">Данные сделки</h2>
                  <p className="text-sm text-gray-500">Выберите поля сделки, которые агент может читать</p>
                </div>
              </div>
              <svg
                className={cn("h-5 w-5 text-gray-400 transition-transform", dealDataExpanded && "rotate-180")}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dealDataExpanded && (
              <div className="border-t border-gray-200 px-6 pb-6 pt-4 space-y-4">
                <div>
                  <Label className="mb-3 block text-sm font-medium text-gray-700">Выберите поля сделки</Label>

                  {dealFields.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {dealFields.map((field) => (
                        <div
                          key={field}
                          className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white"
                        >
                          <span>{field}</span>
                          <button onClick={() => removeField(field, "deal")} className="hover:bg-blue-700 rounded">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="relative">
                    <Input placeholder="Выберите поля, в которых агент сможет получать доступ..." className="pr-10" />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  <p className="mt-3 text-sm text-gray-500">
                    Выбирайте только необходимые поля. Дополнительные поля добавляют лишний контекст и могут снижать
                    точность ответов.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contact Data */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <button
              onClick={() => setContactDataExpanded(!contactDataExpanded)}
              className="flex w-full items-center justify-between p-6"
            >
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-gray-900">Данные контакта</h2>
                  <p className="text-sm text-gray-500">Выберите, какие поля контакта агент сможет читать</p>
                </div>
              </div>
              <svg
                className={cn("h-5 w-5 text-gray-400 transition-transform", contactDataExpanded && "rotate-180")}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {contactDataExpanded && (
              <div className="border-t border-gray-200 px-6 pb-6 pt-4 space-y-4">
                <div>
                  <Label className="mb-3 block text-sm font-medium text-gray-700">Выберите поля контакта</Label>

                  {contactFields.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {contactFields.map((field) => (
                        <div
                          key={field}
                          className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white"
                        >
                          <span>{field}</span>
                          <button onClick={() => removeField(field, "contact")} className="hover:bg-blue-700 rounded">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="relative">
                    <Input placeholder="Выберите поля, в которых агент сможет получать доступ..." className="pr-10" />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  <p className="mt-3 text-sm text-gray-500">
                    Выбирайте только необходимые поля. Большее количество полей добавляет дополнительный контекст и
                    может снижать точность ответов.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Data Input Settings */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <button
              onClick={() => setDataInputExpanded(!dataInputExpanded)}
              className="flex w-full items-center justify-between p-6"
            >
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-gray-900">Настройки ввода данных</h2>
                  <p className="text-sm text-gray-500">
                    Настройте, как агент может изменять данные сделок и контактов в зависимости от контекста разговора
                  </p>
                </div>
              </div>
              <svg
                className={cn("h-5 w-5 text-gray-400 transition-transform", dataInputExpanded && "rotate-180")}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dataInputExpanded && (
              <div className="border-t border-gray-200 px-6 pb-6 pt-4 space-y-6">
                {/* Deal Rules */}
                <div className="rounded-lg border border-gray-200">
                  <button
                    onClick={() => setDealRulesExpanded(!dealRulesExpanded)}
                    className="flex w-full items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <div className="text-left">
                        <h3 className="text-sm font-semibold text-gray-900">Данные сделки</h3>
                        <p className="text-xs text-gray-500">
                          Задайте правила автоматического обновления полей сделки во время разговора
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="text-xs text-gray-500 hover:text-gray-700">Свернуть все</button>
                      <button className="text-xs text-blue-600 hover:text-blue-700">Развернуть все</button>
                      <svg
                        className={cn("h-4 w-4 text-gray-400 transition-transform", dealRulesExpanded && "rotate-180")}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {dealRulesExpanded && (
                    <div className="border-t border-gray-200 p-4 space-y-3">
                      <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                        <div className="flex items-center gap-3">
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 6h16M4 10h16M4 14h16M4 18h16"
                            />
                          </svg>
                          <span className="text-sm text-gray-900">Тип услуги</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="text-red-600 hover:text-red-700">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                        <div className="flex items-center gap-3">
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 6h16M4 10h16M4 14h16M4 18h16"
                            />
                          </svg>
                          <span className="text-sm text-gray-900">Email</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="text-red-600 hover:text-red-700">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full text-gray-700 border-gray-300 hover:bg-gray-50 bg-transparent"
                      >
                        Добавить поле
                      </Button>
                    </div>
                  )}
                </div>

                {/* Contact Rules */}
                <div className="rounded-lg border border-gray-200">
                  <button
                    onClick={() => setContactRulesExpanded(!contactRulesExpanded)}
                    className="flex w-full items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <div className="text-left">
                        <h3 className="text-sm font-semibold text-gray-900">Данные контакта</h3>
                        <p className="text-xs text-gray-500">
                          Определите правила автоматического обновления полей контакта во время разговора
                        </p>
                      </div>
                    </div>
                    <svg
                      className={cn("h-4 w-4 text-gray-400 transition-transform", contactRulesExpanded && "rotate-180")}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {contactRulesExpanded && (
                    <div className="border-t border-gray-200 p-4 space-y-3">
                      <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                        <div className="flex items-center gap-3">
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 6h16M4 10h16M4 14h16M4 18h16"
                            />
                          </svg>
                          <span className="text-sm text-gray-900">Email</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="text-red-600 hover:text-red-700">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full text-gray-700 border-gray-300 hover:bg-gray-50 bg-transparent"
                      >
                        Добавить поле
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button className="bg-blue-600 px-6 text-white hover:bg-blue-700">Сохранить</Button>
            <Button variant="outline" className="px-6 bg-transparent">
              Отмена
            </Button>
          </div>
        </div>
      )}

      {activeTab === "integrations" && (
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <svg
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <Input placeholder="Поиск" className="pl-10" />
              </div>
            </div>

            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Интеграция</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Установлено</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Активно</th>
                  <th className="w-32 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-900">Kommo</td>
                  <td className="px-4 py-4">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth={2} />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                  </td>
                  <td className="px-4 py-4">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth={2} />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Настройки
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-900">Google Calendar</td>
                  <td className="px-4 py-4">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth={2} />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </td>
                  <td className="px-4 py-4">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth={2} />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                      Установить
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "advanced" && (
        <div className="max-w-4xl space-y-6">
          {/* AI Model Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-center gap-2">
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
              <h2 className="text-lg font-semibold text-gray-900">Модель ИИ</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="mb-2 block text-sm font-medium text-gray-700">
                  Выберите модель ИИ<span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <div className="flex items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3">
                    <div>
                      <div className="text-sm font-medium text-gray-900">OpenAI GPT-5</div>
                      <div className="text-xs text-gray-500">
                        Новейшая модель OpenAI с надёжными и естественными ответами
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Выберите, насколько умным вы хотите сделать ИИ. Более продвинутые модели стоят дороже.
                </p>
              </div>
            </div>
          </div>

          {/* Language Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-center gap-2">
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
              <h2 className="text-lg font-semibold text-gray-900">Язык</h2>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-detect-lang" className="text-sm font-medium text-gray-900">
                Автоматически определять язык пользователя
              </Label>
              <Switch id="auto-detect-lang" checked={autoDetectLanguage} onCheckedChange={setAutoDetectLanguage} />
            </div>
          </div>

          {/* Response Settings Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-center gap-2">
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-lg font-semibold text-gray-900">Настройки ответа</h2>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="mb-3 block text-sm font-medium text-gray-900">Креативность</Label>

                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => setCreativity("accurate")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                      creativity === "accurate"
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                    )}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth={2} />
                      <circle cx="12" cy="12" r="3" strokeWidth={2} />
                    </svg>
                    Точный
                  </button>

                  <button
                    onClick={() => setCreativity("balanced")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                      creativity === "balanced"
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                    )}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                    Сбалансированный
                  </button>

                  <button
                    onClick={() => setCreativity("creative")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                      creativity === "creative"
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                    )}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                    Креативный
                  </button>
                </div>

                <p className="text-sm text-gray-500">
                  Управляйте стилем ответов агента. Точный: последовательный и предсказуемый, может звучать сухо.
                  Сбалансированный: естественный и легко читаемый. Креативный: выразительный и разнообразный.
                </p>
              </div>

              <div>
                <Label htmlFor="response-delay" className="mb-2 block text-sm font-medium text-gray-900">
                  Задержка ответа (секунд)
                </Label>
                <Input
                  id="response-delay"
                  type="number"
                  value={responseDelay}
                  onChange={(e) => setResponseDelay(e.target.value)}
                  className="w-full"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Сколько секунд ждать перед ответом. Рекомендуем установить задержку не менее 30 секунд, чтобы избежать
                  дублирования ответов, если клиент отправит другое сообщение, пока агент отвечает.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="bg-blue-600 px-6 text-white hover:bg-blue-700">Сохранить</Button>
            <Button variant="outline" className="px-6 bg-transparent">
              Отмена
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
