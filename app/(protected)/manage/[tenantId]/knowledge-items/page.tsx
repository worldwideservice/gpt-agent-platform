import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

import { ArticlesClient } from './_components/ArticlesClient'

import { auth } from '@/auth'
import {
  getKnowledgeBaseArticles,
  getKnowledgeBaseCategories,
} from '@/lib/repositories/knowledge-base'

export const dynamic = process.env.NODE_ENV === 'development' || process.env.DEMO_MODE === 'true'
  ? 'force-dynamic'
  : 'auto'

export const metadata: Metadata = {
  title: 'Статьи базы знаний',
  description: 'Управление статьями базы знаний',
}

interface ArticlesPageProps {
  params: Promise<{ tenantId: string }>
}

const ArticlesPage = async ({ params }: ArticlesPageProps) => {
  const resolvedParams = await params
  
  const isDemoMode = process.env.NODE_ENV === 'development' || process.env.DEMO_MODE === 'true'

  let articles: Awaited<ReturnType<typeof getKnowledgeBaseArticles>> = []
  let categories: Array<{ id: string; name: string }> = []

  if (isDemoMode) {
    articles = []
    categories = []
  } else {
    const session = await auth()
    if (!session?.user?.orgId) {
      redirect('/login')
    }

    const [articlesResult, categoriesResult] = await Promise.all([
      getKnowledgeBaseArticles(session.user.orgId),
      getKnowledgeBaseCategories(session.user.orgId),
    ])
    articles = articlesResult
    categories = categoriesResult.map((cat) => ({ id: cat.id, name: cat.name }))
  }

  return (
    <ArticlesClient
      initialArticles={articles}
      categories={categories}
    />
  )
}

export default ArticlesPage

