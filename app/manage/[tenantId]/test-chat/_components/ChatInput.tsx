'use client'

import { useState, KeyboardEvent } from 'react'
import { Send } from 'lucide-react'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'

interface Agent {
  id: string
  name: string
  status: 'active' | 'inactive' | 'draft'
}

interface ChatInputProps {
  agents: Agent[]
  selectedAgentId: string | null
  onAgentChange: (agentId: string | null) => void
  onSendMessage: (message: string, agentId: string | null) => void
  disabled?: boolean
}

export const ChatInput = ({
  agents,
  selectedAgentId,
  onAgentChange,
  onSendMessage,
  disabled,
}: ChatInputProps) => {
  const [message, setMessage] = useState('')

  const activeAgents = agents.filter((agent) => agent.status === 'active')

  const handleSend = () => {
    if (!message.trim() || disabled) return

    if (!selectedAgentId && activeAgents.length > 0) {
      // Автоматически выберем первого активного агента если не выбран
      onAgentChange(activeAgents[0].id)
      onSendMessage(message.trim(), activeAgents[0].id)
    } else {
      onSendMessage(message.trim(), selectedAgentId)
    }

    setMessage('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="mx-auto max-w-4xl">
        {/* Agent Selector */}
        <div className="mb-3">
          <Select
            value={selectedAgentId || ''}
            onValueChange={(value) => onAgentChange(value || null)}
            disabled={disabled || activeAgents.length === 0}
            options={[
              { value: '', label: 'Выберите агента ИИ' },
              ...activeAgents.map((agent) => ({ value: agent.id, label: agent.name })),
            ]}
            placeholder="Выберите агента ИИ"
          />
          {activeAgents.length === 0 && (
            <p className="mt-1 text-xs text-gray-500">
              Нет активных агентов. Создайте агента в разделе AI Agents.
            </p>
          )}
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите сообщение здесь... (Enter для отправки, Shift+Enter для новой строки)"
            disabled={disabled || !selectedAgentId}
            rows={3}
            className="min-h-[80px] resize-none"
          />
          <Button
            onClick={handleSend}
            disabled={disabled || !message.trim() || !selectedAgentId}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

