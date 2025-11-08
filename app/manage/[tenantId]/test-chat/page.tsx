"use client"

import { HeaderV0 } from "@/components/layout/HeaderV0"
import { SidebarV0 } from "@/components/layout/SidebarV0"
import { ChatInterface } from "@/components/chat/chat-interface"

export default function TestChatPage() {
  return (
    <div className="flex h-screen flex-col">
      <HeaderV0 />
      <div className="flex flex-1 overflow-hidden">
        <SidebarV0 activePage="chat" />
        <ChatInterface />
      </div>
    </div>
  )
}
