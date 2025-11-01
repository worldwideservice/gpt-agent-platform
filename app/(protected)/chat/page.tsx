'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Bot, Loader2, MessageSquarePlus, Send, User } from 'lucide-react'

import { KwidButton, KwidSelect, KwidTextarea } from '@/components/kwid'

interface Conversation {
  id: string
  title: string | null
  agentId: string | null
  createdAt: string
  updatedAt: string
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

interface Agent {
  id: string
  name: string
}

const ChatPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgentId, setSelectedAgentId] = useState<string>('')
  const [messageValue, setMessageValue] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Загружаем список агентов
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/agents')
        if (response.ok) {
          const payload = (await response.json()) as {
            success: boolean
            data: Agent[]
          }

          if (payload.success) {
            setAgents(payload.data)
            if (payload.data.length > 0) {
              setSelectedAgentId(payload.data[0].id)
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch agents', err)
      }
    }

    fetchAgents()
  }, [])

  // Загружаем список диалогов
  const fetchConversations = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/chat')
      if (!response.ok) {
        throw new Error('Не удалось загрузить диалоги')
      }

      const payload = (await response.json()) as {
        success: boolean
        data: Conversation[]
      }

      if (payload.success) {
        setConversations(payload.data)
      }
    } catch (err) {
      console.error('Failed to fetch conversations', err)
      setError('Не удалось загрузить диалоги')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  // Загружаем сообщения выбранного диалога
  const fetchMessages = useCallback(
    async (conversationId: string) => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/chat?conversationId=${conversationId}`)
        if (!response.ok) {
          throw new Error('Не удалось загрузить сообщения')
        }

        const payload = (await response.json()) as {
          success: boolean
          data: ChatMessage[]
        }

        if (payload.success) {
          const formattedMessages = payload.data.map((msg) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            createdAt: msg.createdAt,
          }))

          setMessages(formattedMessages)
        }
      } catch (err) {
        console.error('Failed to fetch messages', err)
        setError('Не удалось загрузить сообщения')
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  // Обработчик открытия диалога
  const handleOpenConversation = useCallback(
    (conversationId: string) => {
      setSelectedConversationId(conversationId)
      fetchMessages(conversationId)
    },
    [fetchMessages],
  )

  // Обработчик создания нового чата
  const handleNewChat = useCallback(() => {
    setSelectedConversationId(null)
    setMessages([])
    setMessageValue('')
  }, [])

  // Обработчик отправки сообщения
  const handleSend = useCallback(async () => {
    if (!messageValue.trim() || isSending) {
      return
    }

    const messageToSend = messageValue.trim()
    setMessageValue('')
    setIsSending(true)
    setError(null)

    // Добавляем сообщение пользователя в UI сразу
    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: messageToSend,
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: selectedConversationId,
          agentId: selectedAgentId || undefined,
          message: messageToSend,
          useKnowledgeBase: true,
        }),
      })

      if (!response.ok) {
        const errorData = (await response.json()) as { success: boolean; error?: string }
        throw new Error(errorData.error || 'Не удалось отправить сообщение')
      }

      const payload = (await response.json()) as {
        success: boolean
        data: {
          conversationId: string
          message: string
        }
      }

      if (payload.success) {
        // Обновляем conversationId, если это был новый диалог
        if (!selectedConversationId && payload.data.conversationId) {
          setSelectedConversationId(payload.data.conversationId)
          await fetchConversations()
        }

        // Добавляем ответ агента
        const assistantMessage: ChatMessage = {
          id: `temp-assistant-${Date.now()}`,
          role: 'assistant',
          content: payload.data.message,
          createdAt: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, assistantMessage])

        // Обновляем список диалогов
        await fetchConversations()
      }
    } catch (err) {
      console.error('Failed to send message', err)
      setError(err instanceof Error ? err.message : 'Не удалось отправить сообщение')

      // Удаляем временное сообщение пользователя при ошибке
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id))
    } finally {
      setIsSending(false)
    }
  }, [messageValue, selectedConversationId, selectedAgentId, fetchConversations, isSending])

  const agentOptions = useMemo(() => {
    return agents.map((agent) => ({
      value: agent.id,
      label: agent.name,
    }))
  }, [agents])

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp)

    if (Number.isNaN(date.getTime())) {
      return '—'
    }

    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) {
      return 'Только что'
    }

    if (diffMins < 60) {
      return `${diffMins} мин. назад`
    }

    if (diffHours < 24) {
      return `${diffHours} ч. назад`
    }

    if (diffDays < 7) {
      return `${diffDays} дн. назад`
    }

    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const selectedConversationTitle = useMemo(() => {
    if (!selectedConversationId) {
      return null
    }

    const conversation = conversations.find((c) => c.id === selectedConversationId)
    return conversation?.title ?? 'Без названия'
  }, [selectedConversationId, conversations])

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr] xl:grid-cols-[400px_1fr]">
      {/* Боковая панель с диалогами */}
      <aside className="rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Чаты</h2>
          <KwidButton variant="outline" size="sm" className="gap-2" onClick={handleNewChat}>
            <MessageSquarePlus className="h-4 w-4" /> Новый чат
          </KwidButton>
        </div>
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto px-4 py-3">
          {isLoading && conversations.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400 dark:text-gray-500" />
            </div>
          ) : error && conversations.length === 0 ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          ) : conversations.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">Нет диалогов</div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => {
                const isActive = selectedConversationId === conversation.id

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => handleOpenConversation(conversation.id)}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                      isActive
                        ? 'border-custom-200 bg-custom-50 text-custom-700 dark:border-custom-800 dark:bg-custom-900/20 dark:text-custom-400'
                        : 'border-transparent bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700'
                    }`}
                  >
                    <p className="font-medium">{conversation.title ?? 'Без названия'}</p>
                    <p className="mt-2 text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                      {formatTime(conversation.updatedAt)}
                    </p>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </aside>

      {/* Основная область чата */}
      <section className="flex h-[calc(100vh-224px)] flex-col rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
        <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              <Bot className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {selectedConversationTitle ?? 'Новый чат'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Выберите агента и протестируйте поведение в реальном времени
              </p>
            </div>
          </div>
          {agentOptions.length > 0 && (
            <div className="w-64">
              <KwidSelect
                label="Выберите агента ИИ"
                value={selectedAgentId}
                onChange={(value: string) => setSelectedAgentId(value)}
                options={agentOptions}
              />
            </div>
          )}
        </header>

        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            {isLoading && messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-gray-400 dark:text-gray-500">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm font-medium">Загрузка...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-gray-400 dark:text-gray-500">
                <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800" />
                <p className="text-sm font-medium">
                  Выберите чат или начните новый
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse text-right' : ''
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        message.role === 'assistant'
                          ? 'bg-custom-100 text-custom-600 dark:bg-custom-900/20 dark:text-custom-400'
                          : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <Bot className="h-5 w-5" />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </div>
                    <div
                      className={`max-w-xl rounded-xl border px-4 py-3 text-sm ${
                        message.role === 'user'
                          ? 'bg-custom-50 border-custom-200 text-custom-700 dark:bg-custom-900/20 dark:border-custom-800 dark:text-custom-400'
                          : 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">{formatTime(message.createdAt)}</p>
                    </div>
                  </div>
                ))}
                {isSending && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-custom-100 text-custom-600 dark:bg-custom-900/20 dark:text-custom-400">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <footer className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
            <div className="flex items-center gap-3">
              {agentOptions.length > 0 && (
                <KwidSelect
                  label=" "
                  aria-label="Выберите агента"
                  className="w-60"
                  value={selectedAgentId}
                  onChange={(value: string) => setSelectedAgentId(value)}
                  options={agentOptions}
                />
              )}
              <KwidTextarea
                value={messageValue}
                onChange={(event) => setMessageValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Введите сообщение здесь..."
                rows={2}
                disabled={isSending || !selectedAgentId}
                className="flex-1 resize-none"
              />
              <KwidButton
                onClick={handleSend}
                disabled={!messageValue.trim() || isSending || !selectedAgentId}
                variant="primary"
                size="md"
                className="h-[52px] w-36 gap-2"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}{' '}
                Отправить
              </KwidButton>
            </div>
          </footer>
        </div>
      </section>
    </div>
  )
}

export default ChatPage
