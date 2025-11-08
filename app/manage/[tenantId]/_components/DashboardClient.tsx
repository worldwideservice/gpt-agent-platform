"use client"

import { DashboardV0 } from "@/components/dashboard/DashboardV0"
import { HeaderV0 } from "@/components/layout/HeaderV0"
import { SidebarV0 } from "@/components/layout/SidebarV0"

export function DashboardClient() {
  return (
    <div className="flex h-screen flex-col">
      <HeaderV0 />
      <div className="flex flex-1 overflow-hidden">
        <SidebarV0 activePage="dashboard" />
        <DashboardV0 />
      </div>
    </div>
  )
}
