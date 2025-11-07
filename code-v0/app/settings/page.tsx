import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { AccountSettings } from "@/components/account-settings"

export default function SettingsPage() {
  return (
    <div className="flex h-screen flex-col bg-white">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage="settings" />
        <AccountSettings />
      </div>
    </div>
  )
}
