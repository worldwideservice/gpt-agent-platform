'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronDown, ChevronRight, RefreshCw } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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

// Zod validation schema
const agentBasicsSchema = z.object({
  name: z
    .string()
    .min(1, 'Название обязательно')
    .max(100, 'Название не должно превышать 100 символов'),
  isActive: z.boolean().default(false),
  instructions: z
    .string()
    .min(1, 'Инструкции обязательны')
    .max(5000, 'Инструкции не должны превышать 5000 символов'),
  requiresApproval: z.boolean().default(false),
  pipelines: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      isActive: z.boolean(),
    })
  ),
  allChannels: z.boolean().default(true),
  selectedChannels: z.array(z.string()).default([]),
  allCategories: z.boolean().default(true),
  selectedCategories: z.array(z.string()).default([]),
  createTaskIfNoAnswer: z.boolean().default(false),
  noAnswerMessage: z
    .string()
    .max(500, 'Сообщение не должно превышать 500 символов')
    .optional(),
})

type AgentBasicsFormData = z.infer<typeof agentBasicsSchema>

export function AgentBasicsForm({ agent, tenantId }: AgentBasicsFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  // React Hook Form setup
  const form = useForm<AgentBasicsFormData>({
    resolver: zodResolver(agentBasicsSchema),
    defaultValues: {
      name: agent.name,
      isActive: agent.isActive,
      instructions: agent.instructions || '',
      requiresApproval: agent.requiresApproval || false,
      pipelines: [
        { id: '1', name: 'GENERATION LEAD', isActive: true },
        { id: '2', name: 'WORK VISA IN POLAND', isActive: false },
        { id: '3', name: 'SEASONAL VISA IN POLAND', isActive: false },
      ],
      allChannels: true,
      selectedChannels: [],
      allCategories: true,
      selectedCategories: [],
      createTaskIfNoAnswer: false,
      noAnswerMessage:
        'У меня недостаточно информации, чтобы ответить на этот вопрос. Я уточню детали и вернусь к вам.',
    },
  })

  const [expandedPipelines, setExpandedPipelines] = useState<Set<string>>(new Set())

  const pipelines = form.watch('pipelines')

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
    const currentPipelines = form.getValues('pipelines')
    const updatedPipelines = currentPipelines.map((p) =>
      p.id === pipelineId ? { ...p, isActive: !p.isActive } : p
    )
    form.setValue('pipelines', updatedPipelines)
  }

  const onSubmit = async (data: AgentBasicsFormData) => {
    try {
      const response = await fetch(`/api/agents/${agent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          isActive: data.isActive,
          instructions: data.instructions,
          requiresApproval: data.requiresApproval,
          pipelines: data.pipelines.filter((p) => p.isActive).map((p) => p.id),
          allChannels: data.allChannels,
          channels: data.allChannels ? [] : data.selectedChannels,
          allCategories: data.allCategories,
          categories: data.allCategories ? [] : data.selectedCategories,
          createTaskIfNoAnswer: data.createTaskIfNoAnswer,
          noAnswerMessage: data.noAnswerMessage,
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
    }
  }

  const handleCancel = () => {
    router.push(`/manage/${tenantId}/ai-agents`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Профиль агента */}
        <Card>
          <CardHeader>
            <CardTitle>Профиль агента</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Название */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Название <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Введите название агента" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Активно */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Активно</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Инструкции */}
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Инструкции для агента <span className="text-rose-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Введите инструкции для агента"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Начальные инструкции по тону, стилю и ответам вашего агента. Вы также можете добавить общие сведения о компании, чтобы помочь агенту отвечать более точно.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Взаимодействие */}
        <Card>
          <CardHeader>
            <CardTitle>Взаимодействие</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="requiresApproval"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="flex-1">
                    <FormLabel>Проверять перед отправкой</FormLabel>
                    <FormDescription>
                      Сообщения не будут отправляться автоматически. Они появятся в поле ввода сообщения для вашего просмотра и ручной отправки.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="allChannels"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Все каналы</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {!form.watch('allChannels') && (
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
            <FormField
              control={form.control}
              name="allCategories"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Разрешить доступ ко всем категориям</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {!form.watch('allCategories') && (
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

            <FormField
              control={form.control}
              name="createTaskIfNoAnswer"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="flex-1">
                    <FormLabel>Создать задачу, если ответ не найден</FormLabel>
                    <FormDescription>
                      Автоматически создавать задачу в сделке CRM, если в базе знаний не найдена релевантная информация
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="noAnswerMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сообщение при отсутствии ответа</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="У меня недостаточно информации, чтобы ответить на этот вопрос. Я уточню детали и вернусь к вам."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Это сообщение будет показано, когда агент не сможет найти релевантную информацию в базе знаний.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={form.formState.isSubmitting}
          >
            Отмена
          </Button>
        </div>
      </form>
    </Form>
  )
}
