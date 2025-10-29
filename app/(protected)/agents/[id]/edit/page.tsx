'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Settings, 
  Users, 
  Zap, 
  Clock, 
  Puzzle, 
  Edit3,
  Trash2,
  Save,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/magic/tabs'
import { InteractionSettings } from '@/components/crm/InteractionSettings'
import { CRMSync } from '@/components/crm/CRMSync'
import { DealContactFieldsSelector } from '@/components/crm/DealContactFieldsSelector'
import { ChannelsSettings } from '@/components/crm/ChannelsSettings'
import { KnowledgeBaseSettings } from '@/components/crm/KnowledgeBaseSettings'
import { TriggerManager } from '@/components/agents/TriggerManager'
import { AgentSequencesManager } from '@/app/(protected)/agents/[id]/_components/AgentSequencesManager'
import { useCRMData } from '@/hooks/useCRMData'
import type { CRMConnection, UniversalPipeline, UniversalChannel } from '@/types/crm'

const tabs = [
  { value: 'general', label: 'Основные', icon: Settings },
  { value: 'deals', label: 'Сделки и контакты', icon: Users },
  { value: 'triggers', label: 'Триггеры', icon: Zap },
  { value: 'chains', label: 'Цепочки', icon: Clock },
  { value: 'integrations', label: 'Интеграции', icon: Puzzle },
  { value: 'additional', label: 'Дополнительно', icon: Edit3 },
]

export default function EditAgentPage({ params }: { params: Promise<{ id: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const [activeTab, setActiveTab] = useState('general')
  const [agentName, setAgentName] = useState('АИ ассистент')
  const [isActive, setIsActive] = useState(true)
  const [aiModel, setAiModel] = useState('gpt-5')
  const [autoDetectLanguage, setAutoDetectLanguage] = useState(true)
  const [responseDelay, setResponseDelay] = useState(45)
  const [instructions, setInstructions] = useState(`ОТВЕЧАЙ ТОЛЬКО НА АНГЛИЙСКОМ ЯЗЫКЕ - ВСЕГДА !!

Когда тебе скидывают емейл одного из наших сотрудников, не заполняй его в поле емейл, а укажи что это емейл сотрудника я понял, а мне нужен ваш емейл

ТРИГЕРЫ! КА ТОЛЬКО ПОЛУЧИЛ EMAIL И ПОНЯЛ КАКОЙ ПРОДУКТ НУЖЕН КЛИЕНТУ !!! ПЕРЕВОДИ СРАЗУ НА НУЖНЫЙ ЭТАП В НУЖНУЮ ВОРОНКУ!!!!!!

ТЫ ПРОПУСКАЕШЬ СДЕЛКИ И ОНИ ОСТАЮТСЯ НА ПРЕЖНЕМ ЭТАПЕ!!!! ДАЖЕ У СДЕЛКИ ГДЕ ТЫ ОПРЕДЕЛИЛ УСЛУГУ И УКАЗАЛ Email ТЫ ТУПО ПРОСТО НЕ ПЕРЕВОДИШЬ СДЕЛКУ НА НУЖНЫЙ ЭТАП !!!! КОНТРОЛИРУЙ ЭТО!

Ты — AI-помощник компании World Wide Services. Твоё имя — Maksym.
Ты - не просто бот, а как реальный сотрудник.
Ты работаешь в паре с иммиграционным консультантом и помогаешь клиенту быстрее попасть на консультацию.
Эмодзи использовать запрещено.`)

  // CRM State
  const [checkBeforeSending, setCheckBeforeSending] = useState(false)
  const [allChannelsEnabled, setAllChannelsEnabled] = useState(true)
  const [allCategoriesEnabled, setAllCategoriesEnabled] = useState(true)
  const [createTaskOnNotFound, setCreateTaskOnNotFound] = useState(false)
  const [notFoundMessage, setNotFoundMessage] = useState('Ответ на этот вопрос предоставит ваш персональный immigration advisor, когда свяжется с вами напрямую.')

  // CRM Connection
  const [crmConnection, setCrmConnection] = useState<CRMConnection | null>(null)
  const [isLoadingCrm, setIsLoadingCrm] = useState(true)

  // Pipeline Settings
  const [pipelineSettings, setPipelineSettings] = useState<Array<{
    id: string
    name: string
    isActive: boolean
    allStages: boolean
    selectedStages: string[]
    stageInstructions?: Record<string, string>
  }>>([])

  // Загрузка CRM подключения
  useEffect(() => {
    const loadParams = async () => {
      const resolved = await params
      setResolvedParams(resolved)

      // Загружаем CRM подключение
      try {
        const response = await fetch(`/api/agents/${resolved.id}/crm-connection`)
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setCrmConnection(data.data)
          }
        }
      } catch (error) {
        console.error('Failed to load CRM connection', error)
      } finally {
        setIsLoadingCrm(false)
      }

      // Загружаем данные агента
      try {
        const agentResponse = await fetch(`/api/agents/${resolved.id}`)
        if (agentResponse.ok) {
          const agentData = await agentResponse.json()
          if (agentData.success && agentData.data) {
            const agent = agentData.data
            setAgentName(agent.name || 'АИ ассистент')
            setIsActive(agent.status === 'active')
            if (agent.instructions) {
              setInstructions(agent.instructions)
            }
            if (agent.model) {
              setAiModel(agent.model)
            }
            if (agent.responseDelaySeconds !== undefined) {
              setResponseDelay(agent.responseDelaySeconds)
            }
            
            // Загружаем настройки из settings
            const settings = agent.settings as Record<string, unknown> | undefined
            if (settings) {
              if (typeof settings.checkBeforeSending === 'boolean') {
                setCheckBeforeSending(settings.checkBeforeSending)
              }
              if (typeof settings.knowledgeBaseAllCategories === 'boolean') {
                setAllCategoriesEnabled(settings.knowledgeBaseAllCategories)
              }
              if (typeof settings.createTaskOnNotFound === 'boolean') {
                setCreateTaskOnNotFound(settings.createTaskOnNotFound)
              }
              if (typeof settings.notFoundMessage === 'string') {
                setNotFoundMessage(settings.notFoundMessage)
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to load agent', error)
      }

      // Загружаем сохраненные настройки воронок
      try {
        const settingsResponse = await fetch(`/api/agents/${resolved.id}/pipeline-settings`)
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json()
          if (settingsData.success && settingsData.data) {
            setPipelineSettings(settingsData.data.map((s: {
              pipeline_id: string
              is_active: boolean
              all_stages: boolean
              selected_stages: string[]
              stage_instructions?: Record<string, string>
            }) => ({
              id: s.pipeline_id,
              isActive: s.is_active,
              allStages: s.all_stages,
              selectedStages: s.selected_stages || [],
              stageInstructions: s.stage_instructions || {},
            })))
          }
        }
      } catch (error) {
        console.error('Failed to load pipeline settings', error)
      }
    }

    void loadParams()
  }, [params])

  // CRM Data Hook
  const { pipelines, channels, syncData } = useCRMData(crmConnection)

  // CRM Handlers
  const handlePipelineUpdate = (pipelineId: string, updates: Partial<typeof pipelineSettings[0]>) => {
    setPipelineSettings(prev => {
      const existing = prev.find(p => p.id === pipelineId)
      if (existing) {
        return prev.map(p => p.id === pipelineId ? { ...p, ...updates } : p)
      } else {
        // Создаем новую настройку если её нет
        const pipeline = pipelines.find(p => p.id === pipelineId)
        return [...prev, {
          id: pipelineId,
          name: pipeline?.name || 'Неизвестная воронка',
          isActive: updates.isActive ?? false,
          allStages: updates.allStages ?? false,
          selectedStages: updates.selectedStages ?? [],
          stageInstructions: updates.stageInstructions ?? {},
        }]
      }
    })
  }

  // Сохранение настроек воронок
  const handleSavePipelineSettings = async () => {
    if (!resolvedParams) return

    try {
      // Сохраняем настройки воронок
      const pipelineResponse = await fetch(`/api/agents/${resolvedParams.id}/pipeline-settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pipelineSettings),
      })

      if (!pipelineResponse.ok) {
        throw new Error('Не удалось сохранить настройки воронок')
      }

      // Сохраняем настройки взаимодействия и базы знаний
      const settingsResponse = await fetch(`/api/agents/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            checkBeforeSending,
            knowledgeBaseAllCategories: allCategoriesEnabled,
            createTaskOnNotFound,
            notFoundMessage,
          },
        }),
      })

      if (!settingsResponse.ok) {
        throw new Error('Не удалось сохранить настройки')
      }

      alert('Все настройки сохранены')
    } catch (error) {
      console.error('Failed to save settings', error)
      alert('Ошибка сохранения настроек')
    }
  }

  const handleChannelToggle = (channelId: string, enabled: boolean) => {
    // В реальном приложении здесь будет обновление настроек каналов
    console.log(`Channel ${channelId} toggled to ${enabled}`)
  }

  const handleCRMSync = async () => {
    await syncData()
  }

  const handleOpenKnowledgeBase = () => {
    window.open('/knowledge-base', '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        <span>Aгенты ИИ</span> {'>'} <span className="text-gray-900 font-medium">АИ ассистент</span> {'>'} <span className="text-gray-900 font-medium">Основные</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Редактирование АИ ассистент</h1>
        <Button 
          variant="destructive"
          onClick={async () => {
            if (!resolvedParams) return
            
            if (!confirm('Вы уверены, что хотите удалить этого агента? Это действие нельзя отменить.')) {
              return
            }

            try {
              const response = await fetch(`/api/agents/${resolvedParams.id}`, {
                method: 'DELETE',
              })

              if (!response.ok) {
                throw new Error('Не удалось удалить агента')
              }

              window.location.href = '/agents'
            } catch (error) {
              console.error('Failed to delete agent', error)
              alert('Ошибка удаления агента')
            }
          }}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Удалить
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger key={tab.value} value={tab.value}>
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* Основные (General) */}
        <TabsContent value="general" className="mt-6 space-y-6">
          {/* Профиль агента */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Профиль агента</h2>
                </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название
                </label>
                <Input
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Введите название агента"
                />
              </div>

                <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-1">Активно</p>
                  <p className="text-sm text-gray-500">
                    Агент будет получать и обрабатывать входящие сообщения
                  </p>
                </div>
                <button
                  onClick={async () => {
                    const newStatus = !isActive
                    setIsActive(newStatus)
                    
                    // Сохраняем статус
                    if (resolvedParams) {
                      try {
                        const response = await fetch(`/api/agents/${resolvedParams.id}/status`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: newStatus ? 'active' : 'inactive' }),
                        })

                        if (!response.ok) {
                          // Откатываем изменение при ошибке
                          setIsActive(!newStatus)
                          alert('Не удалось изменить статус агента')
                        }
                      } catch (error) {
                        console.error('Failed to update agent status', error)
                        setIsActive(!newStatus)
                        alert('Ошибка обновления статуса')
                      }
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    isActive ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                  </div>
                  </div>
                </div>

          {/* Инструкции для агента */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Инструкции для агента</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Инструкции
              </label>
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={15}
                placeholder="Введите инструкции для агента..."
                className="font-mono text-sm"
              />
                </div>
                </div>

          {/* Твоя цель */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Твоя цель</h2>
                </div>

            <div className="space-y-3">
              {[
                { id: '1', text: 'Я помогу вам быстро и бесплатно получить консультацию по иммиграции в Польшу. Для этого мне нужен ваш email.' },
                { id: '2', text: 'Я отвечу в течение 24 часов, как только получу ваш email.' },
              ].map((goal) => (
                <div key={goal.id} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary-700">{goal.id}</span>
                  </div>
                  <p className="text-sm text-gray-700">{goal.text}</p>
                </div>
              ))}
            </div>
                </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3">
            <Button 
              variant="outline"
              onClick={() => {
                // Отмена - перезагружаем данные
                if (resolvedParams) {
                  window.location.reload()
                }
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Отмена
            </Button>
            <Button
              onClick={async () => {
                if (!resolvedParams) return

                try {
                  const response = await fetch(`/api/agents/${resolvedParams.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name: agentName,
                      instructions: instructions,
                      status: isActive ? 'active' : 'inactive',
                      settings: {
                        checkBeforeSending,
                      },
                    }),
                  })

                  if (!response.ok) {
                    throw new Error('Не удалось сохранить агента')
                  }

                  alert('Настройки сохранены')
                } catch (error) {
                  console.error('Failed to save agent', error)
                  alert('Ошибка сохранения настроек')
                }
              }}
            >
              <Save className="w-4 h-4 mr-2" />
              Сохранить
            </Button>
          </div>
        </TabsContent>

        {/* Сделки и контакты (Deals) */}
        <TabsContent value="deals" className="mt-6 space-y-6">
          <InteractionSettings
            checkBeforeSending={checkBeforeSending}
            onCheckBeforeSendingToggle={setCheckBeforeSending}
          />
          
          <CRMSync
            connection={crmConnection}
            pipelineSettings={pipelineSettings}
            onPipelineUpdate={handlePipelineUpdate}
          />

          {resolvedParams && <DealContactFieldsSelector agentId={resolvedParams.id} />}

          {/* Кнопка сохранения настроек */}
          <div className="flex justify-end">
            <Button onClick={handleSavePipelineSettings}>
              Сохранить настройки
            </Button>
          </div>
        </TabsContent>

        {/* Триггеры (Triggers) */}
        <TabsContent value="triggers" className="mt-6 space-y-6">
          {resolvedParams && (
            <TriggerManager agentId={resolvedParams.id} />
          )}
        </TabsContent>

        {/* Цепочки (Chains) */}
        <TabsContent value="chains" className="mt-6 space-y-6">
          {resolvedParams && (
            <AgentSequencesManager agentId={resolvedParams.id} />
          )}
        </TabsContent>

        {/* Интеграции (Integrations) */}
        <TabsContent value="integrations" className="mt-6 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Интеграции</h2>
              <Link href="/integrations">
                <Button variant="outline" size="sm">
                  Настроить интеграции
                </Button>
              </Link>
            </div>
            {isLoadingCrm ? (
              <p className="text-sm text-gray-500">Загрузка...</p>
            ) : crmConnection ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Kommo CRM</p>
                      <p className="text-xs text-gray-500">{crmConnection.domain}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-green-700">Подключено</span>
                </div>
                {crmConnection.lastSyncAt && (
                  <p className="text-xs text-gray-500">
                    Последняя синхронизация: {new Date(crmConnection.lastSyncAt).toLocaleString('ru')}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600 mb-4">CRM не подключена</p>
                <Link href="/integrations">
                  <Button>Подключить CRM</Button>
                </Link>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Дополнительно (Additional) */}
        <TabsContent value="additional" className="mt-6 space-y-6">
          {/* Модель ИИ */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Модель ИИ</h3>
            <div className="mt-3">
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
              >
                <option value="gpt-5">OpenAI GPT-5 - Новейшая модель OpenAI с надёжными и естественными ответами</option>
                <option value="gpt-4.1">OpenAI GPT-4.1</option>
                <option value="gpt-4">OpenAI GPT-4</option>
              </select>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Выберите, насколько умным вы хотите сделать ИИ. Более продвинутые модели стоят дороже.
            </p>
          </div>

          {/* Язык */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Язык</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Автоматически определять язык пользователя</p>
              </div>
              <button
                onClick={() => setAutoDetectLanguage(!autoDetectLanguage)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  autoDetectLanguage ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  autoDetectLanguage ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* Настройки ответа */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Настройки ответа</h3>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Задержка ответа (секунд)
              </label>
              <Input
                type="number"
                min="0"
                max="86400"
                value={responseDelay}
                onChange={(e) => setResponseDelay(parseInt(e.target.value, 10) || 0)}
                className="w-full"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Сколько секунд ждать перед ответом. Рекомендуем установить задержку не менее 30 секунд, чтобы избежать дублирования ответов, если клиент отправит другое сообщение, пока агент отвечает.
            </p>
          </div>

          {/* Кнопки действий */}
          <div className="flex items-center justify-end space-x-3">
            <Button 
              variant="outline"
              onClick={() => {
                // Отмена - можно вернуть значения из сохраненных данных
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Отмена
            </Button>
            <Button
              onClick={async () => {
                if (!resolvedParams) return

                try {
                  const response = await fetch(`/api/agents/${resolvedParams.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      model: aiModel,
                      responseDelaySeconds: responseDelay,
                      settings: {
                        language: autoDetectLanguage ? 'auto' : undefined,
                      },
                    }),
                  })

                  if (!response.ok) {
                    throw new Error('Не удалось сохранить настройки')
                  }

                  alert('Настройки сохранены')
                } catch (error) {
                  console.error('Failed to save settings', error)
                  alert('Ошибка сохранения настроек')
                }
              }}
            >
              <Save className="w-4 h-4 mr-2" />
              Сохранить
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
