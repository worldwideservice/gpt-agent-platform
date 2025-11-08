"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"

interface ChatAreaProps {
  selectedChat: string | null
}

export function ChatArea({ selectedChat }: ChatAreaProps) {
  const [message, setMessage] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("")

  const handleSend = () => {
    if (!message.trim() || !selectedAgent) return
    console.log("[v0] Sending message:", message, "with agent:", selectedAgent)
    setMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!selectedChat) {
    return (
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-base text-gray-500">Выберите чат или начните новый</p>
        </div>

        <div className="border-t border-gray-200 bg-white px-8 py-6">
          <div className="flex items-end gap-4 max-w-4xl mx-auto">
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="w-[220px] h-[44px]">
                <SelectValue placeholder="Выберите агента ИИ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent1">Агент 1</SelectItem>
                <SelectItem value="agent2">Агент 2</SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              placeholder="Введите сообщение здесь..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 min-h-[44px] max-h-[120px] resize-none"
            />

            <Button
              onClick={handleSend}
              disabled={!message.trim() || !selectedAgent}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-[44px] font-medium"
            >
              Отправить
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Messages will be displayed here */}
          <div className="text-gray-500 text-sm">Начните разговор...</div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white px-8 py-6">
        <div className="flex items-end gap-4 max-w-4xl mx-auto">
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="w-[220px] h-[44px]">
              <SelectValue placeholder="Выберите агента ИИ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agent1">Агент 1</SelectItem>
              <SelectItem value="agent2">Агент 2</SelectItem>
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Введите сообщение здесь..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-h-[44px] max-h-[120px] resize-none"
          />

          <Button
            onClick={handleSend}
            disabled={!message.trim() || !selectedAgent}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-[44px] font-medium"
          >
            Отправить
          </Button>
        </div>
      </div>
    </div>
  )
}
