'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import type { Agent } from './TestChatClient'
import { logger } from '@/lib/utils/logger'

interface NewConversationDialogProps {
  tenantId: string
  agents: Agent[]
  isOpen: boolean
  onClose: () => void
  onConversationCreated: (conversationId: string) => void
  isLoadingAgents: boolean
}

export function NewConversationDialog({
  tenantId,
  agents,
  isOpen,
  onClose,
  onConversationCreated,
  isLoadingAgents,
}: NewConversationDialogProps) {
  const [title, setTitle] = useState('')
  const [selectedAgentId, setSelectedAgentId] = useState<string>('')

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/manage/${tenantId}/test-chat/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || 'New Test Chat',
          agentId: selectedAgentId || null,
        }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create conversation')
      }
      return response.json()
    },
    onSuccess: (data) => {
      onConversationCreated(data.conversation.id)
      setTitle('')
      setSelectedAgentId('')
    },
    onError: (error) => {
      logger.error('Failed to create conversation', error)
      alert('Failed to create conversation. Please try again.')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (agents.length === 0) {
      alert('No agents available. Please create an agent first.')
      return
    }
    createConversationMutation.mutate()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Dialog */}
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                New Test Conversation
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Create a new conversation to test your AI agent.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 sm:mt-6">
            <div className="space-y-4">
              {/* Title input */}
              <div>
                <label htmlFor="conversation-title" className="block text-sm font-medium text-gray-700">
                  Conversation Title (optional)
                </label>
                <input
                  type="text"
                  id="conversation-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Testing lead qualification"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  maxLength={255}
                />
              </div>

              {/* Agent selector */}
              <div>
                <label htmlFor="conversation-agent" className="block text-sm font-medium text-gray-700">
                  Select Agent
                </label>
                {isLoadingAgents ? (
                  <div className="mt-1 h-10 animate-pulse rounded-md bg-gray-200" />
                ) : agents.length === 0 ? (
                  <div className="mt-1 rounded-md border border-yellow-200 bg-yellow-50 p-3">
                    <p className="text-sm text-yellow-800">
                      No agents available. Please create an agent first.
                    </p>
                  </div>
                ) : (
                  <select
                    id="conversation-agent"
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select an agent...</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name}
                        {agent.model && ` (${agent.model})`}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="submit"
                disabled={createConversationMutation.isPending || agents.length === 0}
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed sm:col-start-2"
              >
                {createConversationMutation.isPending ? (
                  <>
                    <svg
                      className="-ml-1 mr-2 h-5 w-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
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
                    Creating...
                  </>
                ) : (
                  'Create'
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={createConversationMutation.isPending}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 sm:col-start-1 sm:mt-0"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
