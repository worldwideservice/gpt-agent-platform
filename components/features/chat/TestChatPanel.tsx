'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2, Plus, Send } from 'lucide-react'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import { useTenant } from '@/components/providers/TenantProvider'

type ConversationItem = {
  id: string
  title: string | null
  updatedAt: string
  metadata?: Record<string, unknown>
}

type ChatMessageItem = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: string
}

type AgentOption = {
  id: string
  name: string
}

type AgentContextResponse = {
  companyKnowledge: string
  salesScripts: string
  objectionResponses: string
  knowledgeGraph: string
  vectorSearch: string
  agentMemory: string
  clientMemory: string
  instructions: string
}

type AiConfigurationResponse = {
  provider: string
  defaultModel?: string
  embeddingModel?: string
  baseUrl?: string
}

type ConversationsApiResponse = {
  id: string
  title: string | null
  updatedAt?: string | null
  updated_at?: string | null
  metadata?: Record<string, unknown>
}

export function TestChatPanel() {
  const { tenantId } = useTenant()
  const [conversations, setConversations] = useState<ConversationItem[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null)
  const [messages, setMessages] = useState<ChatMessageItem[]>([])
  const [agents, setAgents] = useState<AgentOption[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const [lastContext, setLastContext] = useState<AgentContextResponse | null>(
    null,
  )
  const [lastSystemPrompt, setLastSystemPrompt] = useState<string | null>(null)
  const [aiConfiguration, setAiConfiguration] =
    useState<AiConfigurationResponse | null>(null)

  const [loadingConversations, setLoadingConversations] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [loadingAgents, setLoadingAgents] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clientIdentifier = useMemo(
    () => `${tenantId ?? 'workspace'}-test-chat`,
    [tenantId],
  )

  const formatRelativeTime = useCallback((value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
      return '—'
    }

    const now = Date.now()
    const diffMinutes = Math.round((date.getTime() - now) / 60000)
    const formatter = new Intl.RelativeTimeFormat('ru', { numeric: 'auto' })

    if (Math.abs(diffMinutes) < 60) {
      return formatter.format(diffMinutes, 'minute')
    }

    const diffHours = Math.round(diffMinutes / 60)
    if (Math.abs(diffHours) < 24) {
      return formatter.format(diffHours, 'hour')
    }

    const diffDays = Math.round(diffHours / 24)
    if (Math.abs(diffDays) < 7) {
      return formatter.format(diffDays, 'day')
    }

    const diffWeeks = Math.round(diffDays / 7)
    if (Math.abs(diffWeeks) < 4) {
      return formatter.format(diffWeeks, 'week')
    }

    const diffMonths = Math.round(diffDays / 30)
    if (Math.abs(diffMonths) < 12) {
      return formatter.format(diffMonths, 'month')
    }

    const diffYears = Math.round(diffDays / 365)
    return formatter.format(diffYears, 'year')
  }, [])

  const loadAgents = useCallback(async () => {
    setLoadingAgents(true)
    setError(null)
    try {
      const response = await fetch('/api/agents?limit=50', {
        cache: 'no-store',
      })
      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Не удалось загрузить список агентов')
      }

      const agentList: AgentOption[] = payload.data.map(
        (agent: { id: string; name: string }) => ({
          id: agent.id,
          name: agent.name,
        }),
      )

      setAgents(agentList)
      setSelectedAgent((prev) => prev ?? agentList[0]?.id ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки агентов')
    } finally {
      setLoadingAgents(false)
    }
  }, [])

  const loadMessages = useCallback(async (conversationId: string) => {
    setLoadingMessages(true)
    setError(null)
    try {
      const response = await fetch(
        `/api/chat?conversationId=${encodeURIComponent(conversationId)}`,
        {
          cache: 'no-store',
        },
      )
      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Не удалось загрузить сообщения')
      }

      setMessages(payload.data?.messages ?? [])
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Ошибка получения сообщений',
      )
    } finally {
      setLoadingMessages(false)
    }
  }, [])

  const loadConversations = useCallback(async () => {
    setLoadingConversations(true)
    setError(null)
    try {
      const response = await fetch('/api/chat', { cache: 'no-store' })
      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Не удалось загрузить чаты')
      }

      const list: ConversationItem[] = (payload.data ?? []).map(
        (conversation: ConversationsApiResponse) => ({
          id: conversation.id,
          title: conversation.title,
          updatedAt:
            conversation.updatedAt ??
            conversation.updated_at ??
            new Date().toISOString(),
          metadata: conversation.metadata,
        }),
      )

      setConversations(list)
      return list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки чатов')
      return []
    } finally {
      setLoadingConversations(false)
    }
  }, [])

  const selectConversation = useCallback(
    async (conversationId: string | null) => {
      setSelectedConversationId(conversationId)
      setLastContext(null)
      setLastSystemPrompt(null)
      setAiConfiguration(null)
      if (!conversationId) {
        setMessages([])
        return
      }
      await loadMessages(conversationId)
    },
    [loadMessages],
  )

  useEffect(() => {
    const bootstrap = async () => {
      const [, convList] = await Promise.all([
        loadAgents(),
        loadConversations(),
      ])
      if (convList.length > 0) {
        await selectConversation(convList[0].id)
      }
    }

    void bootstrap()
  }, [loadAgents, loadConversations, selectConversation])

  const contextSections = useMemo(
    () =>
      lastContext
        ? (
            [
              { title: 'Инструкции агента', value: lastContext.instructions },
              { title: 'Знания компании', value: lastContext.companyKnowledge },
              { title: 'Скрипты продаж', value: lastContext.salesScripts },
              {
                title: 'Ответы на возражения',
                value: lastContext.objectionResponses,
              },
              {
                title: 'Связанные сущности',
                value: lastContext.knowledgeGraph,
              },
              {
                title: 'Контекст из документов',
                value: lastContext.vectorSearch,
              },
              { title: 'Память агента', value: lastContext.agentMemory },
              { title: 'Память клиента', value: lastContext.clientMemory },
            ] as Array<{ title: string; value: string }>
          ).filter(
            (section) => section.value && section.value.trim().length > 0,
          )
        : [],
    [lastContext],
  )

  const handleNewChat = () => {
    setSelectedConversationId(null)
    setMessages([])
    setError(null)
    setLastContext(null)
    setLastSystemPrompt(null)
    setAiConfiguration(null)
  }

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedAgent) {
      setError('Выберите агента ИИ')
      return
    }

    if (!messageText.trim()) {
      setError('Введите сообщение')
      return
    }

    setSending(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversationId ?? undefined,
          agentId: selectedAgent,
          message: messageText.trim(),
          useKnowledgeBase: true,
          clientIdentifier,
        }),
      })

      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Не удалось отправить сообщение')
      }

      setLastContext(payload.data?.context ?? null)
      setLastSystemPrompt(payload.data?.systemPrompt ?? null)
      setAiConfiguration(payload.data?.configuration ?? null)

      const conversationId = payload.data?.conversationId
      if (conversationId) {
        const conversationList = await loadConversations()
        await selectConversation(conversationId)
        if (
          !conversationList.some(
            (conversation) => conversation.id === conversationId,
          )
        ) {
          setConversations((prev) => [
            ...prev,
            {
              id: conversationId,
              title: null,
              updatedAt: new Date().toISOString(),
            },
          ])
        }
      }

      setMessageText('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка отправки')
    } finally {
      setSending(false)
    }
  }

  const selectedConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === selectedConversationId,
      ) ?? null,
    [conversations, selectedConversationId],
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
      <Card className="order-2 lg:order-1">
        <CardHeader className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Чаты</CardTitle>
            <CardDescription>Раздел тестирования диалогов</CardDescription>
          </div>
          <Button
            onClick={handleNewChat}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Новый чат
          </Button>
        </CardHeader>
        <CardContent
          className="flex flex-col gap-2 overflow-y-auto"
          style={{ maxHeight: '60vh' }}
        >
          {loadingConversations && (
            <p className="text-sm text-gray-500">
              <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
              Загрузка чатов…
            </p>
          )}
          {!loadingConversations && conversations.length === 0 && (
            <p className="text-sm text-gray-500">
              Пока нет чатов. Нажмите «Новый чат», чтобы начать.
            </p>
          )}
          {!loadingConversations &&
            conversations.map((conversation) => {
              const isSelected = conversation.id === selectedConversationId
              const preview =
                typeof conversation.metadata?.preview === 'string'
                  ? conversation.metadata.preview
                  : (conversation.title ?? 'Новый чат')
              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => void selectConversation(conversation.id)}
                  className={cn(
                    'w-full rounded-lg px-3 py-2 text-left text-sm transition',
                    isSelected
                      ? 'bg-primary/10 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{preview}</span>
                    <span className="text-[11px] text-gray-400">
                      {formatRelativeTime(conversation.updatedAt)}
                    </span>
                  </div>
                </button>
              )
            })}
        </CardContent>
      </Card>

      <Card className="order-1 lg:order-2 flex flex-col">
        <CardHeader>
          <CardTitle>
            {selectedConversation
              ? (selectedConversation.title ?? 'Диалог')
              : 'Тестовый чат'}
          </CardTitle>
          <CardDescription>
            {selectedConversation
              ? `Последнее обновление ${formatRelativeTime(selectedConversation.updatedAt)}`
              : 'Выберите чат или создайте новый'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto border-y border-dashed border-gray-200 py-4 dark:border-gray-800">
          {error && <p className="text-sm text-rose-500">{error}</p>}
          {loadingMessages && (
            <p className="text-sm text-gray-500">
              <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
              Загрузка сообщений…
            </p>
          )}
          {!loadingMessages && messages.length === 0 && (
            <p className="text-sm text-gray-500">
              Сообщения появятся после отправки первого сообщения.
            </p>
          )}
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'rounded-xl p-3 text-sm',
                  msg.role === 'user'
                    ? 'bg-primary/10 self-end text-primary-800'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-100',
                )}
              >
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {msg.role === 'user' ? 'Вы' : 'Агент'}
                </p>
                <p>{msg.content}</p>
                <span className="text-[11px] text-gray-400">
                  {new Date(msg.createdAt).toLocaleString('ru-RU')}
                </span>
              </div>
            ))}
          </div>
          {(aiConfiguration ||
            contextSections.length > 0 ||
            lastSystemPrompt) && (
            <div className="space-y-3 rounded-lg border border-dashed border-gray-200 p-3 text-xs text-gray-600 dark:border-gray-800 dark:text-gray-300">
              {aiConfiguration && (
                <div className="space-y-1">
                  <p className="font-semibold uppercase tracking-wide text-[11px] text-gray-500 dark:text-gray-400">
                    Конфигурация ИИ
                  </p>
                  <dl className="grid gap-1 sm:grid-cols-2">
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-gray-500">Провайдер</dt>
                      <dd className="font-medium text-gray-800 dark:text-gray-100">
                        {aiConfiguration.provider}
                      </dd>
                    </div>
                    {aiConfiguration.defaultModel && (
                      <div className="flex items-center justify-between gap-2">
                        <dt className="text-gray-500">Модель по умолчанию</dt>
                        <dd className="font-medium text-gray-800 dark:text-gray-100">
                          {aiConfiguration.defaultModel}
                        </dd>
                      </div>
                    )}
                    {aiConfiguration.embeddingModel && (
                      <div className="flex items-center justify-between gap-2">
                        <dt className="text-gray-500">Модель эмбеддингов</dt>
                        <dd className="font-medium text-gray-800 dark:text-gray-100">
                          {aiConfiguration.embeddingModel}
                        </dd>
                      </div>
                    )}
                    {aiConfiguration.baseUrl && (
                      <div className="flex items-center justify-between gap-2 sm:col-span-2">
                        <dt className="text-gray-500">Базовый URL</dt>
                        <dd className="font-medium text-gray-800 dark:text-gray-100 break-all">
                          {aiConfiguration.baseUrl}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}

              {lastSystemPrompt && (
                <details className="rounded-md border border-dashed border-gray-200 p-2 dark:border-gray-700">
                  <summary className="cursor-pointer font-semibold text-gray-700 dark:text-gray-200">
                    Системный промпт
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap break-words text-[11px] text-gray-600 dark:text-gray-300">
                    {lastSystemPrompt}
                  </pre>
                </details>
              )}

              {contextSections.length > 0 && (
                <div className="space-y-2">
                  <p className="font-semibold uppercase tracking-wide text-[11px] text-gray-500 dark:text-gray-400">
                    Контекст ответа
                  </p>
                  {contextSections.map((section, index) => (
                    <details
                      key={`${section.title}-${index}`}
                      className="rounded-md border border-dashed border-gray-200 p-2 dark:border-gray-700"
                      {...(index === 0 ? { open: true } : {})}
                    >
                      <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-200">
                        {section.title}
                      </summary>
                      <pre className="mt-2 whitespace-pre-wrap break-words text-[11px] text-gray-600 dark:text-gray-300">
                        {section.value}
                      </pre>
                    </details>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSend} className="space-y-3 w-full">
            <div className="space-y-1">
              <Label htmlFor="test-chat-agent">Агент ИИ</Label>
              <Select
                value={selectedAgent ?? ''}
                onValueChange={(value) => setSelectedAgent(value)}
              >
                <SelectTrigger id="test-chat-agent">
                  <SelectValue
                    placeholder={
                      loadingAgents ? 'Загрузка агентов…' : 'Выберите агента'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {agents.length === 0 && (
                <p className="text-xs text-gray-500">
                  Добавьте агента в разделе «Агенты ИИ».
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="test-chat-message">Сообщение</Label>
              <Textarea
                id="test-chat-message"
                rows={4}
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                placeholder="Введите сообщение здесь..."
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <Button
                type="submit"
                disabled={sending || !messageText.trim() || !selectedAgent}
              >
                {sending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Отправляем…
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Отправить
                  </>
                )}
              </Button>
              <span className="text-xs text-gray-500">
                Используется идентификатор:{' '}
                <span className="font-mono">{clientIdentifier}</span>
              </span>
            </div>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
