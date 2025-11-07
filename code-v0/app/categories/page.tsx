import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { CategoriesContent } from "@/components/categories-content"

export default function CategoriesPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage="categories" />
        <CategoriesContent />
      </div>
    </div>
  )
}
