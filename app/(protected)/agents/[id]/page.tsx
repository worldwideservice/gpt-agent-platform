'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { TriggerManager } from '@/components/agents/TriggerManager'

interface AgentEditPageProps {
  params: {
    id: string
  }
}

const AgentEditPage = ({ params }: AgentEditPageProps) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('basic')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Здесь будет логика сохранения
    setTimeout(() => {
      setIsSaving(false)
      router.push('/agents')
    }, 1000)
  }

  const handleBack = () => {
    router.push('/agents')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {params.id === 'new' ? 'Создание агента' : 'Редактирование агента'}
            </h1>
            <p className="text-gray-600 mt-1">
              Настройте параметры и поведение AI-агента
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-5 h-5 mr-2" />
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="basic">Основные</TabsTrigger>
          <TabsTrigger value="instructions">Инструкции</TabsTrigger>
          <TabsTrigger value="crm">Сделки и контакты</TabsTrigger>
          <TabsTrigger value="triggers">Триггеры</TabsTrigger>
          <TabsTrigger value="chains">Цепочки</TabsTrigger>
          <TabsTrigger value="integrations">Интеграции</TabsTrigger>
          <TabsTrigger value="advanced">Расширенные</TabsTrigger>
        </TabsList>
        
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900">Настройка воронок и этапов</p>
              <p className="text-sm text-blue-700 mt-1">
                Выберите воронки и этапы сделок, где агент должен работать
              </p>
            </div>
            <Link href={`/agents/${params.id}/pipelines`}>
              <Button variant="outline" size="sm">
                Настроить воронки
              </Button>
            </Link>
          </div>
        </div>

        <TabsContent value="basic">
          <Card>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название агента
                </label>
                <Input
                  placeholder="Например: Консультант по продажам"
                  defaultValue="Консультант по продажам"
                />
              </div>

              <Select
                label="Статус"
                options={[
                  { value: 'active', label: 'Активен' },
                  { value: 'inactive', label: 'Неактивен' },
                  { value: 'draft', label: 'Черновик' },
                ]}
                defaultValue="active"
              />

              <Textarea
                label="Описание"
                placeholder="Краткое описание назначения агента"
                defaultValue="Агент для консультации клиентов по продуктам и услугам"
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Модель ИИ"
                  options={[
                    { value: 'gpt-4', label: 'GPT-4' },
                    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
                    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
                  ]}
                  defaultValue="gpt-4"
                />

                <Select
                  label="Язык"
                  options={[
                    { value: 'ru', label: 'Русский' },
                    { value: 'en', label: 'English' },
                    { value: 'uk', label: 'Українська' },
                  ]}
                  defaultValue="ru"
                />
              </div>

              <Textarea
                label="Приветственное сообщение"
                placeholder="Приветствие, которое увидит пользователь"
                defaultValue="Здравствуйте! Я AI-консультант. Чем могу помочь?"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructions">
          <Card>
            <CardContent className="space-y-6">
              <Textarea
                label="Роль и задачи агента"
                placeholder="Опишите, кем является агент и какие задачи он решает"
                rows={6}
                defaultValue="Вы - профессиональный консультант по продажам. Ваша задача - помочь клиентам с выбором продукта, ответить на вопросы и провести их через воронку продаж."
              />

              <Textarea
                label="Инструкции для агента"
                placeholder="Детальные инструкции по поведению агента"
                rows={8}
                defaultValue="1. Всегда будьте вежливы и профессиональны&#10;2. Задавайте уточняющие вопросы&#10;3. Предлагайте решения на основе потребностей клиента&#10;4. Не давайте ложных обещаний"
              />

              <Select
                label="Логика диалога"
                options={[
                  { value: 'free', label: 'Свободный диалог' },
                  { value: 'spin', label: 'SPIN-продажи' },
                  { value: 'bant', label: 'BANT (Budget, Authority, Need, Timeline)' },
                  { value: 'fab', label: 'FAB (Features, Advantages, Benefits)' },
                  { value: 'laer', label: 'LAER (Listen, Acknowledge, Explore, Respond)' },
                ]}
                defaultValue="spin"
              />

              <Textarea
                label="Ограничения"
                placeholder="Что агент НЕ должен делать"
                rows={4}
                defaultValue="Не обсуждать цены без согласования с менеджером&#10;Не делать скидки более 10%&#10;Не передавать личные данные клиентов"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crm">
          <Card>
            <CardContent className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Интеграция с CRM
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Автоматическое создание сделок</p>
                    <p className="text-sm text-gray-600">Создавать сделку при первом обращении клиента</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Синхронизация контактов</p>
                    <p className="text-sm text-gray-600">Обновлять данные контакта при изменении</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Передача менеджеру</p>
                    <p className="text-sm text-gray-600">Передавать диалог менеджеру на определённом этапе</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  />
                </div>
              </div>

              <Select
                label="Воронка продаж"
                options={[
                  { value: 'main', label: 'Основная воронка' },
                  { value: 'leads', label: 'Квалификация лидов' },
                  { value: 'support', label: 'Поддержка клиентов' },
                ]}
                defaultValue="main"
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Этапы работы агента
                </label>
                <div className="space-y-2">
                  {['Первичный контакт', 'Квалификация', 'Презентация', 'Переговоры'].map((stage) => (
                    <label key={stage} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{stage}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="triggers">
          <TriggerManager />
        </TabsContent>

        <TabsContent value="chains">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Цепочки сообщений
                </h3>
                <Button>Создать цепочку</Button>
              </div>
              
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Цепочки позволяют настроить автоматическую отправку серии сообщений по расписанию
                </p>
                <Button variant="outline" className="mt-4">
                  Создать первую цепочку
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardContent className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Настройка интеграций
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📊</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Kommo CRM</p>
                      <p className="text-sm text-gray-600">Подключено</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Настроить</Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">💬</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Telegram</p>
                      <p className="text-sm text-gray-600">Не подключено</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Подключить</Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📱</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">WhatsApp</p>
                      <p className="text-sm text-gray-600">Не подключено</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Подключить</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardContent className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Расширенные настройки
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Температура (creativity)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    defaultValue="0.7"
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Точный (0)</span>
                    <span>Креативный (2)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Задержка ответа (сек)
                  </label>
                  <Input
                    type="number"
                    defaultValue="2"
                    min="0"
                    max="10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Максимальная длина ответа (токены)
                </label>
                <Input
                  type="number"
                  defaultValue="500"
                  min="100"
                  max="4000"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Использовать базу знаний</p>
                  <p className="text-sm text-gray-600">Искать ответы в базе знаний перед генерацией</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Сохранять историю диалогов</p>
                  <p className="text-sm text-gray-600">Хранить переписку для анализа и улучшения</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AgentEditPage

