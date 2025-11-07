"use client"

import { Button } from "@/components/ui/button"

interface Chat {
  id: string
  preview: string
  timestamp: string
}

const mockChats: Chat[] = [
  {
    id: "1",
    preview: "Got it, you're interested in a work vi...",
    timestamp: "17 часов назад",
  },
  {
    id: "2",
    preview: "Got it. I'll ignore this message.",
    timestamp: "23 часа назад",
  },
  {
    id: "3",
    preview: "Thank you for your interest! A perso...",
    timestamp: "3 месяца назад",
  },
]

interface ChatListProps {
  onSelectChat: (chatId: string) => void
  selectedChat: string | null
}

export function ChatList({ onSelectChat, selectedChat }: ChatListProps) {
  return (
    <div className="w-[280px] border-r border-gray-200 bg-white flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Чаты</h2>
        <Button variant="outline" size="sm" className="text-sm border-gray-300 hover:bg-gray-50 bg-transparent">
          Новый чат
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {mockChats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full border-b border-gray-100 px-6 py-4 text-left transition-colors hover:bg-gray-50 ${
              selectedChat === chat.id ? "bg-gray-50" : ""
            }`}
          >
            <div className="text-sm text-gray-900 mb-1 line-clamp-1">{chat.preview}</div>
            <div className="text-xs text-gray-500">{chat.timestamp}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
