'use client'

import { useCallback, useEffect, useState } from 'react'
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

interface ChatPageProps {
  params: Promise<{ tenantId: string }>
}

const ChatPage = ({ params }: ChatPageProps) => {
  const [resolvedParams, setResolvedParams] = useState<{ tenantId: string } | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgentId, setSelectedAgentId] = useState<string>('')
  const [messageValue, setMessageValue] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

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
          data: {
            messages: ChatMessage[]
          }
        }

        if (payload.success) {
          setMessages(payload.data.messages)
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

  useEffect(() => {
    if (selectedConversationId) {
      fetchMessages(selectedConversationId)
    } else {
      setMessages([])
    }
  }, [selectedConversationId, fetchMessages])

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
        if (!selectedConversationId) {
          setSelectedConversationId(payload.data.conversationId)
        }

        // Добавляем ответ агента
        const agentMessage: ChatMessage = {
          id: `agent-${Date.now()}`,
          role: 'assistant',
          content: payload.data.message,
          createdAt: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, agentMessage])

        // Обновляем список диалогов
        await fetchConversations()
      }
    } catch (err) {
      console.error('Failed to send message', err)
      setError(err instanceof Error ? err.message : 'Не удалось отправить сообщение')
    } finally {
      setIsSending(false)
    }
  }, [messageValue, isSending, selectedConversationId, selectedAgentId, fetchConversations])

  if (!resolvedParams) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col gap-4 lg:flex-row">
      {/* Боковая панель с диалогами */}
      <div className="flex w-full flex-col gap-4 lg:w-80">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Диалоги</h2>
          <KwidButton variant="outline" size="sm" onClick={handleNewChat}>
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            Новый
          </KwidButton>
        </div>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        ) : (
          <div className="flex-1 space-y-2 overflow-y-auto rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
            {conversations.length === 0 ? (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">Нет диалогов</p>
            ) : (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => setSelectedConversationId(conversation.id)}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    selectedConversationId === conversation.id
                      ? 'border-custom-500 bg-custom-50 dark:border-custom-400 dark:bg-custom-900/20'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-gray-800 dark:bg-gray-800 dark:hover:border-gray-700'
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {conversation.title || 'Новый диалог'}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(conversation.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Основная область чата */}
      <div className="flex flex-1 flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-4 border-b border-gray-200 pb-4 dark:border-gray-800">
          <Bot className="h-6 w-6 text-custom-600 dark:text-custom-400" />
          <div className="flex-1">
            {/* Kwid: Заголовок "Test Chat" */}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Test Chat</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Протестируйте работу агента</p>
          </div>
          <div className="w-48">
            <KwidSelect
              label="Агент"
              value={selectedAgentId}
              onChange={(value) => setSelectedAgentId(value)}
              options={agents.map((agent) => ({
                value: agent.id,
                label: agent.name,
              }))}
            />
          </div>
        </div>

        {/* Область сообщений */}
        <div className="flex-1 space-y-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Bot className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Начните новый диалог с агентом
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-custom-100 text-custom-700 dark:bg-custom-900/30 dark:text-custom-400">
                    <Bot className="h-5 w-5" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-custom-600 text-white dark:bg-custom-500'
                      : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="mt-1 text-xs opacity-70">
                    {new Date(message.createdAt).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Поле ввода */}
        <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
          <div className="flex gap-2">
            <KwidTextarea
              placeholder="Введите сообщение..."
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              rows={3}
              className="flex-1"
            />
            <KwidButton
              variant="primary"
              size="md"
              onClick={handleSend}
              disabled={!messageValue.trim() || isSending}
              className="self-end"
            >
              {isSending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </KwidButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage

