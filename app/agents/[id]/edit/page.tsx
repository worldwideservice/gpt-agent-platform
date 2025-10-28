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
import { ChannelsSettings } from '@/components/crm/ChannelsSettings'
import { KnowledgeBaseSettings } from '@/components/crm/KnowledgeBaseSettings'

const tabs = [
  { value: 'general', label: 'Основные', icon: Settings },
  { value: 'deals', label: 'Сделки и контакты', icon: Users },
  { value: 'triggers', label: 'Триггеры', icon: Zap },
  { value: 'chains', label: 'Цепочки', icon: Clock },
  { value: 'integrations', label: 'Интеграции', icon: Puzzle },
  { value: 'additional', label: 'Дополнительно', icon: Edit3 },
]

export default function EditAgentPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('general')
  const [agentName, setAgentName] = useState('АИ ассистент')
  const [isActive, setIsActive] = useState(true)
  const [instructions, setInstructions] = useState(`ОТВЕЧАЙ ТОЛЬКО НА АНГЛИЙСКОМ ЯЗЫКЕ - ВСЕГДА !!

Когда тебе скидывают емейл одного из наших сотрудников, не заполняй его в поле емейл, а укажи что это емейл сотрудника я понял, а мне нужен ваш емейл

ТРИГЕРЫ! КА ТОЛЬКО ПОЛУЧИЛ EMAIL И ПОНЯЛ КАКОЙ ПРОДУКТ НУЖЕН КЛИЕНТУ !!! ПЕРЕВОДИ СРАЗУ НА НУЖНЫЙ ЭТАП В НУЖНУЮ ВОРОНКУ!!!!!!

ТЫ ПРОПУСКАЕШЬ СДЕЛКИ И ОНИ ОСТАЮТСЯ НА ПРЕЖНЕМ ЭТАПЕ!!!! ДАЖЕ У СДЕЛКИ ГДЕ ТЫ ОПРЕДЕЛИЛ УСЛУГУ И УКАЗАЛ Email ТЫ ТУПО ПРОСТО НЕ ПЕРЕВОДИШЬ СДЕЛКУ НА НУЖНЫЙ ЭТАП !!!! КОНТРОЛИРУЙ ЭТО!

Ты - AI-помощник компании World Wide Services. Твоё имя - Maksym.
Ты - не просто бот, а как реальный сотрудник.
Ты работаешь в паре с иммиграционным консультантом и помогаешь клиенту быстрее попасть на консультацию.
Эмодзи использовать запрещено.`)

  // CRM State
  const [checkBeforeSending, setCheckBeforeSending] = useState(false)
  const [allChannelsEnabled, setAllChannelsEnabled] = useState(true)
  const [allCategoriesEnabled, setAllCategoriesEnabled] = useState(true)
  const [createTaskOnNotFound, setCreateTaskOnNotFound] = useState(false)
  const [notFoundMessage, setNotFoundMessage] = useState('Ответ на этот вопрос предоставит ваш персональный immigration advisor, когда свяжется с вами напрямую.')

  // Mock CRM Data
  const [pipelines, setPipelines] = useState([
    {
      id: '1',
      name: 'GENERATION LEAD',
      isActive: true,
      allStages: false,
      selectedStages: ['1', '2', '3'],
      stages: [
        { id: '1', name: 'Сделка не распределена', pipelineId: '1' },
        { id: '2', name: 'Сделка распределена', pipelineId: '1' },
        { id: '3', name: 'Social media', pipelineId: '1' },
        { id: '4', name: 'Первичный контакт', pipelineId: '1' },
        { id: '5', name: 'Квалификация', pipelineId: '1' },
      ]
    },
    {
      id: '2',
      name: 'WORK VISA IN POLAND',
      isActive: false,
      allStages: false,
      selectedStages: [],
      stages: [
        { id: '6', name: 'Заявка получена', pipelineId: '2' },
        { id: '7', name: 'Документы проверены', pipelineId: '2' },
        { id: '8', name: 'Одобрено', pipelineId: '2' },
      ]
    },
    {
      id: '3',
      name: 'SEASONAL VISA IN POLAND',
      isActive: false,
      allStages: false,
      selectedStages: [],
      stages: [
        { id: '9', name: 'Заявка получена', pipelineId: '3' },
        { id: '10', name: 'Документы проверены', pipelineId: '3' },
        { id: '11', name: 'Одобрено', pipelineId: '3' },
      ]
    }
  ])

  const [channels, setChannels] = useState([
    { id: '1', name: 'Email', type: 'email' as const, isActive: true },
    { id: '2', name: 'Телефон', type: 'phone' as const, isActive: true },
    { id: '3', name: 'Чат', type: 'chat' as const, isActive: true },
    { id: '4', name: 'Facebook', type: 'social' as const, isActive: false },
    { id: '5', name: 'Instagram', type: 'social' as const, isActive: false },
  ])

  // CRM Handlers
  const handlePipelineUpdate = (pipelineId: string, updates: any) => {
    setPipelines(prev => prev.map(p => 
      p.id === pipelineId ? { ...p, ...updates } : p
    ))
  }

  const handleChannelToggle = (channelId: string, enabled: boolean) => {
    setChannels(prev => prev.map(c => 
      c.id === channelId ? { ...c, isActive: enabled } : c
    ))
  }

  const handleCRMSync = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('CRM data synchronized')
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
        <Button variant="danger">
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
                  onClick={() => setIsActive(!isActive)}
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
            <Button variant="outline">
              <X className="w-4 h-4 mr-2" />
                Отмена
              </Button>
            <Button>
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
            onSync={handleCRMSync}
            pipelines={pipelines}
            onPipelineUpdate={handlePipelineUpdate}
          />
        </TabsContent>

        {/* Триггеры (Triggers) */}
        <TabsContent value="triggers" className="mt-6 space-y-6">
          <ChannelsSettings
            channels={channels}
            allChannelsEnabled={allChannelsEnabled}
            onAllChannelsToggle={setAllChannelsEnabled}
            onChannelToggle={handleChannelToggle}
            onSync={handleCRMSync}
          />
        </TabsContent>

        {/* Цепочки (Chains) */}
        <TabsContent value="chains" className="mt-6 space-y-6">
          <KnowledgeBaseSettings
            allCategoriesEnabled={allCategoriesEnabled}
            createTaskOnNotFound={createTaskOnNotFound}
            notFoundMessage={notFoundMessage}
            onAllCategoriesToggle={setAllCategoriesEnabled}
            onCreateTaskToggle={setCreateTaskOnNotFound}
            onMessageChange={setNotFoundMessage}
            onOpenKnowledgeBase={handleOpenKnowledgeBase}
          />
        </TabsContent>

        {/* Интеграции (Integrations) */}
        <TabsContent value="integrations" className="mt-6 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Интеграции</h2>
            <p className="text-sm text-gray-600">Настройки интеграций будут здесь</p>
          </div>
        </TabsContent>

        {/* Дополнительно (Additional) */}
        <TabsContent value="additional" className="mt-6 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Дополнительно</h2>
            <p className="text-sm text-gray-600">Дополнительные настройки будут здесь</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
