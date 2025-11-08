"use client"

import { HeaderV0 } from "@/components/layout/HeaderV0"
import { SidebarV0 } from "@/components/layout/SidebarV0"
import { PricingContentV0 } from "@/components/pricing/PricingContentV0"

export default function PricingPage() {
  return (
    <div className="flex h-screen flex-col">
      <HeaderV0 />
      <div className="flex flex-1 overflow-hidden">
        <SidebarV0 activePage="pricing" />
        <PricingContentV0 />
      </div>
    </div>
  )
}
