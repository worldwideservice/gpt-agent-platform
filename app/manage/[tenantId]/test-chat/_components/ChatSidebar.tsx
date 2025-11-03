'use client'

import { useEffect, useState } from 'react'
import { Plus, MessageSquare } from 'lucide-react'
import type { Conversation } from '@/lib/repositories/conversations'

interface ChatSidebarProps {
  conversations: Conversation[]
  selectedConversationId: string | null
  onSelectConversation: (conversationId: string) => void
  onCreateNew: () => void
  loading?: boolean
}

const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Только что'
  if (diffMins < 60) return `${diffMins} мин. назад`
  if (diffHours < 24) return `${diffHours} ч. назад`
  if (diffDays < 30) return `${diffDays} дн. назад`
  return date.toLocaleDateString('ru-RU')
}

export const ChatSidebar = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onCreateNew,
  loading,
}: ChatSidebarProps) => {
  return (
    <div className="flex h-full flex-col border-r border-gray-200 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-900">Чаты</h2>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Новый чат
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400" />
            <p className="mt-4 text-sm text-gray-500">Нет чатов</p>
            <p className="mt-2 text-xs text-gray-400">Создайте новый чат для начала</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map((conversation) => {
              const isSelected = conversation.id === selectedConversationId
              const preview = conversation.title || 'Новый чат'

              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
                    isSelected
                      ? 'bg-primary-50 text-primary-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-sm font-medium ${
                          isSelected ? 'text-primary-900' : 'text-gray-900'
                        }`}
                      >
                        {preview}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {formatRelativeTime(conversation.updatedAt)}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

