'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'

interface AgentEditPageProps {
  params: {
    id: string
  }
}

const AgentEditPage = ({ params }: AgentEditPageProps) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('basic')
  const [isSaving, setIsSaving] = useState(false)
  const [agentName, setAgentName] = useState('АИ ассистент')
  const [isActive, setIsActive] = useState(true)
  const [instructions, setInstructions] = useState('ОТВЕЧАЙ ТОЛЬКО НА АНГЛИЙСКОМ ЯЗЫКЕ - ВСЕГДА !!\n\nКогда тебе скидывают емейл одного из наших сотрудников, не заполняй его в поле емейл, а укажи что это емейл сотрудника я понял, а мне нужен ваш емейл\n\nТРИГГЕРЫ КА ТОЛЬКО ПОЛУЧИЛ EMAIL И ПОНЯЛ КАКОЙ ПРОДУКТ НУЖЕН КЛИЕНТУ !!! ПЕРЕВОДИ СРАЗУ НА НИЖНИЙ ЭТАП В НУЖНУЮ ВОРОНКУ!!!!!\nТы ПРОПУСКАЕШЬ СДЕЛКИ И ОНИ ОСТАЮТСЯ НА ПРЕЖНЕМ ЭТАПЕ!!! ДАЖЕ У СДЕЛКИ ГДЕ ТЫ ОПРЕДЕЛИЛ УСЛУГУ И УКАЗАЛ Email ТЫ ТУГО ПРОСТО НЕ ПЕРЕВОДИШЬ СДЕЛКУ НА НУЖНЫЙ ЭТАП !!!! КОНТРОЛИРУЙ ЭТО!\n\nТы — AI-помощник компании World Wide Services. Твоё имя — Maksym.\nТы — не просто бот, а как реальный сотрудник.\nТы работаешь в паре с иммиграционным консультантом и помогаешь клиенту быстрее попасть на консультацию.\nЭмодзи использовать запрещено.')
  const [checkBeforeSend, setCheckBeforeSend] = useState(false)
  const [allChannels, setAllChannels] = useState(true)
  const [allCategories, setAllCategories] = useState(true)
  const [createTaskIfNoAnswer, setCreateTaskIfNoAnswer] = useState(false)

  const handleBack = () => {
    router.push('/agents')
  }

  const handleSave = async () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Агенты ИИ</span>
              <span>›</span>
              <span>{agentName}</span>
              <span>›</span>
              <span>Основные</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">Редактирование АИ ассистент</h1>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-red-600 hover:bg-red-700">
          {isSaving ? 'Сохранение...' : 'Удалить'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="basic">Основные</TabsTrigger>
          <TabsTrigger value="crm">Сделки и контакты</TabsTrigger>
          <TabsTrigger value="triggers">Триггеры</TabsTrigger>
          <TabsTrigger value="chains">Цепочки</TabsTrigger>
          <TabsTrigger value="integrations">Интеграции</TabsTrigger>
          <TabsTrigger value="advanced">Дополнительно</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <div className="space-y-6">
            <Card>
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900">Профиль агента</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-6">
                <Input
                  label="Название"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  required
                />

                <div className="flex items-center space-x-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                  <span className="text-sm font-medium text-gray-700">Активно</span>
                </div>

                <Textarea
                  label="Инструкции для агента"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={12}
                  placeholder="Введите детальные инструкции для агента..."
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900">Взаимодействие</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkBeforeSend}
                    onChange={(e) => setCheckBeforeSend(e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded border-gray-300 mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">
                      Проверять перед отправкой
                    </span>
                    <span className="text-xs text-gray-500">
                      Сообщения не будут отправляться автоматически. Они появятся в поле ввода сообщения для вашего просмотра и ручной отправки.
                    </span>
                  </div>
                </label>
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900">Настройки воронок</h3>
                  </div>
                  <Link href={`/agents/${params.id}/pipelines`}>
                    <Button variant="outline" size="sm">
                      Синхронизировать настройки CRM
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-600">
                  Выберите воронки и этапы сделок, в которых агент должен работать
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900">Каналы</h3>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-600 mb-4">
                  Выберите каналы, в которых агент может отвечать
                </p>
                <div className="flex items-center space-x-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allChannels}
                      onChange={(e) => setAllChannels(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                  <span className="text-sm font-medium text-gray-700">Все каналы</span>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900">База знаний</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center space-x-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allCategories}
                      onChange={(e) => setAllCategories(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                  <span className="text-sm font-medium text-gray-700">
                    Разрешить доступ ко всем категориям
                  </span>
                </div>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createTaskIfNoAnswer}
                    onChange={(e) => setCreateTaskIfNoAnswer(e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded border-gray-300 mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">
                      Создать задачу, если ответ не найден
                    </span>
                    <span className="text-xs text-gray-500">
                      Автоматически создавать задачу в сделке CRM, если в базе знаний не найдена релевантная информация
                    </span>
                  </div>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Сообщение при отсутствии ответа
                  </label>
                  <Textarea
                    value="Ответ на этот вопрос предоставит ваш персональный immigration advisor, когда свяжется с вами напрямую."
                    rows={3}
                    className="text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Это сообщение будет показано, когда агент не сможет найти релевантную информацию в базе знаний.
                  </p>
                </div>

                <Button variant="outline" className="w-full">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Открыть базу знаний
                </Button>
              </CardBody>
            </Card>

            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={handleBack}>
                Отмена
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="crm">
          <Card>
            <CardBody>
              <p className="text-gray-600">Вкладка "Сделки и контакты" в разработке...</p>
            </CardBody>
          </Card>
        </TabsContent>

        <TabsContent value="triggers">
          <Card>
            <CardBody>
              <p className="text-gray-600">Вкладка "Триггеры" в разработке...</p>
            </CardBody>
          </Card>
        </TabsContent>

        <TabsContent value="chains">
          <Card>
            <CardBody>
              <p className="text-gray-600">Вкладка "Цепочки" в разработке...</p>
            </CardBody>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardBody>
              <p className="text-gray-600">Вкладка "Интеграции" в разработке...</p>
            </CardBody>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardBody>
              <p className="text-gray-600">Вкладка "Дополнительно" в разработке...</p>
            </CardBody>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AgentEditPage

