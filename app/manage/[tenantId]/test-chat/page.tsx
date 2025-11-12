'use client'

import { TestChatPanel } from '@/components/features/chat/TestChatPanel'

interface TestChatPageProps {
  params: {
    tenantId: string
  }
}

export default function TestChatPage({ params }: TestChatPageProps) {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase text-primary">Тестирование</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Тестовый чат</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Проверьте поведение агентов до запуска в продакшене (workspace&nbsp;
          <span className="font-mono">{params.tenantId}</span>).
        </p>
      </header>
      <TestChatPanel />
    </div>
  )
}
