import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { ArticlesContent } from "@/components/articles-content"

export default function ArticlesPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage="articles" />
        <ArticlesContent />
      </div>
    </div>
  )
}
