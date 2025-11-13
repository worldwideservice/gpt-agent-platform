'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronDown, ChevronRight, RefreshCw } from 'lucide-react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Switch,
  Textarea,
  useToast,
} from '@/components/ui'

interface Agent {
  id: string
  name: string
  isActive: boolean
  instructions?: string | null
  requiresApproval?: boolean | null
}

interface AgentBasicsFormProps {
  agent: Agent
  tenantId: string
}

interface Pipeline {
  id: string
  name: string
  isActive: boolean
  stages?: PipelineStage[]
}

interface PipelineStage {
  id: string
  name: string
}

interface Channel {
  id: string
  name: string
}

export function AgentBasicsForm({ agent, tenantId }: AgentBasicsFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [name, setName] = useState(agent.name)
  const [isActive, setIsActive] = useState(agent.isActive)
  const [instructions, setInstructions] = useState(agent.instructions || '')
  const [requiresApproval, setRequiresApproval] = useState(agent.requiresApproval || false)

  // Funnels state
  const [pipelines, setPipelines] = useState<Pipeline[]>([
    { id: '1', name: 'GENERATION LEAD', isActive: true },
    { id: '2', name: 'WORK VISA IN POLAND', isActive: false },
    { id: '3', name: 'SEASONAL VISA IN POLAND', isActive: false },
  ])
  const [expandedPipelines, setExpandedPipelines] = useState<Set<string>>(new Set())

  // Channels state
  const [allChannels, setAllChannels] = useState(true)
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])

  // Knowledge base state
  const [allCategories, setAllCategories] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [createTaskIfNoAnswer, setCreateTaskIfNoAnswer] = useState(false)
  const [noAnswerMessage, setNoAnswerMessage] = useState(
    'У меня недостаточно информации, чтобы ответить на этот вопрос. Я уточню детали и вернусь к вам.'
  )

  const handleSyncCRM = async () => {
    try {
      const response = await fetch(`/api/agents/${agent.id}/sync-crm`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to sync CRM')
      }

      toast({
        title: 'Успешно',
        description: 'Синхронизация с CRM выполнена успешно',
      })

      router.refresh()
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось синхронизировать с CRM',
        variant: 'destructive',
      })
    }
  }

  const togglePipeline = (pipelineId: string) => {
    setExpandedPipelines((prev) => {
      const next = new Set(prev)
      if (next.has(pipelineId)) {
        next.delete(pipelineId)
      } else {
        next.add(pipelineId)
      }
      return next
    })
  }

  const togglePipelineActive = (pipelineId: string) => {
    setPipelines((prev) =>
      prev.map((p) =>
        p.id === pipelineId ? { ...p, isActive: !p.isActive } : p
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/agents/${agent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          isActive,
          instructions,
          requiresApproval,
          pipelines: pipelines.filter((p) => p.isActive).map((p) => p.id),
          allChannels,
          channels: allChannels ? [] : selectedChannels,
          allCategories,
          categories: allCategories ? [] : selectedCategories,
          createTaskIfNoAnswer,
          noAnswerMessage,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update agent')
      }

      toast({
        title: 'Успешно',
        description: 'Настройки агента обновлены',
      })

      router.refresh()
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить агента',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/manage/${tenantId}/ai-agents`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Профиль агента */}
      <Card>
        <CardHeader>
          <CardTitle>Профиль агента</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Название */}
          <div className="space-y-2">
            <Label htmlFor="agent-name">
              Название <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="agent-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите название агента"
              required
            />
          </div>

          {/* Активно */}
          <div className="flex items-center justify-between">
            <Label htmlFor="agent-active">Активно</Label>
            <Switch
              id="agent-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          {/* Инструкции */}
          <div className="space-y-2">
            <Label htmlFor="agent-instructions">
              Инструкции для агента <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              id="agent-instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Введите инструкции для агента"
              rows={5}
              required
            />
            <p className="text-xs text-gray-500">
              Начальные инструкции по тону, стилю и ответам вашего агента. Вы также можете добавить общие сведения о компании, чтобы помочь агенту отвечать более точно.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Взаимодействие */}
      <Card>
        <CardHeader>
          <CardTitle>Взаимодействие</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="requires-approval">Проверять перед отправкой</Label>
              <p className="text-xs text-gray-500">
                Сообщения не будут отправляться автоматически. Они появятся в поле ввода сообщения для вашего просмотра и ручной отправки.
              </p>
            </div>
            <Switch
              id="requires-approval"
              checked={requiresApproval}
              onCheckedChange={setRequiresApproval}
            />
          </div>
        </CardContent>
      </Card>

      {/* Настройки воронок */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Настройки воронок</CardTitle>
              <p className="mt-1 text-sm text-gray-500">
                Выберите воронки и этапы сделок, в которых агент должен работать
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSyncCRM}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Синхронизировать настройки CRM
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {pipelines.map((pipeline) => (
            <div key={pipeline.id} className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => togglePipeline(pipeline.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {expandedPipelines.has(pipeline.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  <h3 className="font-medium">{pipeline.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`pipeline-${pipeline.id}`}>Активно</Label>
                  <Switch
                    id={`pipeline-${pipeline.id}`}
                    checked={pipeline.isActive}
                    onCheckedChange={() => togglePipelineActive(pipeline.id)}
                  />
                </div>
              </div>
              {expandedPipelines.has(pipeline.id) && (
                <div className="ml-6 rounded-lg border bg-gray-50 p-3 dark:bg-gray-900">
                  <p className="text-sm text-gray-500">
                    Этапы воронки будут загружены из CRM
                  </p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Каналы */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Каналы</CardTitle>
              <p className="mt-1 text-sm text-gray-500">
                Выберите каналы, в которых агент может отвечать
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSyncCRM}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Синхронизировать настройки CRM
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="all-channels">Все каналы</Label>
            <Switch
              id="all-channels"
              checked={allChannels}
              onCheckedChange={setAllChannels}
            />
          </div>
          {!allChannels && (
            <div className="space-y-2">
              <Label htmlFor="channels-select">
                Выбрать каналы <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="channels-select"
                placeholder="Выбрать вариант"
                readOnly
              />
              <p className="text-xs text-gray-500">
                Множественный выбор каналов будет реализован в Phase 12
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* База знаний */}
      <Card>
        <CardHeader>
          <CardTitle>База знаний</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="all-categories">Разрешить доступ ко всем категориям</Label>
            <Switch
              id="all-categories"
              checked={allCategories}
              onCheckedChange={setAllCategories}
            />
          </div>
          {!allCategories && (
            <div className="space-y-2">
              <Label htmlFor="categories-select">
                Выбрать категории <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="categories-select"
                placeholder="Выбрать вариант"
                readOnly
              />
              <p className="text-xs text-gray-500">
                Агент будет получать доступ к знаниям только из этих категорий
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="create-task">Создать задачу, если ответ не найден</Label>
              <p className="text-xs text-gray-500">
                Автоматически создавать задачу в сделке CRM, если в базе знаний не найдена релевантная информация
              </p>
            </div>
            <Switch
              id="create-task"
              checked={createTaskIfNoAnswer}
              onCheckedChange={setCreateTaskIfNoAnswer}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="no-answer-message">Сообщение при отсутствии ответа</Label>
            <Textarea
              id="no-answer-message"
              value={noAnswerMessage}
              onChange={(e) => setNoAnswerMessage(e.target.value)}
              placeholder="У меня недостаточно информации, чтобы ответить на этот вопрос. Я уточню детали и вернусь к вам."
              rows={3}
            />
            <p className="text-xs text-gray-500">
              Это сообщение будет показано, когда агент не сможет найти релевантную информацию в базе знаний.
            </p>
          </div>

          <div>
            <Link
              href={`/manage/${tenantId}/knowledge-items`}
              className="text-sm font-medium text-primary hover:underline"
            >
              Открыть базу знаний →
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Кнопки действий */}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Сохранение...' : 'Сохранить'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Отмена
        </Button>
      </div>
    </form>
  )
}
