"use client"

import { HeaderV0 } from "@/components/layout/HeaderV0"
import { SidebarV0 } from "@/components/layout/SidebarV0"
import { AccountSettings } from "@/components/settings/AccountSettings"

export default function AccountSettingsPage() {
  return (
    <div className="flex h-screen flex-col">
      <HeaderV0 />
      <div className="flex flex-1 overflow-hidden">
        <SidebarV0 activePage="settings" />
        <AccountSettings />
      </div>
    </div>
  )
}
