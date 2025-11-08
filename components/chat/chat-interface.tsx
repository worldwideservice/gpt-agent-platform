"use client"

import { useState } from "react"
import { ChatList } from "./chat-list"
import { ChatArea } from "./chat-area"

export function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)

  return (
    <div className="flex flex-1 overflow-hidden bg-white">
      <ChatList onSelectChat={setSelectedChat} selectedChat={selectedChat} />
      <ChatArea selectedChat={selectedChat} />
    </div>
  )
}
