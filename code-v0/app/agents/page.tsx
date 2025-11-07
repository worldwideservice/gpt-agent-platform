import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { AgentsListContent } from "@/components/agents-list-content"

export default function AgentsPage() {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage="agents" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <AgentsListContent />
          </main>
        </div>
      </div>
    </div>
  )
}
