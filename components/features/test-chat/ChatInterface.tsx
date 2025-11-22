'use client'

import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

import type { Conversation, Agent } from './TestChatClient'
import { logger } from '@/lib/utils/logger'

interface ChatInterfaceProps {
  tenantId: string
  conversation: Conversation
  agents: Agent[]
  onConversationDeleted: () => void
}

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
  metadata?: {
    agent_id?: string
    agent_name?: string
    model?: string
    tokens_used?: number
    simulated?: boolean
  }
}

export function ChatInterface({
  tenantId,
  conversation,
  agents,
  onConversationDeleted,
}: ChatInterfaceProps) {
  const [messageInput, setMessageInput] = useState('')
  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    conversation.agent_id || agents[0]?.id || ''
  )
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  // Fetch messages
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    error: messagesError,
  } = useQuery<{ messages: Message[]; count: number }>({
    queryKey: ['test-messages', tenantId, conversation.id],
    queryFn: async () => {
      const response = await fetch(
        `/api/manage/${tenantId}/test-chat/conversations/${conversation.id}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }
      return response.json()
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  })

  const messages = messagesData?.messages || []

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(
        `/api/manage/${tenantId}/test-chat/conversations/${conversation.id}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, agentId: selectedAgentId }),
        }
      )
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send message')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['test-messages', tenantId, conversation.id] })
      queryClient.invalidateQueries({ queryKey: ['test-conversations', tenantId] })
      setMessageInput('')
    },
    onError: (error) => {
      logger.error('Failed to send message', error)
    },
  })

  // Delete conversation mutation
  const deleteConversationMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/api/manage/${tenantId}/test-chat/conversations/${conversation.id}`,
        { method: 'DELETE' }
      )
      if (!response.ok) {
        throw new Error('Failed to delete conversation')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['test-conversations', tenantId] })
      onConversationDeleted()
    },
  })

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !selectedAgentId) return
    sendMessageMutation.mutate(messageInput.trim())
  }

  const handleDeleteConversation = () => {
    if (confirm('Are you sure you want to delete this conversation?')) {
      deleteConversationMutation.mutate()
    }
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  if (messagesError) {
    logger.error('Failed to load messages', messagesError)
  }

  const selectedAgent = agents.find((a) => a.id === selectedAgentId)

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{conversation.title}</h2>
            {conversation.agents && (
              <p className="text-sm text-gray-500">
                {conversation.agents.name}
                {conversation.agents.model && (
                  <span className="ml-1 text-gray-400">({conversation.agents.model})</span>
                )}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleDeleteConversation}
            disabled={deleteConversationMutation.isPending}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600 disabled:opacity-50"
            title="Delete conversation"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        {isLoadingMessages ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-200" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSendMessage} className="space-y-3">
          {/* Agent selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="agent-select" className="text-sm font-medium text-gray-700">
              Agent:
            </label>
            <select
              id="agent-select"
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} {agent.model ? `(${agent.model})` : ''}
                </option>
              ))}
            </select>
            {selectedAgent?.instructions && (
              <span className="text-xs text-gray-400" title={selectedAgent.instructions}>
                ℹ️ Has instructions
              </span>
            )}
          </div>

          {/* Message input */}
          <div className="flex gap-2">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
              placeholder="Type your message... (Shift+Enter for new line)"
              rows={3}
              className="flex-1 resize-none rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              disabled={sendMessageMutation.isPending}
            />
            <button
              type="submit"
              disabled={!messageInput.trim() || !selectedAgentId || sendMessageMutation.isPending}
              className="self-end rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sendMessageMutation.isPending ? (
                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isUser ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
        }`}
      >
        <div className="whitespace-pre-wrap break-words text-sm">{message.content}</div>
        <div
          className={`mt-1 flex items-center gap-2 text-xs ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          <span>
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true, locale: ru })}
          </span>
          {message.metadata?.simulated && (
            <span className="rounded bg-yellow-100 px-1.5 py-0.5 text-yellow-800">Simulated</span>
          )}
          {message.metadata?.tokens_used && (
            <span>{message.metadata.tokens_used} tokens</span>
          )}
        </div>
      </div>
    </div>
  )
}
