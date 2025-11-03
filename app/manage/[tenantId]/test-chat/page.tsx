export const dynamic = 'force-dynamic'

import { TestChatClient } from './_components/TestChatClient'

const TestChatPage = async () => {
  return (
    <div className="container mx-auto h-screen py-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Тестовый чат</h1>
        <p className="mt-1 text-sm text-gray-600">
          Тестируйте работу ваших AI-агентов в реальном времени
        </p>
      </div>
      <TestChatClient />
    </div>
  )
}

export default TestChatPage

