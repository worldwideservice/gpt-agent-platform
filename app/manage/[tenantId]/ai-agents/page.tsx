"use client"

import { HeaderV0 } from "@/components/layout/HeaderV0"
import { SidebarV0 } from "@/components/layout/SidebarV0"
import { AgentsListContent } from "@/components/agents/AgentsListContent"

export default function AgentListPage() {
  return (
    <div className="flex h-screen flex-col">
      <HeaderV0 />
      <div className="flex flex-1 overflow-hidden">
        <SidebarV0 activePage="agents" />
        <AgentsListContent />
      </div>
    </div>
  )
}
