import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { AgentSettingsContent } from "@/components/agent-settings-content"

export default function AgentEditPage() {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage="agents" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="mx-auto max-w-5xl p-6">
              <AgentSettingsContent />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
