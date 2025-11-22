import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'

import { TestChatClient } from '@/components/features/test-chat/TestChatClient'

/**
 * Test Chat Page
 *
 * Позволяет тестировать AI агентов в реальном времени
 *
 * Security:
 * - Требует аутентификации
 * - Доступ проверяется через middleware
 * - RLS policies на уровне БД
 */
export default async function TestChatPage({
  params,
}: {
  params: { tenantId: string }
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <Suspense fallback={<TestChatSkeleton />}>
        <TestChatClient tenantId={params.tenantId} />
      </Suspense>
    </div>
  )
}

function TestChatSkeleton() {
  return (
    <div className="flex h-full">
      <div className="w-80 border-r border-gray-200 bg-gray-50 p-4">
        <div className="mb-4 h-10 animate-pulse rounded-lg bg-gray-200" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="border-b border-gray-200 p-4">
          <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="flex-1 p-4">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
