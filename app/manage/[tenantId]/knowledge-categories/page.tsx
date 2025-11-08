"use client"

import { HeaderV0 } from "@/components/layout/HeaderV0"
import { SidebarV0 } from "@/components/layout/SidebarV0"
import { CategoriesContent } from "@/components/knowledge/CategoriesContent"

export default function KnowledgeCategoriesListPage() {
  return (
    <div className="flex h-screen flex-col">
      <HeaderV0 />
      <div className="flex flex-1 overflow-hidden">
        <SidebarV0 activePage="categories" />
        <CategoriesContent />
      </div>
    </div>
  )
}
