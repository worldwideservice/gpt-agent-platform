import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { PricingContent } from "@/components/pricing-content"

export default function PricingPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage="pricing" />
        <PricingContent />
      </div>
    </div>
  )
}
