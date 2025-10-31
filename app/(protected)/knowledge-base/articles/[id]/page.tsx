import { redirect } from 'next/navigation'

import { ArticleForm } from './_components/ArticleForm'

import { auth } from '@/auth'
import {
  getKnowledgeBaseArticleById,
  getKnowledgeBaseCategories,
} from '@/lib/repositories/knowledge-base'

interface ArticlePageProps {
  params: Promise<{
    id: string
  }>
}

const ArticlePage = async ({ params }: ArticlePageProps) => {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.orgId) {
    redirect('/login')
  }

  let article = null

  if (id !== 'new') {
    try {
      article = await getKnowledgeBaseArticleById(id, session.user.orgId)
      
      if (!article) {
        redirect('/knowledge-base/articles')
      }
    } catch (error) {
      console.error('Failed to load article', error)
      redirect('/knowledge-base/articles')
    }
  }

  const categories = await getKnowledgeBaseCategories(session.user.orgId)

  return (
    <ArticleForm
      articleId={id}
      initialArticle={article}
      categories={categories.map((cat) => ({ id: cat.id, name: cat.name }))}
    />
  )
}

export default ArticlePage











