'use client'

import { useState } from 'react'
import type { ComponentType } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  BookOpen,
  Link2,
  Save,
  Sparkles,
  Target,
  Trash2,
  Workflow,
} from 'lucide-react'

import { TriggerManager } from '@/components/agents/TriggerManager'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Textarea } from '@/components/ui/Textarea'
import { Toggle } from '@/components/ui/Toggle'

interface AgentEditPageProps {
  params: {
    id: string
  }
}

const AgentEditPage = ({ params }: AgentEditPageProps) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('basic')
  const [isSaving, setIsSaving] = useState(false)
  const [isActive, setIsActive] = useState(true)

  const agentTitle = params.id === 'new' ? 'Новый AI-ассистент' : 'AI ассистент'

  const handleSave = async () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      router.push('/agents')
    }, 1000)
  }

  const handleDelete = () => {
    router.push('/agents')
  }

  return (
    <div className="space-y-8">
      <Card className="border-none bg-white shadow-sm">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => router.push('/agents')}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-primary-600"
              >
                <ArrowLeft className="h-4 w-4" /> Назад к списку
              </button>

              <div className="space-y-2">
                <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                  <Link href="/agents" className="font-semibold text-primary-600 hover:underline">
                    Агенты ИИ
                  </Link>
                  <span>/</span>
                  <span className="font-semibold text-slate-500">{agentTitle}</span>
                </nav>
                <h1 className="text-3xl font-semibold text-slate-900">Редактирование {agentTitle}</h1>
                <p className="max-w-2xl text-sm text-slate-500">
                  Управляйте настройками, сценариями и интеграциями, чтобы агент работал в соответствии с вашими бизнес-процессами.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Toggle
                  checked={isActive}
                  onChange={setIsActive}
                  label="Статус"
                  description={isActive ? 'Агент отвечает пользователям' : 'Ответы временно отключены'}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="border-rose-200 text-rose-600 hover:bg-rose-50"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Удалить
              </Button>
              <Button type="button" onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Сохранение…' : 'Сохранить изменения'}
              </Button>
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
        </CardContent>
      </Card>

      <CalloutPipelines agentId={params.id} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full justify-start overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
          <TabsTrigger value="basic" className="flex-1 rounded-xl px-4 py-2 text-sm">
            Основные
          </TabsTrigger>
          <TabsTrigger value="instructions" className="flex-1 rounded-xl px-4 py-2 text-sm">
            Инструкции
          </TabsTrigger>
          <TabsTrigger value="crm" className="flex-1 rounded-xl px-4 py-2 text-sm">
            Сделки и контакты
          </TabsTrigger>
          <TabsTrigger value="triggers" className="flex-1 rounded-xl px-4 py-2 text-sm">
            Триггеры
          </TabsTrigger>
          <TabsTrigger value="chains" className="flex-1 rounded-xl px-4 py-2 text-sm">
            Цепочки
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex-1 rounded-xl px-4 py-2 text-sm">
            Интеграции
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex-1 rounded-xl px-4 py-2 text-sm">
            Дополнительно
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card className="shadow-sm">
            <CardContent className="space-y-6 p-6">
              <div className="grid gap-4 lg:grid-cols-[1fr,280px]">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">Название агента</label>
                    <Input defaultValue="AI ассистент" placeholder="Например: Консультант по продажам" />
                  </div>

                  <Textarea
                    label="Инструкции для агента"
                    placeholder="Опишите роль, допускаемые и запрещенные действия"
                    rows={6}
                    defaultValue="Отвечай только на английском языке. Представляйся сотрудником компании World Wide Services."
                  />

                  <Textarea
                    label="Приветственное сообщение"
                    placeholder="Сообщение, которое увидит пользователь при первом обращении"
                    rows={4}
                    defaultValue="Hello! I'm Maksym, your immigration advisor. How can I help today?"
                  />
                </div>

                <div className="space-y-4 rounded-2xl bg-slate-50 p-4">
                  <Select
                    label="Модель ИИ"
                    options={[
                      { value: 'gpt-5', label: 'OpenAI GPT-5' },
                      { value: 'gpt-4.1', label: 'OpenAI GPT-4.1' },
                      { value: 'gpt-4', label: 'OpenAI GPT-4' },
                    ]}
                    defaultValue="gpt-5"
                  />
                  <Select
                    label="Рабочий язык"
                    options={[
                      { value: 'auto', label: 'Автоматически определять' },
                      { value: 'en', label: 'English' },
                      { value: 'ru', label: 'Русский' },
                    ]}
                    defaultValue="auto"
                  />
                  <Textarea
                    label="Описание"
                    placeholder="Опишите назначение агента"
                    rows={3}
                    defaultValue="Помогает клиентам быстро получить консультацию и выбрать подходящий тип визы."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="grid gap-6 p-6 lg:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-800">Вовлеченность</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Агент отвечает в среднем <span className="font-semibold text-slate-900">45</span> сообщений в день и генерирует <span className="font-semibold text-slate-900">1200</span> ответов в месяц.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-800">Ответственные сотрудники</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Настройте список менеджеров, которые будут уведомляться о важных диалогах и получать созданные задачи.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructions" className="space-y-6">
          <Card className="shadow-sm">
            <CardContent className="space-y-6 p-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Textarea
                  label="Стратегия общения"
                  placeholder="Опишите ключевые принципы общения с клиентом"
                  defaultValue={`1. Уточняй потребности клиента.
2. Предлагай подходящий продукт.
3. Всегда подтверждай следующий шаг.`}
                  rows={8}
                />
                <Textarea
                  label="Запрещено"
                  placeholder="Что агент не должен делать"
                  defaultValue={`— Не обсуждай внутренние процессы.
— Не обещай результат без подтверждения менеджера.
— Не используй эмодзи в официальных ответах.`}
                  rows={8}
                />
              </div>

              <Select
                label="Методология диалога"
                options={[
                  { value: 'spin', label: 'SPIN (ситуация, проблема, импликация, решение)' },
                  { value: 'bant', label: 'BANT (Budget, Authority, Need, Timeline)' },
                  { value: 'custom', label: 'Собственный сценарий' },
                ]}
                defaultValue="spin"
              />

              <Textarea
                label="Завершение диалога"
                placeholder="Опишите, как агент завершает разговор"
                rows={5}
                defaultValue="Подведи итоги, подтвердив договоренности, и предложи клиенту следующий шаг: консультация, звонок или заполнение формы."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crm" className="space-y-6">
          <Card className="shadow-sm">
            <CardContent className="space-y-6 p-6">
              <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Проверять сообщения перед отправкой</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Сообщения будут появляться в поле ввода для ручного подтверждения оператором.
                  </p>
                </div>
                <Toggle checked={false} onChange={() => undefined} aria-label="Проверять перед отправкой" />
              </div>

              <Select
                label="Рабочая воронка"
                options={[
                  { value: 'generation', label: 'Generation Lead' },
                  { value: 'sales', label: 'Sales Pipeline' },
                  { value: 'support', label: 'Customer Support' },
                ]}
                defaultValue="generation"
              />

              <Textarea
                label="Инструкции по работе со стадией сделки"
                placeholder="Опишите, как агент работает с каждой стадией"
                rows={6}
                defaultValue="На стадии 'Сделка распределена' агент уточняет услугу, определяет тип клиента и назначает следующую сессию."
              />

              <div className="grid gap-4 md:grid-cols-2">
                {['Generation lead', 'Work Visa in Poland', 'Seasonal Visa in Poland', 'Product Vendors (Partnership)'].map(
                  (name) => (
                    <StageCard key={name} name={name} />
                  ),
                )}
              </div>

              <div className="rounded-2xl border border-dashed border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-900">Доступные данные сделки</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Агент сможет читать только выбранные поля. Это помогает исключить лишние личные данные и делает ответы более точными.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                  {['Название сделки', 'Ответственный', 'Тип услуги', 'Этап', 'Email клиента'].map((item) => (
                    <span key={item} className="rounded-full bg-slate-100 px-3 py-1">
                      {item}
                    </span>
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
          <Card className="shadow-sm">
            <CardContent className="space-y-6 p-6 text-center">
              <Workflow className="mx-auto h-10 w-10 text-primary-500" />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900">Цепочки сообщений</h3>
                <p className="text-sm text-slate-500">
                  Настройте серию сообщений и действий, которые будут выполняться автоматически по расписанию или при выполнении условий.
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button>Создать цепочку</Button>
                <Button variant="outline">Импортировать сценарий</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card className="shadow-sm">
            <CardContent className="space-y-4 p-6">
              {[{ name: 'Kommo CRM', status: 'Подключено' }, { name: 'Google Calendar', status: 'Не установлено' }].map(
                (integration) => (
                  <IntegrationRow key={integration.name} name={integration.name} status={integration.status} />
                ),
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card className="shadow-sm">
            <CardContent className="space-y-6 p-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Textarea
                  label="Ответ при отсутствии информации"
                  placeholder="Сообщение, которое видит пользователь, если ответ не найден"
                  rows={6}
                  defaultValue="На этот вопрос ответит ваш персональный immigration advisor, когда свяжется с вами напрямую."
                />
                <div className="space-y-4 rounded-2xl bg-slate-50 p-4">
                  <Toggle
                    checked
                    onChange={() => undefined}
                    label="Создавать задачу, если ответ не найден"
                    description="Помогает контролировать нерешенные вопросы клиентов."
                  />
                  <Toggle
                    checked
                    onChange={() => undefined}
                    label="Использовать базу знаний"
                    description="Перед ответом искать релевантные статьи."
                  />
                  <Toggle
                    checked
                    onChange={() => undefined}
                    label="Сохранять историю диалогов"
                    description="Позволяет анализировать качество ответов и обучать модель."
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <NumberField label="Температура" defaultValue="0.7" hint="Диапазон 0 – 2" />
                <NumberField label="Максимальная длина ответа" defaultValue="900" hint="В токенах" />
                <NumberField label="Задержка ответа" defaultValue="45" hint="В секундах" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

const SummaryCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
}) => (
  <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
      <Icon className="h-5 w-5" />
    </div>
    <div className="space-y-1">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  </div>
)

const CalloutPipelines = ({ agentId }: { agentId: string }) => (
  <div className="rounded-2xl border border-primary-200 bg-primary-50/60 p-6">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
          <Target className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-primary-900">Настройте воронки и этапы</h3>
          <p className="text-sm text-primary-700">
            Определите, на каких этапах и с какими условиями агент должен работать в CRM.
          </p>
        </div>
      </div>
      <Link href={`/agents/${agentId}/pipelines`}>
        <Button variant="outline" className="border-primary-300 bg-white text-primary-700 hover:bg-primary-100">
          <Link2 className="mr-2 h-4 w-4" /> Настроить воронки
        </Button>
      </Link>
    </div>
  </div>
)

const StageCard = ({ name }: { name: string }) => (
  <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4">
    <div className="flex items-center justify-between">
      <p className="font-semibold text-slate-900">{name}</p>
      <Toggle checked onChange={() => undefined} aria-label={`Активность этапа ${name}`} />
    </div>
    <p className="text-sm text-slate-500">
      Когда агент понимает, что это клиент по продукту {name}, автоматически переводит сделку на подходящий этап и назначает задачу.
    </p>
  </div>
)

const IntegrationRow = ({ name, status }: { name: string; status: string }) => (
  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4">
    <div>
      <p className="font-semibold text-slate-900">{name}</p>
      <p className="text-sm text-slate-500">{status}</p>
    </div>
    <Button variant="outline" size="sm">
      {status === 'Подключено' ? 'Настройки' : 'Установить'}
    </Button>
  </div>
)

const NumberField = ({
  label,
  defaultValue,
  hint,
}: {
  label: string
  defaultValue: string
  hint?: string
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-600">{label}</label>
    <Input type="number" defaultValue={defaultValue} />
    {hint ? <p className="text-xs text-slate-400">{hint}</p> : null}
  </div>
)

export default AgentEditPage

