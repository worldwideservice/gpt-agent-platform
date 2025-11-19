"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

interface SubscriptionStatus {
  isValid: boolean
  status: string
  daysLeft: number
  expiryDate: string | null
  planName: string
}

export function LicenseAlert({ tenantId }: { tenantId: string }) {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null)

  useEffect(() => {
    fetch(`/api/manage/${tenantId}/subscription/status`)
      .then(res => res.json())
      .then(setStatus)
      .catch(console.error)
  }, [tenantId])

  if (!status) return null

  // Форматируем дату как "30.10.2025"
  const dateStr = status.expiryDate
    ? new Date(status.expiryDate).toLocaleDateString('ru-RU')
    : "Free Plan"

  const isDanger = !status.isValid || status.daysLeft < 3

  return (
    <Link
      href={`/manage/${tenantId}/pricing`}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
        isDanger
          ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      )}
    >
      {isDanger && <AlertCircle className="h-4 w-4" />}
      <span>{dateStr}</span>
    </Link>
  )
}
