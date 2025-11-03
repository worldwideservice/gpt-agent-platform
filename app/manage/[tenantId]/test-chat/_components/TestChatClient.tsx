'use client'

import { useEffect, useState } from 'react'
import { ChatSidebar } from './ChatSidebar'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'
import type { Conversation, ChatMessage } from '@/lib/repositories/conversations'

interface Agent {
  id: string
  name: string
  status: 'active' | 'inactive' | 'draft'
}

export const TestChatClient = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Загрузка conversations и agents
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Загружаем conversations и agents параллельно
        const [conversationsRes, agentsRes] = await Promise.all([
          fetch('/api/chat/conversations'),
          fetch('/api/agents?status=active&limit=100'),
        ])

        if (conversationsRes.ok) {
          const conversationsData = await conversationsRes.json()
          if (conversationsData.success) {
            setConversations(conversationsData.data.conversations)
          }
        }

        if (agentsRes.ok) {
          const agentsData = await agentsRes.json()
          if (agentsData.success) {
            setAgents(agentsData.data.agents)
          }
        }
      } catch (err) {
        console.error('Failed to load data:', err)
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Загрузка сообщений при выборе conversation
  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([])
      return
    }

    const loadMessages = async () => {
      try {
        const response = await fetch(`/api/chat?conversationId=${selectedConversationId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data?.messages) {
            // GET /api/chat возвращает { success: true, data: { messages: [...], conversationId: ... } }
            setMessages(data.data.messages)
          } else if (data.success && Array.isArray(data.data)) {
            // Fallback: если формат старый (массив напрямую)
            setMessages(data.data)
          }
        }
      } catch (err) {
        console.error('Failed to load messages:', err)
      }
    }

    loadMessages()
  }, [selectedConversationId])

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId)
    const conversation = conversations.find((c) => c.id === conversationId)
    if (conversation?.agentId) {
      setSelectedAgentId(conversation.agentId)
    }
  }

  const handleCreateNew = () => {
    setSelectedConversationId(null)
    setMessages([])
    setSelectedAgentId(null)
  }

  const handleSendMessage = async (messageText: string, agentId: string | null) => {
    if (!messageText.trim() || !agentId) return

    try {
      setSending(true)
      setError(null)

      // Отправляем сообщение
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversationId || undefined,
          agentId,
          message: messageText,
          useKnowledgeBase: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Не удалось отправить сообщение')
      }

      const data = await response.json()

      if (data.success && data.data) {
        const conversationId = data.data.conversationId

        // Добавляем сообщение пользователя
        const userMessage: ChatMessage = {
          id: `temp-user-${Date.now()}`,
          conversationId,
          role: 'user',
          content: messageText,
          createdAt: new Date().toISOString(),
        }

        // Добавляем ответ агента (если есть)
        if (data.data.message) {
          const assistantMessage: ChatMessage = {
            id: data.data.message.id || `temp-assistant-${Date.now()}`,
            conversationId,
            role: 'assistant',
            content: data.data.message.content || data.data.message,
            createdAt: data.data.message.createdAt || new Date().toISOString(),
          }
          setMessages((prev) => [...prev, userMessage, assistantMessage])
        } else {
          // Только пользовательское сообщение (ответ придет позже)
          setMessages((prev) => [...prev, userMessage])
        }

        // Обновляем или создаем conversation
        if (data.data.conversationId !== selectedConversationId) {
          setSelectedConversationId(data.data.conversationId)
          // Перезагружаем список conversations
          const conversationsRes = await fetch('/api/chat/conversations')
          if (conversationsRes.ok) {
            const conversationsData = await conversationsRes.json()
            if (conversationsData.success) {
              setConversations(conversationsData.data.conversations)
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to send message:', err)
      setError(err instanceof Error ? err.message : 'Ошибка отправки сообщения')
    } finally {
      setSending(false)
    }
  }

  if (error && !loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <p className="font-semibold">Ошибка загрузки чата</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 shrink-0">
          <ChatSidebar
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
            onCreateNew={handleCreateNew}
            loading={loading}
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-1 flex-col bg-white">
          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            {selectedConversationId || messages.length > 0 ? (
              <ChatMessages messages={messages} loading={sending} />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-900">Выберите чат или начните новый</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Выберите агента и отправьте первое сообщение
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <ChatInput
            agents={agents}
            selectedAgentId={selectedAgentId}
            onAgentChange={setSelectedAgentId}
            onSendMessage={handleSendMessage}
            disabled={sending}
          />
        </div>
      </div>
    </div>
  )
}

