"use client"

import { useState } from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { ChatList } from "./chat-list"
import { ChatArea } from "./chat-area"

export function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)

  return (
    <div className="flex h-screen flex-col bg-white">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage="chat" />
        <div className="flex flex-1 overflow-hidden">
          <ChatList onSelectChat={setSelectedChat} selectedChat={selectedChat} />
          <ChatArea selectedChat={selectedChat} />
        </div>
      </div>
    </div>
  )
}
