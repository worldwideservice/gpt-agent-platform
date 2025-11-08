"use client"

import { HeaderV0 } from "@/components/layout/HeaderV0"
import { SidebarV0 } from "@/components/layout/SidebarV0"
import { ArticlesContent } from "@/components/knowledge/ArticlesContent"

export default function KnowledgeItemsListPage() {
  return (
    <div className="flex h-screen flex-col">
      <HeaderV0 />
      <div className="flex flex-1 overflow-hidden">
        <SidebarV0 activePage="articles" />
        <ArticlesContent />
      </div>
    </div>
  )
}
