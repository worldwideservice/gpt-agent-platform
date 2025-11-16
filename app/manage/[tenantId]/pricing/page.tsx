import { Suspense } from 'react'
import { PageBreadcrumbs } from '@/components/layout/PageBreadcrumbs'
import { PricingClient } from '@/components/features/pricing-internal/PricingClient'

/**
 * Внутренняя страница тарифов для залогиненных пользователей
 * URL: /manage/[tenantId]/pricing
 */
export default function PricingPage() {
  return (
    <div className="space-y-6">
      <PageBreadcrumbs />

      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Тарифные планы</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Управляйте своей подпиской и выберите подходящий тарифный план
        </p>
      </header>

      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="h-48 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
            <div className="h-12 w-64 animate-pulse self-center rounded-lg bg-gray-200 dark:bg-gray-800" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="h-96 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
              <div className="h-96 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
              <div className="h-96 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        }
      >
        <PricingClient />
      </Suspense>
    </div>
  )
}
