'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { ConversationsList } from './ConversationsList'
import { ChatInterface } from './ChatInterface'
import { NewConversationDialog } from './NewConversationDialog'
import { logger } from '@/lib/utils/logger'

interface TestChatClientProps {
  tenantId: string
}

export interface Agent {
  id: string
  name: string
  model: string | null
  instructions: string | null
}

export interface Conversation {
  id: string
  title: string
  agent_id: string | null
  created_at: string
  updated_at: string
  agents: Agent | null
}

export function TestChatClient({ tenantId }: TestChatClientProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false)

  // Fetch conversations
  const {
    data: conversationsData,
    isLoading: isLoadingConversations,
    error: conversationsError,
    refetch: refetchConversations,
  } = useQuery<{ conversations: Conversation[]; count: number }>({
    queryKey: ['test-conversations', tenantId],
    queryFn: async () => {
      const response = await fetch(`/api/manage/${tenantId}/test-chat/conversations`)
      if (!response.ok) {
        throw new Error('Failed to fetch conversations')
      }
      return response.json()
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  })

  // Fetch agents
  const { data: agentsData, isLoading: isLoadingAgents } = useQuery<{
    agents: Agent[]
    count: number
  }>({
    queryKey: ['test-chat-agents', tenantId],
    queryFn: async () => {
      const response = await fetch(`/api/manage/${tenantId}/test-chat/agents`)
      if (!response.ok) {
        throw new Error('Failed to fetch agents')
      }
      return response.json()
    },
  })

  const conversations = conversationsData?.conversations || []
  const agents = agentsData?.agents || []

  // Auto-select first conversation if none selected
  if (!selectedConversationId && conversations.length > 0) {
    setSelectedConversationId(conversations[0].id)
  }

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId)

  const handleConversationCreated = (conversationId: string) => {
    setIsNewConversationOpen(false)
    refetchConversations()
    setSelectedConversationId(conversationId)
  }

  const handleConversationDeleted = () => {
    refetchConversations()
    setSelectedConversationId(null)
  }

  if (conversationsError) {
    logger.error('Failed to load conversations', conversationsError)
  }

  return (
    <div className="flex h-full">
      {/* Sidebar with conversations list */}
      <div className="w-80 border-r border-gray-200 bg-gray-50">
        <ConversationsList
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
          onNewConversation={() => setIsNewConversationOpen(true)}
          isLoading={isLoadingConversations}
        />
      </div>

      {/* Main chat interface */}
      <div className="flex flex-1 flex-col">
        {selectedConversation ? (
          <ChatInterface
            tenantId={tenantId}
            conversation={selectedConversation}
            agents={agents}
            onConversationDeleted={handleConversationDeleted}
          />
        ) : (
          <EmptyState onNewConversation={() => setIsNewConversationOpen(true)} />
        )}
      </div>

      {/* New conversation dialog */}
      <NewConversationDialog
        tenantId={tenantId}
        agents={agents}
        isOpen={isNewConversationOpen}
        onClose={() => setIsNewConversationOpen(false)}
        onConversationCreated={handleConversationCreated}
        isLoadingAgents={isLoadingAgents}
      />
    </div>
  )
}

function EmptyState({ onNewConversation }: { onNewConversation: () => void }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No conversation selected</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new test chat.</p>
        <div className="mt-6">
          <button
            type="button"
            onClick={onNewConversation}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <svg
              className="-ml-0.5 mr-1.5 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            New Conversation
          </button>
        </div>
      </div>
    </div>
  )
}
