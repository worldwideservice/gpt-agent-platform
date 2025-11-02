import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

import { CategoriesClient } from './_components/CategoriesClient'

import { auth } from '@/auth'
import { getKnowledgeBaseCategories } from '@/lib/repositories/knowledge-base'

export const dynamic = process.env.NODE_ENV === 'development' || process.env.DEMO_MODE === 'true'
  ? 'force-dynamic'
  : 'auto'

export const metadata: Metadata = {
  title: 'Категории базы знаний',
  description: 'Управление категориями базы знаний',
}

interface CategoriesPageProps {
  params: Promise<{ tenantId: string }>
}

const CategoriesPage = async ({ params }: CategoriesPageProps) => {
  const resolvedParams = await params
  
  const isDemoMode = process.env.NODE_ENV === 'development' || process.env.DEMO_MODE === 'true'

  let categories: Awaited<ReturnType<typeof getKnowledgeBaseCategories>> = []

  if (isDemoMode) {
    categories = []
  } else {
    const session = await auth()
    if (!session?.user?.orgId) {
      redirect('/login')
    }

    categories = await getKnowledgeBaseCategories(session.user.orgId)
  }

  return <CategoriesClient initialCategories={categories} />
}

export default CategoriesPage

