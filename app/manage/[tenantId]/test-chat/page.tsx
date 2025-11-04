export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { TestChatClient } from './_components/TestChatClient'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface TestChatPageProps {
  params: Promise<{ tenantId: string }>
}

const TestChatPage = async ({ params }: TestChatPageProps) => {
  const { tenantId } = await params

  return (
    <div className="container mx-auto h-screen py-4">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/manage/${tenantId}`}>Инфопанель</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Тестовый чат</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-4 mt-4">
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


