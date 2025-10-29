'use client'

import { useMemo, useState } from 'react'
import { Bot, LayoutList, MessageSquarePlus, Send, User } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'

interface ChatPreview {
  id: string
  title: string
  excerpt: string
  lastActivity: string
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const mockChats: ChatPreview[] = [
  {
    id: 'chat-1',
    title: 'Thank you for your interest! A person…',
    excerpt: 'Thank you for your interest! A personal consultant will contact you shortly.',
    lastActivity: '3 месяца назад',
  },
]

const mockMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: 'Thank you for your interest! A personal consultant will contact you shortly.',
    timestamp: '3 месяца назад',
  },
]

const agents = [
  { value: 'ai-assistant', label: 'AI ассистент' },
  { value: 'immigration', label: 'Assistant Immigration Advisor World Wide Services' },
]

const ChatPage = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [messageValue, setMessageValue] = useState('')

  const selectedChatMessages = useMemo(() => {
    if (!selectedChatId) {
      return []
    }
    return mockMessages
  }, [selectedChatId])

  const handleOpenChat = (chatId: string) => {
    setSelectedChatId(chatId)
  }

  const handleNewChat = () => {
    setSelectedChatId('new')
  }

  const handleSend = () => {
    if (!messageValue.trim()) {
      return
    }
    setMessageValue('')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr] xl:grid-cols-[400px_1fr]">
      <aside className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Чаты</h2>
          <Button variant="outline" className="gap-2 text-sm" onClick={handleNewChat}>
            <MessageSquarePlus className="h-4 w-4" /> Новый чат
          </Button>
        </div>
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto px-4 py-3">
          <div className="space-y-2">
            {mockChats.map((chat) => {
              const isActive = selectedChatId === chat.id
              return (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => handleOpenChat(chat.id)}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                    isActive ? 'border-primary-200 bg-primary-50 text-primary-700' : 'border-transparent bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-medium">{chat.title}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-500">{chat.excerpt}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-wide text-slate-400">{chat.lastActivity}</p>
                </button>
              )
            })}
          </div>
        </div>
      </aside>

      <section className="flex h-[calc(100vh-224px)] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <LayoutList className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">
                {selectedChatId ? 'История диалога' : 'Выберите чат или начните новый'}
              </p>
              <p className="text-xs text-slate-500">
                Выберите агента и протестируйте поведение в реальном времени
              </p>
            </div>
          </div>
          <div className="w-64">
            <Select label="Выберите агента ИИ" defaultValue="ai-assistant" options={agents} />
          </div>
        </header>

        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {selectedChatMessages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-slate-400">
                <div className="h-16 w-16 rounded-full bg-slate-100" />
                <p className="text-sm font-medium text-slate-500">Выберите чат или начните новый</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedChatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse text-right' : ''}`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        message.role === 'assistant' ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {message.role === 'assistant' ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                    </div>
                    <div className="max-w-xl rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      <p>{message.content}</p>
                      <p className="mt-2 text-xs text-slate-400">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <footer className="border-t border-slate-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <Select label=" " aria-label="Выберите агента" className="w-60" options={agents} defaultValue="ai-assistant" />
              <textarea
                value={messageValue}
                onChange={(event) => setMessageValue(event.target.value)}
                placeholder="Введите сообщение здесь..."
                rows={2}
                className="flex-1 resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
              <Button onClick={handleSend} disabled={!messageValue.trim()} className="h-[52px] w-36 gap-2 text-sm">
                <Send className="h-4 w-4" /> Отправить
              </Button>
            </div>
          </footer>
        </div>
      </section>
    </div>
  )
}

export default ChatPage

