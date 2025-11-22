'use client'

import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

import type { Conversation } from './TestChatClient'

interface ConversationsListProps {
  conversations: Conversation[]
  selectedConversationId: string | null
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
  isLoading: boolean
}

export function ConversationsList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onNewConversation,
  isLoading,
}: ConversationsListProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Test Chat</h2>
          <button
            type="button"
            onClick={onNewConversation}
            className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            title="New conversation"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4">
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-200" />
              ))}
            </div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">No conversations yet</p>
              <button
                type="button"
                onClick={onNewConversation}
                className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Create your first chat
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`w-full rounded-lg p-3 text-left transition-colors ${
                  selectedConversationId === conversation.id
                    ? 'bg-blue-50 ring-2 ring-blue-500'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {conversation.title}
                    </p>
                    {conversation.agents && (
                      <p className="mt-1 truncate text-xs text-gray-500">
                        {conversation.agents.name}
                        {conversation.agents.model && (
                          <span className="ml-1 text-gray-400">
                            ({conversation.agents.model})
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {formatDistanceToNow(new Date(conversation.updated_at), {
                    addSuffix: true,
                    locale: ru,
                  })}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
