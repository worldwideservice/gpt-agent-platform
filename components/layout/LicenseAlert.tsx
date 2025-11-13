'use client'

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LicenseAlertProps {
  expiryDate: Date
  tenantId: string
}

export function LicenseAlert({ expiryDate, tenantId }: LicenseAlertProps) {
  const formattedDate = expiryDate.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const isExpired = expiryDate < new Date()
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry > 0

  // Don't show if license is valid and not expiring soon
  if (!isExpired && !isExpiringSoon) {
    return null
  }

  return (
    <Link
      href={`/manage/${tenantId}/pricing`}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
        isExpired
          ? 'bg-rose-500 text-white hover:bg-rose-600'
          : 'bg-orange-500 text-white hover:bg-orange-600'
      )}
      aria-label={isExpired ? 'Лицензия истекла' : 'Лицензия скоро истечёт'}
    >
      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
      <span>{formattedDate}</span>
    </Link>
  )
}
